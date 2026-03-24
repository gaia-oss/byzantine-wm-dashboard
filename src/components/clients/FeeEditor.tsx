"use client";

import { Edit2, Save, X } from "lucide-react";
import { useState } from "react";
import { calculateAnnualFee, formatCurrency } from "@/lib/format";

interface FeeEditorProps {
  currentFee: number;
  clientAum: number;
  onSave: (newFee: number) => Promise<void>;
}

export function FeeEditor({ currentFee, clientAum, onSave }: FeeEditorProps) {
  const [editing, setEditing] = useState(false);
  const [newFee, setNewFee] = useState<number | "">(currentFee);

  const handleSave = async () => {
    if (newFee === "") return;
    await onSave(Number(newFee));
    setEditing(false);
  };

  const handleCancel = () => {
    setNewFee(currentFee);
    setEditing(false);
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-[#1A0918]">Management Fee</h3>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-[#702963] hover:bg-[#F3EFF5] rounded-lg transition-colors"
          >
            <Edit2 size={16} />
            Edit
          </button>
        )}
      </div>

      {!editing ? (
        <div className="flex items-center justify-between p-4 bg-[#F8F6FA] rounded-lg border border-[#E8E0EC]">
          <span className="text-[#6B5A70]">Current management fee:</span>
          <span className="text-xl font-bold text-[#1A0918]">
            {currentFee} bps
          </span>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label
              htmlFor="fee-input"
              className="text-sm font-medium text-[#6B5A70] mb-2 block"
            >
              New Management Fee (bps)
            </label>
            <input
              id="fee-input"
              type="number"
              min="0"
              max="1000"
              value={newFee}
              onChange={(e) =>
                setNewFee(e.target.value === "" ? "" : Number(e.target.value))
              }
              className="w-full px-4 py-2.5 bg-[#F8F6FA] border border-[#E8E0EC] rounded-lg text-[#1A0918] focus:outline-none focus:border-[#702963] focus:ring-1 focus:ring-[#702963]"
              placeholder="Enter fee in bps"
            />
          </div>

          {newFee !== "" && (
            <div className="p-4 bg-[#F3EFF5] rounded-lg border border-[#E8E0EC] space-y-2">
              <p className="text-sm text-[#6B5A70]">Preview</p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-[#6B5A70]">Client AUM:</span>
                  <span className="font-medium text-[#1A0918]">
                    {formatCurrency(clientAum)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#6B5A70]">Your fee:</span>
                  <span className="font-medium text-[#1A0918]">
                    {newFee} bps
                  </span>
                </div>
                <div className="border-t border-[#E8E0EC] pt-2 flex justify-between">
                  <span className="text-[#1A0918] font-medium">
                    Annual fee income:
                  </span>
                  <span className="font-bold text-[#702963]">
                    {formatCurrency(
                      calculateAnnualFee(clientAum, Number(newFee))
                    )}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <button
              onClick={handleCancel}
              className="inline-flex items-center gap-2 px-4 py-2 border border-[#E8E0EC] text-[#1A0918] rounded-lg font-medium hover:bg-[#F8F6FA] transition-colors"
            >
              <X size={18} />
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#702963] text-white rounded-lg font-medium hover:bg-[#5A1F4F] transition-colors"
            >
              <Save size={18} />
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
