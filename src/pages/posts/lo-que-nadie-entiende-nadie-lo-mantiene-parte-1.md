---
layout: ../../layouts/MarkdownPostLayout.astro
title: "Lo que nadie entiende, nadie lo mantiene (Parte 1): una propuesta para evaluar el entendimiento humano"
published: true
tags:
  - IA
  - AI Agents
  - Arquitectura
  - Criterio
slug: lo-que-nadie-entiende-nadie-lo-mantiene-parte-1
pubDate: 2026-11-12T22:36:00.000-05:00
lang: es
image:
  url: assets/images/lo-que-nadie-entiende-nadie-lo-mantiene-parte-1.png
  alt: "Ilustración: un tablero de agentes con todo en verde y, al lado, un agente que le hace preguntas a un ingeniero sobre lo que se implementó antes de cerrar la tarea"
description: "La orquestación importa, pero creo que el entendimiento humano importa todavía más: sin él, los errores lógicos pasan desapercibidos, el sistema se vuelve difícil de mantener y escalar puede volverse un caos. Mi propuesta: que la IA nos haga preguntas antes de cerrar una tarea."
---

Casi toda la conversación sobre IA que veo hoy gira alrededor de la orquestación: cómo coordinar varios agentes, qué framework usar, qué patrón de supervisores escala mejor. Es una conversación necesaria. Yo mismo trabajo con un equipo de agentes.

Creo, sin embargo, que estamos mirando menos una cosa que importa igual o más: el entendimiento humano.

Un orquestador puede resolver problemas complejos, pero sin entendimiento humano, los errores lógicos o una intención malentendida pueden pasar desapercibidos. Con esos errores ocultos, el sistema se vuelve difícil de mantener. Y cuando crece, escalar puede volverse un caos.

En mi propio trabajo, lo que más me cuesta no es coordinar a los agentes, sino seguir entendiendo qué hicieron. Ya [escribí antes](/posts/lo-caro-de-un-agente-es-la-atencion/) que lo caro de un agente no son los tokens sino la atención. Este post es la otra cara de eso: para qué sirve esa atención. Y termina con una propuesta que todavía no he resuelto.

## Un paper que me ayudó a ponerle nombre

