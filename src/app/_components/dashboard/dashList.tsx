"use client"
import type { Base, WorkSpace } from "@prisma/client";
import { useMemo, useState } from "react";
import { Icon } from "../icon";
import { readableTextColour, stringToRGBColour } from "~/app/helper/stringToColour";
import { formatDistanceToNow } from "date-fns";
import { api } from "~/trpc/react";
import { useDataStore } from "~/stores/workspacesStore";
import { useRouter } from "next/navigation";

type Item = {
  id: string;
  name: string;
  type: "Workspace" | "Base" | "Interface";
  workspace: string; 
  openedAt: Date;
  starred: boolean;
};

type Section = {
  label: string;
  items: Item[];
};

interface DashboardBodyListProps {
  workspaceList: WorkSpace[];
  baseList: Base[];
  filterType1: string;
  filterType2: string;
  openedAtDash: boolean;
}

export function DashboardBodyList({ workspaceList, baseList, filterType1, filterType2, openedAtDash }: DashboardBodyListProps) {
  const router = useRouter();
  const openBase = api.base.openBase.useMutation();
  const totalList = useMemo(() => {
    const wsItems: Item[] = workspaceList.map((w) => ({
      id: w.id,
      name: w.name,
      type: "Workspace",
      workspace: "",
      openedAt: w.openedAt,
      starred: w.starred,
    }));

    const baseItems: Item[] = baseList.map((b) => {
      const parent = workspaceList.find((w) => w.id === b.workspaceId);
      return {
        id: b.id,
        name: b.name,
        type: "Base",
        workspace: parent?.name ?? "",
        openedAt: b.openedAt,
        starred: b.starred,
      };
    });

    let allItems = [...wsItems, ...baseItems];

    if (filterType2 === "Show bases only") {
      allItems = allItems.filter((it) => it.type === "Base");
    } else if (filterType2 === "Show interfaces only") {
      allItems = allItems.filter((it) => it.type === "Interface");
    }

    if (filterType1 === "Opened by you") {
      allItems = allItems.filter((it) => it.type === "Base");
      const now = Date.now();
      const buckets: Record<"Today" | "Past 7 days" | "Earlier", Item[]> = {
        Today: [],
        "Past 7 days": [],
        Earlier: [],
      };
  
      allItems.forEach((it) => {
        const diffDays = (now - it.openedAt.getTime()) / (1000 * 60 * 60 * 24);
        if (diffDays < 1) buckets.Today.push(it);
        else if (diffDays < 7) buckets["Past 7 days"].push(it);
        else buckets.Earlier.push(it);
      });
  
      buckets.Today.sort((a, b) => b.openedAt.getTime() - a.openedAt.getTime());
      buckets["Past 7 days"].sort((a, b) => b.openedAt.getTime() - a.openedAt.getTime());
      buckets.Earlier.sort((a, b) => b.openedAt.getTime() - a.openedAt.getTime());

      const sections: Section[] = [];
      if (buckets.Today.length) {
        sections.push({ label: "Today", items: buckets.Today });
      }
      if (buckets["Past 7 days"].length) {
        sections.push({ label: "Past 7 days", items: buckets["Past 7 days"] });
      }
      if (buckets.Earlier.length) {
        sections.push({ label: "Earlier", items: buckets.Earlier });
      }
      return sections;
    } else if (filterType1 === "Shared with you") {
      return [{ label: "", items: [] }];
    } else {
      const starred = allItems.filter((it) => it.starred);
      return [{ label: "", items: starred }];
    }
  }, [workspaceList, baseList, filterType1, filterType2]);

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const handleMouseEnter = (id: string) => setHoveredId(id);
  const handleMouseLeave = () => setHoveredId(null);

  const toggleStarWorkspace = api.workspace.toggleStar.useMutation({
    onMutate: async ({ id }) => {
      const prev = useDataStore.getState().items.find((w) => w.id === id);
      useDataStore.getState().updateWorkspace({ ...(prev!), starred: !prev!.starred });
      return { prev };
    },
    onError: (_err, { id }, ctx) => {
      if (ctx?.prev) useDataStore.getState().updateWorkspace(ctx.prev);
    },
    onSuccess(updated) {
      useDataStore.getState().updateWorkspace(updated);
    },
  });

  const toggleStarBase = api.base.starBase.useMutation({
    onMutate: async ({ id }) => {
      const prev = useDataStore.getState().bases.find((w) => w.id === id);
      useDataStore.getState().updateBase({ ...(prev!), starred: !prev!.starred });
      return { prev };
    },
    onError: (_err, { id }, ctx) => {
      if (ctx?.prev) useDataStore.getState().updateBase(ctx.prev);
    },
    onSuccess(updated) {
      useDataStore.getState().updateBase(updated);
    },
  });
    
  const handleStar = (id: string, type: string) => {
    if (type === "Workspace") {
      toggleStarWorkspace.mutate({ id });
    } else {
      toggleStarBase.mutate({ id });
    }
  };

  return (
    <div className="pt-8 px-1">
      {/* header row */}
      <div
        className="
          grid 
          grid-cols-[minmax(200px,_3fr)_minmax(120px,_1.5fr)_minmax(180px,_7fr)]
          items-center 
          text-gray-600 
          font-system 
          text-[13px] 
          mb-2
        "
      >
        <div>Name</div>
        <div>Type</div>
        {openedAtDash ? 
          <div>Workspace</div>
        :
          <div>Opened by you</div>
        }
      </div>
      <hr className="border-gray-300 mb-4" />

      {totalList.map((sec) => (
        <div key={sec.label} className="mb-6">
          {filterType1 === "Opened by you" && (
            <div className="text-gray-500 text-[13px] font-semibold mb-2">
              {sec.label}
            </div>
          )}
          <div className="flex flex-col">
          {sec.items.map((it) => (
            <div
              key={it.id}
              className="
                grid 
                grid-cols-[minmax(200px,_3fr)_minmax(120px,_1.5fr)_minmax(180px,_7fr)] 
                items-center 
                py-2
                hover:bg-gray-100 
                cursor-pointer
                font-system
                text-[13px]
                px-3
                rounded-md
              "
              onMouseEnter={() => handleMouseEnter(it.id)}
              onMouseLeave={handleMouseLeave}
              onClick={async () => {
                if (it.type === "Workspace") {
                  router.push(`/workspaces/${it.id}`);
                  return;
                }
                await openBase.mutateAsync({ id: it.id });
                router.push(`/${it.id}`);
              }}              
            >
              <div className="flex items-center space-x-2">
                {it.type === "Workspace" ? 
                  <div className="p-1 bg-gray-200 rounded-md">
                    <Icon id="UsersThree" className="h-4 w-4"/>
                  </div>
                :
                <div
                  className="py-0.5 px-1 rounded-md"
                  style={{ backgroundColor: stringToRGBColour(it.id), color: readableTextColour(stringToRGBColour(it.id)) }}
                >
                  {it.name.substring(0, 2)}
                </div>
                }
                <div className="font-system font-semibold">{it.name}</div>
                {it.starred ? (
                  <Icon
                    id="StarFill"
                    fill="#fbbf24"
                    onClick={e => {
                      e.stopPropagation();
                      handleStar(it.id, it.type);
                    }}
                    className="h-4 w-4 cursor-pointer"
                  />
                ) : hoveredId === it.id ? (
                  <Icon
                    id="Star"
                    onClick={e => {
                      e.stopPropagation();
                      handleStar(it.id, it.type);
                    }}
                    className="h-4 w-4 cursor-pointer transition-opacity text-gray-500"
                  />
                ) : (
                  <div></div>
                )}
              </div>
              <div className="text-gray-500">{it.type}</div>
              {openedAtDash ? 
                <div className="flex-1 text-gray-500">{it.workspace}</div>
              :
              <div className="flex-1 text-gray-500">
                {formatDistanceToNow(new Date(it.openedAt), { addSuffix: true })}
              </div>
              }
            </div>
          ))}
          </div>
        </div>
      ))}
    </div>
  );
}