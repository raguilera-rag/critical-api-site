export type ContactEmailData = {
  requestId: string;
  submittedAtChile: string;
  origin: string;
  ipAddress: string;
  userAgent: string;
  fields: {
    nombre: string;
    empresa: string;
    cargo: string;
    email: string;
    telefono: string;
    tipoNecesidad: string;
    mensaje: string;
  };
};

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const display = (value: string) => escapeHtml(value || "No informado");

const fieldRow = (label: string, value: string) => `
  <tr>
    <td style="padding:0 0 10px 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #d9e2ec;border-radius:6px;background:#ffffff;">
        <tr>
          <td style="padding:12px 14px;background:#f4f7fa;border-bottom:1px solid #d9e2ec;color:#0f4f83;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;">
            ${escapeHtml(label)}
          </td>
        </tr>
        <tr>
          <td style="padding:14px;color:#0c1724;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;">
            ${display(value).replaceAll("\n", "<br>")}
          </td>
        </tr>
      </table>
    </td>
  </tr>
`;

const technicalRow = (label: string, value: string) => `
  <tr>
    <td style="padding:8px 0;color:#5c6b7a;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.5;">
      <strong style="color:#0c1724;">${escapeHtml(label)}:</strong> ${display(value)}
    </td>
  </tr>
`;

export const buildContactEmailHtml = (data: ContactEmailData) => `
<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#eef3f8;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:#eef3f8;">
      <tr>
        <td align="center" style="padding:28px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:720px;border-collapse:collapse;background:#ffffff;border:1px solid #d9e2ec;border-radius:8px;overflow:hidden;">
            <tr>
              <td style="padding:26px 28px;background:#04152b;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                  <tr>
                    <td style="vertical-align:middle;">
                      <img src="https://criticalapiservices.com/critical-logo-light_on_dark.png" width="210" alt="Critical API Services" style="display:block;width:210px;max-width:100%;height:auto;border:0;">
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-top:24px;color:#ffffff;font-family:Arial,Helvetica,sans-serif;">
                      <div style="color:#6aa2d5;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;">Critical API Services</div>
                      <h1 style="margin:8px 0 0 0;color:#ffffff;font-size:26px;line-height:1.2;font-weight:700;">Nueva solicitud de contacto</h1>
                      <p style="margin:10px 0 0 0;color:#c9d6e3;font-size:15px;line-height:1.6;">Un visitante completó el formulario de criticalapiservices.com.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:28px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                  ${fieldRow("Nombre", data.fields.nombre)}
                  ${fieldRow("Empresa", data.fields.empresa)}
                  ${fieldRow("Cargo", data.fields.cargo)}
                  ${fieldRow("Email", data.fields.email)}
                  ${fieldRow("Teléfono", data.fields.telefono)}
                  ${fieldRow("Tipo de necesidad", data.fields.tipoNecesidad)}
                  ${fieldRow("Mensaje", data.fields.mensaje)}
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:24px 28px;background:#f8fafc;border-top:1px solid #d9e2ec;">
                <h2 style="margin:0 0 10px 0;color:#0c1724;font-family:Arial,Helvetica,sans-serif;font-size:17px;line-height:1.3;">Información técnica</h2>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                  ${technicalRow("Fecha y hora Chile", data.submittedAtChile)}
                  ${technicalRow("Dominio de origen", data.origin)}
                  ${technicalRow("Identificador", data.requestId)}
                  ${technicalRow("IP visitante", data.ipAddress)}
                  ${technicalRow("User-Agent", data.userAgent)}
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

export const buildContactEmailText = (data: ContactEmailData) => [
  "Nueva solicitud de contacto",
  "",
  `Nombre: ${data.fields.nombre}`,
  `Empresa: ${data.fields.empresa}`,
  `Cargo: ${data.fields.cargo || "No informado"}`,
  `Email: ${data.fields.email}`,
  `Teléfono: ${data.fields.telefono || "No informado"}`,
  `Tipo de necesidad: ${data.fields.tipoNecesidad}`,
  "",
  "Mensaje:",
  data.fields.mensaje,
  "",
  "Información técnica",
  `Fecha y hora Chile: ${data.submittedAtChile}`,
  `Dominio de origen: ${data.origin}`,
  `Identificador: ${data.requestId}`,
  `IP visitante: ${data.ipAddress || "No informado"}`,
  `User-Agent: ${data.userAgent || "No informado"}`,
].join("\n");
