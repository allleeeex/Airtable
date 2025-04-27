"use client";
import { useEffect, type ReactNode, useState, useRef } from "react";
import { DashBoardHeader } from "../_components/dashboard/header";
import { DashboardSlimSidebar } from "../_components/dashboard/sidebar";
import { api } from "~/trpc/react";
import { useDataStore } from "~/stores/workspacesStore";
import { useUIStore } from "~/stores/sidebarOpenStore";
import { useSession } from "next-auth/react";

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps ) {
  const { data: session, status } = useSession();
  const sidebarOpened = useUIStore((s) => s.sidebarOpened);
  const setSidebarOpened = useUIStore((s) => s.setSidebarOpened);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
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

  const wsQuery = api.workspace.list.useQuery();
  const basesQuery = api.base.listBase.useQuery();
  const [hydrated, setHydrated] = useState(false);
  const setWorkspaces = useDataStore((s) => s.setWorkspaces);
  const setBases = useDataStore((s) => s.setBases);

  useEffect(() => {
    if (
      !hydrated &&
      wsQuery.data &&
      !wsQuery.isLoading &&
      basesQuery.data &&
      !basesQuery.isLoading
    ) {
      setWorkspaces(wsQuery.data);
      setBases(basesQuery.data);
      setHydrated(true);
    }
  }, [
    hydrated,
    wsQuery.data,
    wsQuery.isLoading,
    basesQuery.data,
    basesQuery.isLoading,
    setWorkspaces,
    setBases,
  ]);
  if (status === "loading" || !session) {
    return null;
  }
  if (!hydrated) {
    return <div></div>;
  }

  return (
    <div className="flex flex-col h-screen bg-[#f9fafb]">
      <div className="flex">
        <DashboardSlimSidebar user={session.user} sidebarOpened={sidebarOpened} />

        <div className="flex-1 min-w-0 overflow-auto">
          {children}  
        </div>
      </div>

      <DashBoardHeader user={session.user} sidebarOpened={sidebarOpened} setSidebarOpened={toggleSidebar} />
    </div>
  );
}