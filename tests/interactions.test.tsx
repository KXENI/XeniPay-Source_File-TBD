import { afterEach, before, test } from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { Workflow } from "../src/components/workflow";
import { Industries } from "../src/components/industries";
import { FaqAccordion } from "../src/components/faq-accordion";
import { SettlementNetwork } from "../src/components/settlement-network";
import { LeadForm } from "../src/components/lead-form";

let testing: typeof import("@testing-library/react");
let userEvent: typeof import("@testing-library/user-event").default;

before(async () => {
  const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "http://localhost:3000" });
  Object.assign(globalThis, {
    window: dom.window, self: dom.window, document: dom.window.document,
    HTMLElement: dom.window.HTMLElement, HTMLInputElement: dom.window.HTMLInputElement,
    FormData: dom.window.FormData, getComputedStyle: dom.window.getComputedStyle,
    IS_REACT_ACT_ENVIRONMENT: true,
  });
  Object.defineProperty(globalThis, "navigator", { value: dom.window.navigator, configurable: true });
  testing = await import("@testing-library/react");
  userEvent = (await import("@testing-library/user-event")).default;
});

afterEach(() => testing.cleanup());

test("walkthrough updates the selected step and product preview status", () => {
  const { render, screen, fireEvent } = testing;
  render(<Workflow/>);
  const first = screen.getByRole("button", { name: /Capture the booking/ });
  fireEvent.click(first);
  assert.equal(first.getAttribute("aria-pressed"), "true");
  assert.ok(screen.getByText("Booking captured"));
  const last = screen.getByRole("button", { name: /Settle with confidence/ });
  fireEvent.click(last);
  assert.equal(first.getAttribute("aria-pressed"), "false");
  assert.ok(screen.getByText("Settlement complete"));
});

test("product analytics preview responds to ranges and toolbar actions", () => {
  const { render, screen, fireEvent } = testing;
  render(<Workflow/>);
  const oneWeek = screen.getByRole("button", { name: "1W" });
  fireEvent.click(oneWeek);
  assert.equal(oneWeek.getAttribute("aria-pressed"), "true");
  assert.ok(screen.getByRole("img", { name: "Activity chart for 1W" }));
  fireEvent.click(screen.getByRole("button", { name: "Filter" }));
  assert.ok(screen.getByText("Filter controls ready"));
});

test("workflow supports separated dashboard and steps layouts", () => {
  const { render, screen, fireEvent } = testing;
  const dashboard = render(<Workflow mode="dashboard"/>);
  assert.ok(screen.getByRole("img", { name: "Activity chart for 1M" }));
  assert.equal(screen.queryByRole("button", { name: /Capture the booking/ }), null);
  dashboard.unmount();
  render(<Workflow mode="steps"/>);
  assert.ok(screen.getByRole("button", { name: /Capture the booking/ }));
  assert.ok(screen.getByRole("img", { name: /Capture the booking interface preview/ }));
  assert.equal(screen.getAllByRole("img", { name: /interface preview/ }).length, 1);
  fireEvent.click(screen.getByRole("button", { name: /Settle with confidence/ }));
  assert.ok(screen.getByRole("img", { name: /Settle with confidence interface preview/ }));
  assert.equal(screen.getAllByRole("img", { name: /interface preview/ }).length, 1);
  assert.equal(screen.queryByRole("img", { name: /Activity chart/ }), null);
});

test("workflow automatically advances and can be paused", async (context) => {
  const { render, screen, act, fireEvent } = testing;
  context.mock.timers.enable({ apis: ["setTimeout"] });
  render(<Workflow mode="steps"/>);
  assert.ok(screen.getByRole("img", { name: /Capture the booking interface preview/ }));
  await act(() => context.mock.timers.tick(5300));
  assert.ok(screen.getByRole("img", { name: /Create a shared source of truth interface preview/ }));
  fireEvent.click(screen.getByRole("button", { name: "Pause automatic walkthrough" }));
  await act(() => context.mock.timers.tick(6000));
  assert.ok(screen.getByRole("img", { name: /Create a shared source of truth interface preview/ }));
  context.mock.timers.reset();
});

