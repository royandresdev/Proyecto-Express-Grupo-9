import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { RectangleVertical } from "lucide-react";
import { useDashboardStore } from "@/store/dashboard.store";

// Colores predefinidos para participación
const PARTICIPATION_COLORS = [
  '#4CAF50', // verde
  '#2196F3', // azul
  '#FFC107', // amarillo
  '#9C27B0', // morado
  '#FF5722', // naranja
  '#607D8B', // gris azulado
];

export default function ParticipacionCard() {
  const participacion = useDashboardStore((state) => state.participacionPorUsuario);

  const data = participacion.map((p, index) => ({
    nombre: p.nombre,
    porcentaje: p.porcentaje,
    color: PARTICIPATION_COLORS[index % PARTICIPATION_COLORS.length]
  }));

  return (
    <Card className="w-full max-w-md p-4 gap-4">
      <CardHeader className="gap-0 p-0">
        <CardTitle className="text-base flex items-center justify-between">
          Participación <RectangleVertical className="w-4 h-4" />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-4">
          {
            data.length > 0 ? (
              data.map((item, index) => (
                <ProgressBar key={index} item={item} />
              ))
            ) : (
              <div className="text-center text-gray-500">No hay datos de participación disponibles</div>
            )}
        </div>
      </CardContent>
    </Card>
  );
}

type ProgressBarProps = {
  item: { nombre: string; porcentaje: number; color: string };
};

const ProgressBar: React.FC<ProgressBarProps> = ({ item }) => {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>{item.nombre}</span>
        <span>{item.porcentaje}%</span>
      </div>
      <div className="h-2 rounded-full bg-gray-200">
        <div
          className="h-full rounded-full"
          style={{
            width: `${item.porcentaje}%`,
            backgroundColor: item.color,
          }}
        />
      </div>
    </div>
  );
};
