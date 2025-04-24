"use client";
import Link from "next/link";

export function LandingAd() {
    return (
        <div className="w-full px-5 pt-16 justify-between">
            <div
                className="
                    absolute inset-0
                    bg-gradient-to-br
                    from-[#FFD6E8]
                    via-[#FFF9C4]
                    to-[#BBDEFB]
                    opacity-80
                    blur-[80px]
                    -z-10
                "
            />
            <div className="flex md:flow-col items-center space-x-20">
                <div className="flex flex-col">
                    <div>Digital Operations for the AI era</div>
                </div>
                <img src="airtableAd.webp" className="h-180"/>
            </div>
        </div>
    )
}