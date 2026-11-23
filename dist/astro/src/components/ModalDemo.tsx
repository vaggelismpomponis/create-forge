import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "./Button";
import { Modal } from "./Modal";

export function ModalDemo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          Modal Viewport Isolation Verification
        </h2>
        <p className="text-xs sm:text-sm text-zinc-500">
          Portaled directly to document.body at z-[99999].
        </p>
      </div>
      <Button onClick={() => setIsOpen(true)}>
        <span>Open Verified Modal</span>
        <ArrowRight className="w-4 h-4 ml-1.5" />
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Verified Body Portal Modal">
        <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-4">
          This modal is portaled directly into <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">document.body</code> at <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">z-[99999]</code>.
        </p>
        <div className="flex justify-end gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Close (Esc)
          </Button>
        </div>
      </Modal>
    </div>
  );
}