Hace unas semanas salió en arXiv [*Why and How to Do Science When AI Is Better at It*](https://arxiv.org/abs/2610.36116v2), de Hoda Heidari y Aydin Mohseni. Es un paper sobre ciencia, no sobre empresas ni software, pero el argumento se puede extrapolar a otras áreas que hacen uso extenso de IA, incluido mi trabajo con agentes.

Parten de un supuesto fuerte a propósito: que la IA ya es más precisa, menos sesgada y más eficiente que los investigadores humanos, y aun así concluyen que la investigación debe seguir guiada por humanos para garantizar un entendimiento humano colectivo y durable como fin de la ciencia. Como regla para delegar tareas de investigación, exigen que la comunidad pueda seguir comprendiendo, defendiendo y cuestionando el resultado por su cuenta, y que conserve las habilidades para hacerlo en el futuro. Esto no impide usar resultados verificados que todavía nadie comprende, siempre que se identifiquen así y después se priorice explicarlos.

La idea que más me quedó es la distinción entre un resultado **verificado** y uno **entendido**. Verificado es que pasó los chequeos que la comunidad acepta, como la replicación o una prueba formal, sin que necesariamente implique un resultado verdadero. Entendido es que además un colaborador puede explicarlo, defenderlo y cuestionarlo.

Con esa distinción, veo tres riesgos encadenados:

## 1. Errores lógicos que nadie ve

Un PR con todos los tests en verde pasó esos chequeos. Eso no demuestra que esté bien en todos los casos, y mucho menos que alguien lo entienda. Los tests prueban lo que se pensó en probar, y normalmente es la misma IA quien los implementa. Un error lógico, una regla de negocio mal interpretada o un supuesto que nadie escribió pasan desapercibidos por ese hueco.

Y revisar no siempre cierra ese hueco. En [*Automation Bias in Mammography*](https://doi.org/10.1148/radiol.222176) (Radiology, 2023), Thomas Dratsch y colegas pusieron a 27 radiólogos a leer mamografías con sugerencias de un supuesto sistema de IA. Los inexpertos acertaron cerca del 80 % de las veces cuando la sugerencia era correcta, y menos del 20 % cuando era incorrecta. Los muy experimentados también cayeron: de 82 % a 45,5 %. Heidari y Mohseni lo citan como evidencia de anclaje: **ver primero la respuesta de la IA condiciona tu propia evaluación**. Si bien no es un estudio de revisión de código, me preocupa un riesgo parecido cuando planificamos una especificación o revisamos un PR partiendo de lo que un agente dice y asumimos como correcto.

## 2. Después, un sistema difícil de mantener

Un error que nadie vio no desaparece. Aparece meses después, en producción, y alguien tiene que encontrarlo. Para eso hace falta leer código, formarse una hipótesis y depurar.

En [*How AI Impacts Skill Formation*](https://arxiv.org/abs/2601.20245) (2026), Judy Hanwen Shen y Alex Tamkin hicieron experimentos aleatorizados con desarrolladores que aprendían una librería asíncrona nueva, con y sin IA. Con IA, la comprensión conceptual, la lectura de código y la capacidad de depurar salieron peor, sin ganancias de eficiencia significativas en promedio. Quienes delegaron todo el código sí ganaron algo de productividad, pero a costa del aprendizaje de la librería. Los patrones que implicaban compromiso cognitivo conservaron el aprendizaje aunque usaran IA.

Usar IA nunca fue mi preocupación, sino que (consciente o inconscientemente) asuma sus salidas como correctas y, ya sea por tiempo o por las exigencias del día a día, pase a la siguiente tarea sin un entendimiento a fondo de la respuesta anterior.

## 3. Y al escalar, caos

En un sistema pequeño, un error que nadie ve es solo un bug. Pero si otros componentes empiezan a dar por válido ese comportamiento, corregirlo ya no es un cambio aislado: hay que revisar también todo lo que se construyó encima. Si un agente escribió el código y otro lo revisó, pero ningún humano se ocupó de leerlo ni depurarlo, cuando falle va a ser difícil, primero, identificar el error y, segundo, si se llega a identificar, saber por dónde empezar a resolverlo. Un agente puede pasar horas leyendo contexto para lograr identificar qué pasó.

El paper describe esa dinámica para la ciencia: si el output de la IA crece más rápido que nuestra capacidad de absorberlo, la proporción de cosas verificadas que alguien entiende va a bajar. Y cita [*Gradual Disempowerment*](https://arxiv.org/abs/2501.16946) (2025), de Jan Kulveit y colegas, para una idea que me parece la más útil para pensar en una empresa: una sociedad que puede actuar sobre el mundo pero ya no lo entiende no puede reconocer ni corregir sus propios errores, y poco a poco le cede el control a los sistemas de los que depende.

Yo veo un riesgo parecido en una empresa que ya no sabe explicar su propio sistema de producción. La orquestación puede ayudarle a producir más, pero no garantiza que el equipo comprenda lo que sale de ahí y menos aún que tome las decisiones correctas a la hora de escalar o responder a una creciente demanda.

## Lo que todavía no hago bien

Para ser honesto: no reviso todo lo que delego a la IA. Es muy difícil, por el volumen de información y porque la industria nos exige productividad, no entendimiento. Por lo general decido implementar y validar primero que funcione, que es lo que validan los clientes, antes de entenderlo por completo.

Mi herramienta [artifacts-manager](/posts/deja-de-leer-muros-de-texto-llm-por-que-cree-artifacts-manager/) me ayuda a generar artefactos y diagramas que facilitan el entendimiento. Pero esos artefactos y esa documentación también los genera la IA, y son susceptibles a alucinaciones y sesgos.

Con esto en mente, decidí sacrificar un poco de productividad a cambio de revisiones más rigurosas, minuciosas y, sobre todo, escalables. El reto no termina ahí: necesitamos mejores herramientas que nos ayuden a desarrollar nuestro pensamiento crítico. Si la IA siempre nos da las respuestas, ¿cuándo vamos a ejercitar ciertas habilidades críticas?

## Una propuesta atrevida: que la IA nos haga las preguntas

Uno puede marcar algo como "Entendido", en un checklist o en un PR, sin haberlo comprendido del todo. Una casilla no prueba nada, solo registra lo que creo saber.

Por eso pienso que la misma IA debería tener un evaluador de entendimiento humano. Lo que propongo es que, antes de dar por terminada una tarea, la IA genere preguntas sobre lo implementado que tengamos que responder para cerrarla: por ejemplo, por qué se resolvió así, qué supuestos hay o cómo se revierte. Un LLM podría actuar como juez de esas respuestas.

No va a ser perfecto. El juez también es un modelo, con sus propias alucinaciones y sesgos, y responder bien hoy no garantiza poder defender el cambio más adelante. Pero es un filtro más. Podría acercarnos a evaluar una parte de lo que el paper llama "entendido" (poder explicar, defender y cuestionar el cambio) y no quedarnos solo en lo verificado. Los tests comprueban casos de uso, pero las preguntas buscarían indicios de que alguien puede dar razones sobre lo implementado.

Mi apuesta es que responder preguntas sobre el cambio podría meter en el flujo el compromiso cognitivo que, según Shen y Tamkin, conservó el aprendizaje. No obstante, en este punto es todavía una hipótesis inspirada en ese estudio.

Todavía no lo tengo resuelto para mí mismo. Me quedan dudas abiertas: cuántas preguntas son razonables sin convertir el cierre de cada tarea en una carga, qué contexto necesitaría el juez para evaluar las respuestas, cómo evitar que apruebe explicaciones convincentes pero incorrectas, y si conviene aplicarlo a todo o solo a lo que es caro de revertir. Y hay una objeción incómoda: puedo pedirle a otra IA que responda por mí. ¿Cómo distinguir entonces mi criterio de una respuesta generada? Tampoco eso lo tengo resuelto.

## Las dos cosas importan

Volviendo al tema que empezó este debate, la orquestación: no estoy en contra de ella. La uso todos los días y me permite hacer cosas que no podría hacer con un solo agente. Aun así, en mi trabajo, el límite que más me preocupa no es cuántos agentes puedo coordinar, sino cuánto de lo que producen seguimos pudiendo explicar y corregir.

Voy a probar esta propuesta en mi propio flujo. En una segunda entrega contaré cómo me fue al usarla: qué funcionó, qué no y qué cambiaría. También contaré con más detalle las prácticas que ya uso con mi equipo de agentes para dejar rastro de lo que hacen.

Mientras tanto, te dejo la pregunta que me hice al leer el paper: en tu sistema, ¿qué parte está verificada pero nadie entiende? ¿Y qué pasaría si mañana falla?
