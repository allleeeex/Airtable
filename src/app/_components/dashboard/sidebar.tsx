"use client"
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "../icon";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { api } from "~/trpc/react";
import { nanoid } from "nanoid";
import { useDataStore } from "~/stores/workspacesStore";
import { CreateBaseSelectorModal } from "../dashboard/createModal";
import type { Session } from "next-auth";

interface DashboardSlimSidebarProps {
  user: Session["user"];
  sidebarOpened: boolean;
}

export function DashboardSlimSidebar({ user, sidebarOpened }: DashboardSlimSidebarProps ) {
  const router = useRouter(); 
  const items = useDataStore((s) => s.items);
  const alphabetical = useMemo(() => {
    const pattern = /^(.+?)(?: (\d+))?$/;
  
    return [...items].sort((a, b) => {
      const ma = pattern.exec(a.name);
      const mb = pattern.exec(b.name);
  
      if (ma && mb && ma[1] === mb[1]) {
        const na = ma[2] ? parseInt(ma[2], 10) : 0;
        const nb = mb[2] ? parseInt(mb[2], 10) : 0;
        return na - nb;
      }

      return a.name.localeCompare(b.name);
    });
  }, [items]);
  const starred = useMemo(
    () => alphabetical.filter((w) => w.starred),
    [alphabetical]
  );
  const [homeHovered, setHomeHovered] = useState(false);
  const [workspaceHovered, setWorkspaceHovered] = useState(false);
  const [homeOpen, setHomeOpen] = useState(true);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [addHovered, setAddHovered] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const handleMouseEnter = (id: string) => setHoveredId(id);
  const handleMouseLeave = () => setHoveredId(null);
  const openMutation = api.workspace.open.useMutation();

  const createWorkspace = api.workspace.create.useMutation({
    onMutate: (vars) => {
      const now = new Date();
      router.push(`/workspaces/${vars.id}`);
      useDataStore.getState().addWorkspace({
        id: vars.id,
        name: vars.baseName,
        description: null,
        createdAt: now, 
        openedAt: now,
        starred: false,
        createdById: "me",
        createdBy: {
          name: user.name!,
          id: user.id,
          email: user.email!,
          image: user.image!,
        },
        sharedUsers: [],
        pendingUsers: [],
      });
      return { tempId: vars.id };
    },
    
    onSuccess(workspace) {
      useDataStore.getState().updateWorkspace(workspace);
    },

    onError: (_err, _vars, context) => {
      if (context?.tempId) {
        useDataStore.getState().removeWorkspace(context.tempId);
      }
    },
  })

  const handleAdd = () => {
    const tempId = nanoid();
    const { getNextName } = useDataStore.getState();
    const baseName = getNextName("Workspace");
    createWorkspace.mutate({ id: tempId, baseName });
  }

  const toggleStar = api.workspace.toggleStar.useMutation({
    onMutate: async ({ id }) => {
      const prev = useDataStore.getState().items.find((w) => w.id === id);
      useDataStore.getState().updateWorkspace({ ...(prev!), starred: !prev!.starred });
      return { prev };
    },
    onError: (_err, { id }, ctx) => {
      console.log(id);
      if (ctx?.prev) useDataStore.getState().updateWorkspace(ctx.prev);
    },
    onSuccess(updated) {
      useDataStore.getState().updateWorkspace(updated);
    },
  });
  
  const handleStar = (id: string) => {
    toggleStar.mutate({ id });
  };

  const createBase = api.base.createBase.useMutation({
    onSuccess(newBase) {
      useDataStore.getState().addBase(newBase);
      setShowCreateModal(false);
      router.push(`/app${newBase.id}`);
    },
  });

  const handleCreate = (workspaceId: string) => {
    createBase.mutate({
      workspaceId,
    });
  };
  
  return (
    <div className={`relative group left-0 h-screen ${sidebarOpened ? "w-75" : "w-12"} overflow-auto`}>
      { /* The Slim Bar for Hover Trigger */ }
      <div className="bg-white inset-y-0 fixed h-full w-12 z-30 flex flex-col items-center border-1 border-gray-300">
        <div className="fixed h-full flex flex-col items-center justify-between pt-19">
          <div className="flex flex-col space-y-5 items-center">
            <Icon id="House" className="w-5 h-5"/>
            <Icon id="UsersThree" className="w-5 h-5"/>
            <div className="w-full border-1 border-gray-200" />
          </div>
          <div className="flex flex-col space-y-4 items-center">
            <div className="w-full border-1 border-gray-100" />
            <Icon id="BookOpen" className="w-4 h-4 text-gray-400 "/>
            <Icon id="ShoppingBagOpen" className="w-4 h-4 text-gray-400 "/>
            <Icon id="Globe" className="w-4 h-4 text-gray-400 "/>
            <div className="border-1 border-gray-200 rounded-md p-1 shadow-xs">
            <Icon id="Plus" className="w-4 h-4 text-gray-400 "/>
            </div>
          </div>
        </div>
      </div>
      { /* The Wide Bar when Triggered */ }
      <div
        className={`fixed top-0 inset-y-0 left-0 pt-14 w-75 bg-white border-r border-gray-200 z-50 transform transition-transform duration-40 ease-out -translate-x-full
          ${sidebarOpened
            ? "translate-x-0 pointer-events-auto"
            : "group-hover:translate-x-0 group-hover:pointer-events-auto"
          }
          ${sidebarOpened ? "" : "pointer-events-none"}
        `}
      > 
        <div className="flex flex-col h-full pb-3">
          <div className="h-full p-3 flex flex-col space-y-1">
            { /* Home Button */}
            <div className="flex items-center space-x-3 hover:bg-gray-100 cursor-pointer px-3 py-2 rounded-md justify-between pr-2">
              <span className="text-gray-900 text-[15px] font-medium">Home</span>
              <button
                onClick={() => {
                  setHomeOpen((v) => {
                    const next = !v;
                    if (next) setWorkspaceOpen(false)
                    return next;
                  })
                }}
                onMouseEnter={() => setHomeHovered(true)}
                onMouseLeave={() => setHomeHovered(false)}
                className="relative hover:bg-gray-200 p-1.5 rounded-md transition peer"
              >
                <span className={`absolute left-1/2 mb-1 -translate-x-1/2 translate-y-6 bg-gray-800 text-white text-[0.65rem] rounded px-2 py-1 whitespace-nowrap overflow-hidden max-w-fit transition-opacity duration-150 ease-out pointer-events-none ${homeHovered ? "opacity-100" : "opacity-0"}`}>
                  {homeOpen ? "Collapse starred items" : "Expand starred items"}
                </span>
                <ChevronRightIcon className={`w-3 h-3 text-black transform transition-transform duration-200 ${homeOpen ? "rotate-90" : "rotate-0"}`} />
              </button>
            </div>
            { /* Home Text */}
            {homeOpen && (
              starred?.length === 0 ? (
                <div className="flex items-center space-x-2 px-4 text-gray-500">
                  <div className="border p-1.5 border-gray-300 rounded-sm">
                    <Icon id="Star" className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="text-[11px] font-system">
                    Your starred bases, interfaces, and workspaces will appear here
                  </div>
                </div>
              ) : (
                <div>
                  {starred.map((ws) => (
                    <div 
                      key={ws.id} 
                      className="flex items-center justify-between hover:bg-gray-100 rounded-md px-3 w-full cursor-pointer"
                      onMouseEnter={() => handleMouseEnter(ws.id)}
                      onMouseLeave={handleMouseLeave}
                      onClick={() => {
                        openMutation.mutate({ id: ws.id })
                        router.push(`/workspaces/${ws.id}`)
                      }}
                    >
                      <div className="flex items-center space-x-2 py-1">
                        <div className="p-[5px] bg-gray-200 rounded-sm">
                          <Icon id="UsersThree" className="w-4 h-4"/>
                        </div>
                        <div className="text-[13px] fonzt-system">
                          {ws.name}
                        </div>
                      </div>
                      {(hoveredId === ws.id) && (
                      ws.starred ? (
                        <Icon
                          id="StarFill"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStar(ws.id);
                          }}
                          fill="#fbbf24"
                          className="h-4 w-4 cursor-pointer z-30"
                        />
                      ) : (
                        <Icon
                          id="Star"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStar(ws.id);
                          }}
                          className="h-4 w-4 cursor-pointer transition-opacity text-gray-500 z-30"
                        />
                      )
                    )}
                    </div>
                  ))}
                </div>
              )
            )}
            { /* Workspace Stuff */}
            <div className="flex items-center space-x-3 hover:bg-gray-100 cursor-pointer px-3 py-1.5 rounded-md justify-between pr-2">
              <span className="text-gray-900 text-[15px] font-medium">All workspaces</span>
              <div className="flex items-center space-x-1">
                { /* Add Button */}
                <button
                  onClick={handleAdd}
                  onMouseEnter={() => setAddHovered(true)}
                  onMouseLeave={() => setAddHovered(false)}
                  className="relative hover:bg-gray-200 p-1.5 rounded-md transition peer"
                >
                  <span className={`absolute left-1/2 mb-1 -translate-x-1/2 translate-y-6.5 bg-gray-800 text-white text-[0.65rem] rounded px-2 py-1 whitespace-nowrap overflow-hidden max-w-fit transition-opacity duration-150 ease-out pointer-events-none ${addHovered ? "opacity-100" : "opacity-0"}`}>
                    Create workspace
                  </span>
                  <Icon id="Plus" className={`w-4 h-4 text-black`} />
                </button>
                { /* Workspace Button */}
                <button
                  onClick={() => {
                    setWorkspaceOpen((v) => {
                      const next = !v;
                      if (next) setHomeOpen(false)
                      return next;
                    })
                  }}
                  onMouseEnter={() => setWorkspaceHovered(true)}
                  onMouseLeave={() => setWorkspaceHovered(false)}
                  className="relative hover:bg-gray-200 p-1.5 rounded-md transition peer"
                >
                  <span className={`absolute left-1/2 mb-1 -translate-x-1/2 translate-y-6 bg-gray-800 text-white text-[0.65rem] rounded px-2 py-1 whitespace-nowrap overflow-hidden max-w-fit transition-opacity duration-150 ease-out pointer-events-none ${workspaceHovered ? "opacity-100" : "opacity-0"}`}>
                    {workspaceOpen ? "Collapse workspaces" : "Expand workspaces"}
                  </span>
                  <ChevronRightIcon className={`w-3 h-3 text-black transform transition-transform duration-200 ${workspaceOpen ? "rotate-90" : "rotate-0"}`} />
                </button>
              </div>
            </div>
            { /* Workspace List */}
            {workspaceOpen && alphabetical && (
              <div className="flex-1 overflow-auto space-y-1.5 pt-0 w-full max-h-65/100">
                {alphabetical.map((ws) => (
                  <div 
                    key={ws.id} 
                    className="flex items-center justify-between hover:bg-gray-100 rounded-md px-3 w-full cursor-pointer"
                    onMouseEnter={() => handleMouseEnter(ws.id)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => {
                      openMutation.mutate({ id: ws.id })
                      router.push(`/workspaces/${ws.id}`)
                    }}
                  >
                    <div className="flex items-center space-x-2 py-1">
                      <div className="p-[5px] bg-gray-200 rounded-sm">
                        <Icon id="UsersThree" className="w-4 h-4"/>
                      </div>
                      <div className="text-[13px] fonzt-system">
                        {ws.name}
                      </div>
                    </div>
                    {(hoveredId === ws.id || ws.starred) && (
                      ws.starred ? (
                        <Icon
                          id="StarFill"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStar(ws.id);
                          }}
                          fill="#fbbf24"
                          className="h-4 w-4 cursor-pointer z-30"
                        />
                      ) : (
                        <Icon
                          id="Star"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStar(ws.id);
                          }}
                          className="h-4 w-4 cursor-pointer transition-opacity text-gray-500 z-30"
                        />
                      )
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="absolute flex flex-col items-center space-y-3 px-3 py-4 pt-0 bottom-1 w-full">
            <div className="w-93/100 border-1 border-gray-200" />
            <div className="flex flex-col text-[13px] font-system w-full">
              <button className="flex items-center w-full p-2 hover:bg-gray-100 rounded cursor-pointer">
                <Icon id="BookOpen" className="w-4 h-4 mr-2" />
                <span>Templates and apps</span>
              </button>
              <button className="flex items-center w-full p-2 hover:bg-gray-100 rounded cursor-pointer">
                <Icon id="ShoppingBagOpen" className="w-4 h-4 mr-2" />
                <span>Marketplace</span>
              </button>
              <button className="flex items-center w-full p-2 hover:bg-gray-100 rounded cursor-pointer">
                <Icon id="UploadSimple" className="w-4 h-4 mr-2" />
                <span>Import</span>
              </button>
            </div>
            <button onClick={() => setShowCreateModal(true)} className="flex items-center justify-center space-x-2 bg-blue-600 text-white w-full text-[13px] font-semibold py-1.5 rounded-md cursor-pointer font-system">
              <Icon id="Plus" className="h-4 w-4"/>
              <div>Create</div>
            </button>
          </div>
        </div>
      </div>
      {showCreateModal && (
        <CreateBaseSelectorModal
          workspaces={alphabetical}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}

