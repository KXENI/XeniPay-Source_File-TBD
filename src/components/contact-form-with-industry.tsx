"use client";

import { useSearchParams } from "next/navigation";
import { LeadForm } from "@/components/lead-form";

const industries = new Set(["Travel agents", "Hotels", "Airlines", "Consolidators", "Other"]);

export function ContactFormWithIndustry({ onlineEnabled }: { onlineEnabled: boolean }) {
  const industry = useSearchParams().get("industry") || "";
  return <LeadForm initialIndustry={industries.has(industry) ? industry : ""} onlineEnabled={onlineEnabled}/>;
}
