import { generateContentWithRetry } from "../../lib/giminiClient";

export const analizarTono = async (
  mensaje: string
): Promise<"positivo" | "neutro" | "tenso"> => {
  const prompt = `Analizá este mensaje y respondé solo si corresponde con: positivo, neutro o tenso\n"${mensaje}"`;

  const result = await generateContentWithRetry(prompt);

  if (!result || result.error || !result.response) {
    console.warn(
      "⚠️ Error al analizar tono:",
      result?.error || "Respuesta inválida"
    );
    return "neutro"; // valor por defecto
  }

  const texto = result.response.text().trim().toLowerCase();
  if (["positivo", "neutro", "tenso"].includes(texto)) {
    return texto as "positivo" | "neutro" | "tenso";
  }

  return "neutro";
};

export const analizarDecision = async (
  mensaje: string
): Promise<"resuelta" | "pendiente" | "ninguna"> => {
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
    console.warn(
      "⚠️ Error al analizar decisión:",
      result?.error || "Respuesta inválida"
    );
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
Sos un asistente inteligente para mejorar la comunicación de un equipo de desarrollo, no seas molesto al repetir las cosas si ya las mencionaste.

Analizá esta conversación y respondé **solo si detectás un problema grave o relevante** para mejorar, como:
- falta de respuesta o seguimiento importante,
- mensajes poco claros en temas que indican ser críticos e importantes,
- tono tenso o conflictivo evidente,
- decisiones sin responsables claros que bloqueen el proyecto,
- mensajes cruzados o confusión significativa,
- falta de acuerdos o alineación que afecten el trabajo.

Ignorá mensajes triviales, saludos, cortesías o comentarios neutrales sin impacto en la dinámica del equipo, evita ser repetitivo.

Recuerda que eres un asistente y si el equipo no responde a tus sugerencias, no debes insistir. Tu objetivo es ayudar a mejorar la comunicación y la efectividad del equipo.

Cuando respondas, sé breve, amable y constructivo, sugiriendo acciones claras para mejorar.

Si no hay nada relevante, respondé únicamente con la palabra exacta: "ninguna".

Importante, si se da uno de estos casos respondé con la palabra exacta: "ninguna":
- Si el asistente IA ya respondió al problema anteriormente.
- Si el mensaje ya fue analizado y no se detectó problema.
- Si el mensaje es una simple pregunta o saludo sin relevancia.
- Si el mensaje no aporta información nueva o relevante.
- Si el equipo ya ha discutido el tema y no hay nuevas acciones a tomar.
- Si el equipo realmente no necesita ayuda en este momento.
- Si el equipo no se nota confundido o perdido en la conversación.

Conversación:
${mensajes.map((m, i) => `${i + 1}. ${m.nombre}: ${m.texto}`).join("\n")}

Sugerencia:
`.trim();

  const result = await generateContentWithRetry(prompt);

  if (!result || result.error || !result.response) {
    console.warn(
      "⚠️ Error al generar feedback conversacional:",
      result?.error || "Respuesta inválida"
    );
    return result?.error || null; // para mostrar mensaje de alerta en el chat si hay error
  }

  const texto = result.response.text().trim();
  if (texto.toLowerCase() === "ninguna") return null;

  return texto;
};

export const analizarClaridad = async (mensaje: string): Promise<number> => {
  const prompt = `
Analiza el siguiente mensaje y devuelve ÚNICAMENTE un número del 0 al 100 que represente el porcentaje de claridad, donde:
- 100%: mensaje perfectamente claro, directo y fácil de entender
- 50%: mensaje con algunas ambigüedades pero entendible
- 0%: mensaje muy confuso o incomprensible

Mensaje: "${mensaje}"

IMPORTANTE: Responde SOLO con el número (ejemplo: 75)
`;

  const result = await generateContentWithRetry(prompt);

  if (!result || result.error || !result.response) {
    console.warn(
      "⚠️ Error al analizar claridad:",
      result?.error || "Respuesta inválida"
    );
    return 50; // valor neutral por defecto
  }

  const texto = result.response.text().trim();
  const numero = parseInt(texto);

  if (!isNaN(numero) && numero >= 0 && numero <= 100) {
    return numero;
  }

  return 50; // valor neutral por defecto
};
