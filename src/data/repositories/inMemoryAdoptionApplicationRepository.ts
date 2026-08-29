import type {
  AdoptionApplication,
  AdoptionApplicationRepository,
  AdoptionRepository,
  CreateAdoptionApplicationInput,
  NotificationRepository,
} from "@/src/domain";

function clone(item: AdoptionApplication): AdoptionApplication {
  return { ...item };
}

export class InMemoryAdoptionApplicationRepository implements AdoptionApplicationRepository {
  private applications: AdoptionApplication[] = [];
  private idCounter = 0;

  constructor(
    private readonly adoptionRepository: AdoptionRepository,
    private readonly notificationRepository?: NotificationRepository,
  ) {}

  async submit(input: CreateAdoptionApplicationInput) {
    const listing = await this.adoptionRepository.getById(input.listingId);
    if (!listing || listing.status !== "available" || listing.moderationStatus !== "approved") {
      throw new Error("هذا الحيوان غير متاح لاستقبال طلبات التبني حاليًا.");
    }
    if (input.applicantAccountId === listing.ownerAccountId) {
      throw new Error("لا يمكنك التقدم لتبني حيوان قمت بعرضه بنفسك.");
    }

    const duplicate = this.applications.find(
      (item) =>
        item.listingId === input.listingId &&
        item.applicantAccountId === input.applicantAccountId &&
        !["rejected", "not_selected", "withdrawn"].includes(item.status),
    );
    if (duplicate) throw new Error("لديك طلب نشط بالفعل لهذا الحيوان.");

    const now = new Date().toISOString();
    const application: AdoptionApplication = {
      id: `adoption-application-${Date.now()}-${++this.idCounter}`,
      ...input,
      listingOwnerAccountId: listing.ownerAccountId,
      applicantName: input.applicantName.trim(),
      phone: input.phone.trim(),
      city: input.city.trim(),
      experience: input.experience.trim(),
      reason: input.reason.trim(),
      notes: input.notes?.trim() || undefined,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    };
    this.applications.unshift(application);
    return clone(application);
  }

  async listByApplicant(applicantAccountId: string) {
    return this.applications
      .filter((item) => item.applicantAccountId === applicantAccountId)
      .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
      .map(clone);
  }

  async getByApplicant(id: string, applicantAccountId: string) {
    const found = this.applications.find((item) => item.id === id && item.applicantAccountId === applicantAccountId);
    return found ? clone(found) : undefined;
  }

  async listByListing(listingId: string, listingOwnerAccountId: string) {
    return this.applications
      .filter((item) => item.listingId === listingId && item.listingOwnerAccountId === listingOwnerAccountId)
      .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
      .map(clone);
  }

  async getForListingOwner(id: string, listingId: string, listingOwnerAccountId: string) {
    const found = this.applications.find(
      (item) => item.id === id && item.listingId === listingId && item.listingOwnerAccountId === listingOwnerAccountId,
    );
    return found ? clone(found) : undefined;
  }

  async acceptForListingOwner(id: string, listingId: string, listingOwnerAccountId: string) {
    const index = this.applications.findIndex(
      (item) =>
        item.id === id &&
        item.listingId === listingId &&
        item.listingOwnerAccountId === listingOwnerAccountId,
    );
    if (index < 0) throw new Error("طلب التبني غير موجود.");
    if (this.applications[index].status !== "pending") {
      throw new Error("لا يمكن اتخاذ قرار جديد على هذا الطلب.");
    }

    // Reserve first. If this fails, no application state is changed.
    await this.adoptionRepository.reserveOwned(listingId, listingOwnerAccountId);

    const now = new Date().toISOString();
    this.applications = this.applications.map((item) => {
      if (item.listingId !== listingId || item.listingOwnerAccountId !== listingOwnerAccountId) return item;
      if (item.id === id) {
        return { ...item, status: "accepted" as const, decidedAt: now, updatedAt: now };
      }
      if (item.status === "pending") {
        return { ...item, status: "not_selected" as const, decidedAt: now, updatedAt: now };
      }
      return item;
    });

    const selected = this.applications.find((item) => item.id === id)!;
    await this.notificationRepository?.create({
      accountId: selected.applicantAccountId,
      title: "تم قبول طلب التبني",
      body: "تم اختيارك للتبني. يمكنك الآن الاطلاع على معلومات التواصل وموقع التسليم.",
      category: "adoption",
      target: { kind: "adoption-application", applicationId: selected.id },
    });
    return clone(selected);
  }

  async getAcceptedContactForApplicant(id: string, applicantAccountId: string) {
    const application = this.applications.find(
      (item) => item.id === id && item.applicantAccountId === applicantAccountId && ["accepted", "completed"].includes(item.status),
    );
    if (!application) return undefined;

    const listing = await this.adoptionRepository.getOwnedById(
      application.listingId,
      application.listingOwnerAccountId,
    );
    if (!listing || !["reserved", "adopted"].includes(listing.status)) return undefined;

    return {
      applicationId: application.id,
      listingId: listing.id,
      applicantAccountId: application.applicantAccountId,
      listingOwnerAccountId: application.listingOwnerAccountId,
      contact: { ...listing.contact },
      location: { ...listing.location },
    };
  }

