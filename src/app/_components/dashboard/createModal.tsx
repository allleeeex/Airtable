import type { WorkSpace } from "@prisma/client";
import { useState } from "react";

interface CreateBaseSelectorModalProps {
  workspaces: WorkSpace[];
  onClose(): void;
  onCreate(workspaceId: string): void;
}

export function CreateBaseSelectorModal({
  workspaces,
  onClose,
  onCreate,
}: CreateBaseSelectorModalProps) {
  const [chosen, setChosen] = useState<string>(
    workspaces.length > 0 ? workspaces[0].id : ""
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm relative">
        <h2 className="text-lg font-semibold mb-4">Create a new base</h2>

        <label className="block mb-4">
          <span className="text-sm font-medium">Workspace</span>
          <select
            value={chosen}
            onChange={(e) => setChosen(e.target.value)}
            className="mt-1 block w-full border rounded px-3 py-2"
          >
            {workspaces.map((ws) => (
              <option key={ws.id} value={ws.id}>
                {ws.name}
              </option>
            ))}
          </select>
        </label>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => onCreate(chosen)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={!chosen}
          >
            Create
          </button>
        </div>

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
      </div>
    </div>
  );
}
