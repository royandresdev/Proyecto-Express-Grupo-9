import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Bot } from "lucide-react";
import { useDashboardStore } from "@/store/dashboard.store";

export default function SugerenciasIaCard() {
  const sugerencia = useDashboardStore((state) => state.sugerenciaGeneral);

  const data = sugerencia ? [{
    texto: sugerencia,
    color: '#4CAF50'
  }] : [];

  return (
    <Card className="w-full max-w-md p-4 gap-4">
      <CardHeader className="gap-0 p-0">
        <CardTitle className="text-base flex items-center justify-between">
          Sugerencias IA <Bot size={16} />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-2">
          {
            data.length > 0 ? (
              data.map((sugerencia, index) => (
                <SugerenciaItem key={index} sugerencia={sugerencia} />
              ))
            ) : (
              <div className="text-center text-gray-500">No hay sugerencias disponibles</div>
            )}
        </div>
      </CardContent>
    </Card>
  );
}

const SugerenciaItem: React.FC<{ sugerencia: { texto: string; color: string } }> = ({ sugerencia }) => {
  return (
    <div
      className="p-3 rounded-lg bg-amber-100"
    >
      <p className="text-sm text-black font-bold" >
        ⚠️ {sugerencia.texto}
      </p>
    </div>
  )
};
