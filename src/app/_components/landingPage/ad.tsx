"use client";
import Link from "next/link";

export function LandingAd() {
    return (
        <div className="w-full px-2 pt-16 pl-20 relative overflow-hidden">
            <div
                className="
                    absolute inset-0
                    bg-gradient-to-br
                    from-[#a3b6c5]
                    via-[#ffefe3]
                    to-[#a3b6c5]
                    opacity-80
                    blur-[80px]
                    -z-10
                "
            />
            <div className="w-full flex items-center justify-between md:flow-col">
                <div className="flex flex-col">
                    <div className="transition font-semibold text-[clamp(1rem,3.6vw,10rem)] leading-none text-[#34383f]">Digital operations for the AI era</div>
                    <div className="font-semibold text-[#42454c] text-[clamp(1rem,1.3vw,10rem)]">Create modern business apps to manage and automate critical processes</div>
                    <div className="flex items-center space-x-6 pt-10">
                        <Link href="/" className="transition hover:bg-blue-900 py-1 bg-blue-600 text-white rounded font-sans font-semibold text-[1.25rem] rounded-lg px-6 py-2">Sign up for free</Link>
                        <Link href="/api/auth/signin" className="duration-300 transition hover:border-blue-500 hover:text-blue-500 bg-white/50 hover:bg-blue-100 hidden md:inline px-6 py-2 border-2 border-gray-200 rounded font-sans font-semibold text-[1.25rem] rounded-lg">Contact Sales</Link>
                    </div>
                </div>
                <img src="airtableAd.webp" className="h-180"/>
            </div>
        </div>
    )
}