import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, Check, CircleDollarSign, Fingerprint, Globe2, Layers3, LockKeyhole, Plus, ShieldCheck, Zap } from "lucide-react";
import { ButtonLink, Eyebrow } from "@/components/ui";
import { SettlementNetwork } from "@/components/settlement-network";
import { Workflow } from "@/components/workflow";
import { Industries } from "@/components/industries";
import { FaqAccordion } from "@/components/faq-accordion";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SettlementStats } from "@/components/settlement-stats";
import { site } from "@/lib/site";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function HomePage() {
  return <main id="main">
    <ScrollReveal/>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Organization", name: site.name, url: site.url, description: site.description, email: site.email }).replace(/</g, "\\u003c") }}/>
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-atmosphere" aria-hidden="true"/>
      <div className="shell hero-content">
        <h1 id="hero-title">Travel moves fast.<br/><span>Your money should too.</span></h1>
        <p className="hero-description">A better way to reconcile and settle travel payments.<br className="desktop-break"/> One shared source of truth. Powered by Web3. Built for your world.</p>
        <div className="hero-actions"><ButtonLink href="/contact">Request a demo</ButtonLink></div>
        <SettlementNetwork/>
      </div>
      <div className="hero-proof shell" aria-label="XeniPay benefits"><div><ShieldCheck size={16}/>Shared transaction records</div><div><Globe2 size={16}/>Connected counterparties</div><div><Zap size={16}/>Simpler settlement</div></div>
    </section>

    <SettlementStats/>

    <section id="platform" className="section shell platform-section" aria-labelledby="platform-heading">
      <div className="section-heading"><div><Eyebrow>THE PAYMENT DISCONNECT</Eyebrow><h2 id="platform-heading">The trip is seamless.<br/><span>The settlement should be, too.</span></h2></div><p>Behind every booking is a chain of businesses.<br/>XeniPay puts them on the same page, so payments<br className="desktop-break"/> can move forward.</p></div>
      <div className="problem-strip"><span>Scattered records</span><Plus size={15}/><span>Invoicing disputes</span><Plus size={15}/><span>Manual reconciliation</span><ArrowRight size={20}/><strong>One connected platform <Check size={15}/></strong></div>
      <div className="feature-grid">
        <article className="feature-card feature-ledger"><div className="feature-icon"><Layers3 size={21}/></div><h3>One record.<br/>Everyone in agreement.</h3><p>Replace fragmented booking information with a shared, transparent transaction record.</p><div className="record-visual" aria-hidden="true"><div className="record-row"><span className="record-avatar">TA</span><span>Travel agency</span><Check size={12}/></div><div className="record-row"><span className="record-avatar">CO</span><span>Consolidator</span><Check size={12}/></div><div className="record-row"><span className="record-avatar">HT</span><span>Hotel partner</span><Check size={12}/></div><div className="record-id"><Fingerprint size={14}/>XN–2084–7F3A<span>SYNCED</span></div></div></article>
        <article className="feature-card feature-speed"><div className="feature-icon"><Zap size={21}/></div><h3>Less back-and-forth.<br/>More forward motion.</h3><p>Connect booking events and payment status to make reconciliation feel effortless.</p><div className="speed-visual" aria-hidden="true"><div className="speed-ring ring-1"/><div className="speed-ring ring-2"/><div className="speed-ring ring-3"/><div className="speed-center"><Zap size={35} strokeWidth={1.3}/></div><span className="speed-pill"><span className="status-dot"/>Ready to settle</span></div></article>
        <article className="feature-card feature-control"><div className="feature-icon"><ShieldCheck size={21}/></div><h3>Built on trust.<br/>Designed for clarity.</h3><p>Know what’s owed, to whom, and when. Give every counterparty a consistent view.</p><div className="control-visual" aria-hidden="true"><div className="control-top"><span><LockKeyhole size={14}/>Shared ledger</span><span className="status-dot"/></div><div><span>Booking details</span><span><Check size={12}/>Recorded</span></div><div><span>Payment status</span><span><Check size={12}/>Visible</span></div><div><span>Transaction history</span><span><Check size={12}/>Traceable</span></div></div></article>
      </div>
    </section>

    <section id="how-it-works" className="section workflow-section" aria-labelledby="workflow-heading"><div className="shell">
      <div className="section-heading"><div><Eyebrow>FROM BOOKED TO SETTLED</Eyebrow><h2 id="workflow-heading">One connected journey.<br/><span>From start to settled.</span></h2></div></div>
      <Workflow mode="steps"/>
    </div></section>

    <section id="why-xenipay" className="section technology-section shell" aria-labelledby="technology-heading">
      <div className="technology-dashboard"><Workflow mode="dashboard"/></div>
      <div className="technology-copy"><Eyebrow>WEB3, WITH A REAL-WORLD PURPOSE</Eyebrow><h2 id="technology-heading">Powerful underneath.<br/><span>Simple on the surface.</span></h2><p>Blockchain should make your business easier to run. XeniPay brings shared records and traceable transactions into the workflows your team already understands.</p><div className="technology-benefits"><div><Fingerprint size={18}/><span>A universal transaction ID</span></div><div><ShieldCheck size={18}/><span>A consistent record for every party</span></div><div><CircleDollarSign size={18}/><span>A clearer path to settlement</span></div></div><Link href="/contact" className="text-link">Meet your new settlement layer<ArrowUpRight size={17}/></Link></div>
    </section>

    <section id="industries" className="section industries-section" aria-labelledby="industry-heading"><div className="shell"><div className="centered-heading"><Eyebrow>YOUR INDUSTRY. YOUR ADVANTAGE.</Eyebrow><h2 id="industry-heading">Built for the businesses<br/><span>that keep the world moving.</span></h2><p>From the first booking to the final payout, we’re connecting travel.</p></div><Industries/></div></section>

    <section className="section faq-section shell" aria-labelledby="faq-heading"><div><h2 id="faq-heading">Good questions.<br/><span>Straight answers.</span></h2><p>Let’s make the next step a clear one.</p><Link href="/contact" className="text-link">Talk to our team<ArrowUpRight size={17}/></Link></div><FaqAccordion/></section>

    <section className="cta-section shell" aria-labelledby="cta-heading"><div className="cta-orbits" aria-hidden="true"><span/><span/><span/><svg className="cta-brand-mark" viewBox="0 0 51 48" fill="none"><path d="M39.4713 0.0299944H50.6485V0.254932L34.2638 22.0748L31.2927 18.1108L29.7984 16.1112L28.3041 14.1292L38.8063 0.132471H39.3991L39.4713 0.0299944Z" fill="currentColor"/><path d="M23.8362 16.0963L11.8421 0.127475H0V0.252454L17.8665 24.0493L0 47.8413V47.9712H11.8421L23.8362 31.9976L29.7984 24.0519L23.8362 16.0963Z" fill="currentColor"/><path d="M28.3041 33.9695L38.8063 47.9662H50.6535V47.8413L34.2688 26.0264L28.3041 33.9695Z" fill="currentColor"/></svg></div><div><h2 id="cta-heading">The next destination?<br/>Better settlement.</h2><ButtonLink href="/contact">Let’s talk</ButtonLink></div></section>
  </main>;
}
