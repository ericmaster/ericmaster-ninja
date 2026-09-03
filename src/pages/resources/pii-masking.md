---
layout: ../../layouts/PageLayout.astro
title: "PII Masking Microservice"
slug: "pii-masking"
description: "Zero-Trust Real-Time PII De-Identification & Secret Guard for LLM Pipelines."
tags: ["fastapi", "python", "presidio", "spacy", "zero-trust", "infisical", "privacy", "llm", "lopdp"]
category: "Resources"
---

# PII Masking Microservice

**GitHub:** [https://github.com/Nimblersoft/pii-masking](https://github.com/Nimblersoft/pii-masking)  
**Interactive Slides:** [https://ericmaster.ninja/presentations/pii-masking](/presentations/pii-masking)  
**License:** MIT  

PII Masking is a high-performance, containerized FastAPI microservice designed to intercept and anonymize personally identifiable information (PII) before it is forwarded to Large Language Models (LLMs) or third-party cognitive APIs.

It enforces a strict **Zero-Trust architecture for Artificial Intelligence**: sensitive user data never leaves your infrastructure in plaintext, and external model providers only see salted, deterministic surrogate tokens.

---

## The Core Problem

When organizations integrate LLMs (OpenAI, Anthropic, Gemini, or self-hosted models), every query, transcript, or prompt sent across the wire risks exposing sensitive customer information:
- Full names, email addresses, and phone numbers.
- National ID numbers (e.g., Cédula / DNI / SSN) and tax identifiers.
- Banking details, credit card numbers, and medical context.

Under regulatory frameworks such as Ecuador's **LOPDP (Ley Orgánica de Protección de Datos Personales)** and Europe's **GDPR**, routing personal data through third-party AI logs without strict consent and anonymization introduces catastrophic legal and compliance liabilities.

Furthermore, applications that pass raw database connection strings, credentials, or unprotected API keys within runtime contexts are vulnerable to prompt injection and credential leakage.

---

## Architectural Blueprint

```
                     ┌─────────────────────────────────────────────────────────────┐
                     │              Zero-Trust AI Privacy Perimeter                │
                     │                                                             │
┌──────────────┐     │  ┌──────────────────┐        ┌───────────────────────────┐  │      ┌─────────────────────────┐
│              │     │  │                  │──HTTP─▶│ Presidio Analyzer + spaCy │  │      │                         │
│ Client / App │───▶ │  │  pii-masking     │        │ (Spanish & English NER)   │  │      │ Third-Party or Local    │
│ (Raw prompt) │     │  │  (FastAPI :8090) │◀───────│ Anonymizer Engine         │  │      │ LLM Provider            │
│              │     │  └────────┬─────────┘        └───────────────────────────┘  │      │ (Sees ONLY tokens)      │
└──────────────┘     │           │                                                 │      │                         │
                     │           ▼                                                 │      │ e.g. OpenAI, Anthropic, │
                     │  ┌──────────────────┐                                       │      │ DeepSeek, Ollama, vLLM  │
                     │  │ Salted Token Map │                                       │      │                         │
                     │  │ (SHA-256 Hashed) │                                       │      └────────────┬────────────┘
                     │  └────────┬─────────┘                                       │                   │
                     │           │                                                 │                   │
                     │           ▼                                                 │                   │
                     │  ┌──────────────────┐         Sanitized Prompt              │                   │
                     │  │ Reverse Resolver │───────────────────────────────────────┼──────────────────▶│
                     │  │ (Client Response)│◀──────────────────────────────────────┼───────────────────┘
                     │  └──────────────────┘         Sanitized Response            │
                     │                                                             │
                     │  ┌──────────────────────────────────────────────────────┐   │
                     │  │ Infisical Secret Manager (Zero-Trust Key Injection)  │   │
                     │  └──────────────────────────────────────────────────────┘   │
                     └─────────────────────────────────────────────────────────────┘
```

---

## Key Capabilities

### 1. In-Flight Named Entity Detection (NER)
Powered by [Microsoft Presidio](https://microsoft.github.io/presidio/) coupled with optimized [spaCy](https://spacy.io/) neural network models for both **Spanish (`es_core_news_md`)** and **English (`en_core_web_md`)**. Entities detected out of the box include:
- `PERSON`: Individual names and aliases.
- `EMAIL_ADDRESS`: Public and private email formats.
- `PHONE_NUMBER`: International and regional phone formats with country prefixes.
- `CREDIT_CARD`: Luhn-validated credit card sequences.
- `ID_NUMBERS`: Identification records, tax codes, and passport identifiers.

### 2. Salted, Deterministic Surrogate Tokens
Instead of generic placeholders that strip contextual semantics (such as `[PERSON]`), the engine assigns deterministic, salted hex tokens:
- `John Smith` $\rightarrow$ `[PERSON_3a7f1c08]`
- `john@acme.com` $\rightarrow$ `[EMAIL_4e9b21a0]`

This allows LLMs to retain entity disambiguation and co-reference resolution across long multi-turn conversations without ever knowing the actual identity behind the token.

### 3. Reversible Local Desanonymization
The microservice returns a secure entity mapping dictionary to the authenticated caller. Once the LLM generates its response referencing `[PERSON_3a7f1c08]`, the client application swaps the surrogate token back to `John Smith` seamlessly before presenting the final output to the user.

### 4. Zero-Trust Infrastructure via Infisical
Credential security is as crucial as data privacy. The service integrates with self-hosted **[Infisical](https://infisical.com/)**:
- API tokens, model keys, and master cryptographic salts (`PII_HASH_SALT`) are injected directly into container memory via Universal Auth.
- Eliminates unencrypted `.env` files and prevents API secret leakage during automated agent runs and CI/CD pipelines.
- Granular audit logs track every microservice invocation and secret access event.

---

## API Contract

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| `GET` | `/health` | None | Service liveness probe & supported languages |
| `POST` | `/mask` | `X-API-Key` | Detect, mask, and tokenize PII in arbitrary text |
| `POST` | `/tokens` | `X-Master-Key` | Mint a new scoped API token |
| `GET` | `/tokens` | `X-Master-Key` | List active token metadata |
| `DELETE` | `/tokens/{id}` | `X-Master-Key` | Immediately revoke an API token |

### Example Request

```bash
curl -s -X POST http://localhost:8090/mask \
  -H "Content-Type: application/json" \
  -H "X-API-Key: pii_live_secret_token" \
  -d '{
    "text": "Hola, mi nombre es Juan Pérez de Corporación Favorita en Quito. Mi correo es juan.perez@favorita.ec y mi cédula es 1718293847.",
    "language": "es",
    "return_entities": true
  }'
```

### Example Response

```json
{
  "text": "Hola, mi nombre es [PERSON_4b9a1e02] de [ORG_7f21a89c] en Quito. Mi correo es [EMAIL_91c0e3a4] y mi cédula es [ID_NUM_33e14a80].",
  "entities": [
    { "start": 19, "end": 29, "entity_type": "PERSON", "text": "Juan Pérez", "token": "[PERSON_4b9a1e02]" },
    { "start": 33, "end": 53, "entity_type": "ORGANIZATION", "text": "Corporación Favorita", "token": "[ORG_7f21a89c]" },
    { "start": 78, "end": 100, "entity_type": "EMAIL_ADDRESS", "text": "juan.perez@favorita.ec", "token": "[EMAIL_91c0e3a4]" },
    { "start": 117, "end": 127, "entity_type": "ID_NUMBER", "text": "1718293847", "token": "[ID_NUM_33e14a80]" }
  ]
}
```

---

## Quick Start (Docker)

```bash
git clone https://github.com/Nimblersoft/pii-masking.git
cd pii-masking

# Copy environment template
cp .env.example .env

# Launch the microservice
docker compose up -d --build

# Verify health status
curl http://localhost:8090/health
```

---

## Presentation & Conference Talk

This project was selected for presentation at **Software Freedom Day Quito 2026** (Universidad UTE / Fundación OpenLab Ecuador):
- **Talk Title:** *Zero-Trust para IA: Protegiendo Datos Personales (PII) y Secretos de Infraestructura en Pipelines de LLMs con Software Libre*
- **Speaker:** Eric Aguayo (Nimblersoft)
- **Interactive Deck:** Access the full 3D impress.js slide deck at [/presentations/pii-masking](/presentations/pii-masking).
