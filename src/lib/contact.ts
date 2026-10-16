import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name.").max(100),
  email: z.email("Please enter a valid email address.").max(254),
  company: z.string().trim().min(2, "Please enter your company name.").max(150),
  industry: z.enum(["Travel agents", "Hotels", "Airlines", "Consolidators", "Other"]),
  message: z.string().trim().max(3000, "Please keep your message under 3,000 characters."),
  website: z.string().max(200).optional(),
});

export type ContactRequest = z.infer<typeof contactSchema>;

export function createEmailLink(data: Pick<ContactRequest, "name" | "email" | "company" | "industry" | "message">) {
  const body = `Hello XeniPay team,\n\nI would like to learn more about XeniPay.\n\nName: ${data.name}\nEmail: ${data.email}\nCompany: ${data.company}\nIndustry: ${data.industry}\n\n${data.message}`;
  return `mailto:info@xeni.com?subject=${encodeURIComponent(`XeniPay demo request — ${data.company}`)}&body=${encodeURIComponent(body)}`;
}
