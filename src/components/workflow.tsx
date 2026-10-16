"use client";

import Image from "next/image";
import { useEffect, useId, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Bell,
  BookOpen,
  CalendarDays,
  ChartNoAxesCombined,
  Columns3,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Pause,
  Play,
  Search,
  SlidersHorizontal,
  Upload,
  UsersRound,
  WalletCards,
} from "lucide-react";
import { assetPath } from "@/lib/asset-path";

const STEP_DURATION = 5200;

const steps = [
  { title: "Capture the booking", description: "Bring booking details and counterparties together. Every transaction starts with a clear, connected record.", label: "Booking captured" },
  { title: "Create a shared source of truth", description: "Give every counterparty the same view of booking status, linked by one universal transaction ID.", label: "Record verified" },
  { title: "Bring clarity to funds", description: "Connect payment status with booking events so your teams can see what is owed, to whom, and when.", label: "Funds secured" },
  { title: "Settle with confidence", description: "Move from reconciliation to settlement with a consistent record that everyone can follow.", label: "Settlement complete" },
];

const workflowAsset = assetPath("/product/workflow-assets");

function XdsStatus({ tone, icon, children }: { tone: string; icon: string; children: React.ReactNode }) {
  return <span className={`xds-status ${tone}`}><Image src={`${workflowAsset}/${icon}`} width={16} height={16} alt=""/>{children}</span>;
}

function XdsField({ label, value = "—", className = "" }: { label: string; value?: string; className?: string }) {
  return <div className={`xds-field ${className}`}><strong>{label}</strong><span>{value}</span></div>;
}

function XdsWallet() {
  return <span className="xds-wallet"><Image src={`${workflowAsset}/wallet.png`} width={40} height={40} alt=""/><strong>Wallet : 0.0.1681222</strong></span>;
}

function XdsBrand({ variant }: { variant: "dark" | "light" | "blue" | "orange" }) {
  return <Image className="xds-logo" src={`${workflowAsset}/logo-${variant}.svg`} width={136} height={33} alt=""/>;
}

