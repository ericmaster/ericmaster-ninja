---
layout: ../../layouts/MarkdownPostLayout.astro
title: The Expensive Part of an Agent Isn't Tokens, It's Attention
slug: the-expensive-part-of-an-agent-is-attention
description: 'An agent can cost pennies in model usage and still eat up your week. In my workflow, the expensive part is the attention it demands: steering, plan review, fixing drift. Here is how I try to cut that down before the agent writes the first line.'
pubDate: 2026-10-22T15:00:00.000Z
lang: en
published: true
tags:
  - AI Agents
  - Arquitectura
  - Planning
  - Testing
image:
  url: /assets/images/lo-caro-de-un-agente-es-la-atencion.png
  alt: 'Comparative illustration: on the left, an engineer correcting an agent that drifted from a giant plan; on the right, short plans in vertical slices validated by tests that the agent completes on its own'
---

<p>USD 1.61. That is what <a href="https://pioneeraidata.com/blog/ai-maintenance-cost-small-business" target="_blank" rel="noopener noreferrer">Pioneer AI &amp; Data</a> logged in model spend over two months for two scheduled agents classifying email, across 508 runs. Six of those runs did not record cost, so the real figure is only slightly higher. Over the same period, their total inventory of agents and services to keep running grew from 13 to 50. The author notes he did not track his own hours closely enough to publish a number.</p>
<p>Another agency, <a href="https://oasecreative.nl/en/knowledge-base/what-an-agent-system-costs-to-maintain" target="_blank" rel="noopener noreferrer">Oase Creative</a>, tracked 134 days of scheduled runs of their agent system. They recorded some failure on 72 of 133 evaluable days, or 54%. That is an indicator of operational load, even though it does not directly measure interventions or human hours. They sum it up themselves: the bill arrives in attention, not in euros.</p>
<p>In my workflow, attention is the cost I care most about cutting: every time I have to watch, review, correct, or redirect an agent.</p>
<p>Those cases describe operational maintenance. Here I focus on another drain on attention: steering agents during development and correcting scope drift. I use three terms consistently: <em>steering</em> is redirecting the agent while it works; <em>drift</em> is the gap between what it implements and what I wanted; <em>outcome</em> is the verifiable result I am after, rather than the solution I have in mind.</p>
<h2 id="governance-vs-autonomy">Governance vs. autonomy</h2>
<p>On one hand we want governance. We want to stay in control, so we add guardrails, reviews, hooks. On the other hand we want autonomy: having the agent finish the job without supervision.</p>
<p>At first those two goals look contradictory. Not every control costs the same, though. When every check ends in a human approval, interruptions pile up. Automated checks, like tests, acceptance criteria, or a Definition of Done (DoD) verified by another agent, can reduce them, although they need maintenance too.</p>
<p>I ran into this on my first attempt at building my own orchestrator harness. I wanted an autonomous yet safe flow, so I put guardrails in place:</p>
<ul>
<li>Block any task where the agent was unsure.</li>
<li>Block tasks that needed credentials.</li>
<li>Ask for confirmation before deploying to production.</li>
<li>Classify my request to decide whether it could run directly or needed a plan or design.</li>
</ul>
<p>During implementation I had to step in and steer: the agent expanded scope with things I had not considered, without checking with me. Once I started using it, inconsistencies surfaced between agents. One agent approved a task for execution, and the implementing agent decided it was not ready, blocked it, and sent it back to review. I was spending more time fixing my orchestrator harness than shipping code.</p>
<p>Adding another reviewer did not fix that discrepancy. The issue was that each agent applied its own criteria. What I needed was a shared rule: the same acceptance criteria decide when a task runs, when it stops, and when it escalates. If the agents still cannot agree, I decide the best approach based on my experience.</p>
<h2 id="why-steering-is-expensive">Why steering is expensive</h2>
<p>Steering usually arrives late. The agent has already built the feature and there is drift from the original idea. Now it has to be corrected, and the agent does not only need to grasp the new context: it also has to understand what is already implemented, figure out how to fix it safely, and iterate further. Every round asks for more attention.</p>
<p>Planning agents or planning modes are the usual way to keep implementation aligned with intent. Agents can hallucinate, though, and reviewing a plan can demand heavy attention before you can run it safely and avoid drift.</p>
<p>And it does not stop there. Once the plan is implemented, you have to verify that the result lines up with it. To do that, I first need to understand the plan and the specs that were generated.</p>
<blockquote>
<p>⚠️ <strong>Gotcha</strong>: a long plan does not eliminate attention, it moves it. If I do not understand the plan, I cannot validate the implementation against it.</p>
</blockquote>
<p>A concrete example: I needed a simple interface to edit a system’s markdown context files. What I had in mind was a separate app to edit the <code>.md</code> files. It turned into a migration of the system to embed an editor inside it. I had not been explicit that the tool had to be standalone, nor had I checked with the agent that we were on the same page. The plan resolved that ambiguity on its own.</p>
<h2 id="how-i-make-sure-the-plan-is-well-defined-before-running-it">How I make sure the plan is well defined before running it</h2>
<p>The real question is how we make sure plans are well defined and aligned with the result we want to build. These are the strategies I am using and testing before and during plan creation.</p>
<h3 id="1-adversarial-review-ideally-with-another-provider-and-model">1. Adversarial review, ideally with another provider and model</h3>
<p>Before a single line of code is written, I hand the plan (not the code) to another agent with an explicit mandate to find holes in it. I test with another model, often from a different provider, to look for different blind spots. In my experience, that helps catch gaps the original agent missed, though switching providers does not guarantee a better review: I evaluate what extra errors it finds and how it justifies them.</p>
<p>For example, you can use an OpenAI model to generate the plan, Claude Opus to review it, and Grok to implement it, or whatever combination works best for your workflow.</p>
<p>For this I use <a href="https://github.com/ericmaster/agent-fabric" target="_blank" rel="noopener noreferrer">agent-fabric</a>, a CLI that installs the same portable agents across OpenCode, Kilo, Codex, Claude Code, and other tools, with each provider’s model configured per adapter, so I can assign a different provider to the planner role and the reviewer role.</p>
<h3 id="2-simple-plans-scoped-to-a-valuable-outcome">2. Simple plans, scoped to a valuable outcome</h3>
<p>In my experience, plans that lock onto a solution too early tend to grow. Short plans with a verifiable outcome and explicit scope boundaries work better for me. With AI we iterate much faster, so it pays to plan lightly and iterate on the outcome.</p>
<p>The common mistake is planning from the solution we picture in our heads instead of from the outcome. The agent finds gaps and hypothetical scenarios, adds features we never asked for, and we end up with huge plans that eat up review time.</p>
<h3 id="3-use-cases-translated-into-test-cases">3. Use cases translated into test cases</h3>
<p>Test cases turn part of the spec into verifiable conditions. Another agent can check them and cut down my routine review; you still have to verify that they actually represent the outcome and its constraints.</p>
<p>For instance, in an authentication system, a use case might be: an anonymous user visits the site and must authenticate before using a service. From that come test cases like these:</p>
<ul>
<li>Given a request without a valid session, when it calls the protected service directly, then it is rejected and returns no protected data.</li>
<li>Given an email with an invalid format, when I request a code, then the system rejects the request and sends no OTP code.</li>
<li>Given a valid email for a registered user, when I request a code, then the system sends an OTP code to that email.</li>
<li>Given a valid email that is not registered, when I request a code, then no code is sent, no session is created, and the public response is the same as for a registered user: “If the email is registered, you will receive a code.” Both cases return the same HTTP status, with no exploitable timing differences, so accounts cannot be enumerated. Sending the code is verified internally.</li>
<li>Given a valid, unused code issued for that account, when I enter it, then a session is created for that account and the code is marked as consumed.</li>
<li>Given an incorrect, expired, or already used code, when I enter it, then no session is created and the response is “Invalid or expired code.”</li>
<li>Given the attempt limit has been exceeded, when I enter another code, then it is rejected even if it is correct.</li>
<li>Given a valid session created after verifying the code, when I call the protected service, then I can use the service I am authorized for.</li>
</ul>
<p>This example is not a complete authentication guide: it leaves out other controls and tests.</p>
<h3 id="4-phases-as-vertical-slices-not-modules">4. Phases as vertical slices, not modules</h3>
<p>I split phases into vertical slices instead of horizontal modules or layers. Each slice delivers end-to-end observable behavior on top of a shared base, has a clear Definition of Done, and can be delegated. I make its dependencies explicit and check that it does not introduce regressions. If a slice goes off track, drift is easier to spot and roll back, though it is not isolated if it shares session state, a database, or contracts with other parts.</p>
<p>In the example, the first slice is “registered user logs in and accesses the service.” Validating the email, sending the code, and verifying it are not slices: they are tasks inside that flow.</p>
<h3 id="5-visualizing-the-flow-and-architecture">5. Visualizing the flow and architecture</h3>
<p>A diagram lets me check dependencies and scope faster than prose; I compare it against the acceptance criteria. I use visualization tools, such as my <a href="https://artifacts-manager.ericmaster.ninja">artifacts-manager</a>, to inspect the flow, architecture topology, and components before approving.</p>
<p>In this diagram, the arrows between tasks indicate implementation dependencies: a task builds on what the previous one produced.</p>
<pre><code class="language-mermaid">flowchart TD
  outcome["Outcome: registered user logs in and accesses the service"] --&gt; plan["Plan reviewed by another model"]
  plan --&gt; s1["Task 1: validate email"]
  s1 --&gt;|depends on| s2["Task 2: send OTP code"]
  s2 --&gt;|depends on| s3["Task 3: verify code, create session, and protect the service"]
  s1 --&gt; a1(["Agent A"])
  s2 --&gt; a2(["Agent B"])
  s3 --&gt; a3(["Agent C"])
  a1 --&gt; t1["Task 1 tests"]
  a2 --&gt; t2["Task 2 tests"]
  a3 --&gt; t3["Task 3 tests"]
  t1 --&gt; e2e["Integration &amp; E2E"]
  t2 --&gt; e2e
  t3 --&gt; e2e
  e2e --&gt; gate{"Criteria &amp; DoD pass?"}
  gate --&gt;|Yes| done["Validated outcome"]
  gate --&gt;|No| fix["Fix the failing task"]
  fix --&gt; e2e
  classDef default fill:#0d152c,stroke:#252f55,stroke-width:1px,color:#f0f4ff;
  classDef selected fill:#2e1065,stroke:#c084fc,stroke-width:2px,color:#fff;
  class outcome,done selected;
