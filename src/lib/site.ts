export const site = {
  name: "XeniPay",
  description: "Bring clarity to every travel transaction. XeniPay connects booking, reconciliation, and settlement through one shared blockchain-based record.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://xenipay.com",
  email: "info@xeni.com",
};

export const navigation = [
  { label: "Platform", href: "/#platform" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Why XeniPay", href: "/#why-xenipay" },
  { label: "Who it’s for", href: "/#industries" },
];

export const faqs = [
  { question: "What is XeniPay?", answer: "XeniPay is a blockchain-based reconciliation and settlement system built for the travel industry. It brings booking information and payment status into a shared record, helping counterparties agree on what is owed and when." },
  { question: "Who is XeniPay built for?", answer: "XeniPay is designed for travel agents, online travel agencies, hotels, airlines, and travel inventory consolidators. The platform connects the parties involved in a travel booking through a common transaction record." },
  { question: "How does blockchain help with reconciliation?", answer: "A shared ledger gives counterparties a consistent record of booking events. A universal transaction ID connects those events, so teams can reconcile against the same information and reduce back-and-forth over booking status." },
  { question: "Do I need to be a blockchain expert?", answer: "No. XeniPay is designed around familiar travel operations: bookings, counterparties, and settlement. During a demo, our team can walk you through the underlying technology and the setup for your business." },
  { question: "How can my business get started?", answer: "Request a demo and tell us about your business and settlement workflow. XeniPay is working with selected partners; our team will discuss product fit, integration requirements, and availability with you." },
];
