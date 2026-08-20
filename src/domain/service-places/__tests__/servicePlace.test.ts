import { describe, expect, it } from "vitest";
import { allDayOpeningHours, getPlaceOpenState, validateOpeningHours, type ServicePlace } from "../servicePlace";

const place: ServicePlace = {
  id: "test",
  type: "clinic",
  name: "عيادة",
  address: "دمشق",
  latitude: 33.5,
  longitude: 36.2,
  phone: "+963",
  status: "active",
  openingHours: [
    { day: 1, open: "09:00", close: "17:00" },
  ],
};

describe("getPlaceOpenState", () => {
  it("reports open during today's schedule", () => {
    const mondayNoon = new Date(2026, 7, 10, 12, 0, 0);
    expect(getPlaceOpenState(place, mondayNoon).isOpen).toBe(true);
  });

  it("reports closed outside today's schedule", () => {
    const mondayEvening = new Date(2026, 7, 10, 20, 0, 0);
    expect(getPlaceOpenState(place, mondayEvening).isOpen).toBe(false);
  });

  it("honors temporary closure", () => {
    expect(getPlaceOpenState({ ...place, status: "temporarily_closed" }).label).toBe("مغلق مؤقتًا");
  });

  it("handles an overnight schedule", () => {
    const overnight: ServicePlace = {
      ...place,
      openingHours: [{ day: 1, open: "20:00", close: "02:00" }],
    };
    const mondayLate = new Date(2026, 7, 10, 23, 0, 0);
    expect(getPlaceOpenState(overnight, mondayLate).isOpen).toBe(true);
  });

  it("supports all-day emergency hours", () => {
    const emergency: ServicePlace = {
      ...place,
      emergency24h: true,
      openingHours: allDayOpeningHours(),
    };
    const mondayEarly = new Date(2026, 7, 10, 3, 30, 0);
    expect(getPlaceOpenState(emergency, mondayEarly).isOpen).toBe(true);
    expect(getPlaceOpenState(emergency, mondayEarly).nextChangeLabel).toContain("طوارئ");
  });

});

describe("validateOpeningHours", () => {
  it("accepts a complete seven-day schedule", () => {
    expect(validateOpeningHours(allDayOpeningHours())).toBeNull();
  });

  it("rejects invalid clock values", () => {
    const invalid = allDayOpeningHours();
    invalid[1] = { ...invalid[1], open: "28:90" };
    expect(validateOpeningHours(invalid)).toContain("صيغة وقت");
  });

  it("accepts fully closed days", () => {
    const schedule = allDayOpeningHours();
    schedule[5] = { day: 5, open: null, close: null };
    expect(validateOpeningHours(schedule)).toBeNull();
  });
});