function WorkflowStepGraphic({ step }: { step: number }) {
  const label = `${steps[step].title} interface preview`;

  if (step === 0) return <div className="xds-card xds-card-light" role="img" aria-label={label}>
    <header><XdsBrand variant="dark"/><XdsStatus tone="success" icon="check.svg">Booking Created</XdsStatus></header>
    <section className="xds-card-content">
      <h4>Booking Details &amp; Counter Parties</h4>
      <div className="xds-fields xds-fields-three">
        <XdsField label="Customer Name"/><XdsField label="Booking Details"/><XdsField label="Cancellation Policy"/>
        <XdsField label="OTA"/><XdsField label="Consolidator"/><XdsField label="Service Provider"/>
      </div>
      <h5>Blockchain Data</h5>
      <div className="xds-fields xds-fields-three xds-blockchain-fields">
        <XdsField label="Transaction Hash" value="X X X X  X X X X  X X X X"/><XdsField label="Block Number" value="7325623"/><XdsField label="Consensus at" value="7:55:05.5791"/>
      </div>
    </section>
  </div>;

  if (step === 1) return <div className="xds-card xds-card-code" role="img" aria-label={label}>
    <header><XdsBrand variant="light"/><XdsStatus tone="code" icon="code.svg">Blockchain Xeni Tokens</XdsStatus></header>
    <section className="xds-card-content">
      <h4>Code Snippet</h4>
      <pre className="xds-code"><span className="xds-comment">{"// Store Booking Data in HCS"}</span>{"\n"}<b>const</b> <i>ledgerTopicId</i> = <b>await</b> <i>hcsProvider.createTopic</i>({`{ topicMemo: _id }`});{"\n\n"}<span className="xds-comment">{"// Insert into Booking Table"}</span>{"\n"}<b>const</b> booking = <b>await</b> <em>databaseCommon.insert</em>(MODEL.BOOKING, {`{`}{"\n"}  <i>by: userId,</i>{"\n"}  amount: fare.total,{"\n"}  <i>_id,</i>…</pre>
    </section>
  </div>;

  if (step === 2) return <div className="xds-card xds-card-light" role="img" aria-label={label}>
    <header><XdsBrand variant="blue"/><XdsStatus tone="redeem" icon="zap.svg">Redeem</XdsStatus></header>
    <div className="xds-event-row"><span>Event : Booking Settled</span><XdsWallet/></div>
    <section className="xds-card-content xds-redeem-content">
      <h4>Counter Parties</h4>
      <div className="xds-fields xds-fields-three"><XdsField label="OTA" value="" className="placeholder"/><XdsField label="Consolidator" value="" className="placeholder"/><XdsField label="Service Provider" value="" className="placeholder"/></div>
      <h5>History</h5>
      <div className="xds-fields xds-history-fields"><XdsField label="Transaction Hash" value="XXXX XXXX XXXX"/><XdsField label="Date"/><XdsField label="Time"/><XdsField label="Event"/></div>
    </section>
  </div>;

  return <div className="xds-card xds-card-light" role="img" aria-label={label}>
    <header><XdsBrand variant="orange"/><XdsStatus tone="vendors" icon="users.svg">Vendors</XdsStatus></header>
    <XdsWallet/>
    <section className="xds-card-content xds-vendor-content">
      <h4>Vendors</h4>
      <div className="xds-vendor-grid">{[0,1,2].map(item => <span className="xds-vendor" key={item}><i/><b><i/><i/></b></span>)}</div>
      <button type="button" tabIndex={-1}><Image src={`${workflowAsset}/send.svg`} width={20} height={20} alt=""/>Settle Payments</button>
    </section>
  </div>;
}

const rangeData = {
  "24h": [6, 9, 8, 13, 15, 14, 19, 22, 21, 27, 29, 32],
  "1W": [7, 11, 10, 15, 18, 17, 22, 24, 23, 29, 31, 34],
  "1M": [5, 9, 12, 11, 16, 18, 17, 22, 25, 24, 30, 34],
  "1Y": [8, 10, 14, 13, 18, 21, 20, 25, 29, 27, 32, 36],
  All: [6, 9, 12, 14, 13, 19, 21, 24, 23, 29, 33, 37],
} as const;

type ChartPoint = { x: number; y: number; value: number };

function makeSmoothChartPath(points: ChartPoint[]) {
  if (points.length < 2) return "";
  return points.slice(0, -1).reduce((path, point, index) => {
    const previous = points[index - 1] ?? point;
    const next = points[index + 1];
    const afterNext = points[index + 2] ?? next;
    const controlOneX = point.x + (next.x - previous.x) / 6;
    const controlOneY = point.y + (next.y - previous.y) / 6;
    const controlTwoX = next.x - (afterNext.x - point.x) / 6;
    const controlTwoY = next.y - (afterNext.y - point.y) / 6;
    return `${path} C ${controlOneX},${controlOneY} ${controlTwoX},${controlTwoY} ${next.x},${next.y}`;
  }, `M ${points[0].x},${points[0].y}`);
}

type Range = keyof typeof rangeData;

const bookingMix = [
  ["Flights", 15],
  ["Hotels", 25],
  ["Cars", 10],
  ["Activities", 30],
  ["Packages", 15],
  ["Cruise", 5],
] as const;

const countries = [
  ["India", "8K", 100],
  ["United States", "5.5K", 72],
  ["Mexico", "1.4K", 35],
  ["Canada", "1.3K", 31],
] as const;

const recentRows = [
  ["Cherry", "Hotel", "Brazil", "$2,450"],
  ["eabooking.com", "Flight", "Mexico", "$1,890"],
  ["One Air", "Activity", "India", "$780"],
] as const;

const navItems = [
  ["Dashboard", LayoutDashboard],
  ["Analytics", ChartNoAxesCombined],
  ["Booking History", BookOpen],
  ["Counterparties", UsersRound],
  ["Payment History", CreditCard],
  ["Wallets", WalletCards],
] as const;

type WorkflowMode = "combined" | "steps" | "dashboard";

export function Workflow({ mode = "combined" }: { mode?: WorkflowMode }) {
  const showSteps = mode !== "dashboard";
  const showDashboard = mode !== "steps";
  const [active, setActive] = useState(() => mode === "steps" ? 0 : 1);
  const [cycleKey, setCycleKey] = useState(0);
  const [autoPlayPaused, setAutoPlayPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [range, setRange] = useState<Range>("1M");
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [toolbarMessage, setToolbarMessage] = useState("Live data connected");
  const gradientId = useId().replace(/:/g, "");
  const values = rangeData[range];
  // Keep the SVG's native aspect ratio. The chart is deliberately sized as a
  // wide panel so it stays crisp at every dashboard size instead of stretching.
  const width = 760;
  const height = 220;
  const points = values.map((value, index) => ({
    x: 18 + index * ((width - 36) / (values.length - 1)),
    y: height - 18 - (value / 40) * (height - 36),
    value,
  }));
  const linePath = makeSmoothChartPath(points);
  const areaPath = `${linePath} L ${width - 18},${height - 18} L 18,${height - 18} Z`;

  useEffect(() => {
    if (mode !== "steps" || typeof window.matchMedia !== "function") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(media.matches);
    updatePreference();
    media.addEventListener("change", updatePreference);
    return () => media.removeEventListener("change", updatePreference);
  }, [mode]);

  useEffect(() => {
    if (mode !== "steps" || autoPlayPaused || prefersReducedMotion) return;
    const timer = window.setTimeout(() => {
      setActive(current => (current + 1) % steps.length);
      setCycleKey(current => current + 1);
    }, STEP_DURATION);
    return () => window.clearTimeout(timer);
  }, [active, autoPlayPaused, cycleKey, mode, prefersReducedMotion]);

  const runToolbarAction = (label: string) => {
    setToolbarMessage(`${label} controls ready`);
  };

  const selectStep = (index: number) => {
    setActive(index);
    setCycleKey(current => current + 1);
  };

  const autoPlayIsPaused = autoPlayPaused || prefersReducedMotion;

  return <div
    className={`workflow-grid ${mode === "steps" ? `steps-only ${autoPlayIsPaused ? "is-paused" : ""}` : mode === "dashboard" ? "dashboard-only" : ""}`}
    style={mode === "steps" ? { "--step-duration": `${STEP_DURATION}ms` } as React.CSSProperties : undefined}
  >
    {showSteps && <div className="workflow-steps" aria-label="Settlement walkthrough">
      {steps.map((step, index) => <button
          type="button"
          key={step.title}
          className={`workflow-step ${index === active ? "active" : ""}`}
          aria-pressed={active === index}
          aria-controls={showDashboard ? "workflow-preview" : undefined}
          onClick={() => selectStep(index)}
        >
          <span className="step-number">0{index + 1}</span>
          <span><strong>{step.title}</strong><span className="step-description">{step.description}</span></span>
          <ArrowUpRight size={18} aria-hidden="true"/>
          {mode === "steps" && <span className="step-progress" aria-hidden="true"><i key={`${index}-${active}-${cycleKey}`}/></span>}
        </button>)}
    </div>}

    {mode === "steps" && <div className="workflow-step-stage" aria-live="polite">
      <figure key={active} className="workflow-step-figure">
        <WorkflowStepGraphic step={active}/>
      </figure>
      <div className="workflow-stage-caption">
        <span>STEP 0{active + 1}</span>
        <strong>{steps[active].label}</strong>
        {!prefersReducedMotion && <button
          type="button"
          className="workflow-autoplay-toggle"
          aria-label={autoPlayPaused ? "Resume automatic walkthrough" : "Pause automatic walkthrough"}
          aria-pressed={autoPlayPaused}
          onClick={() => {
            if (autoPlayPaused) setCycleKey(current => current + 1);
            setAutoPlayPaused(current => !current);
          }}
        >
          {autoPlayPaused ? <Play size={11} aria-hidden="true"/> : <Pause size={11} aria-hidden="true"/>}
          {autoPlayPaused ? "Resume" : "Pause"}
        </button>}
      </div>
    </div>}

    {showDashboard && <div id="workflow-preview" className="workflow-preview product-preview">
      <div className="product-window-bar" aria-hidden="true">
        <span/><span/><span/>
        <p>app.xenipay.com / analytics</p>
        <em><span className="status-dot"/>LIVE</em>
      </div>

      <div className="product-app">
        <aside className="product-sidebar" aria-label="Product preview navigation">
          <div className="product-mark"><span>X</span><strong>XeniPay</strong></div>
          <nav>
            {navItems.map(([label, Icon]) => <button
              type="button"
              key={label}
              className={label === "Analytics" ? "active" : ""}
              aria-current={label === "Analytics" ? "page" : undefined}
              onClick={() => setToolbarMessage(label === "Analytics" ? "Analytics view active" : `${label} preview coming next`)}
            ><Icon size={13}/><span>{label}</span></button>)}
          </nav>
          <button type="button" className="product-logout" onClick={() => setToolbarMessage("You are viewing a secure demo")}><LogOut size={12}/><span>Logout</span></button>
        </aside>

        <div className="product-main">
          <header className="product-toolbar">
            <button type="button" aria-label="Go back" onClick={() => runToolbarAction("Back")}><ArrowLeft size={13}/></button>
            <div className="product-tools">
              {([
                ["Search", Search],
                ["Filter", SlidersHorizontal],
                ["Date", CalendarDays],
                ["Columns", Columns3],
                ["Export", Upload],
                ["Notifications", Bell],
              ] as const).map(([label, Icon]) => <button type="button" key={label} aria-label={label} onClick={() => runToolbarAction(label)}><Icon size={12}/></button>)}
            </div>
          </header>

          <div className="product-content">
            <div className="product-title-row">
              <div><span>WORKSPACE / ANALYTICS</span><h3>Live Analytics</h3></div>
              <div className="range-tabs" aria-label="Live analytics date range">
                {(Object.keys(rangeData) as Range[]).map(item => <button type="button" key={item} aria-pressed={range === item} onClick={() => setRange(item)}>{item}</button>)}
              </div>
            </div>

            <section className="live-overview" aria-label="Live analytics overview">
              <div className="live-metric">
                <span>Users in last 30 minutes</span>
                <strong>{12 + active * 4}</strong>
                <div className="minute-bars" aria-hidden="true">{[22, 43, 78, 31, 60, 34, 49, 85, 40, 67, 28, 53].map((bar, index) => <i key={index} style={{ height: `${bar}%` }}/>)}</div>
                <small aria-live="polite"><span className="status-dot"/>{steps[active].label}</small>
              </div>

              <div className="booking-mix">
                <span className="product-label">Booking mix</span>
                <div>{bookingMix.map(([label, value]) => <figure key={label}>
                  <span className="donut" style={{ "--share": `${value * 3.6}deg` } as React.CSSProperties}>{String(value).padStart(2, "0")}%</span>
                  <figcaption>{label}</figcaption>
                </figure>)}</div>
              </div>

              <div className="geo-activity">
                <div className="map-wrap"><Image src={assetPath("/product/analytics-world-map.svg")} width={584} height={291} alt="World map showing settlement activity across XeniPay markets"/></div>
                <div className="country-list">
                  <div><b>Country</b><b>Count</b></div>
                  {countries.map(([country, count, percent]) => <div key={country}><span>{country}</span><strong>{count}</strong><i style={{ width: `${percent}%` }}/></div>)}
                </div>
              </div>
            </section>

            <section className="activity-panel" aria-label={`User activity, ${range} range`}>
              <div className="activity-heading"><div><h4>User Activity</h4><span role="status" aria-live="polite">{toolbarMessage}</span></div><div className="activity-legend"><i/>Verified events</div></div>
              <div className="chart-wrap">
                <span className="chart-y y-top">40</span><span className="chart-y y-middle">20</span><span className="chart-y y-bottom">0</span>
                <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`Activity chart for ${range}`} preserveAspectRatio="xMidYMid meet">
                  <defs><linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8F63EE" stopOpacity=".34"/><stop offset="1" stopColor="#5B478A" stopOpacity=".03"/></linearGradient></defs>
                  <g className="chart-grid"><line x1="18" y1="18" x2="742" y2="18"/><line x1="18" y1="110" x2="742" y2="110"/><line x1="18" y1="202" x2="742" y2="202"/></g>
                  <path d={areaPath} fill={`url(#${gradientId})`}/>
                  <path d={linePath} className="activity-line"/>
                  {points.map((point, index) => <circle
                    key={index}
                    cx={point.x}
                    cy={point.y}
                    r={hoveredPoint === index ? 4.5 : 2.7}
                    tabIndex={0}
                    role="button"
                    aria-label={`Day ${index + 1}: ${point.value} verified events`}
                    onMouseEnter={() => setHoveredPoint(index)}
                    onMouseLeave={() => setHoveredPoint(null)}
                    onFocus={() => setHoveredPoint(index)}
                    onBlur={() => setHoveredPoint(null)}
                  />)}
                </svg>
                {hoveredPoint !== null && <div className="chart-tooltip" style={{ left: `${(points[hoveredPoint].x / width) * 100}%`, top: `${(points[hoveredPoint].y / height) * 100}%` }}><span>Verified events</span><strong>{points[hoveredPoint].value}</strong></div>}
                <div className="chart-dates" aria-hidden="true"><span>14 Nov</span><span>20 Nov</span><span>26 Nov</span><span>02 Dec</span><span>08 Dec</span></div>
              </div>
            </section>

            <section className="recent-activity" aria-label="Recent transaction activity">
              <div className="recent-title"><h4>Recent activity</h4><button type="button" onClick={() => setToolbarMessage("All transaction activity loaded")}>View all</button></div>
              <div className="recent-head"><span>OTA name</span><span>Activity</span><span>Location</span><span>Amount</span></div>
              {recentRows.map(([name, activity, location, amount]) => <div className="recent-row" key={name}><strong>{name}</strong><span>{activity}</span><span>{location}</span><b>{amount}</b></div>)}
            </section>
          </div>
        </div>
      </div>

      <div className="preview-caption"><span>PRODUCT PREVIEW · INTERACTIVE</span><span>0{active + 1} / 04</span></div>
    </div>}
  </div>;
}
