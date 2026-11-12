# Acciones iniciales nativas del bot

Estado: aceptado, 2026-11-12.
Supersedes: [ADR-0004](0004-web-chat-welcome-actions.md), únicamente la propiedad y
renderización de las acciones y su puente con la web.

## Decisión

El Flow define y traduce las tres acciones iniciales; el Viewer las muestra dentro
de la conversación. Se reutiliza el patrón del recepcionista virtual: opciones
nativas con búsqueda y escritura libre simultánea. No es necesario elegir antes
de escribir. La web sólo aporta el idioma inicial, el contenedor, los controles
de sesión y el aviso de IA/privacidad; se elimina el puente de acciones.

Servicio y perfil pasan por la validación, modelo y límite de ocho intentos
existentes. El contacto es un enlace fijo a `https://wa.me/593983337611`, sin
mensaje, consulta ni transcript. Una extensión del renderer limitada al bot de
Eric y su bloque inicial lo convierte en enlace sin petición al servidor del bot.
El iframe permite ventanas emergentes sin heredar su sandbox; no permite navegar
la ventana principal. El contacto del pie sigue disponible si el Viewer no carga.

Las acciones desaparecen con el primer envío y regresan con Nuevo chat. Cerrar y
reabrir conserva la conversación. Los turnos posteriores usan el input existente.
No cambian branding, avatar, modelo, prompt, credenciales ni otros bots.

## Alternativas y verificación

Un redirect del Flow exigiría una petición al bot para contactar; alojar los botones
en la web contradice la ubicación solicitada. No se añade un esquema genérico de
enlaces ni funcionalidad al Builder.

Verificar el DOM dentro del iframe, EN/ES, teclado, móvil/escritorio, envío único,
escritura libre, comandos, ciclo de sesión y contacto sin red al bot. Las pruebas
del Flow y renderer, build/CSP, revisión independiente y comprobación publicada
siguen siendo obligatorias.
