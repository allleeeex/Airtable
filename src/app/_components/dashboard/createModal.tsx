/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { useDataStore } from "~/stores/workspacesStore";
import { useUIStore } from "~/stores/uiStore";
import { Icon } from "../icon";
import { randomDataGenerator } from "~/app/helper/rngDataGenerator";

export function CreateBaseSelectorModal() {
  const workspaces = useDataStore((s) => s.items);
  const [mounted, setMounted] = useState(false);
  const { createBaseModal, closeCreateBaseModal } = useUIStore();
  const [chosen, setChosen] = useState(() => {
    const match = workspaces.find(
      (w) => w.id === createBaseModal.workspaceId
    );
    if (match) return match;
    return workspaces[0];
  });
  const [workspaceChoosing, setWorkspaceChoosing] = useState(false);
  const router = useRouter();
  const addBase = useDataStore((s) => s.addBase);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) {
        closeCreateBaseModal();
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [closeCreateBaseModal]);

  const createBase = api.base.createBase.useMutation({
    onSuccess(newBase) {
      addBase(newBase);
      closeCreateBaseModal();
      router.push(`/${newBase.id}`);
    },
  });
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  
  const table = randomDataGenerator("Table 1");

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div ref={ref} className="relative bg-white rounded-lg shadow-lg w-full max-w-188 flex flex-col">
        <div className="flex flex-row items-center justify-between p-6 py-3">
          <span className="font-system text-[24px] font-semibold">How do you want to start?</span>
          <button 
            onClick={() => closeCreateBaseModal()}
            className="cursor-pointer"
          >
            <Icon id="X" className="h-4 w-4"/>
          </button>
        </div>
        <div className="w-full border-1 border-gray-200" />
        <div className="flex justify-start items-center w-full py-5 px-6 space-x-1">
          <div>Workspace:</div>
          <button onClick={() => setWorkspaceChoosing(!workspaceChoosing)} className="flex items-center space-x-1 text-gray-600 cursor-pointer hover:text-black">
            <span>
              {chosen?.name}
            </span>
            <Icon id="ChevronDown" className="h-4 w-4"/>
          </button>
          {workspaceChoosing && (
            <div className="p-3 absolute top-23/100 left-10 mt-2 w-60 bg-white border border-gray-200 rounded-md shadow-lg z-10 overflow-auto max-h-125">
              {workspaces.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => {
                    setChosen(opt);
                    setWorkspaceChoosing(false);
                  }}
                  className="px-2 py-2 cursor-pointer hover:bg-gray-100 rounded-md flex justify-between items-center"
                > 
                  <div className="font-system text-[13px]">{opt.name}</div>
                  <Icon id="Check" className={`h-3 w-3 ${opt == chosen ? "opacity-100" : "opacity-0"}`}/>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-between items-center px-5 pb-4 space-x-6">
        <div className="flex flex-col w-1/2 rounded-md border-gray-300 border-1 cursor-pointer">
            <img src="/start-with-ai-v3.png" width="100%" height="100%" alt="data"/>
            <div className="" />
            <div className="px-4 py-4 font-system">
              <span className="font-medium text-[20px]">Build an app with AI</span>
              <div className="text-[15px] text-gray-500">Cobuilder quickly turns your process into a custom app with data and interfaces</div>
            </div>
          </div>
          <div 
            className="flex flex-col w-1/2 rounded-md border-gray-300 border-1 cursor-pointer"
            onClick={() => {
              if (chosen) {
                createBase.mutate({ workspaceId: chosen.id, table: table });
                closeCreateBaseModal();
              }
            }}
          >
            <img src="/start-with-data.png" width="100%" height="100%" alt="data"/>
            <div className="" />
            <div className="px-4 py-4 font-system">
              <span className="font-medium text-[20px]">Start from scratch</span>
              <div className="text-[15px] text-gray-500">Build your ideal workflow starting with a blank table</div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}