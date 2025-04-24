"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export function LandingHeader() {
	const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`
        fixed top-0 left-0 w-full bg-white shadow-md z-50
        transition-all duration-300
        ${scrolled ? "backdrop-blur-md bg-opacity-70" : ""}
      `}
    >
      <div className="px-5 sm:px-10 w-full">
        <nav className="flex h-16 items-center justify-between">
					<div className="flex space-x-10 items-center">
						<Link href="/" className="flex space-x-2 items-center">
							<img src="airtableLogo.png" className="h-8 justify-between"></img>
							{
								scrolled ? <></> : 
									<span className="font-semibold text-2xl transition-all duration-300 origin-left">
									Airtable
								</span>
								}
						</Link>
						<div className="hidden lg:flex space-x-6 items-center">
							<div className="font-sans font-medium text-x1 hover:text-blue-600 cursor-pointer">Platform</div>
							<div className="font-sans font-medium text-x1 hover:text-blue-600 cursor-pointer">Solutions</div>
							<div className="font-sans font-medium text-x1 hover:text-blue-600 cursor-pointer">Resources</div>
							<div className="font-sans font-medium text-x1 hover:text-blue-600 cursor-pointer">Enterprise</div>
							<div className="font-sans font-medium text-x1 hover:text-blue-600 cursor-pointer">Pricing</div>
						</div>
					</div>
          <div className="flex space-x-4 items-center">
						<Link href="/" className="duration-300 transition hover:border-blue-500 hover:text-blue-500 hover:bg-blue-100 hidden md:inline px-2 py-1 border-2 border-gray-200 rounded font-sans font-medium text-x1 rounded-lg">
							Contact Sales
						</Link>
            <Link href="/api/auth/signin" className="transition hover:bg-blue-900 px-2 py-1 bg-blue-600 text-white rounded font-sans font-medium text-x1 rounded-lg">
							<span>Sign up</span>
							<span className="hidden md:inline"> for free</span>
						</Link>
						<div className="flex items-center">
							<Link href="/api/auth/signin" className="hidden md:inline-block font-sans font-medium text-x1 hover:text-blue-600">Sign in</Link>
							<Link
								className="md:hidden p-2 focus:outline-none cursor-pointer"
								href="/api/auth/signin"
							>
								<svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2}>
									<path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
								</svg>
							</Link>
						</div>
          </div>
        </nav>
      </div>
    </header>
  );
}
