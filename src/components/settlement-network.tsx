"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Check, CheckCheck, Clock3, Hotel, LockKeyhole, Plane, ShieldCheck, Wallet } from "lucide-react";

const stages = [
  { status: "Booking captured · payment made", caption: "FUNDS IN TRANSIT", duration: 2100 },
  { status: "XeniPay verifying payment", caption: "VERIFYING & ROUTING", duration: 1500 },
  { status: "Supplier and agent payouts processing", caption: "SENDING PAYOUTS", duration: 2200 },
  { status: "Payouts delivered · confirming settlement", caption: "CONFIRMING PAYOUTS", duration: 1900 },
  { status: "Settlement complete", caption: "SETTLEMENT COMPLETE", duration: 3000 },
] as const;

const upperIncomingPath = "M110 130H300Q335 130 335 165V215Q335 250 370 250H560";
const upperOutgoingPath = "M560 250H755Q790 250 790 215V130Q790 95 825 95H1010";
const CARD_CONNECTION_OVERLAP = 6;

function lowerConnection(startX: number, startY: number, endX: number, endY: number) {
  const horizontalDistance = endX - startX;
  const verticalDirection = Math.sign(endY - startY) || 1;
  const corner = Math.round(Math.max(1, Math.min(24, Math.abs(endY - startY) / 3, horizontalDistance / 6)));
  const turnX = Math.round(startX + horizontalDistance * .38);
  const elbowX = turnX + corner;
  return `M${startX} ${startY}H${turnX}Q${elbowX} ${startY} ${elbowX} ${startY + verticalDirection * corner}V${endY - verticalDirection * corner}Q${elbowX} ${endY} ${elbowX + corner} ${endY}H${endX}`;
}

function ArrivalBorder({ width, height }: { width: number; height: number }) {
  const borderRef = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState({ width, height });

  useLayoutEffect(() => {
    const card = borderRef.current?.parentElement;
    if (!card) return;
    const updateSize = () => {
      const nextWidth = card.offsetWidth;
      const nextHeight = card.offsetHeight;
      if (!nextWidth || !nextHeight) return;
      setSize(previous => previous.width === nextWidth && previous.height === nextHeight
        ? previous
        : { width: nextWidth, height: nextHeight });
    };
    updateSize();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(updateSize);
    observer?.observe(card);
    return () => observer?.disconnect();
  }, []);

  const edge = .625;
  const radius = 9;
  const right = size.width - edge;
  const bottom = size.height - edge;
  const path = `M${edge} ${size.height / 2}V${radius}Q${edge} ${edge} ${radius} ${edge}H${size.width - radius}Q${right} ${edge} ${right} ${radius}V${size.height - radius}Q${right} ${bottom} ${size.width - radius} ${bottom}H${radius}Q${edge} ${bottom} ${edge} ${size.height - radius}V${size.height / 2}`;

  return <svg ref={borderRef} className="arrival-border" viewBox={`0 0 ${size.width} ${size.height}`} aria-hidden="true"><path pathLength="1" d={path}/></svg>;
}

