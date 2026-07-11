# Formulario de contacto en Cloudflare Pages

El formulario de `/contacto` envía los datos a `POST /api/contacto`, implementado como Cloudflare Pages Function en `functions/api/contacto.ts`.

Campos requeridos: `nombre`, `empresa`, `email`, `tipoNecesidad` y `mensaje`.

## Variables en Cloudflare

Configurar en Cloudflare Pages:

`Pages -> critical-api-site -> Settings -> Environment variables`

Variables requeridas:

- `RESEND_API_KEY`: API key secreta de Resend.
- `RESEND_FROM_EMAIL`: remitente verificado usado por Resend.

Valor operativo esperado:

```txt
Critical API Services <no-reply@mail.criticalapiservices.com>
```

Aplicar las variables en `Production` y también en `Preview` si se desea probar despliegues de vista previa.

## Resend y DNS

Resend está configurado como proveedor transaccional de salida para el formulario. El dominio de envío verificado es `mail.criticalapiservices.com` y el remitente se obtiene exclusivamente desde `RESEND_FROM_EMAIL`.

El destinatario final es `contacto@criticalapiservices.com`, alojado en Proton Mail. El encabezado `Reply-To` utiliza el email ingresado por el visitante, por lo que al responder desde Proton se responde directamente a la persona que completó el formulario.

No se debe usar un remitente provisional en producción ni dejar remitentes alternativos en el código.

## QA recomendado

1. `npm run build`
2. Si tienes Wrangler disponible, probar localmente:

```bash
npx wrangler pages dev dist --binding RESEND_API_KEY=tu_api_key
```

Con remitente verificado:

```bash
npx wrangler pages dev dist --binding RESEND_API_KEY=tu_api_key --binding RESEND_FROM_EMAIL="Critical API Services <no-reply@mail.criticalapiservices.com>"
```

3. En Cloudflare Preview o Production, probar `/contacto`.
4. Enviar formulario válido y confirmar mensaje de éxito.
5. Confirmar llegada a `contacto@criticalapiservices.com`.
6. Probar email inválido y formulario vacío.
7. Probar `GET /api/contacto` y confirmar `405`.
8. Confirmar que `RESEND_API_KEY` no aparece en el HTML generado ni en el frontend.

## Anti-spam

Actualmente existe un honeypot oculto llamado `website` y validación de tiempo de envío. Cloudflare Turnstile queda como mejora posterior, fuera del cierre actual de producción.
