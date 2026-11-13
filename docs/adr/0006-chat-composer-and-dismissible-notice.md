# Compositor fijo y aviso descartable

Estado: aceptado, 2026-11-13.
Supersedes: [ADR-0005](0005-bot-native-welcome-actions.md), únicamente el contacto
duplicado del pie y la visibilidad permanente del aviso.

## Decisión

Por solicitud de Eric, el chat habilitado elimina «WhatsApp — sin IA» del pie y
conserva «Contactar con Eric directamente» entre las acciones nativas iniciales.
El enlace de respaldo permanece cuando el chat no está habilitado o no hay JavaScript;
ya no se garantiza un contacto externo al Viewer durante una caída de éste.

El aviso enlazado tiene un botón de cierre accesible. `localStorage` conserva sólo
la preferencia `ericmaster-chat-notice-v1=dismissed`, compartida entre EN/ES y páginas
del mismo origen; no registra consentimiento, identidad ni conversación. Si el
almacenamiento está bloqueado, cerrar funciona durante la página actual. Borrar los
datos del sitio vuelve a mostrar el aviso. La política sigue en el menú del chat.

Sólo el bot de Eric usa un compositor nativo fijo al fondo del Viewer; los mensajes
y acciones iniciales se desplazan encima. Se mueve el control existente, sin otro
input en la web ni puente de mensajes. Mientras no hay input disponible, el mismo
espacio muestra un control deshabilitado. Envío, reintento, validación, idiomas,
límites y ciclo de sesión mantienen sus propietarios existentes.

## Verificación

Pruebas de preferencia con almacenamiento disponible/bloqueado; build y CSP;
navegador EN/ES móvil/escritorio: un solo input activo, posición estable al hacer
scroll, teclado, viewport bajo, envío único, reintento, acciones nativas, persistencia
del aviso, cerrar/reabrir y Nuevo chat. Otros bots conservan su disposición original.