export function SettlementNetwork() {
  const [stage, setStage] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [motionPaused, setMotionPaused] = useState(false);
  const remainingMs = useRef<number>(stages[0].duration);
  const connectionsRef = useRef<SVGSVGElement>(null);
  const networkRef = useRef<HTMLDivElement>(null);
  const walletRef = useRef<HTMLDivElement>(null);
  const agentRef = useRef<HTMLDivElement>(null);
  const [lowerPaths, setLowerPaths] = useState({
    incoming: lowerConnection(320, 315, 560, 250),
    outgoing: lowerConnection(560, 250, 790, 320),
  });

  useEffect(() => {
    const network = networkRef.current;
    const wallet = walletRef.current;
    const agent = agentRef.current;
    if (!network || !wallet || !agent) return;

    const updatePaths = () => {
      const bounds = network.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      const walletBounds = wallet.getBoundingClientRect();
      const agentBounds = agent.getBoundingClientRect();
      const x = (value: number) => Math.round((value - bounds.left) * 1120 / bounds.width);
      const y = (value: number) => Math.round((value - bounds.top) * 420 / bounds.height);
      const incoming = lowerConnection(x(walletBounds.right), y(walletBounds.top + walletBounds.height / 2), 560, 250);
      // Continue slightly beneath the card so the animated connector and its
      // arrival outline meet cleanly despite responsive scaling/subpixel layout.
      const outgoing = lowerConnection(
        560,
        250,
        x(agentBounds.left + CARD_CONNECTION_OVERLAP),
        y(agentBounds.top + agentBounds.height / 2),
      );
      setLowerPaths(previous => previous.incoming === incoming && previous.outgoing === outgoing ? previous : { incoming, outgoing });
    };

    updatePaths();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(updatePaths);
    observer?.observe(network);
    observer?.observe(wallet);
    observer?.observe(agent);
    window.addEventListener("resize", updatePaths);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", updatePaths);
    };
  }, []);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => {
      setReducedMotion(media.matches);
      if (media.matches) {
        remainingMs.current = stages[stages.length - 1].duration;
        setStage(stages.length - 1);
      }
    };
    updatePreference();
    media.addEventListener("change", updatePreference);
    return () => media.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const updatePause = () => setMotionPaused(root.dataset.motion === "paused");
    updatePause();
    const observer = new window.MutationObserver(updatePause);
    observer.observe(root, { attributes: true, attributeFilter: ["data-motion"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reducedMotion || motionPaused) return;
    const startedAt = Date.now();
    let completed = false;
    const timer = window.setTimeout(() => {
      completed = true;
      const nextStage = (stage + 1) % stages.length;
      remainingMs.current = stages[nextStage].duration;
      setStage(nextStage);
    }, remainingMs.current);
    return () => {
      window.clearTimeout(timer);
      if (!completed) remainingMs.current = Math.max(0, remainingMs.current - (Date.now() - startedAt));
    };
  }, [stage, reducedMotion, motionPaused]);

  useEffect(() => {
    if (motionPaused) connectionsRef.current?.pauseAnimations?.();
    else connectionsRef.current?.unpauseAnimations?.();
  }, [motionPaused]);

  const settled = stage === 4;
  const payingOut = stage === 2 || stage === 3;
  const payoutArrived = stage >= 3;
  const payoutStatus = settled ? "Settled" : stage === 3 ? "Confirming" : payingOut ? "Processing" : "Pending";
  const agentStatus = settled ? "Paid" : stage === 3 ? "Confirming" : payingOut ? "Processing" : "Pending";

  return <div ref={networkRef} className={`settlement-network stage-${stage}`}>
    <div className="network-grid" aria-hidden="true" />
    <div className="network-halo" aria-hidden="true" />
    <svg ref={connectionsRef} className="network-connections" viewBox="0 0 1120 420" preserveAspectRatio="none" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="flow-in-gradient"><stop stopColor="var(--ink-700)" stopOpacity=".1"/><stop offset=".5" stopColor="var(--violet-300)"/><stop offset="1" stopColor="var(--violet-500)" stopOpacity=".1"/></linearGradient>
        <linearGradient id="flow-out-gradient"><stop stopColor="var(--success)" stopOpacity=".35"/><stop offset=".5" stopColor="var(--success)"/><stop offset="1" stopColor="var(--mint)"/></linearGradient>
      </defs>
      <path className="connection-base" d={`${upperIncomingPath} ${lowerPaths.incoming} ${upperOutgoingPath} ${lowerPaths.outgoing}`}/>
      <path className="connection-flow flow-in" pathLength="1" d={upperIncomingPath}/>
      <path className="connection-flow flow-in flow-in-lower" pathLength="1" d={lowerPaths.incoming}/>
      {stage >= 2 && <>
        <path className="connection-flow flow-out" pathLength="1" d={upperOutgoingPath}/>
        <path className="connection-flow flow-out flow-out-lower" pathLength="1" d={lowerPaths.outgoing}/>
      </>}
      {stage === 0 && <>
        <circle className="transfer-token" r="6"><animateMotion dur="2.1s" path="M110 130H300Q335 130 335 165V215Q335 250 370 250H560" fill="freeze"/></circle>
        <circle className="transfer-token" r="6"><animateMotion dur="2.1s" path={lowerPaths.incoming} fill="freeze"/></circle>
      </>}
      {stage === 2 && <circle className="transfer-token transfer-token-out" r="6"><animateMotion dur="2.2s" path={upperOutgoingPath} fill="freeze"/></circle>}
    </svg>
    <div className="network-card booking-card">
      <div className="card-label"><span className="tiny-icon violet"><Plane size={15}/></span>TRAVEL BOOKING<span className="card-dots">···</span></div>
      <div className="booking-route"><span>JFK</span><span className="route-line"><Plane size={14}/></span><span>LHR</span></div>
      <div className="booking-subline"><span>New York</span><span>London</span></div>
      <div className="network-card-footer"><span>Booking #XN-2084</span><span className="small-status"><Check size={11}/> Confirmed</span></div>
    </div>
    <div ref={walletRef} className="network-card wallet-card"><span className="tiny-icon"><Wallet size={17}/></span><div><span className="micro-label">PAYMENT MADE</span><strong>$2,450.00 <small>USD</small></strong></div><ArrowDownLeft size={17} className="mint-text"/></div>
    <div className="settlement-core">
      <div className="core-orbit orbit-one" aria-hidden="true"/><div className="core-orbit orbit-two" aria-hidden="true"/>
      <div className="core-cube">
        <svg className="core-mark" viewBox="0 0 51 48" fill="none" aria-hidden="true">
          <path d="M39.4713 0.0299944H50.6485V0.254932L34.2638 22.0748L31.2927 18.1108L29.7984 16.1112L28.3041 14.1292L38.8063 0.132471H39.3991L39.4713 0.0299944Z" fill="currentColor"/>
          <path d="M23.8362 16.0963L11.8421 0.127475H0V0.252454L17.8665 24.0493L0 47.8413V47.9712H11.8421L23.8362 31.9976L29.7984 24.0519L23.8362 16.0963Z" fill="currentColor"/>
          <path d="M28.3041 33.9695L38.8063 47.9662H50.6535V47.8413L34.2688 26.0264L28.3041 33.9695Z" fill="currentColor"/>
        </svg>
        <span className="core-brand-name">XeniPay</span>
      </div>
      <div className="core-caption"><span className="status-dot"/>{stages[stage].caption}</div>
    </div>
    <div className="network-card payout-card">
      {payoutArrived && <ArrivalBorder width={232} height={150}/>}
      <div className="card-label"><span className="tiny-icon"><Hotel size={15}/></span>SUPPLIER PAYOUT<ArrowUpRight size={14}/></div>
      <strong className="payout-amount">$2,205.00 <small>USD</small></strong>
      <div className="network-card-footer"><span>Connected supplier</span><span className={`small-status ${settled ? "" : "pending"}`}>{settled ? <CheckCheck size={13}/> : <Clock3 size={12}/>}{payoutStatus}</span></div>
    </div>
    <div ref={agentRef} className="network-card agent-card">{payoutArrived && <ArrivalBorder width={252} height={72}/>}<span className="tiny-icon amber"><Wallet size={16}/></span><div><span className="micro-label">AGENT EARNINGS</span><strong>$245.00 <small>USD</small></strong></div><span className={`agent-status ${settled ? "complete" : ""}`}>{settled ? <Check size={13}/> : <Clock3 size={13}/>}<span>{agentStatus}</span></span></div>
    <div className="ledger-chip"><ShieldCheck size={13}/><span>One transaction. One shared truth.</span></div>
    <div className="network-bottom"><div className="demo-status" role="status" aria-live="off"><LockKeyhole size={16}/>{stages[stage].status}</div></div>
  </div>;
}
