# Bienvenida breve y acciones iniciales junto a la escritura libre

Estado: aceptado, 2026-11-12. Sustituye únicamente la ubicación del aviso dentro
del chat descrita en [ADR-0003](0003-web-chat-context-and-language.md).

## Decisión

Eric solicita un saludo amigable y tres respuestas rápidas; autoriza proceder tras
revisión independiente. La web muestra «Solicitar un servicio», «Conocer más sobre
Eric» y «Contactar con Eric directamente», traducidos al inglés cuando corresponde.
El Viewer conserva la entrada libre y empieza con un único saludo breve. El aviso
visible de IA y la política enlazada permanecen en la web, fuera de las burbujas.

Las acciones conversacionales se habilitan sólo cuando el input nativo confirma
que está montado. El puente se limita al bot de Eric y al origen de esta web,
verifica origen, ventana y token por input, y admite dos acciones fijas, no texto
arbitrario. Las respuestas siguen la validación y presupuesto existentes. El
contacto directo es un enlace normal: no envía mensajes, historial ni datos al CRM.

Al enviar manualmente o mediante acción se ocultan las sugerencias. Cerrar conserva
el estado; Nuevo chat lo reinicia. Si el Viewer falla, el contacto sigue disponible.

## Alternativas

Un bloque nativo de opciones obligaría a elegir antes de escribir. Añadir campos
al esquema de input requeriría actualizar Builder y ampliar innecesariamente el
despliegue. Los controles alojados en la web y un puente acotado permiten mantener
Builder, cron, modelo, credenciales, límites y otros bots sin cambios.

## Verificación

Pruebas del adaptador, puente e inicio del Flow; compilaciones y CSP; navegador
EN/ES en móvil/escritorio con teclado, envío único, escritura libre, ciclo de
sesión y contacto offline; revisión del candidato y comprobación real tras publicar.
