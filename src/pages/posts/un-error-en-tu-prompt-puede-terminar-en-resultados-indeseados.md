---
layout: ../../layouts/MarkdownPostLayout.astro
title: "Un error en tu prompt puede terminar en resultados indeseados"
published: true
tags:
  - Artificial Intelligence
  - Software Architecture
  - AI Agents
  - Prompt Engineering
slug: un-error-en-tu-prompt-puede-terminar-en-resultados-indeseados
pubDate: 2026-11-06T10:26:41.000Z
lang: es
author: "Eric Aguayo"
image:
  url: assets/images/un-error-en-tu-prompt-corazon-coraza.jpg
  alt: "Cómic en el que una IA interpreta «coraza de amor» en lugar de «corazón de amor» y genera un oso de peluche con armadura medieval y armas."
description: "Un error en un prompt puede producir un resultado coherente, pero indeseado. Una reflexión sobre lenguaje natural, programación y la necesidad de validar la intención."
---

*El lenguaje humano nos permite expresar casi cualquier intención. Eso no significa que una máquina vaya a interpretarla como esperamos.*

Pides un osito con un gran **corazón** de amor. Un error convierte «corazón» en «coraza» y recibes un peluche con armadura medieval, pinchos y un martillo de guerra.

El cómic es absurdo. El problema que ilustra, no tanto.

[![Cómic en el que una IA interpreta «coraza de amor» en lugar de «corazón de amor» y genera un oso de peluche con armadura medieval y armas.](/assets/images/un-error-en-tu-prompt-corazon-coraza.jpg)](/assets/images/un-error-en-tu-prompt-corazon-coraza.jpg)

*[Abrir el cómic completo](/assets/images/un-error-en-tu-prompt-corazon-coraza.jpg).*

Entre lo que queremos, lo que escribimos y lo que un sistema ejecuta hay una distancia. El lenguaje natural nos permite recorrerla con una facilidad impresionante, pero también puede ocultarnos cuánto quedó a interpretación.

## Hablar nos da libertad. Programar nos obliga a precisar.

Cuando hablamos con otra persona, dejamos muchas cosas sin decir. Compartimos contexto, usamos aproximaciones y esperamos que nuestro interlocutor complete los espacios.

«Déjalo listo para mañana» puede ser una instrucción suficiente entre dos personas que conocen el trabajo. Fuera de ese contexto, deja abiertas preguntas básicas: ¿qué significa listo?, ¿a qué hora?, ¿con qué criterios?

Con la IA hacemos algo parecido. Expresamos una intención y esperamos que el modelo la convierta en un resultado.

Los lenguajes de programación y los lenguajes declarativos nos exigen otra disciplina. Tenemos que representar lo que queremos dentro de un vocabulario, una estructura y unas reglas explícitas.

Esa limitación resulta incómoda. También resulta útil.

Un compilador puede rechazar una instrucción mal formada. Un sistema de tipos puede impedir una operación incompatible. Un esquema puede detectar un campo desconocido o un valor fuera de las opciones permitidas.

**No saben lo que yo quería hacer, pero pueden detectar que lo que escribí viola ciertas reglas.**

## A veces, el error es una buena respuesta

Una de las cosas que más valoramos de los modelos de lenguaje es su capacidad de trabajar con entradas imperfectas. Entienden frases incompletas, toleran errores ortográficos y producen respuestas incluso cuando faltan detalles.

Para explorar ideas, eso es una ventaja.

Para ejecutar acciones con consecuencias, puede convertirse en un riesgo.

En el cómic, la petición extraña no detiene al robot. La interpreta, completa los detalles y produce algo coherente con esa interpretación. Hasta añade armas que nadie pidió.

El usuario descubre el malentendido cuando el resultado ya está delante.

Una respuesta como «¿quisiste decir corazón o coraza?» habría sido menos espectacular, pero bastante más útil.

**El problema no siempre es que el sistema falle. A veces es que continúa cuando debería detenerse.**

## Que compile no significa que esté bien

Tampoco conviene idealizar el código.

Un programa puede compilar perfectamente y ejecutar una lógica equivocada. Una consulta SQL puede ser válida y modificar los registros incorrectos. Una configuración puede cumplir su esquema y apuntar al entorno que no era.

Los lenguajes formales no garantizan que intención, lógica y resultado coincidan.

Lo que nos ofrecen son mecanismos para comprobar partes de esa relación: sintaxis, tipos, restricciones, precondiciones y pruebas. Si expresamos una condición y construimos una comprobación adecuada, podemos rechazar lo que no la cumple.

El error aparece cuando se viola una regla que el sistema puede verificar. **Si nunca expresamos la regla, no podemos asumir que alguien la está comprobando.**

Con los prompts sucede lo mismo, pero con una superficie de interpretación mucho más amplia.

## Expresar la intención no debería ser el último paso

Considera esta instrucción:

> Limpia los registros antiguos de los clientes.

¿Limpiar significa corregir datos, archivarlos o eliminarlos? ¿Antiguos según qué fecha? ¿Incluye clientes activos? ¿Se puede deshacer?

Un modelo podría proponer una interpretación razonable. Eso no la convierte en la interpretación correcta.

Para una tarea así, prefiero separar el proceso:

1. **Expresar la intención** en lenguaje humano.
2. **Resolver las ambigüedades** que cambian el alcance.
3. **Convertir la interpretación en reglas explícitas:** qué registros, qué operación y qué exclusiones.
4. **Revisar una vista previa** antes de modificar datos.
5. **Verificar el resultado** contra esas reglas.

El lenguaje natural sirve para conversar sobre lo que queremos. Las restricciones verificables sirven para limitar lo que el sistema puede hacer.

No hace falta renunciar a uno para aprovechar el otro.

## El prompt no reemplaza al contrato

Me interesa la posibilidad de construir software expresando intenciones en lugar de escribir cada instrucción. Pero reducir el esfuerzo de expresar una intención no elimina el trabajo de comprobarla.

Un prompt más largo tampoco resuelve automáticamente el problema. Podemos escribir varias páginas y seguir dejando ambiguo el verbo que autoriza una acción irreversible.

Cuando el resultado importa, necesitamos algo más que una respuesta convincente: límites, validaciones y condiciones que obliguen al sistema a detenerse.

Revisa las palabras de tu próximo prompt. Después, revisa qué ocurriría si el sistema las interpretara de otra manera.

**Para pedir un peluche, una coraza inesperada puede ser un buen chiste. Para operar un sistema, prefiero recibir un error a recibir un «listo» sobre algo que nunca quise hacer.**
