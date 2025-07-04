import { generateContentWithRetry } from "../../lib/giminiClient";

export const analizarTono = async (mensaje: string): Promise<"positivo" | "neutro" | "tenso"> => {
  const prompt = `Analizá este mensaje y respondé solo si corresponde con: positivo, neutro o tenso\n"${mensaje}"`;

  const result = await generateContentWithRetry(prompt);

  if (!result || result.error || !result.response) {
    console.warn("⚠️ Error al analizar tono:", result?.error || "Respuesta inválida");
    return "neutro"; // valor por defecto
  }

  const texto = result.response.text().trim().toLowerCase();
  if (["positivo", "neutro", "tenso"].includes(texto)) {
    return texto as "positivo" | "neutro" | "tenso";
  }

  return "neutro";
};

export const analizarDecision = async (mensaje: string): Promise<"resuelta" | "pendiente" | "ninguna"> => {
  const prompt = `
Tu tarea es analizar si el siguiente mensaje representa una decisión. 
Debés responder solo con una de las siguientes opciones (sin explicaciones): 
- "resuelta": si el mensaje indica que se ha tomado una decisión o acción concreta.
- "pendiente": si el mensaje expresa intención o propuesta, pero aún no se ejecutó o definió.
- "ninguna": si no hay intención, propuesta ni decisión.

Ejemplos:
1. "Vamos a implementar la solución mañana." → resuelta  
2. "Podríamos hablarlo en la próxima reunión." → pendiente  
3. "Hola, cómo están todos?" → ninguna  

Mensaje: "${mensaje}"

Respondé solo con: resuelta, pendiente o ninguna.
`;

  const result = await generateContentWithRetry(prompt);

  if (!result || result.error || !result.response) {
    console.warn("⚠️ Error al analizar decisión:", result?.error || "Respuesta inválida");
    return "ninguna"; 
  }

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

  if (!result || result.error || !result.response) {
    console.warn("⚠️ Error al generar feedback conversacional:", result?.error || "Respuesta inválida");
    return result?.error || null; // para mostrar mensaje de alerta en el chat si hay error
  }

  const texto = result.response.text().trim();
  if (texto.toLowerCase() === "ninguna") return null;

  return texto;
};

export const analizarClaridad = async (mensaje: string): Promise<"alta" | "media" | "baja"> => {
  const prompt = `
Analizá el siguiente mensaje y respondé únicamente con uno de estos niveles de claridad:
- alta: es claro, directo y fácil de entender.
- media: se entiende con algunos esfuerzos, tiene ambigüedades o errores menores.
- baja: es confuso, vago o desorganizado.

Mensaje: "${mensaje}"

Respondé solo con: alta, media o baja.
`;

  const result = await generateContentWithRetry(prompt);

  if (!result || result.error || !result.response) {
    console.warn("⚠️ Error al analizar claridad:", result?.error || "Respuesta inválida");
    return "media"; // valor neutral por defecto
  }

  const texto = result.response.text().trim().toLowerCase();

  if (["alta", "media", "baja"].includes(texto)) {
    return texto as "alta" | "media" | "baja";
  }

  return "media";
};

