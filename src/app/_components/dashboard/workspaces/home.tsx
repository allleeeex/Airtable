"use client";
import { Icon } from "~/app/_components/icon";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState, useMemo } from "react";
import { useDataStore } from "~/stores/workspacesStore";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";
import { stringToRGBColour } from "~/app/helper/stringToColour";
import { useUIStore } from "~/stores/uiStore";
import { DashboardBodyList } from "../dashList";

export default function WorkspaceDetailPage() {
  const sidebarOpened = useUIStore((s) => s.sidebarOpened);
  const { data: session } = useSession();
  const myUserId = session?.user.id;
  const id = useParams().id as string;
  const workspace = useDataStore((s) => s.getWorkspaceById(id))!;
  const allBases = useDataStore((s) => s.bases);
  const bases = useMemo(
    () => allBases.filter((b) => b.workspaceId === id),
    [allBases, id]
  );
  const [choice1, setChoice1] = useState("Opened by you");
  const [choice2, setChoice2] = useState("Show all types");
  const [showList, setShowList] = useState(true);
  const options1 = ["Opened by you", "Shared with you", "Starred"];
  const options2 = ["Show all types", "Show bases only", "Show interfaces only"];
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const openCreateBaseModal = useUIStore((s) => s.openCreateBaseModal);

  console.log(id);
  console.log("STORE IN detail page:", useDataStore.getState().items);
  console.log(workspace);

  const participants = useMemo(() => {
    const all = [workspace.createdBy, ...workspace.sharedUsers];

    const unique = Array.from(
      new Map(all.map(u => [u.id, u])).values()
    );

    if (myUserId) {
      const me = unique.filter(u => u.id === myUserId);
      const others = unique.filter(u => u.id !== myUserId);
      return [...me, ...others];
    }

    return unique;
  }, [workspace, myUserId]);

  const ref1 = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref1.current && !ref1.current.contains(e.target as Node)) {
        setOpen1(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const ref2 = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref2.current && !ref2.current.contains(e.target as Node)) {
        setOpen2(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const toggleStar = api.workspace.toggleStar.useMutation({
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
    
  const handleStar = (id: string) => {
    toggleStar.mutate({ id });
  };

  return(
    <div className="flex-1 min-w-0 w-full h-full fixed p-10 pt-21.5 pl-12 bg-[#f9fafb] flex overflow-x-auto justify-start">
      <div 
        className={`h-full flex-1 flex-col ${sidebarOpened ?  "max-w-1261/2000" : "max-w-317" }`}
      >
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-shrink-0">
            <div className="text-[#1d1f25] font-[660] text-[27px] font-home leading-[33.75px] tracking-[-0.16px]">
              {workspace?.name}
            </div>
            <button>
              {workspace?.starred ? 
              <Icon
                id="StarFill"
                onClick={() => handleStar(workspace.id)}
                fill="#fbbf24"
                className="h-4 w-4 cursor-pointer z-30"
              />
              :
              <Icon
                id="Star"
                onClick={() => handleStar(workspace.id)}
                className="h-4 w-4 cursor-pointer transition-opacity text-gray-500 z-30"
              />
              }
            </button>
          </div>
        </div>
        {/* sorting bar idk */}
        <div className="w-full mt-7 max-w-317 flex items-center justify-between min-w-117 text-[15px] font-system right-0">
          <div className="flex space-x-3">
            <div ref={ref1} className="relative">
              <button onClick={() => setOpen1(!open1)} className="flex items-center space-x-1 text-gray-600 cursor-pointer hover:text-black">
                <span>
                  {choice1}
                </span>
                <Icon id="ChevronDown" className="h-4 w-4"/>
              </button>
              {open1 && (
              <div className="p-3 absolute left-0 mt-2 w-60 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                {options1.map((opt) => (
                  <div
                    key={opt}
                    onClick={() => {
                      setChoice1(opt);
                      setOpen1(false);
                    }}
                    className="px-2 py-2 cursor-pointer hover:bg-gray-100 rounded-md flex justify-between items-center"
                  >
                    <div className="font-system text-[13px]">{opt}</div>
                    <Icon id="Check" className={`h-3 w-3 ${opt == choice1 ? "opacity-100" : "opacity-0"}`}/>
                  </div>
                ))}
              </div>
            )}
            </div>
            <div ref={ref2} className="relative">
              <button onClick={() => setOpen2(!open2)} className="flex items-center space-x-1 text-gray-600 cursor-pointer hover:text-black">
                <span>
                {choice2}
                </span>
                <Icon id="ChevronDown" className="h-4 w-4"/>
              </button>
              {open2 && (
              <div className="p-3 absolute left-0 mt-2 w-60 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                {options2.map((opt) => (
                  <div
                    key={opt}
                    onClick={() => {
                      setChoice2(opt);
                      setOpen2(false);
                    }}
                    className="px-2 py-2 cursor-pointer hover:bg-gray-100 rounded-md flex justify-between items-center"
                  >
                    <div className="font-system text-[13px]">{opt}</div>
                    <Icon id="Check" className={`h-3 w-3 ${opt == choice2 ? "opacity-100" : "opacity-0"}`}/>
                  </div>
                ))}
              </div>
            )}
            </div>
          </div>
          <div className="flex items-center">
            <button 
              onClick={() => {
                if (!showList) {
                  setShowList(!showList)
                }
              }} 
              className={`p-1 rounded-full hover:text-black cursor-pointer ${showList ? "bg-gray-200 text-black" : "text-gray-500"}`}
            >
              <Icon id="List" className="h-5 w-5"/>
            </button>
            <button 
              onClick={() => {
                if (showList) {
                  setShowList(!showList)
                }
              }} 
              className={`p-1 rounded-full hover:text-black cursor-pointer ${showList ? "text-gray-500" : "bg-gray-200 text-black"}`}
            >
              <Icon id="GridFour" className="h-5 w-5"/>
            </button>
            </div>
        </div>
        <div className="pl-1 pr-3 flex h-87/100 w-full">
            {bases.length === 0 ? (
              <div className="flex-1 font-system flex flex-col w-full items-center justify-center">
                <span className="text-[21.5px] font-normal">This workspace is empty</span>
                <span className="text-[13px] font-normal text-gray-500">Bases and interfaces in this workspace will appear here.</span>
                <div className="flex items-center justify-center p-8">
                  <button onClick={() => openCreateBaseModal(workspace.id)} className="py-1 px-2 border-1 border-gray-300 rounded-md bg-white hover:cursor-pointer hover:ring-2 hover:ring-gray-300/20">Create</button>
                </div>
              </div>
            ) : showList ? (
              <div className={`flex-1 overflow-y-auto ${sidebarOpened ? "max-w-390" : "max-w-390"}`}>
                <DashboardBodyList workspaceList={[]} baseList={bases} filterType1={choice1} filterType2={choice2} openedAtDash={false}/>
              </div>
            ) : (
              <div>brr</div>
            )}
        </div>
      </div>
      <div className="pl-15.5 flex flex-col min-w-70 space-y-8">
        {bases.length === 0 ?
          <div className="flex w-full items-center justify-end space-x-2 flex-shrink-0">
            <button className="font-system text-[13px] bg-white py-1.5 px-3 border-1 border-gray-300 rounded-lg cursor-pointer shadow-xs hover:shadow-sm">
              Share
            </button>
            <button className="bg-white py-2 px-3 border-1 border-gray-300 rounded-lg cursor-pointer shadow-xs hover:shadow-sm">
              <Icon id="DotsThree" className="h-4 w-4"/>
            </button>
          </div>
        : 
        <div className="flex w-full items-center justify-start space-x-2 flex-shrink-0">
          <button 
            onClick={() => openCreateBaseModal(workspace.id)}
            className="font-system font-medium text-[13px] bg-blue-600 text-white py-1.5 px-3 border-1 border-gray-300 rounded-lg cursor-pointer shadow-xs hover:shadow-sm"
          >
            Create
          </button>
          <button className="font-system text-[13px] bg-white py-1.5 px-3 border-1 border-gray-300 rounded-lg cursor-pointer shadow-xs hover:shadow-sm">
            Share
          </button>
          <button className="bg-white py-2 px-3 border-1 border-gray-300 rounded-lg cursor-pointer shadow-xs hover:shadow-sm">
            <Icon id="DotsThree" className="h-4 w-4"/>
          </button>
        </div>
        }
        <div className="flex flex-col space-y-3">
          <span className="font-system text-[15px] font-semibold">Collaborators</span>
          <div className="flex flex-col">
            {
              participants.map(user => (
                <div key={user.id} className="flex items-center space-x-2 text-gray-500 font-system text-[13px]">
                  <div className="flex items-center text-black justify-center rounded-full font-light text-[13px]	h-6 w-6" style={{ background:stringToRGBColour(user.name!) }}>
                    <div>{user.name?.charAt(0).toUpperCase()}</div>
                  </div>
                  <span>
                    {user.id === myUserId ? (
                      "You"
                    ) : (
                      user.name
                    )}
                  </span>
                  <span>
                    {workspace.createdBy.id === user.id ? (
                      "(Owner)"
                    ) : (
                      ""
                    )}
                  </span>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  )
}