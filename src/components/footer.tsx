import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/ui";
import { navigation, site } from "@/lib/site";

export function Footer() {
  return <footer className="site-footer"><div className="shell">
    <div className="footer-top"><div><Logo/><p>Better connected.<br/>Better settled.</p></div><div className="footer-links"><div><span>EXPLORE</span>{navigation.map(item => <Link key={item.href} href={item.href}>{item.label}</Link>)}</div><div><span>CONNECT</span><Link href="/contact">Request a demo<ArrowUpRight size={13}/></Link><a href={`mailto:${site.email}`}>{site.email}</a><a href="https://www.xeni.com/" target="_blank" rel="noopener noreferrer">Discover Xeni<span className="sr-only"> (opens in a new tab)</span><ArrowUpRight size={13}/></a></div></div></div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} XeniPay. All rights reserved.</span><span>Built for a world in motion. <span aria-hidden="true">↗</span></span></div>
    <div className="footer-wordmark" aria-hidden="true">XeniPay<span>↗</span></div>
  </div></footer>;
}
