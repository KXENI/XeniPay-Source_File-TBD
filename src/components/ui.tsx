import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { assetPath } from "@/lib/asset-path";

export function Logo() {
  return <Link href="/" className="brand" aria-label="XeniPay home"><Image src={assetPath("/brand/xenipay-light.svg")} alt="XeniPay" width={272} height={66} priority /></Link>;
}

export function ButtonLink({ href, children, secondary = false, className = "" }: { href: string; children: ReactNode; secondary?: boolean; className?: string }) {
  return <Link href={href} className={`button ${secondary ? "button-secondary" : "button-primary"} ${className}`}>{children}<ArrowUpRight size={17} aria-hidden="true" /></Link>;
}

export function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return <p className={`eyebrow ${light ? "eyebrow-light" : ""}`}><span aria-hidden="true" />{children}</p>;
}
