import { describe, expect, it } from "vitest";

import {
  buildRegisterEntityPayload,
  getRegisterEntityErrors,
  type RegisterEntityValidationInput,
} from "./registerEntityForm";

const validInput: RegisterEntityValidationInput = {
  entityType: "clinic",
  entityTitle: "عيادة",
  fullName: "أحمد خالد",
  email: "ahmad@example.com",
  birthDate: new Date(1990, 0, 1),
  phone: "0912345678",
  entityName: "عيادة الرفق",
  entityCategory: "عيادة بيطرية عامة",
  licenseNumber: "LIC-123",
  issuingAuthority: "وزارة الزراعة",
  description: "عيادة متخصصة في رعاية الحيوانات الأليفة وعلاجها.",
  serviceGovernorate: "دمشق",
  serviceDistrict: "المزة",
  selectedLocation: { latitude: 33.5, longitude: 36.2 },
  selectedActivities: ["examination"],
  selectedAnimals: ["pets"],
  open24Hours: false,
  workingHours: "09:00 - 17:00",
  hasShelter: false,
  shelterCapacity: "",
  acceptsVolunteers: false,
  volunteerRequirements: "",
  licenseDocument: "file://license.jpg",
  password: "حماية1234",
  confirmPassword: "حماية1234",
  informationConfirmed: true,
  verificationConfirmed: true,
  termsAccepted: true,
};

describe("getRegisterEntityErrors", () => {
  it("returns no messages for a valid clinic form", () => {
    expect(
      Object.values(getRegisterEntityErrors(validInput)).filter(Boolean),
    ).toEqual([]);
  });

  it("requires working hours when the clinic is not open 24 hours", () => {
    const errors = getRegisterEntityErrors({
      ...validInput,
      workingHours: "",
    });

    expect(errors.workingHours).toBeTruthy();
  });

  it("requires a positive shelter capacity for organizations with shelters", () => {
    const errors = getRegisterEntityErrors({
      ...validInput,
      entityType: "organization",
      entityTitle: "جمعية / منظمة",
      hasShelter: true,
      shelterCapacity: "0",
    });

    expect(errors.shelterCapacity).toBeTruthy();
  });
});

describe("buildRegisterEntityPayload", () => {
  it("normalizes manager phone and builds clinic details", () => {
    const payload = buildRegisterEntityPayload({
      ...validInput,
      logo: null,
      managerDocument: null,
      extraDocument: null,
      homeVisits: true,
      emergencyService: true,
    });

    expect(payload.manager.phone).toBe("+963912345678");
    expect("clinicDetails" in payload).toBe(true);
  });
});