test("hero settlement moves from incoming funds through processing to paid payouts", async (context) => {
  const { render, screen, act } = testing;
  context.mock.timers.enable({ apis: ["setTimeout"] });
  const { container } = render(<SettlementNetwork/>);
  const supplier = container.querySelector(".payout-card");
  const agent = container.querySelector(".agent-card");
  assert.match(container.querySelector(".wallet-card")?.textContent || "", /PAYMENT MADE/);
  assert.match(screen.getByRole("status").textContent || "", /payment made/);
  assert.match(supplier?.textContent || "", /Pending/);
  assert.match(agent?.textContent || "", /Pending/);
  assert.doesNotMatch(supplier?.textContent || "", /Settled/);
  assert.equal(container.querySelectorAll(".arrival-border path, .flow-out").length, 0);
  assert.equal(container.querySelectorAll(".network-connections > circle[cx]").length, 0);

  await act(() => context.mock.timers.tick(2100));
  assert.match(screen.getByRole("status").textContent || "", /XeniPay verifying payment/);
  assert.ok(container.querySelector(".settlement-network.stage-1"));
  assert.equal(container.querySelectorAll(".arrival-border path, .flow-out").length, 0);

  await act(() => context.mock.timers.tick(1500));
  assert.match(supplier?.textContent || "", /Processing/);
  assert.match(agent?.textContent || "", /Processing/);
  assert.ok(container.querySelector(".settlement-network.stage-2"));
  assert.equal(container.querySelectorAll(".flow-out").length, 2);
  assert.equal(container.querySelectorAll(".arrival-border path").length, 0);
  assert.equal(container.querySelectorAll(".transfer-token-out").length, 1);

  Object.defineProperties(supplier!, {
    offsetWidth: { configurable: true, value: 240 },
    offsetHeight: { configurable: true, value: 156 },
  });
  Object.defineProperties(agent!, {
    offsetWidth: { configurable: true, value: 252 },
    offsetHeight: { configurable: true, value: 72 },
  });

  await act(() => context.mock.timers.tick(2200));
  assert.ok(container.querySelector(".settlement-network.stage-3"));
  assert.equal(container.querySelectorAll(".stage-3 .arrival-border path").length, 2);
  assert.equal(container.querySelector(".payout-card .arrival-border")?.getAttribute("viewBox"), "0 0 240 156");
  assert.match(supplier?.textContent || "", /Confirming/);
  assert.match(agent?.textContent || "", /Confirming/);
  assert.doesNotMatch(supplier?.textContent || "", /Settled/);
  assert.doesNotMatch(agent?.textContent || "", /Paid/);
  assert.match(screen.getByRole("status").textContent || "", /confirming settlement/);

  await act(() => context.mock.timers.tick(1700));
  assert.ok(container.querySelector(".settlement-network.stage-3"));
  assert.doesNotMatch(supplier?.textContent || "", /Settled/);

  await act(() => context.mock.timers.tick(200));
  assert.ok(container.querySelector(".settlement-network.stage-4"));
  assert.equal(container.querySelectorAll(".arrival-border path").length, 2);
  assert.match(supplier?.textContent || "", /Settled/);
  assert.match(agent?.textContent || "", /Paid/);
  assert.match(screen.getByRole("status").textContent || "", /Settlement complete/);
  context.mock.timers.reset();
});

