"use client";

import { useState, type FormEvent } from "react";
import { ArrowUpRight, CheckCircle2, LoaderCircle } from "lucide-react";
import { contactSchema, createEmailLink } from "@/lib/contact";

export function LeadForm({ initialIndustry = "", onlineEnabled }: { initialIndustry?: string; onlineEnabled: boolean }) {
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error" | "email">("idle");
  const [message, setMessage] = useState("");
  const [emailLink, setEmailLink] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const parsed = contactSchema.safeParse(data);
    if (!parsed.success) { setStatus("error"); setMessage(parsed.error.issues[0].message); setEmailLink(""); return; }
    const fallback = createEmailLink(parsed.data);
    if (!onlineEnabled) {
      setEmailLink(fallback); setStatus("email"); setMessage("Your email draft is ready. Open it below, then send it from your email app to complete your request."); return;
    }
    setStatus("pending"); setEmailLink("");
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.data), signal: AbortSignal.timeout(12000) });
      const result = await response.json();
      if (!response.ok) {
        setStatus("error"); setMessage(result.error || "Please try again."); if(result.emailFallback) setEmailLink(fallback); return;
      }
      setStatus("success"); setMessage("Your request has been delivered to our team. We look forward to learning about your business."); form.reset();
    } catch {
      setStatus("error"); setMessage("We couldn’t confirm delivery. Please try again or send your request by email."); setEmailLink(fallback);
    }
  }

  return <form onSubmit={submit} className="lead-form" aria-label="Request a XeniPay demo">
    <h2>Let’s get to know your business.</h2><p className="form-intro">Tell us a little about your team. We’ll take it from there.</p>
    <div className="form-row"><div className="form-field"><label htmlFor="name">Full name</label><input id="name" name="name" autoComplete="name" placeholder="Alex Morgan" minLength={2} maxLength={100} required/></div><div className="form-field"><label htmlFor="company">Company</label><input id="company" name="company" autoComplete="organization" placeholder="Your company" minLength={2} maxLength={150} required/></div></div>
    <div className="form-field"><label htmlFor="email">Work email</label><input id="email" name="email" type="email" autoComplete="email" placeholder="alex@company.com" maxLength={254} required/></div>
    <div className="form-field"><label htmlFor="industry">Your industry</label><select id="industry" name="industry" defaultValue={initialIndustry} required><option value="" disabled>Select your industry</option>{["Travel agents", "Hotels", "Airlines", "Consolidators", "Other"].map(industry => <option key={industry}>{industry}</option>)}</select></div>
    <div className="form-field"><label htmlFor="message">What would you like to explore? <span>(optional)</span></label><textarea id="message" name="message" placeholder="Tell us about your current settlement workflow…" maxLength={3000} rows={3}/></div>
    <div className="honeypot" aria-hidden="true"><label htmlFor="website">Leave this field empty</label><input id="website" name="website" tabIndex={-1} autoComplete="off"/></div>
    <p className="form-consent">{onlineEnabled ? "We’ll use these details to respond to your enquiry. Please don’t include payment details or other sensitive information." : "Your details stay in this form until you choose to send them from your email app. You’ll be able to review your draft first."}</p>
    <button className="button button-primary form-submit" type="submit" disabled={status === "pending"}>{status === "pending" ? "Sending your request…" : onlineEnabled ? "Request a demo" : "Prepare my demo request"}{status === "pending" ? <LoaderCircle size={17} className="spin"/> : <ArrowUpRight size={17}/>}</button>
    <div aria-live="polite" aria-atomic="true">{status !== "idle" && status !== "pending" && <div className={`form-message ${status === "error" ? "error" : ""}`}>{status === "success" && <CheckCircle2 size={20} className="mb-2"/>}<p>{message}</p>{emailLink && <a href={emailLink}>Open email draft <ArrowUpRight size={14}/></a>}</div>}</div>
    <noscript><p className="form-message">Please email <a href="mailto:info@xeni.com?subject=XeniPay%20demo%20request">info@xeni.com</a> to request a demo.</p></noscript>
  </form>;
}
