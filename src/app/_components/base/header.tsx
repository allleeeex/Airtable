"use client"
import { useRouter } from "next/navigation";
import type { BaseWithTables } from "~/app/helper/types";
import { Icon } from "../icon";
import { useBaseStore } from "~/stores/baseStore";

interface BaseHeaderProps {
  colour: string;
  textColour: string;
  darkerColour: string;
  base: BaseWithTables
}

export function BaseHeader({ colour, textColour, darkerColour, base }: BaseHeaderProps) {
  const router = useRouter();
  return (
    <div
      className="relative w-full flex justify-between top-0 left-0 p-5 py-4.5 h-[56px]"
      style={{ backgroundColor: colour, color: textColour }}
    >
      <div className="flex">
        {/* Logo */ }
        <div className="cursor-pointer group w-10">
          <div onClick={() => router.back()} className={`absolute transform transition-transform flex items-center justify-center circle w-[24px] h-[24px] p-1.5 rounded-full duration-100 ease-out group-hover:scale-100 scale-0`} style={{ backgroundColor: textColour }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path fillRule="evenodd" d="M5.64775 2.22725C5.86742 2.44692 5.86742 2.80308 5.64775 3.02275L3.233 5.4375H10.125C10.4357 5.4375 10.6875 5.68934 10.6875 6C10.6875 6.31066 10.4357 6.5625 10.125 6.5625H3.233L5.64775 8.97725C5.86742 9.19692 5.86742 9.55308 5.64775 9.77275C5.42808 9.99242 5.07192 9.99242 4.85225 9.77275L1.47725 6.39775C1.37176 6.29226 1.3125 6.14918 1.3125 6C1.3125 5.85082 1.37176 5.70774 1.47725 5.60225L4.85225 2.22725C5.07192 2.00758 5.42808 2.00758 5.64775 2.22725Z" fill={colour}></path>
            </svg>
          </div>
          <svg width="24" height="20.4" viewBox="0 0 200 170" xmlns="http://www.w3.org/2000/svg" className={`absolute transform transition-transform duration-100 ease-out scale-100 group-hover:scale-0`}>
            <g>
              <path fill={textColour} d="M90.0389,12.3675 L24.0799,39.6605 C20.4119,41.1785 20.4499,46.3885 24.1409,47.8515 L90.3759,74.1175 C96.1959,76.4255 102.6769,76.4255 108.4959,74.1175 L174.7319,47.8515 C178.4219,46.3885 178.4609,41.1785 174.7919,39.6605 L108.8339,12.3675 C102.8159,9.8775 96.0559,9.8775 90.0389,12.3675"></path>
              <path fill={textColour} d="M105.3122,88.4608 L105.3122,154.0768 C105.3122,157.1978 108.4592,159.3348 111.3602,158.1848 L185.1662,129.5368 C186.8512,128.8688 187.9562,127.2408 187.9562,125.4288 L187.9562,59.8128 C187.9562,56.6918 184.8092,54.5548 181.9082,55.7048 L108.1022,84.3528 C106.4182,85.0208 105.3122,86.6488 105.3122,88.4608"></path>
              <path fill={textColour} d="M88.0781,91.8464 L66.1741,102.4224 L63.9501,103.4974 L17.7121,125.6524 C14.7811,127.0664 11.0401,124.9304 11.0401,121.6744 L11.0401,60.0884 C11.0401,58.9104 11.6441,57.8934 12.4541,57.1274 C12.7921,56.7884 13.1751,56.5094 13.5731,56.2884 C14.6781,55.6254 16.2541,55.4484 17.5941,55.9784 L87.7101,83.7594 C91.2741,85.1734 91.5541,90.1674 88.0781,91.8464"></path>
            </g>
          </svg>
        </div>
        {/* Base Name */ }
        <div className="flex items-center space-x-7">
          <div className="flex cursor-pointer space-x-1 items-center">
            <div className="min-w-0 grow-0 shrink-1 basis-auto line-height-[24px] text-[16.4px] font-[700]">
              {base.name}
            </div>
            <Icon id="ChevronDown" className="h-4 w-4"/>
          </div>
          <div className="flex font-lg space-x-8.5 text-[12.7px]">
            <div>
              Data
            </div>
            <div>
              Automations
            </div>
            <div>
              Interfaces
            </div>
            <div>
              Forms
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}