</code></pre>
<h2 id="tradeoffs">Tradeoffs</h2>
<p>None of this is free:</p>
<ul>
<li>This workflow also consumes attention when writing criteria, resolving discrepancies, and maintaining checks. Whether it pays off depends on that effort being smaller than the rework it prevents. I do not have data proving that yet, which is why I am sharing it as a practice I am using and evaluating.</li>
<li>Adversarial review with another model adds token cost and latency. In my case I accept that, because attention costs me more than tokens.</li>
<li>Short plans mean more cycles. If the outcome is unclear, iterating fast just produces drift faster.</li>
<li>Test cases only protect what they cover. If the plan, implementation, and tests share the same wrong assumption, they can all agree cleanly and still be wrong.</li>
<li>Vertical slices cost more upfront when the base of the system does not exist yet.</li>
</ul>
<h2 id="next-step">Next step</h2>
<p>If you are spending more time correcting agents today than reviewing results, try this on your next feature:</p>
<ol>
<li>Write the outcome in one sentence.</li>
<li>Translate it into 3 to 5 test cases.</li>
<li>Ask for the plan and run it past a reviewer using another model.</li>
<li>Cut it into vertical slices with a DoD.</li>
<li>Inspect it visually before approving.</li>
</ol>
<p>The question I still have not settled: how much governance can I move into automated checks before those checks turn into one more thing I have to maintain? Oase classified almost a third of its failed runs (76 out of 241) as deliberate rejections by its own quality gate, and describes that as the gate working as intended. It helps to separate those expected blocks from false positives and from failures in the check itself. I am curious how you are handling that.</p>
