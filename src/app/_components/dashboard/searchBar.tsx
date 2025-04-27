// components/SearchModal.tsx
"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { useState, useEffect } from "react";

export function SearchModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(o => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      {/* The trigger is invisible since we’ll use the header input itself */}
      <Dialog.Trigger asChild>
        <div />
      </Dialog.Trigger>
      
      <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-20" />
        <Dialog.Content
          className="
            fixed inset-0 flex items-start justify-center p-4 pt-24
            lg:pt-32
          "
        >
          <div className="w-full max-w-xl rounded-lg bg-white p-6 shadow-lg">
            <Dialog.Close className="absolute top-4 right-4 text-gray-500 hover:text-gray-900">
              ✕
            </Dialog.Close>

            {/* Your search input */}
            <div className="flex items-center border-b border-gray-300 pb-2">
              <svg className="h-5 w-5 text-gray-400 mr-2" /* search icon */ />
              <input
                autoFocus
                type="text"
                placeholder="Search…"
                className="w-full outline-none placeholder-gray-400 text-lg"
              />
            </div>

            {/* Results area */}
            <div className="mt-4 max-h-80 overflow-auto">
              {/* Map your recent/opened bases here */}
              <p className="text-gray-500">Recently opened</p>
              {/* …list items… */}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
