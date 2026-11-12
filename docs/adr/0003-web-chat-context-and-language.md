# Idioma y contexto de página para un chat web sin fricción

**Estado:** aceptado (2026-11-12); implementación pendiente.

## Contexto

El asistente web se abre desde una página cuyo idioma ya conocemos. Pedirlo otra
vez y mostrar el mensaje inicial en dos idiomas añade fricción innecesaria.
Eric prioriza un chatbot amigable y una buena UI/UX, y autoriza aprovechar el
contexto de la página. WhatsApp será un canal posterior con necesidades distintas.

La prohibición previa de transmitir datos del visitante por querystring era una
restricción de nuestra integración, no una limitación de Typebot. No debe impedir
transmitir un idioma público ni otro contexto útil de página deliberadamente elegido.

## Decisión

- La página es la fuente del idioma inicial: `es` o `en`. Se transmite al abrir el
  Viewer mediante una variable inicial de Typebot; el adaptador mapea ese valor a
  la variable de idioma del Flow. No se copia la querystring del visitante.
- El chat web no presenta selector de idioma ni un aviso o saludo duplicado EN/ES.
  Aviso, saludo, controles y respuestas iniciales corresponden al idioma de la página.
  La traducción del aviso conserva su contenido; no se elimina la divulgación.
- La integración siempre debe proporcionar un idioma válido. Su ausencia o un
  valor inválido es un defecto de integración que deben detectar las pruebas, no
  una razón para añadir otra pantalla al recorrido normal. No diseñamos ahora
  una experiencia separada para abrir el Viewer directamente.
- Se permite ampliar el contexto enviado cuando aporte valor concreto al chat
  (por ejemplo, la sección o el servicio público consultado). Cada campo tendrá
  un propósito, fuente y formato definidos, con validación proporcional. Esta
  decisión no obliga a enviar esos campos ahora ni a crear un framework genérico.
- El contexto del navegador orienta la conversación; no autentica al visitante ni
  concede permisos. No reenviar automáticamente URL completa, parámetros arbitrarios,
  secretos, mensajes o identificadores de conversación (`resume`, `resultId`,
  `startFrom`). Se mantienen los límites, el modelo, las credenciales y el aislamiento
  existentes; el idioma no habilita acciones ni acceso a datos privados.
- WhatsApp queda fuera de esta implementación. En el backlog se registra evaluar
  selección inicial de idioma y guardar la preferencia en CRM asociada al número,
  reutilizándola en conversaciones posteriores y permitiendo cambiarla.

## Consecuencias y alternativas

El visitante puede empezar a conversar sin repetir información que el sitio ya
conoce. La integración web y el Flow deben cambiar y verificarse juntos: pasar un
parámetro por sí solo no elimina la elección ni el aviso bilingüe actuales.

Descartamos mantener el selector web como alternativa rutinaria y prohibir todo
contexto por URL: ambos sacrifican usabilidad sin una protección proporcional para
el idioma. También descartamos reenviar toda la URL o variables arbitrarias: no es
necesario para una experiencia contextual y puede introducir datos no deseados.

## Aplicación y verificación

El [plan de integración](../plans/2026-09-28-nimblerbot-integration.md#revisión-ux-2026-11-12--pendiente-de-implementación)
define alcance y criterios `UX-LANG-01` a `UX-LANG-04`. Esta decisión sustituye la
interpretación de prohibición total de parámetros para el contexto web; no cambia
retroactivamente las pruebas ni la aceptación del MVP ya entregado.

Referencia técnica: [variables predefinidas de Typebot](https://docs.typebot.com/editor/variables).
