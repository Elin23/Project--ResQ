import type {
  EntityLocation,
  RegisterEntityErrors,
  RegisterEntityType,
} from "../types/registerEntity";
import {
  ENTITY_MANAGER_MINIMUM_AGE,
  formatSyrianMobileInternational,
  validateBirthDate,
  validateEmail,
  validateFullName,
  validatePasswordConfirmation,
  validateRegistrationPassword,
  validateSyrianMobile,
} from "./registrationValidation";

export type RegisterEntityValidationInput = {
  entityType: RegisterEntityType;
  entityTitle: string;
  fullName: string;
  email: string;
  birthDate: Date | null;
  phone: string;
  entityName: string;
  entityCategory: string;
  licenseNumber: string;
  issuingAuthority: string;
  description: string;
  serviceGovernorate: string;
  serviceDistrict: string;
  selectedLocation: EntityLocation | null;
  selectedActivities: string[];
  selectedAnimals: string[];
  open24Hours: boolean;
  workingHours: string;
  hasShelter: boolean;
  shelterCapacity: string;
  acceptsVolunteers: boolean;
  volunteerRequirements: string;
  licenseDocument: string | null;
  password: string;
  confirmPassword: string;
  informationConfirmed: boolean;
  verificationConfirmed: boolean;
  termsAccepted: boolean;
};

export function getRegisterEntityErrors(
  input: RegisterEntityValidationInput,
): RegisterEntityErrors {
  const isClinic = input.entityType === "clinic";
  const errors: RegisterEntityErrors = {
    fullName: validateFullName(input.fullName),
    email: validateEmail(input.email),
    birthDate: validateBirthDate(
      input.birthDate,
      ENTITY_MANAGER_MINIMUM_AGE,
    ),
    phone: validateSyrianMobile(input.phone),
    password: validateRegistrationPassword(input.password),
    confirmPassword: validatePasswordConfirmation(
      input.confirmPassword,
      input.password,
    ),
  };

  if (input.entityName.trim().length < 3)
    errors.entityName = `يرجى إدخال اسم ${input.entityTitle}`;
  if (!input.entityCategory)
    errors.entityCategory = `يرجى اختيار نوع ${input.entityTitle}`;
  if (!input.licenseNumber.trim()) errors.licenseNumber = "رقم الترخيص مطلوب";
  else if (input.licenseNumber.trim().length < 3)
    errors.licenseNumber = "رقم الترخيص قصير جدًا";
  if (!input.issuingAuthority.trim())
    errors.issuingAuthority = "جهة إصدار الترخيص مطلوبة";
  else if (input.issuingAuthority.trim().length < 3)
    errors.issuingAuthority = "يرجى كتابة اسم جهة الإصدار بشكل أوضح";
  if (input.description.trim().length < 20)
    errors.description = "يرجى إضافة نبذة لا تقل عن 20 حرفًا";
  if (!input.serviceGovernorate)
    errors.serviceGovernorate = "يرجى اختيار محافظة موقع الجهة";
  if (!input.serviceDistrict.trim())
    errors.serviceDistrict = "المنطقة أو الحي مطلوب";
  else if (input.serviceDistrict.trim().length < 2)
    errors.serviceDistrict = "يرجى كتابة اسم المنطقة أو الحي بشكل صحيح";
  if (!input.selectedLocation)
    errors.mapLocation = "يرجى تحديد الموقع بدقة على الخريطة";
  if (input.selectedActivities.length === 0)
    errors.activities = isClinic
      ? "يرجى اختيار خدمة واحدة على الأقل"
      : "يرجى اختيار نشاط واحد على الأقل";
  if (input.selectedAnimals.length === 0)
    errors.animals = "يرجى اختيار الحيوانات التي تخدمها الجهة";
  if (isClinic && !input.open24Hours && input.workingHours.trim().length < 3)
    errors.workingHours =
      "يرجى إدخال أوقات دوام العيادة أو تفعيل خيار 24 ساعة";
  if (!isClinic && input.hasShelter && Number(input.shelterCapacity) <= 0)
    errors.shelterCapacity = "يرجى إدخال سعة صحيحة لمنشأة الإيواء";
  if (
    !isClinic &&
    input.acceptsVolunteers &&
    input.volunteerRequirements.trim().length > 0 &&
    input.volunteerRequirements.trim().length < 10
  )
    errors.volunteerRequirements =
      "اكتب متطلبات التطوع بشكل أوضح أو اترك الحقل فارغًا";
  if (!input.licenseDocument)
    errors.licenseDocument = "صورة الترخيص مطلوبة للتحقق";
  if (!input.informationConfirmed)
    errors.information = "يجب تأكيد صحة المعلومات";
  if (!input.verificationConfirmed)
    errors.verification = "يجب الموافقة على مراجعة واعتماد الجهة";
  if (!input.termsAccepted)
    errors.terms = "يجب الموافقة على الشروط وسياسة الخصوصية";

  return errors;
}

export type RegisterEntityPayloadInput = RegisterEntityValidationInput & {
  logo: string | null;
  managerDocument: string | null;
  extraDocument: string | null;
  homeVisits: boolean;
  emergencyService: boolean;
};

export function buildRegisterEntityPayload(input: RegisterEntityPayloadInput) {
  const sharedPayload = {
    accountType: "entity-admin" as const,
    entityType: input.entityType,
    manager: {
      fullName: input.fullName.trim(),
      email: input.email.trim(),
      birthDate: input.birthDate?.toISOString() ?? "",
      phone: formatSyrianMobileInternational(input.phone),
    },
    entity: {
      name: input.entityName.trim(),
      category: input.entityCategory,
      licenseNumber: input.licenseNumber.trim(),
      issuingAuthority: input.issuingAuthority.trim(),
      description: input.description.trim(),
      serviceGovernorate: input.serviceGovernorate,
      serviceDistrict: input.serviceDistrict.trim(),
      location: input.selectedLocation,
      supportedAnimals: input.selectedAnimals,
      logo: input.logo,
      licenseDocument: input.licenseDocument,
      managerDocument: input.managerDocument,
    },
    password: input.password,
  };

  return input.entityType === "clinic"
    ? {
        ...sharedPayload,
        clinicDetails: {
          services: input.selectedActivities,
          open24Hours: input.open24Hours,
          workingHours: input.open24Hours ? "24/7" : input.workingHours.trim(),
          homeVisits: input.homeVisits,
          emergencyService: input.emergencyService,
          doctorLicenseDocument: input.extraDocument,
        },
      }
    : {
        ...sharedPayload,
        organizationDetails: {
          activities: input.selectedActivities,
          hasShelter: input.hasShelter,
          shelterCapacity: input.hasShelter ? input.shelterCapacity : "",
          acceptsVolunteers: input.acceptsVolunteers,
          volunteerRequirements: input.acceptsVolunteers
            ? input.volunteerRequirements.trim()
            : "",
          policyDocument: input.extraDocument,
        },
      };
}
