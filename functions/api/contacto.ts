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

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const normalize = (value: unknown, maxLength: number) => {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: JSON_HEADERS,
  });

const buildEmailHtml = (fields: Record<string, string>) => `
  <div style="font-family:Arial,sans-serif;color:#0c1724;line-height:1.55">
    <h1 style="font-size:20px;margin:0 0 16px">Nueva solicitud desde criticalapiservices.com</h1>
    <table style="border-collapse:collapse;width:100%;max-width:680px">
      ${Object.entries(fields)
        .map(
          ([label, value]) => `
            <tr>
              <td style="border:1px solid #d9e2ec;padding:10px 12px;font-weight:700;background:#f4f7fa;width:190px">${escapeHtml(label)}</td>
              <td style="border:1px solid #d9e2ec;padding:10px 12px">${escapeHtml(value || "No informado")}</td>
            </tr>
          `,
        )
        .join("")}
    </table>
  </div>
`;

const buildEmailText = (fields: Record<string, string>) =>
  Object.entries(fields)
    .map(([label, value]) => `${label}: ${value || "No informado"}`)
    .join("\n");

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

    const submittedAt = new Date().toISOString();
    const fields = {
      Nombre: nombre,
      Empresa: empresa,
      Cargo: cargo,
      Email: email,
      "Teléfono": telefono,
      "Tipo de necesidad": tipoNecesidad,
      Mensaje: mensaje,
      "Fecha/hora": submittedAt,
      Origen: "criticalapiservices.com",
    };

    // TODO: Integrar Cloudflare Turnstile antes de campañas o tráfico pagado.
    // Si el dominio no está verificado en Resend, configurar temporalmente
    // RESEND_FROM_EMAIL="Critical API Services <onboarding@resend.dev>" en Cloudflare.
    const from =
      env.RESEND_FROM_EMAIL || "Critical API Services <no-reply@criticalapiservices.com>";

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
        html: buildEmailHtml(fields),
        text: buildEmailText(fields),
      }),
    });

    if (!resendResponse.ok) {
      return json({ ok: false, message: ERROR_MESSAGE }, 502);
    }

    return json({ ok: true, message: "Solicitud enviada correctamente." });
  } catch {
    return json({ ok: false, message: ERROR_MESSAGE }, 500);
  }
};
