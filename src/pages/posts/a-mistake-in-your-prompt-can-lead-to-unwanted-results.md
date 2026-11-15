---
layout: ../../layouts/MarkdownPostLayout.astro
title: A Mistake in Your Prompt Can Lead to Unwanted Results
slug: a-mistake-in-your-prompt-can-lead-to-unwanted-results
description: A mistake in a prompt can produce a coherent yet unwanted result. A reflection on natural language, programming, and the need to validate intent.
pubDate: 2026-11-06T10:26:41.000Z
lang: en
published: true
tags:
  - Artificial Intelligence
  - Software Architecture
  - AI Agents
  - Prompt Engineering
image:
  url: /assets/images/un-error-en-tu-prompt-corazon-coraza.jpg
  alt: Comic where an AI interprets 'coraza de amor' (armor of love) instead of 'corazón de amor' (heart of love) and generates a teddy bear in medieval armor with weapons.
---

<p><em>Human language lets us express almost any intent. That does not mean a machine is going to interpret it the way we expect.</em></p>
<p>You ask for a teddy bear with a big <strong>heart</strong> of love (<em>corazón</em> in Spanish). One typo turns <em>corazón</em> into <em>coraza</em> (armor), and you get a plush bear in medieval armor, spikes, and a warhammer.</p>
<p>The comic is absurd. The problem it illustrates, less so.</p>
<p><a href="/assets/images/un-error-en-tu-prompt-corazon-coraza.jpg"><img src="/assets/images/un-error-en-tu-prompt-corazon-coraza.jpg" alt="Comic where an AI interprets 'coraza de amor' (armor of love) instead of 'corazón de amor' (heart of love) and generates a teddy bear in medieval armor with weapons."></a></p>
<p><em><a href="/assets/images/un-error-en-tu-prompt-corazon-coraza.jpg">Open the full comic</a>.</em></p>
<p>Between what we mean, what we write, and what a system executes sits a gap. Natural language lets us cross it with striking ease, yet it can also hide how much was left up to interpretation.</p>
<h2 id="talking-gives-us-freedom-programming-forces-precision">Talking gives us freedom. Programming forces precision.</h2>
<p>When we talk to another person, we leave a lot unsaid. We share context, speak in approximations, and expect the other person to fill in the blanks.</p>
<p>“Have it ready for tomorrow” can be plenty of instruction between two people who know the work. Outside that context, it leaves basic questions open: what does ready mean, by what time, by what criteria?</p>
<p>With AI we do something similar. We state an intent and expect the model to turn it into a result.</p>
<p>Programming languages and declarative languages demand a different discipline. We have to represent what we want inside an explicit vocabulary, structure, and set of rules. That constraint feels uncomfortable, and it is also useful.</p>
<p>A compiler can reject a malformed instruction. A type system can block an incompatible operation. A schema can catch an unknown field or a value outside the allowed options. <strong>They do not know what I meant to do, yet they can detect that what I wrote breaks certain rules.</strong></p>
<h2 id="sometimes-an-error-is-a-good-answer">Sometimes an error is a good answer</h2>
<p>One of the things we value most in language models is their ability to work with imperfect input. They understand incomplete sentences, tolerate typos, and produce answers even when details are missing. For exploring ideas, that is an advantage; for executing actions with consequences, it can become a risk.</p>
<p>In the comic, the odd request does not stop the robot. It interprets it, fills in the details, and produces something consistent with that reading. It even adds weapons nobody asked for. The user discovers the misunderstanding once the result is already sitting in front of them. A reply like “did you mean <em>corazón</em> (heart) or <em>coraza</em> (armor)?” would have been less dramatic, and far more useful.</p>
<p><strong>The problem is not always that the system fails. Sometimes it is that it keeps going when it should stop.</strong></p>
<h2 id="compiling-does-not-mean-it-is-right">Compiling does not mean it is right</h2>
<p>We should not romanticize code either. A program can compile cleanly and run the wrong logic. A SQL query can be valid and modify the wrong rows. A configuration can pass its schema and point at the wrong environment. Formal languages do not guarantee that intent, logic, and outcome match.</p>
<p>What they give us are mechanisms to check parts of that relationship: syntax, types, constraints, preconditions, and tests. If we express a condition and build a proper check, we can reject whatever fails it. The error shows up when a rule the system can verify is violated. <strong>If we never state the rule, we cannot assume anyone is checking it.</strong> The same happens with prompts, just with a much wider surface for interpretation.</p>
<h2 id="stating-intent-should-not-be-the-last-step">Stating intent should not be the last step</h2>
<p>Consider this instruction:</p>
<blockquote>
<p>Clean up the old customer records.</p>
</blockquote>
<p>Does “clean up” mean fixing data, archiving it, or deleting it? Old according to which date? Does it include active customers? Can it be undone?</p>
<p>A model could propose a reasonable interpretation. That does not make it the right one.</p>
<p>For a task like that, I prefer separating the process:</p>
<ol>
<li><strong>State the intent</strong> in human language.</li>
<li><strong>Resolve the ambiguities</strong> that change the scope.</li>
<li><strong>Turn the interpretation into explicit rules:</strong> which records, which operation, and which exclusions.</li>
<li><strong>Inspect a preview</strong> before modifying any data.</li>
<li><strong>Verify the result</strong> against those rules.</li>
</ol>
<p>Natural language works well for talking through what we want. Verifiable constraints work well for limiting what the system is allowed to do.</p>
<p>You do not have to give up one to benefit from the other.</p>
<h2 id="a-prompt-does-not-replace-a-contract">A prompt does not replace a contract</h2>
<p>I am interested in building software by stating intents instead of writing every instruction by hand. Still, making it easier to express an intent does not remove the work of checking it.</p>
<p>A longer prompt does not automatically solve the problem either. You can write several pages and still leave the verb that authorizes an irreversible action ambiguous.</p>
<p>When the result matters, we need more than a convincing reply: boundaries, validations, and conditions that force the system to stop.</p>
<p>Check the words in your next prompt. Then check what would happen if the system read them a different way.</p>
<p><strong>When ordering a plush toy, an unexpected suit of armor can make a good joke. When operating a system, I would rather get an error back than get a “done” on something I never meant to do.</strong></p>
