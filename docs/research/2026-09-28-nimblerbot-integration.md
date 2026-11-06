# Integración de Nimblerbot: investigación y decisiones propuestas

Fecha: 2026-09-28. Alcance: investigación y planificación; no autorización de implementación ni despliegue.

## Resumen

Recomendación: **Viewer publicado en un iframe dentro del lanzador actual**, creado únicamente después de un consentimiento explícito. El sitio conserva su interfaz exterior, idiomas, accesibilidad y contacto directo; Nimblerbot ejecuta y renderiza la conversación. No añadir SDK de terceros al documento principal ni un proxy LLM al Worker del sitio.

El trabajo no consiste solamente en pegar un embed: existe material de un bot personal, pero requiere reemplazar su flujo heredado de WhatsApp/CRM por un flujo web seguro. La disponibilidad de un portal/builder no demuestra que el bot esté publicado ni conectado correctamente.

Plan canónico: [MVP de dos entregas](../plans/2026-09-28-nimblerbot-integration.md), revisado el 2026-11-06 a solicitud del usuario. La investigación siguiente conserva evidencia técnica de la inspección original, no acredita capacidades vivas. El plan vigente gobierna aceptación; las mejoras aplazadas y sus disparadores están en [ENINJA-2](https://proj.nimblersoft.com/projects/ENINJA/issues/2/nimblerbot-web-mejoras-posteriores-al-mvp).

## Raíces y estado inspeccionado

- **S**: `/home/ericmaster/products/ericmaster-ninja`, remoto `ericmaster/ericmaster-ninja`, HEAD `153c028493613c2ca032a173dd9afada1bfce33d`.
- **N**: `/home/ericmaster/products/nimblerbot`, HEAD `9a409458ef74b08250367f932db3a5cb1fef4fae`.
- **T**: `N/typebot`, submódulo HEAD `fdb02a2cc61adb5fec5bc5aec03cd8be08d9cb03`, limpio al inspeccionarlo.
- S ya tenía cambios ajenos en `AGENTS.md`, `public/pdfs/resume-es.pdf`, `public/pdfs/resume.pdf`, `src/data/resume.es.json`, `src/data/resume.json`, `src/pages/content/resume.md`. No se alteraron. No convertir esos borradores en conocimiento publicado sin revisar su procedencia.
- N tenía cambios ajenos en `.artifacts-manager/manifest.json` y archivos no rastreados de planes, worktrees y QA. No se usaron como evidencia ni se modificaron.
- No se encontró `.agent-fabric/profile.yaml` ni `FABRIC.md` en S; gobiernan `AGENTS.md`, configuración y ADR existentes.

## Contexto previo: qué está confirmado y qué no

1. **Confirmado por el usuario:** sitio Astro/Cloudflare, chatbot sin LLM/RAG, Nimblerbot con Builder y embed, sesión únicamente de planificación autónoma.
2. **Decisión aceptada existente:** `S/docs/adr/0001-strict-csp-via-alpine-csp-build.md:24-44`: Alpine CSP autoalojado, sin `unsafe-eval`, scripts servidos por el propio sitio. No relajar esa decisión por el embed.
3. **Decisión aceptada existente:** `N/docs/adr/0005-bot-sync-promotes-only-flow.md`: promover Flow, mantener bindings por entorno. El código actual precisa el alcance: PATCH excluye también `events`; la redacción histórica de siete campos no es el contrato efectivo.
4. **Material existente, no aprobación ni evidencia de producción:** `N/bots/ericmaster-ninja/flow.json` y `prompt.txt`. Su texto propone CV, captación y agenda, pero esto no prueba una decisión del usuario ni un servicio funcionando. Falta `ids.env` en ese directorio; no se ha establecido `DEV_ID`, `PROD_ID` o `publicId` vivo.
5. Se consultó agentmemory por REST (`POST http://localhost:3111/agentmemory/smart-search`) con consultas globales y acotadas a ambos proyectos. No surgió una decisión previa relevante y verificable sobre esta integración. Los resultados fueron principalmente referencias operativas no relacionadas; no se reconstruyeron decisiones a partir de títulos truncados ni se consultaron historiales/ledgers locales. El antecedente utilizable es el código/ADR citado, no una memoria inferida.

## Evidencia del sitio

| Evidencia | Resultado |
|---|---|
| `S/src/components/AiChatbot.astro:184-355` | Clase DOM `ChatbotUI`, import de `ChatServiceMock`, mensajes en memoria, sin llamada a backend. Aunque el sitio utiliza Alpine, este widget actual es JavaScript imperativo, no un componente Alpine. |
| `S/src/lib/ChatServiceMock.ts:16-232` | Inglés/español, keywords/fuzzy matching, latencia artificial, máximo lógico de tres intercambios y derivaciones anteriores para preguntas; enlace `wa.me/593983337611`. |
| `S/src/layouts/BaseLayout.astro:5,65-176` | Montaje global del widget; registro central de componentes Alpine y arranque diferido. |
| `S/public/_headers:9-19` | `frame-src` permite sólo LinkedIn; `script-src` y `connect-src` no incluyen Nimblerbot. `frame-ancestors 'none'`/XFO protegen al sitio de ser embebido: no son la directiva que hay que retirar para alojar otro iframe. Excepción `/admin/*` con detach obligatorio. |
| `S/package.json:5-17,20-44` | Astro `^7.2.6`, Alpine CSP, Tailwind; `npm test` y `npm run build` con verificación de hashes CSP. |
| `S/wrangler.jsonc:3-8` y `S/CONTEXT.md:39-54` | Assets estáticos y Worker existente; no hay API general de conversación. |

Inspección pública, 2026-09-28: HEAD a `https://ericmaster.ninja` devolvió 200 y CSP concordante. Navegador Chromium/CDP, contexto aislado: un lanzador `#chatbot-toggle-btn`, ningún iframe al cargar, panel visible tras pulsarlo y saludo del mock. No se enviaron mensajes ni datos personales. HEAD a `https://viewer.nimblerbot.com` devolvió 200 sin cabecera global de bloqueo de frames; **no demuestra** el comportamiento de la URL del bot, todavía no establecida.

Capacidad de QA comprobada en la investigación original: Chromium 149 en `http://127.0.0.1:9222`; `playwright` resolvía desde S por la instalación del host. El MVP permite herramientas Playwright configuradas con procedimiento reproducible y evidencia conservada; revalidar disponibilidad al ejecutar, sin depender de un módulo npm ambiental ni exigir un servidor fixture propio.

## Evidencia de Nimblerbot

### Builder, portal y canales

`N/AGENTS.md:24-38` distingue Builder (`builder.nimblerbot.com`), Viewer (`viewer.nimblerbot.com`) y Booking Portal. El Portal de reservas y su SSO **no son** el runtime público del chat ni autenticación de visitantes del sitio. Desarrollo usa `bot-builder.nimblersoft.com` y `bot-viewer.nimblersoft.com`.

`N/CONTEXT.md:319-330`: teléfono/nombre de WhatsApp no existen en web. `T/packages/bot-engine/src/api/handleContinueChat.ts:42-47` rechaza reanudar sesiones WhatsApp desde la API web. El enlace directo a WhatsApp no implica continuidad de transcript ni activación de un bot en ese canal.

### Bot personal encontrado: riesgos concretos

- `N/bots/ericmaster-ninja/flow.json:24-103`: empieza obteniendo teléfono de WhatsApp y consultando **CRM de producción**.
- `:225-275,427-450`: crea/actualiza contactos en CRM; no hay consentimiento web acreditado. La reescritura segura de CRM de `bot.py` es específica de `nimblersoft-bot`, no debe asumirse para este bot.
- `:301-357`: webhook directo OpenRouter con sentinel de credencial, modelo `google/gemma-4-26b-a4b-it`; no es el bloque nativo con controles de routing.
- `:586-625`: invoca PII Mask pero incorpora `user_msg`, no `pii_masked_msg`, al historial. No afirmar anonimización.
- `:633-684`: texto de derivación promete seguimiento, pero ese grupo no acredita un mecanismo de notificación/atención humana.
- `N/bots/ericmaster-ninja/prompt.txt:19-29`: enlace Calendly de ejemplo y protocolo `[META]`; no prueba agenda real ni captación correcta. Las afirmaciones profesionales deben reconciliarse con contenido público vigente.

### `bot.sh`: contrato operativo real

`N/scripts/bot.sh:3-17` delega en Python; no genera un script para incrustar en la web.

| Operación | Contrato/precaución |
|---|---|
| `export dev|prod` | GET del draft y escritura local de flujo/prompt. No es una operación sólo lectura del repositorio. Redacta sentinels conocidos, no todo secreto arbitrario. |
| `create dev|prod` | POST, registra ID y trata de publicar; no asigna necesariamente `publicId`. |
| `deploy dev|prod` | PATCH, verifica Start y trata de publicar; el status de publicación impreso no garantiza exit no-cero ante fallo. |
| `clear-sessions [pattern]` | Borrado SQL local por patrón, no acotado al nombre de bot. Prohibido como procedimiento de limpieza de esta integración. |

Fuentes: `N/scripts/bot.py:93-95,1148-1170,1214-1305,1329-1440,1487-1598`. `DEV_ID`/`PROD_ID` prevalecen sobre `BOT_ID`. Crear/exportar conserva name/version/events/groups/edges/variables/theme; PATCH excluye events. Ni settings, dominios, publicId ni bindings WhatsApp se promueven. `credentialsId` sí viaja dentro de groups, sin remapeo: `T/apps/builder/src/features/typebot/helpers/sanitizers.ts:103-132` puede quitar referencias inexistentes.

El CLI obtiene secretos de administración y exige incluso claves CRM/OpenRouter para operaciones genéricas (`bot.py:1540-1543`); no exponerlo al navegador ni imprimir respuestas completas. El default histórico público de Infisical en `scripts/lib/ops_access.py` contradice la regla actual: fijar explícitamente endpoint local/mesh, siguiendo `N/AGENTS.md:167`.

`T/apps/builder/src/features/publish/components/PublishButton.tsx:125-134` guarda `publicId` antes de publicar. `getPublicId.ts:4-14` lo deriva con sufijo; **el nombre del bot no es su publicId**. `handlePublishTypebot.ts:179-219` copia el snapshot, no garantiza asignarlo. No repetir `create` automáticamente tras un timeout.

### Contexto, LLM y persistencia

- Bloque `open-router`, acción `Create chat completion`, credencial cifrada server-side: `T/packages/forge/blocks/openRouter/src/{index,auth,handlers}.ts` y `actions/createChatCompletion.ts`.
- `T/packages/ai/src/parseChatCompletionMessages.ts:49-85`: Dialogue recibe cadenas alternadas, no objetos `{role,content}`. Prompt del sistema separado; no copiar directamente el historial del webhook anterior.
- `T/packages/bot-engine/src/forge/executeForgedBlock.ts:54-74,164-244`: streaming depende del bloque siguiente; un Condition inmediatamente posterior evita el stream y permite verificar respuesta vacía. Routing interno sin credencial se permite en BUSINESS/PERSONAL, no FREE; presupuesto interno no limita BYOK explícito.
- No se acreditó un pipeline de crawling, embeddings, indexación o RAG del sitio. Contexto curado en prompt es una capacidad distinta y suficiente para v1.
- `T/packages/settings/src/schemas.ts`: `rememberUser` y `allowedOrigins` existen; no hay switch general de no-persistencia ni TTL configurable de web demostrado.
- `T/packages/bot-engine/src/helpers/assertOriginIsAllowed.ts:6-28`: una petición sin Origin pasa; la allowlist no autentica al cliente.
- `T/packages/results/src/archiveResults.ts:61-104`: API de borrado elimina answers/logs/historial/última sesión enlazada, **archiva** Result y limpia variables; no prueba borrado de sesiones huérfanas, copias de seguridad ni proveedor.
- `T/apps/builder/src/features/results/api/{router,handleGetResults,handleDeleteResults}.ts`: GET/DELETE autenticados por bot; selección explícita de resultIds. Listado paginado usa cursor numérico (iniciar con 0), por defecto filtra tiempo: la limpieza debe solicitar todo el período y no omitir páginas.

## Comparación de opciones realmente soportadas

| Ruta | Soporte real | Ventajas | Costes/límites | Decisión |
|---|---|---|---|---|
| Iframe del Viewer publicado | Generador `T/apps/builder/src/features/publish/components/deploy/dialogs/iframe/IframeSnippet.tsx:15-24` | Aislamiento DOM/JS; conserva lanzador; sólo ampliar frame-src; runtime compatible con el fork | Sin inspección del estado interior por same-origin policy; tamaño/foco/teclado/cookies y framing requieren QA; load no prueba salud | **Recomendada v1** |
| Embed oficial JavaScript | initStandard/initBubble/initPopup; generadores `.../snippetParsers/{standard,bubble,popup,shared}.ts` | Eventos de lifecycle y mayor integración visual | Snippet importa CDN por major; debe fijarse versión compatible con fork, autoalojarse y revisar CSP/style/connect/streaming. No pegarlo sin cambios | Alternativa posterior si se necesita telemetría de conversación o control fino del foco |
| API manteniendo UI propia | POST Viewer `/api/v1/typebots/{publicId}/startChat` y `/api/v1/sessions/{sessionId}/continueChat`, `T/packages/bot-engine/src/api/router.ts:78-100` | Máximo control visual y accesible | Renderizar inputs/actions/estado/errores/streaming; sesión como capability; no es reemplazar una respuesta de texto. Coste alto, posible proxy y controles adicionales | Descartada para v1 |
| Enlace a Viewer en pestaña | Mismo published URL | Fallback independiente del iframe | Saca al usuario del sitio | Fallback secundario; WhatsApp permanece disponible |

`@typebot.io/js` del checkout: 0.10.12 (`T/packages/embeds/js/package.json`); no se acreditó paridad con npm/CDN. Sitio no necesita React/Vue/Svelte para ninguna de las opciones elegibles.

Documentación primaria consultada mediante Context7, 2026-09-28:
- Typebot: https://github.com/baptistearno/typebot.io/blob/main/apps/docs/deploy/web/iframe.mdx y `html-javascript.mdx` (iframe oficial y apiHost). El fork inspeccionado prevalece para capacidades concretas.
- Astro: https://github.com/withastro/docs/blob/main/src/content/docs/en/guides/client-side-scripts.mdx y `environment-variables.mdx` (bundling, data attributes y configuración estática al build).
- OpenRouter: https://github.com/openrouterteam/docs/blob/main/content/blog/2026-08-07-team-spend-controls-setup.md (límites de claves y desactivación). Documentación acredita rechazo al agotar límite, **no** un techo matemático sin sobrepaso por concurrencia; medir y bloquear lanzamiento si no se puede acotar.

## Decisiones autónomas propuestas, no atribuidas al usuario

- Web desktop/móvil, inglés/español. Espejo GitHub Pages: contacto solamente en v1; no añadirlo implícitamente a allowedOrigins. No WhatsApp bot, Instagram, Telegram, voz, archivos, booking o SSO de visitantes.
- Contexto inicial curado de CV público y servicios/about/work publicados; URLs de referencia y fecha/hash de cada fuente. No todo el repositorio: excluir postulaciones, branded-docs, borradores, CV no revisado, secretos, notas privadas y artículos unpublished aunque una ruta resulte accesible.
- Sin RAG, crawler ni embeddings. Actualización manual revisada al cambiar CV/servicios; revisión mensual por Eric. No afirmar que el modelo consulta en vivo la página actual.
- Captación v1 significa **derivación voluntaria al contacto existente**, no persistir un Lead. No nombre/email obligatorio, no CRM. Enlace WhatsApp con texto fijo no sensible, sin transcript ni sessionId. No prometer reserva ni respuesta humana inmediata.
- Bot anónimo, propietario/operador Eric; administración autenticada sólo en Builder. Workspace dedicado FREE/BYOK para impedir fallback interno; credenciales específicas por entorno y clave de proveedor con presupuesto inicial total propuesto de USD 10, sin renovación automática. Modelo candidato explícito: el ya referenciado `google/gemma-4-26b-a4b-it`; comprobar existencia, coste y calidad, detenerse si no cumple en vez de sustituir sin revisión.
- Límite propuesto de ocho turnos LLM por sesión, 1.000 caracteres por entrada validados en Flow antes del modelo; no describirlo como protección global contra bots. Cuota del proveedor y apagado operativo son controles adicionales obligatorios.
- Consentimiento antes de cargar Viewer; aviso de IA, transmisión a Nimblerbot/OpenRouter/proveedor seleccionado, almacenamiento y enlace a privacidad. No prometer anonimización/zero retention. rememberUser apagado; nueva conversación al recargar/navegar, no transferencia de historial a otros canales.
- Retención operativa propuesta: depuración diaria del contenido de resultados mayores de siete días, objetivo observable máximo ocho días con servicio sano; metadata archivada, sesiones residuales, backups y políticas del proveedor se documentan por separado. No lanzamiento hasta comprobar el alcance real y publicar aviso fiel. Si la API no cubre lo necesario, detener activación y planificar el ajuste acotado, no inventar TTL.
- Bot caído/cuota agotada: contacto siempre visible. El parent no declara «conectado» por evento load ni detecta errores internos de un iframe cross-origin. No depender de mensajes postMessage no documentados.

## Criterios tras la revisión MVP

1. **Viabilidad:** el ID y la publicación no están probados. Ajuste: comprobar identidad, snapshot publicado y ejecución real; no aceptar exit code del CLI como evidencia suficiente.
2. **Alineación:** un LLM no es valor por sí solo. La revisión MVP sustituye el benchmark comparativo por doce casos congelados EN/ES: ocho útiles con fuentes y cuatro guardrails, todos correctos. Comparación mock/40 casos/tres runs/estadística quedan en NB-B4; ya no se afirma mejora estadística. Los negativos de controles siguen obligatorios aparte del dataset funcional.
3. **Riesgo:** abuso anónimo y persistencia. Ajuste: clave dedicada con cuota real, workspace sin fallback interno, pruebas de agotamiento/revocación, purge bot-scoped y aviso comprobado; Origin y rememberUser no sustituyen estos controles.

Se conserva la integración mínima; se rechazan la reutilización ciega del flujo heredado, el proxy LLM nuevo y un RAG no solicitado. CLI/manifests, harness mock y timer de retención propios no son entregables obligatorios del MVP. La retención sólo puede operar sin automatización nueva si un procedimiento probado cubre plazos, ausencias y fallos; de lo contrario bloquea activación. El plan registra la sustitución explícita de baseline y preserva el original, sin aceptar evidencia de ejecución inexistente.

## Límites de la investigación y condiciones de parada

No se ingresó al Builder autenticado ni se cargaron secretos; no se crearon conversaciones Nimblerbot, bots, claves, sesiones o despliegues. No se ejecutaron suites de implementación. No se establecieron inventario vivo, configuración de cuota/proveedor, backups, reglas WAF, publicId ni parity de producción. Son comprobaciones de entrada/aceptación del plan, no hechos afirmados. Si un locator requerido no resuelve, un entorno no coincide o un guardrail falla, conservar contacto-only y reportar el punto exacto; no improvisar un ID, endpoint o política.

## Revisión independiente del plan

La aceptación anterior correspondía al plan de cuatro fases, no al MVP. La revisión vigente debe evaluar el candidato de dos fases y su cambio de baseline; disposición, continuación y hash se conservan con los recibos privados de planificación. Permanece la puerta dura de confirmación productiva; ni validación de esquema ni publicación del plan autorizan implementación.