  private async completeHandoverIfReady(applicationId: string) {
    const index = this.applications.findIndex((item) => item.id === applicationId);
    if (index < 0) throw new Error("طلب التبني غير موجود.");
    const current = this.applications[index];

    if (!current.applicantHandoverConfirmedAt || !current.ownerHandoverConfirmedAt) {
      return clone(current);
    }

    await this.adoptionRepository.markAdoptedOwned(
      current.listingId,
      current.listingOwnerAccountId,
    );

    const now = new Date().toISOString();
    this.applications[index] = {
      ...current,
      status: "completed",
      completedAt: now,
      updatedAt: now,
    };

    await Promise.all([
      this.notificationRepository?.create({
        accountId: current.applicantAccountId,
        title: "اكتمل التبني بنجاح",
        body: "تم تأكيد استلام الحيوان من الطرفين وإغلاق عملية التبني.",
        category: "adoption",
        target: { kind: "adoption-application", applicationId: current.id },
      }),
      this.notificationRepository?.create({
        accountId: current.listingOwnerAccountId,
        title: "اكتملت عملية التبني",
        body: "تم تأكيد تسليم الحيوان من الطرفين وأصبح الإعلان مكتملًا.",
        category: "adoption",
        target: { kind: "adoption-listing-applications", listingId: current.listingId },
      }),
    ]);

    return clone(this.applications[index]);
  }

  async confirmHandoverForApplicant(id: string, applicantAccountId: string) {
    const index = this.applications.findIndex(
      (item) => item.id === id && item.applicantAccountId === applicantAccountId,
    );
    if (index < 0) throw new Error("طلب التبني غير موجود.");
    const current = this.applications[index];
    if (!["accepted", "completed"].includes(current.status)) {
      throw new Error("لا يمكن تأكيد الاستلام قبل قبول طلب التبني.");
    }
    if (current.status === "completed") return clone(current);
    if (!current.applicantHandoverConfirmedAt) {
      const now = new Date().toISOString();
      this.applications[index] = {
        ...current,
        applicantHandoverConfirmedAt: now,
        updatedAt: now,
      };
      await this.notificationRepository?.create({
        accountId: current.listingOwnerAccountId,
        title: "تم تأكيد استلام الحيوان",
        body: "المتبني أكد استلام الحيوان. أكّد التسليم من طرفك لإتمام العملية.",
        category: "adoption",
        target: { kind: "adoption-listing-applications", listingId: current.listingId },
      });
    }
    return this.completeHandoverIfReady(id);
  }

  async confirmHandoverForListingOwner(
    id: string,
    listingId: string,
    listingOwnerAccountId: string,
  ) {
    const index = this.applications.findIndex(
      (item) =>
        item.id === id &&
        item.listingId === listingId &&
        item.listingOwnerAccountId === listingOwnerAccountId,
    );
    if (index < 0) throw new Error("طلب التبني غير موجود.");
    const current = this.applications[index];
    if (!["accepted", "completed"].includes(current.status)) {
      throw new Error("لا يمكن تأكيد التسليم قبل قبول طلب التبني.");
    }
    if (current.status === "completed") return clone(current);
    if (!current.ownerHandoverConfirmedAt) {
      const now = new Date().toISOString();
      this.applications[index] = {
        ...current,
        ownerHandoverConfirmedAt: now,
        updatedAt: now,
      };
      await this.notificationRepository?.create({
        accountId: current.applicantAccountId,
        title: "تم تأكيد تسليم الحيوان",
        body: "صاحب الحيوان أكد التسليم. أكّد الاستلام من طرفك لإتمام عملية التبني.",
        category: "adoption",
        target: { kind: "adoption-application", applicationId: current.id },
      });
    }
    return this.completeHandoverIfReady(id);
  }

  async rejectForListingOwner(
    id: string,
    listingId: string,
    listingOwnerAccountId: string,
    decisionNote?: string,
  ) {
    const index = this.applications.findIndex(
      (item) =>
        item.id === id &&
        item.listingId === listingId &&
        item.listingOwnerAccountId === listingOwnerAccountId,
    );
    if (index < 0) throw new Error("طلب التبني غير موجود.");
    if (this.applications[index].status !== "pending") {
      throw new Error("لا يمكن اتخاذ قرار جديد على هذا الطلب.");
    }

    const now = new Date().toISOString();
    this.applications[index] = {
      ...this.applications[index],
      status: "rejected",
      decisionNote: decisionNote?.trim() || undefined,
      decidedAt: now,
      updatedAt: now,
    };
    await this.notificationRepository?.create({
      accountId: this.applications[index].applicantAccountId,
      title: "تم تحديث طلب التبني",
      body: "لم تتم الموافقة على طلب التبني هذه المرة.",
      category: "adoption",
      target: { kind: "adoption-application", applicationId: this.applications[index].id },
    });
    return clone(this.applications[index]);
  }
}
