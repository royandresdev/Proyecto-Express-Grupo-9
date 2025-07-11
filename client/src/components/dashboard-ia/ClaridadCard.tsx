import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useDashboardStore } from "@/store/dashboard.store";
import { Sun } from "lucide-react";

export default function ClaridadCard() {
  const clarityConversation =
    useDashboardStore((state) => state.clarityConversation);

  if (typeof clarityConversation !== "number") {
    return null;
  }

  return (
    <Card className="w-full max-w-md p-4 gap-4">
      <CardHeader className="gap-0 p-0">
        <CardTitle className="text-base flex items-center justify-between">
          Claridad de la conversación<Sun size={16} />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="space-y-2">
          <li>
            <div className="flex items-center gap-2">
              <Progress
                value={clarityConversation}
                indicatorColor="bg-blue-500"
                className="flex-1 h-2"
              />
              <span className="w-8 text-right">{clarityConversation}%</span>
            </div>
            <div className="flex justify-between w-full">
              <span className="text-sm text-gray-500">
                Baja
              </span>
              <span className="text-sm text-gray-500">
                Alta
              </span>
            </div>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
