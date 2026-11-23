import { useState, useEffect } from "react";
import { Server, ShieldCheck, Terminal, ArrowRight, RefreshCw } from "lucide-react";
import { Button } from "./components/ui/button";
import { Modal } from "./components/ui/modal";

interface ItemDto {
  id: string;
  name: string;
  description: string;
  createdAtUtc: string;
}

export default function App() {
  const [items, setItems] = useState<ItemDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/items");
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (err) {
      console.error("API fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 md:py-16 flex-1 flex flex-col">
      <header className="mb-10 text-left">
        <p className="text-xs font-semibold tracking-widest uppercase text-zinc-500 mb-2">
          Clean Architecture Blueprint
        </p>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          C# .NET 10 Web API + React
        </h1>
        <p className="mt-3 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl">
          Clean architecture, explicit manual DTO projection (<code className="text-xs bg-zinc-200 dark:bg-zinc-800 px-1 py-0.5 rounded">ToDto()</code>), zero AutoMapper, and body-portaled modal isolation.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-2 mb-2 text-zinc-900 dark:text-zinc-100 font-semibold">
            <Server className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>.NET 10 API Directives</span>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Explicit manual DTO projection, <code className="text-xs bg-zinc-200 dark:bg-zinc-800 px-1 py-0.5 rounded">.AsNoTracking()</code>, and <code className="text-xs bg-zinc-200 dark:bg-zinc-800 px-1 py-0.5 rounded">CancellationToken</code> propagation.
          </p>
        </div>

        <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-2 mb-2 text-zinc-900 dark:text-zinc-100 font-semibold">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Production Guardrails</span>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Enforced in <code className="text-xs bg-zinc-200 dark:bg-zinc-800 px-1 py-0.5 rounded">AGENTS.md</code> and <code className="text-xs bg-zinc-200 dark:bg-zinc-800 px-1 py-0.5 rounded">.agent/skills</code>.
          </p>
        </div>
      </div>

      <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Backend Items (via /api/items)
          </h2>
          <Button variant="secondary" size="sm" onClick={fetchItems} disabled={loading}>
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {items.length === 0 ? (
          <p className="text-sm text-zinc-500">
            {loading ? "Loading items from .NET API..." : "No items found or API not started yet. Run: dotnet run --project src/Server"}
          </p>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="border border-zinc-200 dark:border-zinc-800 p-3 rounded-md">
                <p className="font-medium text-sm text-zinc-900 dark:text-zinc-100">{item.name}</p>
                <p className="text-xs text-zinc-500">{item.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-zinc-200 dark:border-zinc-800 pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Modal Viewport Isolation Verification
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500">
            Portaled directly to document.body at z-[99999].
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <span>Open Verified Modal</span>
          <ArrowRight className="w-4 h-4 ml-1.5" />
        </Button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Verified Body Portal Modal"
      >
        <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-4">
          This modal is portaled directly into <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">document.body</code> at <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">z-[99999]</code>.
        </p>
        <div className="flex justify-end gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
            Close (Esc)
          </Button>
        </div>
      </Modal>
    </div>
  );
}
