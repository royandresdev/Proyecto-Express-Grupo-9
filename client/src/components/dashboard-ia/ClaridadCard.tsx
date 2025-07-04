import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useDashboardStore } from "@/store/dashboard.store";
import { RectangleVertical } from "lucide-react";

export default function ClaridadCard() {
  const claridadPorUsuario = useDashboardStore((state) => state.claridadPorUsuario) ?? [];

  if (!Array.isArray(claridadPorUsuario)) {
    return null;
  }

  return (
    <Card className="w-full max-w-md p-4 gap-4">
      <CardHeader className="gap-0 p-0">
        <CardTitle className="text-base flex items-center justify-between">
          Claridad <RectangleVertical className="w-4 h-4" />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="space-y-2">
          {claridadPorUsuario.map((user) => (
            <li key={user.user_id} className="flex items-center gap-2">
              <span className="w-16">{user.nombre}</span>
              <Progress
                value={user.claridad}
                indicatorColor="bg-blue-500"
                className="flex-1 h-2"
              />
              <span className="w-8 text-right">{user.claridad}%</span>
            </li>
          ))}
          {claridadPorUsuario.length === 0 && (
            <li className="text-center text-gray-500">
              No hay datos de claridad disponibles
            </li>
          )}
        </ul>
      </CardContent>
    </Card>
  );
}
