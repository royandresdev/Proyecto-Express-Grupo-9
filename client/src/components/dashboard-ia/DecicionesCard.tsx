import { CheckCircle, Clock, RectangleVertical } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { useDashboardStore } from "@/store/dashboard.store";


export default function DecicionesCard() {
  const decisionesCantidad = useDashboardStore((state) => state.decisionesCantidad);
  return (
    <Card className="w-full max-w-md p-4 gap-4">
      <CardHeader className="gap-0 p-0">
        <CardTitle className="text-base flex items-center justify-between">
          Decisiones <RectangleVertical className="w-4 h-4" />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex justify-between">
          <div className="text-center ">
            <div className="text-2xl font-bold text-teal-600 mb-1">{decisionesCantidad.resueltas}</div>
            <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Resueltas
            </div>
          </div>
          <div className="text-center ">
            <div className="text-2xl font-bold text-orange-600 mb-1">{decisionesCantidad.pendientes}</div>
            <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
              <Clock className="w-3 h-3" />
              Pendientes
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
