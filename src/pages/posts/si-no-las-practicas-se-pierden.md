---
layout: ../../layouts/MarkdownPostLayout.astro
title: "Si no las practicas, se pierden: lo que el Urku Trail me recordó sobre la IA"
published: true
tags:
  - Trail Running
  - IA
  - Criterio
  - Práctica
slug: si-no-las-practicas-se-pierden
pubDate: 2026-11-10T11:00:00.000-05:00
lang: es
image:
  url: assets/images/si-no-las-practicas-se-pierden.png
  alt: "Ilustración comparativa: a la izquierda, un corredor de trail sube un páramo empinado; a la derecha, un ingeniero revisa con criterio el plan de un agente de IA en lugar de aceptarlo de un vistazo"
description: "Corrí el 10K de Urku Runas Trail en La Rinconada: 10 km, unos 1.000 m de desnivel, en unas dos horas, sin estar en mi mejor forma. El empedrado recuerda que las bases —los tobillos, y también el criterio— hay que seguir entrenándolas. Lo mismo ocurre si le dejamos demasiada carga cognitiva a la IA."
---

Es ilógico que no haya escrito antes sobre trail. Es un deporte que es parte de mi vida. Terminé el [UTMB](https://utmb.world/) en 2024, he seguido activo, y sin embargo en este blog casi no aparece.

Este domingo corrí el [10K Mulugacho](https://urkurunastrail.com/detalle_carrera.php?evento=10k) de la séptima edición de [Urku Runas Trail](https://urkurunastrail.com/), en La Rinconada, Angochagua. Según la ficha oficial, son 10 km, 1.037 m de desnivel positivo y un techo a 3.663 msnm, con salida el 8 de noviembre de 2026 a las 08:00. Lo terminé en unas dos horas. No tengo el tiempo exacto, y no es un registro del que me sienta orgulloso; lo dejo solo como referencia.

La organización de Urku Runas Trail estuvo excelente. Gracias a quienes hacen posible esa carrera en La Rinconada.

Mi hija, [Melissa Aguayo](https://meliruns.com), terminó primera en la categoría Juvenil y entre las cinco primeras de la general. En [meliruns.com](https://meliruns.com) cuenta su camino en el trail, desde los Andes ecuatorianos, con la vista puesta en el Campeonato Nacional y el Mundial WMTRC 2027.

No es una carrera larga, ni de las más exigentes que he hecho. Tampoco estoy en la condición que tenía cuando terminé el UTMB. Aun así, la ruta es exigente: más de 100 metros de desnivel por kilómetro, a más de 3.600 m, clasificada como *Fuerte* por la organización, con un tiempo de cierre de 4 horas. Una ruta así, de vez en cuando, te recuerda una cosa simple: si no pones en práctica las habilidades que tardaste años en construir, las puedes perder.

Lo mismo ocurre si le delegamos demasiada carga cognitiva a la IA.

## Lo que se oxida no es la idea de correr

No se me olvidó qué es el trail, ni cómo se corre una carrera de montaña. Lo que se nota, cuando no estás en tu mejor forma, es otra cosa: el ritmo en la vertical, la respiración a esa altura, cuándo caminar y cuándo empujar, cómo bajar sin pelearte con el terreno. Eso no se conserva leyendo perfiles ni recordando el UTMB. Se conserva usándolo.

La irregularidad del terreno y el empedrado recuerdan algo todavía más básico: las bases también hay que tenerlas fuertes y entrenadas. En el trail, esas bases son los tobillos. Varios corredores terminaron con esguince de tobillo.

Por eso no hace falta una ultradistancia para enterarte. Un 10K con 1.000 m de desnivel, en un día en el que no llegas sobrado, alcanza. Te devuelve una señal clara: esas habilidades siguen ahí, pero más opacas, más lentas, más caras de recuperar sobre la marcha. Lo mismo vale para las bases: si dejas de entrenarlas, el empedrado te lo cobra.

## El paralelo con la IA, sin dramatizar

En mi trabajo diario diseño y dirijo sistemas con agentes. Los uso todo el tiempo. Me ahorran horas de ejecución. El riesgo no es usarlos. El riesgo es dejar de hacer yo las partes que mantienen el criterio: definir el resultado que busco, leer un plan con desconfianza, seguir un fallo hasta la causa, decidir qué no construir.

Eso no es una metáfora suelta. En una [encuesta de CHI 2025](https://doi.org/10.1145/3706598.3713778), Hao-Ping Lee y colegas de Carnegie Mellon y Microsoft Research preguntaron a 319 trabajadores del conocimiento, a partir de 936 ejemplos reales de uso de IA generativa, cómo percibían el pensamiento crítico cuando trabajaban con estos sistemas. Una mayor confianza en el modelo se asoció con menos pensamiento crítico; una mayor confianza en la propia habilidad, con más. El esfuerzo se desplaza: de reunir información a verificarla, de resolver el problema a integrar la respuesta del modelo, de ejecutar la tarea a supervisarla. Los autores advierten que eso puede reducir el compromiso crítico y, a largo plazo, la habilidad de resolver problemas por cuenta propia.

Es una encuesta de autopercepción, no un estudio longitudinal que mida atrofia. No pretendo que demuestre más de lo que demuestra. Aun así, describe bien lo que siento cuando dejo que el agente cargue con el juicio y yo solo asiento.

En el trail no dejo el reloj en casa. Me sirve. Pero si el reloj se queda sin batería, todavía tengo que saber bajar. Con la IA me pasa igual: quiero que cargue con ejecución, no con el criterio que yo dejo de entrenar. Ese criterio también tiene bases. Si dejas de entrenarlas —leer un plan con desconfianza, seguir un fallo, decidir qué no construir— se debilitan igual que un tobillo que ya no está acostumbrado al empedrado.

## Cómo lo estoy practicando

No tengo una receta, y no voy a dejar de usar agentes. Estas son las repeticiones que me estoy exigiendo para no oxidarme:

1. **Escribo el outcome en una frase antes de pedirle un plan al agente.** Si no puedo, todavía no debo delegar. La frase es mía; el plan viene después.
2. **Reviso el plan como revisaría el de un colega.** Qué asume, qué falta, qué no pedí. Aceptar la primera versión es el equivalente a creerte en forma porque alguna vez terminaste una carrera larga.
3. **De vez en cuando sigo un fallo sin pegar el error en el chat.** No por romanticismo, ni en cada ticket. Lo hago lo bastante seguido como para no perder la mano de leer un stack trace, un log o un diff y formarme una hipótesis.
4. **Me quedo con las decisiones de alcance.** Qué no vamos a construir, dónde está el límite, cuál es el resultado verificable. Esa es la parte que más se parece a decidir cuándo caminar en una vertical: si la dejas siempre en manos de otro, un día no sabes hacerlo.

Nada de esto pide abandonar la herramienta. Pide no confundir velocidad de ejecución con forma.

## Seguir usándolo

No necesito volver al UTMB esta temporada para no olvidar cómo correr en montaña. Necesito, de vez en cuando, una ruta que me exija lo que ya sé y que se oxida si no lo uso. El 10K de La Rinconada no era la carrera más dura de mi calendario. Era, justo por eso, un buen recordatorio.

Con la IA me pasa igual. El modelo puede cargar con mucha de la ejecución, pero el criterio sigue siendo mío. Y el criterio también se entrena.

La pregunta que me queda, y que te dejo: ¿dónde notas primero que se te está oxidando la mano, en la montaña o frente a la pantalla?
