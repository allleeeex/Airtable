"use client"
import { useDataStore } from "~/stores/workspacesStore";

export function DashboardBodyList() {
  const bases = useDataStore((s) => s.bases);
  return (
    <div className="flex-1 flex-col overflow-auto p-0.5 py-6.5">
      <div className="w-387 border-collapse">
        <div className="flex text-gray-600 font-system text-[13px]">
          <div className="mr-97.5">
            Name
          </div>
          <div className="mr-32">
            Type
          </div>
          <div>
            Workspace
          </div>
        </div>
        <hr className="mt-1.5 w-full border-0.5 text-gray-300 pr-24"></hr>
        {bases.map((b) => (
          <div key={b.id} className="flex hover:bg-gray-50 cursor-pointer font-system text-[13px]">
            <div className="mr-88">{b.name}</div>
            <div>Base</div>
          </div>
        ))}
      </div>
    </div>
  );
}