# Auditoría final Cloudflare para criticalapiservices.com

Objetivo: revisar manualmente la configuración de Cloudflare antes de anunciar oficialmente el sitio. No cambiar DNS, reglas, SSL/TLS ni Pages sin autorización explícita.

## 1. DNS

Dominio principal:

- `criticalapiservices.com`

Validar:

- Registros DNS activos y vigentes.
- CNAME/A usados por Cloudflare Pages.
- Proxy naranja donde corresponda.
- Sin duplicidad innecesaria de registros.
- Dominio `www` configurado según la estrategia actual.
- Redirección `www -> apex` o `apex -> www` consistente con la configuración actual.
- Sin registros MX/SPF/DKIM alterados para Proton Mail.

## 2. SSL/TLS

Validar:

- Modo SSL/TLS en `Full` o `Full (strict)` según configuración actual.
- Universal SSL activo.
- Certificados de perímetro activos.
- Fechas de expiración correctas.
- Sin certificados pendientes o fallidos.
- Sin warnings críticos en SSL/TLS.

## 3. Dominios secundarios

Dominios de protección de marca:

- `criticalapiservice.com`
- `criticalapiservices.cl`
- `criticalapiservice.cl`
- `criticalapis.cl`
- `criticalapi.cl`

Validar:

- Redirección hacia `https://criticalapiservices.com`.
- Mantención de ruta equivalente cuando corresponda.
- Redirecciones 301.
- Sin correo configurado para dominios secundarios, salvo instrucción posterior.
- Sin loops entre dominios.

## 4. Redirect Rules

Validar:

- Redirecciones 301 permanentes.
- Sin redirecciones temporales innecesarias.
- Sin loops.
- Sin conflictos entre Page Rules antiguas y Redirect Rules actuales.
- Reglas de marca no afectan `/robots.txt`, `/sitemap-index.xml`, `/sitemap-0.xml` ni `/api/contacto`.

## 5. Cloudflare Pages

Validar:

- Proyecto Pages correcto.
- Rama de producción: `main`.
- Build command correcto: `npm run build`.
- Output directory correcto: `dist`.
- Último deploy exitoso.
- Dominios personalizados conectados.
- Preview deploys funcionando si se usan para QA.
- Functions detectadas para `/api/contacto`.

## 6. Variables y secretos

Validar existencia de:

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`

En:

- Production.
- Preview si se necesita probar formulario antes de publicar.

Valor operativo previsto de `RESEND_FROM_EMAIL`:

- `Critical API Services <no-reply@mail.criticalapiservices.com>`

Notas:

- No imprimir valores de secretos.
- No copiar API keys en tickets, capturas ni documentación.
- El dominio de envío verificado en Resend es `mail.criticalapiservices.com`.

## 7. Seguridad

Validar:

- WAF / Security Rules activas y razonables.
- Bot Fight Mode según política actual.
- Managed Challenge no bloquea usuarios legítimos.
- Reglas no bloquean `/sitemap-index.xml` ni `/sitemap-0.xml`.
- Reglas no bloquean `/robots.txt`.
- Reglas no bloquean `POST /api/contacto`.
- Reglas no bloquean Googlebot.
- Modo Under Attack desactivado para go-live normal.
- Turnstile planificado para fase posterior del formulario.

## 8. Cache

Validar:

- Caché normal activa para assets estáticos.
- No cachear `/api/contacto`.
- Purgar caché después del deploy final.
- No servir versiones antiguas de imágenes, logo o CSS.
- Revisar Browser Cache TTL según configuración actual.

## 9. SEO técnico

Validar en producción:

- `https://criticalapiservices.com/robots.txt` responde 200.
- `https://criticalapiservices.com/sitemap-index.xml` responde 200 y referencia `https://criticalapiservices.com/sitemap-0.xml`.
- Sitemap no bloqueado por WAF.
- Páginas principales indexables.
- Canonical correcto hacia `https://criticalapiservices.com`.
- Sin soft 404.
- Sin rutas antiguas expuestas como páginas principales.
- Open Graph básico correcto.
- Favicon correcto.

## 10. Analytics

Validar:

- Cloudflare Web Analytics si está configurado.
- Google Analytics 4 si existe.
- Search Console activo.
- Sin duplicar scripts de medición.
- Sin scripts que afecten rendimiento o privacidad innecesariamente.

## 11. Email/formulario

Validar:

- Envío real desde `/contacto`.
- Recepción en Proton Mail: `contacto@criticalapiservices.com`.
- `Reply-To` permite responder al email del cliente.
- Email no llega a spam.
- Resend no muestra error de dominio.
- Logs sin información sensible.
- `GET /api/contacto` devuelve 405.
- Honeypot no envía correo.

## 12. Performance

Validar:

- Lighthouse Desktop.
- Lighthouse Mobile.
- Core Web Vitals.
- Imágenes optimizadas.
- CSS/JS razonables.
- Sin assets innecesarios.
- Sin errores de consola.

## 13. Checklist final Go-Live

| Área | Estado | Observación | Responsable |
| --- | --- | --- | --- |
| DNS principal | Pendiente | Validar registros y proxy | Raul |
| Dominios secundarios | Pendiente | Validar redirecciones 301 | Raul |
| SSL/TLS | Pendiente | Revisar certificados y modo SSL | Raul |
| Pages deploy | Pendiente | Confirmar último deploy exitoso | Raul |
| Variables Resend | Pendiente | Crear `RESEND_API_KEY` | Raul |
| Formulario | Pendiente | Probar envío real y Reply-To | Raul |
| Proton Mail | Pendiente | Confirmar recepción y spam | Raul |
| Cache | Pendiente | Purgar después de deploy final | Raul |
| SEO técnico | Pendiente | Validar robots, sitemap, canonical | Raul |
| Analytics/Search Console | Pendiente | Confirmar configuración | Raul |
| Performance | Pendiente | Ejecutar Lighthouse | Raul |
| Anuncio oficial | Pendiente | Solo después de checklist OK | Raul |

Estados permitidos: `Pendiente`, `OK`, `Revisar`, `Bloqueado`.
