import { describe, expect, it } from "vitest";
import { buildRegisterEntityPayload, getRegisterEntityErrors, type RegisterEntityValidationInput } from "./registerEntityForm";

const valid: RegisterEntityValidationInput = {
  entityType: "organization", entityTitle: "جمعية / منظمة", fullName: "أحمد محمد", email: "team@example.com",
  birthDate: new Date(1990, 0, 1), phone: "0999999999", entityName: "جمعية الرحمة", entityCategory: "rescue",
  licenseNumber: "LIC-123", issuingAuthority: "وزارة الشؤون", description: "جمعية مختصة بإنقاذ ورعاية الحيوانات المحتاجة.",
  serviceGovernorate: "دمشق", serviceDistrict: "المزة", selectedLocation: { latitude: 33.5, longitude: 36.2 },
  selectedActivities: ["rescue"], selectedAnimals: ["cats"], open24Hours: false, workingHours: "", hasShelter: false,
  shelterCapacity: "", acceptsVolunteers: true, volunteerRequirements: "", licenseDocument: "file://license.jpg",
  password: "StrongPass1!", confirmPassword: "StrongPass1!", informationConfirmed: true, verificationConfirmed: true, termsAccepted: true,
};

describe("organization registration form", () => {
  it("accepts a complete organization application", () => {
    expect(Object.values(getRegisterEntityErrors(valid)).filter(Boolean)).toHaveLength(0);
  });
  it("builds organization details only", () => {
    const payload = buildRegisterEntityPayload({ ...valid, logo: null, managerDocument: null, extraDocument: null, homeVisits: false, emergencyService: false });
    expect(payload.entityType).toBe("organization");
    expect("organizationDetails" in payload).toBe(true);
    expect("clinicDetails" in payload).toBe(false);
  });
});
