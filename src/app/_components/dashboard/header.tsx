/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import React from "react";
import { SearchModal } from "./searchBar";
import { type Session } from "next-auth";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { stringToRGBColour } from "~/app/helper/stringToColour";

interface DashBoardHeaderProps {
  user: Session["user"];
  sidebarOpened: boolean;
  setSidebarOpened: () => void;
}

export function DashBoardHeader({ user, sidebarOpened, setSidebarOpened }: DashBoardHeaderProps) {
	const avatarCol = stringToRGBColour(user.name!);

  return (
		<>
			<nav className="fixed top-0 left-0 w-full bg-white z-50 flex items-center h-14 shadow-xs justify-between px-4 pl-1 border-y border-gray-300">
				{/* Sidebar, Logo, Name */}
				<div className="flex space-x-2">
					<button 
						className="hidden sm:block relative p-2 text-gray-400 hover:text-black focus:outline-none cursor-pointer group"
						onClick={setSidebarOpened}
					>
						<span className="pointer-events-none absolute top-3/4 left-0 transform translate-x-1/10 mt-2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-[0.65rem] text-white opacity-0 group-hover:opacity-100 transition-opacity font-system">
							{sidebarOpened ? "Collapse sidebar" : "Expand sidebar"}
						</span>
						<svg
							className="h-5 w-6"
							fill="none"
							stroke="currentColor"
							strokeWidth={2}
							viewBox="0 0 24 24"
						>
							<path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
						</svg>
					</button>
					<Link href="/" className="flex items-center space-x-1 sm:ml-0 ml-4">
						<img src="/airtableLogo.png" className="h-7 justify-between" height={"100%"} width={"100%"} alt=""/>
						<span className="font-semibold font-system text-[#32353d] text-[1.2rem]">Airtable</span>
					</Link>
				</div>

				{/* Search Bar */}
				<button
					onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }))}
					className="
						flex w-[clamp(200px,25vw,350px)] items-end
						border border-gray-300 rounded-full px-4 py-1.5
						text-gray-500 shadow-xs hover:shadow-md
					"
				>
					<MagnifyingGlassIcon className="h-4 w-4 text-black mr-2" />
					<span className="flex-1 text-left font-system text-[0.8rem] font-normal">Search…</span>
					<span className="text-gray-400 font-system text-[0.8rem]">ctrl K</span>
				</button>
				{/* profile and other bs */}
				<div className="flex items-center space-x-4 text-light">
					{/* Help */}
					<div className="flex items-center space-x-1 hover:bg-gray-300 px-3 py-1 rounded-full cursor-pointer">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-4 w-4">
							<path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
						</svg>
						<span className="hidden lg:block text-[0.8rem] color-gray-500">Help</span>
					</div>
					{/* Bell */}
					<div className="relative p-1.5 rounded-full border border-gray-200 hover:bg-gray-200 transition shadow-xs cursor-pointer group">
						<span className="pointer-events-none absolute top-3/4 left-0 transform -translate-x-5 mt-4 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-[0.65rem] text-white opacity-0 group-hover:opacity-100 transition-opacity">
							Notifications
						</span>
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="h-4 w-4">
							<path strokeLinecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
						</svg>
					</div>
					{/* Profile */}
					<Link href="/api/auth/signout" className="relative flex items-center justify-center font-light text-sm	h-7 w-7 rounded-full border border-white hover:shadow-sm cursor-pointer group" style={{ background:avatarCol }}>
						<span className="pointer-events-none absolute top-3/4 left-0 transform -translate-x-5 mt-4 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-[0.65rem] text-white opacity-0 group-hover:opacity-100 transition-opacity">
							Account
						</span>
						
						{/* user.image == null ? 
							<div>{user.name?.charAt(0).toUpperCase()}</div>
							 : 
							<img src={user.image} className="h-8 w-8 rounded-full object-cover"/> 
						*/}
						<div>{user.name?.charAt(0).toUpperCase()}</div>
					</Link>
				</div>
			</nav>
			<SearchModal />
		</>
  )
}