"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";

const navLinks = [
    {href: "/", label: "Services"},
    {href: "/checkout", label: "Checkout"},
    {href: "/booking", label: "Booking"},
];

export default function Navbar() {
    const pathname = usePathname();

    return (
        <header className="medex-nav">
            <div className="medex-nav-inner">
                <Link href="/" className="medex-nav-brand" aria-label="MedEx home">
                    <span className="medex-nav-brand-icon" aria-hidden="true">✦</span>
                    <span>MedEx</span>
                </Link>

                <nav aria-label="Main navigation">
                    <ul className="medex-nav-links" role="list">
                        {navLinks.map(({href, label}) => (
                            <li key={href}>
                                <Link
                                    href={href}
                                    className={`medex-nav-link${pathname === href ? " is-active" : ""}`}
                                    aria-current={pathname === href ? "page" : undefined}
                                >
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </header>
    );
}

