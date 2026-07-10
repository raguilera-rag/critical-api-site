# Go-live checklist para criticalapiservices.com

Este checklist prepara la publicación de la nueva versión del sitio en Cloudflare Pages. No ejecutar commit, push ni deploy sin aprobación explícita.

## Comandos locales

Instalar dependencias si es necesario:

```bash
npm install
```

Compilar:

```bash
npm run build
```

Preview estático local:

```bash
npm run preview
```

Probar Cloudflare Pages Functions si Wrangler está disponible:

```bash
npx wrangler pages dev dist --binding RESEND_API_KEY=tu_api_key
```

Con remitente explícito:

```bash
npx wrangler pages dev dist --binding RESEND_API_KEY=tu_api_key --binding RESEND_FROM_EMAIL="Critical API Services <no-reply@criticalapiservices.com>"
```

## Variables necesarias

En Cloudflare Pages -> proyecto -> Settings -> Environment variables:

- `RESEND_API_KEY`: API key secreta de Resend.

Opcional:

- `RESEND_FROM_EMAIL`: `Critical API Services <no-reply@criticalapiservices.com>`.

Configurar en:

- Production.
- Preview si se probará el formulario antes de producción.

## Resend y Proton Mail

- Proton Mail sigue siendo el buzón receptor corporativo.
- Resend se usa solo como proveedor transaccional de salida para el formulario.
- Destinatario final: `contacto@criticalapiservices.com`.
- Verificar dominio `criticalapiservices.com` en Resend antes de usar `no-reply@criticalapiservices.com`.
- Publicar SPF/DKIM solicitados por Resend en Cloudflare DNS.
- No configurar correo para dominios secundarios salvo instrucción posterior.

## Pasos de deploy

1. Confirmar que el working tree está listo para revisión.
2. Ejecutar `npm run build`.
3. Revisar `/dist` generado.
4. Confirmar que no hay secretos en frontend.
5. Solicitar aprobación para commit/push.
6. Después de aprobación, subir a `main` según flujo del proyecto.
7. Esperar deploy exitoso en Cloudflare Pages.
8. Purgar caché si corresponde.

## Pruebas post-deploy

Rutas esperadas:

- `/`
- `/quienes-somos`
- `/enfoque`
- `/ambitos`
- `/capacidades`
- `/sectores`
- `/soluciones`
- `/casos-de-uso`
- `/recursos`
- `/contacto`

Validar:

- Header consistente.
- Footer consistente.
- Imágenes y logos actualizados.
- Responsive móvil/tablet/desktop.
- Sin errores de consola.
- Links internos correctos.
- Links externos abren correctamente.
- Canonical correcto.
- Open Graph básico.
- `robots.txt` responde 200.
- `sitemap.xml` responde 200.
- No hay soft 404.

## Validación de formulario

1. Enviar formulario vacío y confirmar validación del navegador.
2. Probar email inválido y confirmar validación.
3. Probar mensaje menor a 20 caracteres.
4. Enviar formulario válido.
5. Confirmar mensaje: `Solicitud enviada correctamente.`
6. Confirmar llegada a `contacto@criticalapiservices.com`.
7. Responder al correo y validar `Reply-To`.
8. Probar `GET /api/contacto` y confirmar 405.
9. Probar honeypot `website` en entorno controlado y confirmar que no envía correo.
10. Revisar logs sin datos sensibles ni secretos.

## Validación SEO

- Search Console configurado.
- Sitemap enviado.
- Canonicals apuntan a `https://criticalapiservices.com`.
- Dominios secundarios redirigen al dominio principal.
- No indexar previews ni rutas no deseadas.
- Revisar títulos y descriptions principales.

## Validación Cloudflare

Usar `docs/cloudflare/production-audit-checklist.md` antes del anuncio oficial.

## Rollback básico

Si el deploy presenta problemas:

1. No anunciar el sitio.
2. En Cloudflare Pages, volver al deploy anterior estable.
3. Purgar caché si se sirvieron assets problemáticos.
4. Revisar logs de Pages Functions si el problema está en `/api/contacto`.
5. Corregir en rama local.
6. Repetir build y QA antes de nuevo deploy.

## Checklist de publicación

| Área | Estado | Observación |
| --- | --- | --- |
| Build local | Pendiente | Ejecutar antes de publicar |
| Rutas principales | Pendiente | Validar en preview |
| Formulario | Pendiente | Requiere `RESEND_API_KEY` |
| Resend DNS | Pendiente | Verificar SPF/DKIM |
| Proton recepción | Pendiente | Confirmar email recibido |
| Cloudflare audit | Pendiente | Ver checklist dedicado |
| SEO técnico | Pendiente | robots/sitemap/canonical |
| Performance | Pendiente | Lighthouse |
| Aprobación final | Pendiente | Requerida antes de push/deploy |

Estados sugeridos: `Pendiente`, `OK`, `Revisar`, `Bloqueado`.
