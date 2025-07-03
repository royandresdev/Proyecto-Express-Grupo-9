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

export const analizarFeedbackConversacional = async (
  mensajes: { nombre: string; texto: string }[]
): Promise<string | null> => {
  const prompt = `
Sos un asistente inteligente para mejorar la comunicación de un equipo de desarrollo.

Analizá esta conversación y respondé **solo si detectás un problema grave o relevante** para mejorar, como:
- falta de respuesta o seguimiento importante,
- mensajes poco claros que dificulten el avance,
- tono tenso o conflictivo evidente,
- decisiones sin responsables claros que bloqueen el proyecto,
- mensajes cruzados o confusión significativa,
- falta de acuerdos o alineación que afecten el trabajo.

Ignorá mensajes triviales, saludos, cortesías o comentarios neutrales sin impacto en la dinámica del equipo.

Cuando respondas, sé breve, amable y constructivo, sugiriendo acciones claras para mejorar.

Si no hay nada relevante, respondé únicamente con la palabra exacta: "ninguna".

Conversación:
${mensajes.map((m, i) => `${i + 1}. ${m.nombre}: ${m.texto}`).join("\n")}

Sugerencia:
`.trim();

  const result = await generateContentWithRetry(prompt);
  const texto = result.response.text().trim();

  if (texto.toLowerCase() === "ninguna") return null;
  return texto;
};

