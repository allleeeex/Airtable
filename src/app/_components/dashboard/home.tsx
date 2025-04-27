"use client"
import { Icon } from "../icon";
import { useEffect, useRef, useState } from "react";
import { DashboardBodyList } from "./dashList";

export function DashboardBody() {
  const [choice1, setChoice1] = useState("Opened by you");
  const [choice2, setChoice2] = useState("Show all types");
  const [showList, setShowList] = useState(false);
  const options1 = ["Opened by you", "Shared with you", "Starred"];
  const options2 = ["Show all types", "Show bases only", "Show interfaces only"];
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);

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
  
  return(
    <div 
      className="fixed w-full h-full pt-21 pl-12 bg-[#f9fafb] flex flex-col"
    >
      <div className="w-full text-[#1d1f25] font-[660] text-[27px] font-home leading-[33.75px] tracking-[-0.16px]">
        Home
      </div>
      {/* sorting bar idk */}
      <div className="pr-24 w-full flex items-center justify-between mt-13 text-[15px] font-system right-0">
        <div className="flex space-x-3">
          <div ref={ref1} className="relative">
            <button onClick={() => setOpen1(!open1)} className="flex items-center space-x-1 text-gray-600 cursor-pointer hover:text-black">
              <div>
                {choice1}
              </div>
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
              <div>
              {choice2}
              </div>
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
        <div className="fixed top-42.5 [right:clamp(1.75rem,5vw,3rem)] flex items-center">
          <button onClick={() => setShowList(!showList)} className={`p-1 rounded-full hover:text-black cursor-pointer ${showList ? "bg-gray-200 text-black" : "text-gray-500"}`}>
            <Icon id="List" className="h-5 w-5"/>
          </button>
          <button onClick={() => setShowList(!showList)} className={`p-1 rounded-full hover:text-black cursor-pointer ${showList ? "text-gray-500" : "bg-gray-200 text-black"}`}>
            <Icon id="GridFour" className="h-5 w-5"/>
          </button>
          </div>
      </div>
      {showList ? 
        <div className="flex-1">
          <DashboardBodyList />
        </div>
      :
        <div>
          brr
        </div>
      }
    </div>
  )
}