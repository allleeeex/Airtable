"use client"

import { darkenColour } from "~/app/helper/stringToColour";
import type { BaseWithTables } from "~/app/helper/types";
import { useState } from "react";
import { Icon } from "../icon";
import { useBaseStore } from "~/stores/baseStore";

interface BaseHeaderProps {
  colour: string;
  textColour: string;
  darkerColour: string;
  theBase: BaseWithTables;
}

export function BaseHeader2({ colour, textColour, darkerColour, theBase }: BaseHeaderProps) {
  const hoverColour = darkenColour(colour, 0.2);
  const lightText = textColour === "#fff" ? "#f2f2f2" : "#363333";
  const [showAddTable, setShowAddTable] = useState(false);
  const [extHover, setExtHover] = useState(false);
  const [toolsHover, setToolsHover] = useState(false);
  const [addHover, setAddHover] = useState(false);
  return (
    <div className="relative flex h-[32px] w-full space-x-2" style={{ backgroundColor: colour, color: textColour }}>
      {/* Table Selector */}
      <div className="flex overflow-x-auto pl-3 rounded-tr-md flex-1 items-center h-full" style={{ backgroundColor: darkerColour }}>
        {theBase.tables.map((table) => (
          <div key={table.name}>
            {theBase.lastSelectedTableId === table.id ? 
              <div className="p-3 space-x-1 text-[13px] font-medium font-system bg-white h-[32px] items-center flex text-black rounded-t-sm">
                <div>{table.name}</div>
                <Icon id="ChevronDown" className="h-4 w-4" />
              </div>
            :
              <div className="flex items-center">
                {table.name}
              </div>
            }
          </div>
        ))}
        <div className="px-3 cursor-pointer h-full flex items-center" style={{ color: lightText }}>
          <Icon id="ChevronDown" className="h-4 w-4" />
        </div>
        <div className="font-thin text-gray-800 opacity-50 text-[13px]">
          |
        </div>
        <div 
          className="flex text-[13px] font-system space-x-2 items-stretch px-2.5 hover:cursor-pointer"
          onMouseEnter={() => setAddHover(true)}
          onMouseLeave={() => setAddHover(false)}
          style={{ color: addHover ? textColour : lightText }}
        >
          <Icon id="Plus" className="h-4 w-4 pt-0.5" />
          <div>
            Add or import
          </div>
        </div>
      </div>

      {/* Extensions and Tools */}
      <div className="font-system flex rounded-tl-md p-2 px-3 items-center space-x-6 text-[13px] font-normal" style={{ backgroundColor: darkerColour }}>
        <div
          className="cursor-pointer transition-colors"
          onMouseEnter={() => setExtHover(true)}
          onMouseLeave={() => setExtHover(false)}
          style={{
            color: extHover ? textColour : lightText,
          }}
        >
          Extensions
        </div>
        <div
          className="flex items-center space-x-1 cursor-pointer transition-colors"
          onMouseEnter={() => setToolsHover(true)}
          onMouseLeave={() => setToolsHover(false)}
          style={{
            color: toolsHover ? textColour : lightText,
          }}
        >
          <div>Tools</div>
          <Icon id="ChevronDown" className="h-4 w-4" />
        </div>
      </div>
    </div>
  )
}
