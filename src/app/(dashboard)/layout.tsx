/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";
import { useEffect, type ReactNode, useState, useRef } from "react";
import { DashBoardHeader } from "../_components/dashboard/header";
import { DashboardSlimSidebar } from "../_components/dashboard/sidebar";
import { api } from "~/trpc/react";
import { useDataStore } from "~/stores/workspacesStore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps ) {
  const { data: session, status } = useSession();
  const [sidebarOpened, setSidebarOpened] = useState(false);
  const wasOpenRef = useRef<boolean>(false);
  const collapsedByResponsiveRef = useRef<boolean>(false);
  const sidebarOpenRef = useRef<boolean>(sidebarOpened);
  useEffect(() => {
    sidebarOpenRef.current = sidebarOpened;
  }, [sidebarOpened]);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 768px)");
    const onMediaChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        if (sidebarOpenRef.current) {
          wasOpenRef.current = true;
          collapsedByResponsiveRef.current = true;
          setSidebarOpened(false);
        }
      } else {
        if (collapsedByResponsiveRef.current) {
          setSidebarOpened(wasOpenRef.current);
          collapsedByResponsiveRef.current = false;
        }
      }
    };
    mql.addEventListener("change", onMediaChange);
    if (mql.matches && sidebarOpenRef.current) {
      wasOpenRef.current = true;
      collapsedByResponsiveRef.current = true;
      setSidebarOpened(false);
    }

    return () => {
      mql.removeEventListener("change", onMediaChange);
    };
  }, []);

  const { data: workspaces } = api.workspace.list.useQuery();
  const setItems = useDataStore((s) => s.setWorkspaces);
  const { data: bases } = api.base.listBase.useQuery();
  const setItems2 = useDataStore((s) => s.setBases);
  useEffect(() => {
    if (workspaces) {
      setItems(workspaces);
    }
  }, [workspaces, setItems]);
  useEffect(() => {
    if (bases) {
      setItems2(bases);
    }
  }, [bases, setItems2]);

  const router = useRouter(); 
  if (status === "loading") return <div></div>;
  if (!session) router.push("/");

  return (
    <div className="flex flex-col h-screen bg-[#f9fafb]">
      <div className="flex">
        <DashboardSlimSidebar sidebarOpened={sidebarOpened} />

        <div className="flex-1 min-w-0 overflow-auto">
          {children}  
        </div>
      </div>

      <DashBoardHeader user={session!.user} sidebarOpened={sidebarOpened} setSidebarOpened={() => setSidebarOpened((v) => !v)} />
    </div>
  );
}