import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Workflow, Users, Layers3 } from "lucide-react";
import { Eyebrow } from "@/components/ui";
import { LeadForm } from "@/components/lead-form";
import { ContactFormWithIndustry } from "@/components/contact-form-with-industry";

export const metadata: Metadata = {
  title: "Let’s talk about better settlement",
  description: "Explore XeniPay for your travel business. Request a walkthrough of our blockchain-based reconciliation and settlement platform.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const onlineEnabled = Boolean(process.env.CONTACT_WEBHOOK_URL);
  return <main id="main" className="contact-main shell"><Link href="/" className="back-link"><ArrowLeft size={18}/>Back to XeniPay</Link><div className="contact-grid"><div className="contact-copy"><Eyebrow>LET’S MOVE FORWARD</Eyebrow><h1>Better settlement<br/><span>starts here.</span></h1><p>Let’s explore how XeniPay can connect your bookings, counterparties, and payments.</p><div className="contact-points"><div><Workflow size={24}/><div><strong>See the complete journey</strong><p>A walkthrough from booking to reconciliation and settlement.</p></div></div><div><Users size={24}/><div><strong>Built around your business</strong><p>Discuss your team’s workflows and counterparty relationships.</p></div></div><div><Layers3 size={24}/><div><strong>Explore a partnership</strong><p>Understand integration needs and availability for your business.</p></div></div></div><a className="contact-email" href="mailto:info@xeni.com"><Mail size={20}/><span>Prefer email?</span><strong>info@xeni.com</strong></a></div><Suspense fallback={<LeadForm onlineEnabled={onlineEnabled}/>}><ContactFormWithIndustry onlineEnabled={onlineEnabled}/></Suspense></div></main>;
}
