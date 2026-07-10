# Formulario de contacto en Cloudflare Pages

El formulario de `/contacto` envía los datos a `POST /api/contacto`, implementado como Cloudflare Pages Function en `functions/api/contacto.ts`.

Campos requeridos: `nombre`, `empresa`, `email`, `tipoNecesidad` y `mensaje`.

## Variables en Cloudflare

Configurar en Cloudflare Pages:

`Pages -> critical-api-site -> Settings -> Environment variables`

Variables requeridas:

- `RESEND_API_KEY`: API key secreta de Resend.

Variable opcional:

- `RESEND_FROM_EMAIL`: remitente usado por Resend.

Valor recomendado cuando el dominio esté verificado en Resend:

```txt
Critical API Services <no-reply@criticalapiservices.com>
```

Fallback temporal si el dominio todavía no está verificado en Resend:

```txt
Critical API Services <onboarding@resend.dev>
```

Aplicar las variables en `Production` y también en `Preview` si se desea probar despliegues de vista previa.

## Resend y DNS

Para usar `no-reply@criticalapiservices.com` como remitente, verificar el dominio en Resend y publicar los registros DNS indicados por Resend, normalmente SPF/DKIM. Proton Mail puede seguir recibiendo en `contacto@criticalapiservices.com`; Resend solo actúa como proveedor transaccional de salida del formulario.

## QA recomendado

1. `npm run build`
2. Si tienes Wrangler disponible, probar localmente:

```bash
npx wrangler pages dev dist --binding RESEND_API_KEY=tu_api_key
```

Con remitente temporal:

```bash
npx wrangler pages dev dist --binding RESEND_API_KEY=tu_api_key --binding RESEND_FROM_EMAIL="Critical API Services <onboarding@resend.dev>"
```

3. En Cloudflare Preview o Production, probar `/contacto`.
4. Enviar formulario válido y confirmar mensaje de éxito.
5. Confirmar llegada a `contacto@criticalapiservices.com`.
6. Probar email inválido y formulario vacío.
7. Probar `GET /api/contacto` y confirmar `405`.
8. Confirmar que `RESEND_API_KEY` no aparece en el HTML generado ni en el frontend.

## Anti-spam

Actualmente existe un honeypot oculto llamado `website` y validación de tiempo de envío. El endpoint deja un comentario preparado para agregar Cloudflare Turnstile más adelante.
