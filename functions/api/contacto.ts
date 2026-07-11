import { buildContactEmailHtml, buildContactEmailText } from "../_lib/contact-email";

type Env = {
  RESEND_API_KEY?: string;
  RESEND_FROM_EMAIL?: string;
};

type ContactPayload = {
  nombre?: unknown;
  empresa?: unknown;
  cargo?: unknown;
  email?: unknown;
  telefono?: unknown;
  tipoNecesidad?: unknown;
  mensaje?: unknown;
  website?: unknown;
  formStartedAt?: unknown;
};

const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
};

const MAX_LENGTHS = {
  nombre: 120,
  empresa: 160,
  cargo: 120,
  email: 180,
  telefono: 40,
  tipoNecesidad: 120,
  mensaje: 3000,
};

const ERROR_MESSAGE =
  "No pudimos enviar la solicitud. Inténtalo nuevamente o escribe a contacto@criticalapiservices.com.";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalize = (value: unknown, maxLength: number) => {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: JSON_HEADERS,
  });

const formatChileDate = (date: Date) =>
  new Intl.DateTimeFormat("es-CL", {
    dateStyle: "full",
    timeStyle: "medium",
    timeZone: "America/Santiago",
  }).format(date);

const createRequestId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `cas-${Date.now().toString(36)}`;
};

export const onRequest = async (context: {
  request: Request;
  env: Env;
}): Promise<Response> => {
  const { request, env } = context;

  if (request.method !== "POST") {
    return json({ ok: false, message: "Método no permitido." }, 405);
  }

  try {
    if (!env.RESEND_API_KEY) {
      return json({ ok: false, message: ERROR_MESSAGE }, 500);
    }

    if (!env.RESEND_FROM_EMAIL) {
      return json({ ok: false, message: ERROR_MESSAGE }, 500);
    }

    const payload = (await request.json().catch(() => null)) as ContactPayload | null;

    if (!payload || typeof payload !== "object" || Object.keys(payload).length === 0) {
      return json({ ok: false, message: ERROR_MESSAGE }, 400);
    }

    const website = normalize(payload.website, 200);
    if (website) {
      return json({ ok: true, message: "Solicitud enviada correctamente." });
    }

    const formStartedAt = Number(payload.formStartedAt);
    if (Number.isFinite(formStartedAt)) {
      const elapsedMs = Date.now() - formStartedAt;
      if (elapsedMs >= 0 && elapsedMs < 2500) {
        return json({ ok: true, message: "Solicitud enviada correctamente." });
      }
    }

    const nombre = normalize(payload.nombre, MAX_LENGTHS.nombre);
    const empresa = normalize(payload.empresa, MAX_LENGTHS.empresa);
    const cargo = normalize(payload.cargo, MAX_LENGTHS.cargo);
    const email = normalize(payload.email, MAX_LENGTHS.email).toLowerCase();
    const telefono = normalize(payload.telefono, MAX_LENGTHS.telefono);
    const tipoNecesidad = normalize(payload.tipoNecesidad, MAX_LENGTHS.tipoNecesidad);
    const mensaje = normalize(payload.mensaje, MAX_LENGTHS.mensaje);

    if (
      !nombre ||
      !empresa ||
      !email ||
      !EMAIL_RE.test(email) ||
      !tipoNecesidad ||
      !mensaje ||
      mensaje.length < 20
    ) {
      return json({ ok: false, message: ERROR_MESSAGE }, 400);
    }

    const submittedAt = new Date();
    const originDomain = new URL(request.url).hostname;
    const contactEmail = {
      requestId: createRequestId(),
      submittedAtChile: formatChileDate(submittedAt),
      origin: originDomain,
      ipAddress: request.headers.get("cf-connecting-ip") || "",
      userAgent: request.headers.get("user-agent") || "",
      fields: {
        nombre,
        empresa,
        cargo,
        email,
        telefono,
        tipoNecesidad,
        mensaje,
      },
    };

    const from = env.RESEND_FROM_EMAIL;

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: ["contacto@criticalapiservices.com"],
        reply_to: email,
        subject: "Nueva solicitud desde criticalapiservices.com",
        html: buildContactEmailHtml(contactEmail),
        text: buildContactEmailText(contactEmail),
      }),
    });

    if (!resendResponse.ok) {
      console.error("RESEND ERROR:", {
        status: resendResponse.status,
      });
      return json({ ok: false, message: ERROR_MESSAGE }, 502);
    }

    return json({ ok: true, message: "Solicitud enviada correctamente." });
  } catch {
    return json({ ok: false, message: ERROR_MESSAGE }, 500);
  }
};