test("lower settlement connectors attach to the side centers of their cards without a visible seam", async (context) => {
  const { render, act } = testing;
  context.mock.timers.enable({ apis: ["setTimeout"] });
  const { container } = render(<SettlementNetwork/>);
  const network = container.querySelector<HTMLElement>(".settlement-network")!;
  const wallet = container.querySelector<HTMLElement>(".wallet-card")!;
  const agent = container.querySelector<HTMLElement>(".agent-card")!;
  const rect = (left: number, top: number, width: number, height: number) =>
    ({ left, top, width, height, right: left + width, bottom: top + height }) as DOMRect;
  network.getBoundingClientRect = () => rect(0, 0, 1120, 420);
  wallet.getBoundingClientRect = () => rect(120, 275, 224, 76);
  agent.getBoundingClientRect = () => rect(790, 281, 227, 72);

  act(() => window.dispatchEvent(new window.Event("resize")));

  await act(() => context.mock.timers.tick(2100));
  await act(() => context.mock.timers.tick(1500));

  const incoming = container.querySelector<SVGPathElement>(".flow-in-lower")?.getAttribute("d") || "";
  const outgoing = container.querySelector<SVGPathElement>(".flow-out-lower")?.getAttribute("d") || "";
  assert.match(incoming, /^M344 313H\d+Q\d+ 313 \d+ \d+V\d+Q\d+ 250 \d+ 250H560$/);
  // The end travels six pixels beneath the card edge, so the connector and
  // animated border meet without a subpixel gap.
  assert.match(outgoing, /^M560 250H\d+Q\d+ 250 \d+ \d+V\d+Q\d+ 317 \d+ 317H796$/);
  context.mock.timers.reset();
});

test("industry tabs support arrow keys, Home and End with matching content", async () => {
  const { render, screen } = testing;
  render(<Industries/>);
  const user = userEvent.setup();
  const first = screen.getByRole("tab", { name: "Travel agents" });
  first.focus();
  await user.keyboard("{ArrowRight}");
  const hotel = screen.getByRole("tab", { name: "Hotels" });
  assert.equal(document.activeElement, hotel);
  assert.equal(hotel.getAttribute("aria-selected"), "true");
  assert.equal(screen.getByRole("tabpanel").getAttribute("aria-labelledby"), hotel.id);
  assert.ok(screen.getByRole("heading", { name: /Every reservation/ }));
  await user.keyboard("{End}");
  assert.equal(document.activeElement, screen.getByRole("tab", { name: "Consolidators" }));
  await user.keyboard("{Home}");
  assert.equal(document.activeElement, first);
});

test("industry tabs rotate automatically and a click restarts the selection", async (context) => {
  const { render, screen, act, fireEvent } = testing;
  context.mock.timers.enable({ apis: ["setTimeout"] });
  render(<Industries/>);
  assert.equal(screen.getByRole("tab", { name: "Travel agents" }).getAttribute("aria-selected"), "true");

  await act(() => context.mock.timers.tick(6000));
  assert.equal(screen.getByRole("tab", { name: "Hotels" }).getAttribute("aria-selected"), "true");

  fireEvent.click(screen.getByRole("tab", { name: "Consolidators" }));
  assert.equal(screen.getByRole("tab", { name: "Consolidators" }).getAttribute("aria-selected"), "true");
  await act(() => context.mock.timers.tick(6000));
  assert.equal(screen.getByRole("tab", { name: "Travel agents" }).getAttribute("aria-selected"), "true");
  context.mock.timers.reset();
});

test("opening a FAQ closes the previously open answer", () => {
  const { render, screen, fireEvent } = testing;
  render(<FaqAccordion/>);
  const first = screen.getByText("What is XeniPay?");
  const second = screen.getByText("Who is XeniPay built for?");
  fireEvent.click(first);
  assert.equal(first.closest("details")?.open, true);
  fireEvent.click(second);
  assert.equal(first.closest("details")?.open, false);
  assert.equal(second.closest("details")?.open, true);
});

test("unconfigured contact form prepares an email draft without claiming delivery", async () => {
  const { render, screen } = testing;
  render(<LeadForm onlineEnabled={false} initialIndustry="Hotels"/>);
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Full name"), "Alex Morgan");
  await user.type(screen.getByLabelText("Company"), "Example Travel");
  await user.type(screen.getByLabelText("Work email"), "alex@example.com");
  await user.click(screen.getByRole("button", { name: "Prepare my demo request" }));
  const draft = screen.getByRole("link", { name: /Open email draft/ });
  assert.ok(draft.getAttribute("href")?.startsWith("mailto:info@xeni.com?"));
  assert.ok(screen.getByText(/Your email draft is ready/));
  assert.equal(screen.queryByText(/Your request has been delivered/), null);
});
