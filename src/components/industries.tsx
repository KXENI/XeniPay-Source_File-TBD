"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ArrowUpRight, Building2, Hotel, Plane, Route, Check } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const industries = [
  { name: "Travel agents", icon: Route, image: "/industries/travel-agents-real.jpg", imagePosition: "center 34%", heading: "Less chasing payments. More moving people.", description: "Connect each booking to its payment journey. Get a clearer view of supplier obligations and your earnings, so your team can focus on the next great trip.", points: ["A shared view of booking status", "Clear supplier and agent payment records", "Less manual reconciliation"], source: "Travel agency", destination: "Travel suppliers", initials: "TA", amount: "$245.00", amountLabel: "Agent earnings" },
  { name: "Hotels", icon: Hotel, image: "/industries/hotels-pool.png", imagePosition: "center", heading: "Every reservation. A clearer path to payment.", description: "Bring reservation and payment records together across your distribution partners. See the booking context behind each settlement and resolve discrepancies with shared information.", points: ["Connected booking and settlement records", "Visibility across distribution partners", "Simpler payment reconciliation"], source: "Booking partners", destination: "Your hotel", initials: "HT", amount: "$2,205.00", amountLabel: "Supplier payout" },
  { name: "Airlines", icon: Plane, image: "/industries/airlines-real.jpg", imagePosition: "36% 20%", heading: "Keep your payments on the same itinerary.", description: "Connect agencies and distribution partners around a consistent transaction record. Follow payment obligations from the original booking through to settlement.", points: ["Shared transaction references", "Counterparty payment visibility", "A consistent audit trail"], source: "Travel partners", destination: "Your airline", initials: "AL", amount: "$2,450.00", amountLabel: "Booking value" },
  { name: "Consolidators", icon: Building2, image: "/industries/consolidators-real.jpg", imagePosition: "center 22%", heading: "A connected view of a complex network.", description: "Coordinate your supplier and agency relationships with one shared record. Give your operations team a common reference for every booking and payment event.", points: ["Connected agency and supplier records", "One universal transaction ID", "Clarity across counterparties"], source: "Agency network", destination: "Supplier network", initials: "CO", amount: "$2,450.00", amountLabel: "Booking value" },
];
const AUTO_ADVANCE_MS = 6000;

export function Industries() {
  const [active, setActive] = useState(0);
  const [rotation, setRotation] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const industry = industries[active];
  const Icon = industry.icon;

  useEffect(() => {
    const timer = window.setTimeout(() => setActive(current => (current + 1) % industries.length), AUTO_ADVANCE_MS);
    return () => window.clearTimeout(timer);
  }, [active, rotation]);

  function selectIndustry(index: number) {
    setActive(index);
    setRotation(current => current + 1);
  }

  function handleKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if(event.key === "ArrowRight") next = (index + 1) % industries.length;
    else if(event.key === "ArrowLeft") next = (index - 1 + industries.length) % industries.length;
    else if(event.key === "Home") next = 0;
    else if(event.key === "End") next = industries.length - 1;
    else return;
    event.preventDefault(); selectIndustry(next); tabs.current[next]?.focus();
  }
  return <div className="industries-content">
    <div className="industry-stage">
      <div role="tablist" aria-label="Explore by industry" className="industry-tabs">
        {industries.map((item,i) => {
          const TabIcon = item.icon;
          return <button type="button" role="tab" id={`industry-tab-${i}`} aria-label={item.name} aria-controls={`industry-panel-${i}`} aria-selected={active === i} tabIndex={active === i ? 0 : -1} ref={element => {tabs.current[i] = element;}} onKeyDown={event => handleKey(event,i)} onClick={() => selectIndustry(i)} key={item.name}>
            <span className="industry-tab-icon"><TabIcon size={18}/></span>
            <span className="industry-tab-copy">{item.name}</span>
            {active === i && <span className="industry-tab-progress" key={rotation} aria-hidden="true"/>}
          </button>;
        })}
      </div>
      <div role="tabpanel" id={`industry-panel-${active}`} aria-labelledby={`industry-tab-${active}`} tabIndex={0} className="industry-panel" key={active}>
        <div className="industry-copy"><h3>{industry.heading}</h3><p>{industry.description}</p><ul>{industry.points.map(point => <li key={point}><Check size={15}/>{point}</li>)}</ul><Link href={`/contact?industry=${encodeURIComponent(industry.name)}`} className="text-link">Let’s talk about your business<ArrowUpRight size={17}/></Link></div>
        <div className="industry-visual" aria-label={`Example transaction connecting ${industry.source} and ${industry.destination}`}>
          <div className="industry-photo-card">
            <Image className="industry-photo" src={industry.image} alt="" fill sizes="(max-width: 640px) 340px, 420px" style={{ objectPosition: industry.imagePosition }}/>
            <div className="industry-photo-wash" aria-hidden="true"/>
            <div className="industry-visual-grid" aria-hidden="true"/>
            <div className="industry-node"><span><Icon size={22}/></span><strong>{industry.source}</strong><small>BOOKING CONNECTED</small></div>
            <div className="industry-wire" aria-hidden="true"><span/><span/><span/></div>
            <div className="industry-transaction"><div className="flex items-center justify-between"><span className="micro-label">{industry.amountLabel}</span><span className="small-status"><Check size={11}/>Matched</span></div><strong>{industry.amount}<small> USD</small></strong><div className="industry-payee"><span>{industry.initials}</span><div>{industry.destination}<small>Transaction #XN-2084</small></div><ArrowUpRight size={16}/></div></div>
          </div>
        </div>
      </div>
    </div>
  </div>;
}
