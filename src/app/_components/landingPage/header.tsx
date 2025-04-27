/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export function LandingHeader() { 
	const [scrolled, setScrolled] = useState(false);
	const spanRef = useRef<HTMLSpanElement>(null);
	const [textWidth, setTextWidth] = useState(0);

	// Measure width of airtable name
	useEffect(() => {
    if (spanRef.current) {
      setTextWidth(spanRef.current.offsetWidth + 8);
    }
  }, []);
	
	// Detect scrolling
	useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
	
	const width = scrolled ? 0 : 100;

  const linksStyle = {
    transform:  `translateX(${scrolled ? -textWidth : 0}px)`,
  };

  return (
    <header
      className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="px-5 sm:px-10 w-full">
        <nav className="relative flex h-16 items-center justify-between overflow-hidden">
					<div className="flex space-x-10 items-center">
						<Link href="/" className="flex space-x-2 items-center flex-shrink-0">
							<img src="airtableLogo.png" className="h-8 justify-between" alt=""/>
							<span className="font-semibold text-2xl origin-left whitespace-nowrap overflow-hidden inline-block transition-all duration-400" 
								ref={spanRef}
								style={{
									width: `${width}%`,
								}}
							>
								Airtable
							</span>
						</Link>
						<div className="hidden lg:flex space-x-6 items-center transition-all duration-400 ease" style={linksStyle}>
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
