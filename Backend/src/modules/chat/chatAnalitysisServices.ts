import { generateContentWithRetry } from "../../lib/giminiClient";

export const analizarTono = async (mensaje: string): Promise<"positivo" | "neutro" | "tenso"> => {
  const prompt = `Analizá este mensaje y respondé solo si corresponde con: positivo neutro o tenso\n"${mensaje}"`;
  const result = await generateContentWithRetry(prompt);

  const texto = result.response.text().trim().toLowerCase();
  if (["positivo", "neutro", "tenso"].includes(texto)) {
    return texto as "positivo" | "neutro" | "tenso";
  }

  return "neutro";
};

export const analizarDecision = async (mensaje: string): Promise<"resuelta" | "pendiente" | "ninguna"> => {
  const prompt = `¿Este mensaje representa una decisión? Respondé: resuelta, pendiente o ninguna.\n"${mensaje}"`;

  const result = await generateContentWithRetry(prompt);
  const texto = result.response.text().trim().toLowerCase();

  if (["resuelta", "pendiente"].includes(texto)) {
    return texto as "resuelta" | "pendiente";
  }

  return "ninguna";
};
