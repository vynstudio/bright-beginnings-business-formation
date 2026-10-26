import type { Entity } from "@/lib/catalog";

// Choices for the Sunbiz filing and EIN questions at checkout. create-checkout validates the same values.
export const SUFFIXES: Record<Entity, string[]> = {
  llc: ["LLC", "L.L.C.", "Limited Liability Company"],
  corp: ["Inc.", "Corp.", "Corporation", "Incorporated"],
};

export const ROLES: Record<Entity, string[]> = {
  llc: ["Member", "Manager", "Member and manager"],
  corp: ["President and director", "President", "Vice president", "Secretary", "Treasurer", "Director", "Shareholder only"],
};

// IRS Form SS-4, line 16 categories.
export const ACTIVITIES = [
  "Retail", "Wholesale", "Construction", "Real estate", "Rental and leasing", "Manufacturing",
  "Transportation and warehousing", "Finance and insurance", "Health care and social assistance",
  "Accommodation and food service", "Other",
];

export const TAX_ID_CHOICES = [
  { id: "ssn", label: "Yes, an SSN" },
  { id: "itin", label: "Yes, an ITIN" },
  { id: "none", label: "No, I don't have either" },
];

// The company name with a Florida-accepted ending, unless the client already typed one.
export const fullCompanyName = (name: string, suffix: string, entity: Entity) => {
  const n = name.trim();
  return SUFFIXES[entity].some((s) => n.toLowerCase().endsWith(` ${s.toLowerCase()}`)) ? n : `${n} ${suffix}`;
};
