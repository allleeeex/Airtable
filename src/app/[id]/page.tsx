"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useBaseStore } from "~/stores/baseStore";
import { api } from "~/trpc/react";

import { BaseHeader } from "../_components/base/header";
import { BaseHeader2 } from "../_components/base/header2";
import { FilterBar } from "../_components/base/filterBar";
import { SideBar } from "../_components/base/sidebar";
import { Table } from "../_components/base/table";
import {
  darkenColour,
  readableTextColour,
  stringToRGBColour,
} from "../helper/stringToColour";

export default function BasePage() {
  const baseId = useParams().id as string;

  const { data: base, isLoading } = api.base.getBaseById.useQuery({ id: baseId });
  const setBase = useBaseStore((s) => s.setSelectedBase);
  const setSelectedTable = useBaseStore((s) => s.setSelectedTable);

  useEffect(() => {
    if (!base) return;
    setBase(base.id);
    setSelectedTable(base.lastSelectedTableId);
  }, [base, setBase, setSelectedTable]);

  // Lets just not load anything lol
  if (isLoading || !base) {
    return <div></div>;
  }

  const colourTheme = stringToRGBColour(baseId);
  const textColour = readableTextColour(colourTheme);
  const darkerColourTheme = darkenColour(colourTheme, 0.05);
  return (
    <div className="flex flex-col w-full fixed">
      <BaseHeader
        colour={colourTheme}
        textColour={textColour}
        darkerColour={darkerColourTheme}
        base={base}
      />
      <BaseHeader2
        colour={colourTheme}
        textColour={textColour}
        darkerColour={darkerColourTheme}
        theBase={base}
      />
      <FilterBar />
      <div className="flex relative">
        <SideBar />
        <Table selectedTableId={base.lastSelectedTableId!} />
      </div>
    </div>
  );
}
