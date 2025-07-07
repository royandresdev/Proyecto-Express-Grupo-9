import { Bot } from "lucide-react";

export default function DashboardHeader() {
  return (
    <div className="w-80 bg-white">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <Bot />
          <h2 className="font-semibold">Dashboard IA</h2>
        </div>
        <p className="text-xs text-gray-500 mt-1">Análisis en tiempo real</p>
      </div>
    </div>
  );
}
