export interface ProjectItem {
  id: string;
  title: string;
  tagline: {
    en: string;
    es: string;
  };
  description: {
    en: string;
    es: string;
  };
  benefits: {
    en: string[];
    es: string[];
  };
  stack: string[];
  image: string;
  imageAlt: {
    en: string;
    es: string;
  };
  landingUrl: string;
  repoUrl?: string;
  liveUrl?: string;
  badge?: {
    en: string;
    es: string;
  };
}

export interface CheatsheetItem {
  id: string;
  title: string;
  description: {
    en: string;
    es: string;
  };
  type: "interactive" | "guide" | "repo";
  typeLabel: {
    en: string;
    es: string;
  };
  tags: string[];
  url: string;
  external?: boolean;
}

export const projectsData: ProjectItem[] = [
  {
    id: "pii-masking",
    title: "PII Masking Microservice",
    tagline: {
      en: "Zero-Trust Real-Time PII De-Identification & Secret Guard for LLM Pipelines",
      es: "Desidentificación de PII en tiempo real y protección Zero-Trust para LLMs",
    },
    description: {
      en: "A high-performance FastAPI microservice powered by Microsoft Presidio, spaCy (English & Spanish), and Infisical secret management. Detects, tokenizes with salted hashes, and reversibly restores PII before external model inference, ensuring strict regulatory compliance (LOPDP/GDPR).",
      es: "Microservicio FastAPI de alto rendimiento con Microsoft Presidio, spaCy (español e inglés) y gestión de secretos con Infisical. Detecta, tokeniza con hashes salteados y restaura reversiblemente PII antes de la inferencia con LLMs, garantizando cumplimiento de la LOPDP y GDPR.",
    },
    benefits: {
      en: [
        "In-flight PII masking: names, emails, phone numbers, tax IDs, and credit cards replaced by salted tokens",
        "Deterministic, reversible tokenization maps original entities safely on client returns",
        "Integrated Infisical zero-trust secret management: runtime in-memory credential injection with no plaintext keys",
        "Multi-language support with specialized spaCy pipeline for Spanish and English",
        "Single-container deployment with warm-start models for sub-millisecond local inference",
      ],
      es: [
        "Enmascaramiento de PII en tránsito: nombres, correos, teléfonos, cédulas y tarjetas reemplazados por tokens salteados",
        "Tokenización determinista y reversible que mapea las entidades originales de forma segura en las respuestas",
        "Gestión Zero-Trust de secretos con Infisical: inyección de credenciales en memoria sin llaves en texto plano",
        "Soporte multilingüe con modelos optimizados de spaCy para español e inglés",
        "Despliegue contenerizado en un solo contenedor con modelos en warm-start para baja latencia",
      ],
    },
    stack: ["FastAPI", "Python", "Microsoft Presidio", "spaCy", "Docker", "Infisical", "Zero-Trust"],
    image: "/assets/images/pii-masking-zero-trust.jpg",
    imageAlt: {
      en: "PII Masking zero-trust cryptographic shield intercepting sensitive data before AI neural core",
      es: "Escudo criptográfico Zero-Trust de PII Masking interceptando datos sensibles antes del modelo de IA",
    },
    landingUrl: "/resources/pii-masking",
    repoUrl: "https://github.com/Nimblersoft/pii-masking",
    liveUrl: "/presentations/pii-masking",
    badge: {
      en: "Privacy & Security",
      es: "Privacidad y Seguridad",
    },
  },
  {
    id: "agent-fabric",
    title: "Agent Fabric",
    tagline: {
      en: "Multi-Harness Portable Agent System & Adapter CLI",
      es: "Sistema de agentes portátiles multi-harness y CLI adaptadora",
    },
    description: {
      en: "Canonical Markdown-defined agent roles compiled deterministically into native configurations and prompt files for OpenCode, Kilo, Antigravity CLI, Codex, and Claude Code.",
      es: "Roles de agentes canónicos definidos en Markdown y compilados determinísticamente en configuraciones nativas y prompts para OpenCode, Kilo, Antigravity CLI, Codex y Claude Code.",
    },
    benefits: {
      en: [
        "Single source of truth: author once in Markdown, run across all top AI coding harnesses",
        "Deterministic compiler with zero vendor lock-in",
        "Atomic SHA-256 state tracking (`.agent-fabric-manifest.json`) prevents overwriting customizations",
        "Six portable lifecycle hooks (`load-task`, `pre-plan`, `classify`, `label`, `decompose`, `post-plan`)",
        "Integrated catalog client (`agf hub install`) to discover and sync custom agents",
      ],
      es: [
        "Fuente única de verdad: redacta una vez en Markdown, ejecuta en los mejores harnesses de IA",
        "Compilador determinista sin bloqueo de proveedor ni dependencias propietarias",
        "Seguimiento atómico de estado con SHA-256 para proteger ediciones locales",
        "Seis hooks portátiles de ciclo de vida (`load-task`, `pre-plan`, `classify`, `label`, `decompose`, `post-plan`)",
        "Cliente de catálogo integrado (`agf hub install`) para descubrir y sincronizar agentes",
      ],
    },
    stack: ["Go", "CLI", "Shell", "Multi-Harness", "Markdown Schema"],
    image: "/assets/images/overlord-mas.png",
    imageAlt: {
      en: "Agent Fabric multi-harness architecture visualization",
      es: "Visualización de la arquitectura multi-harness de Agent Fabric",
    },
    landingUrl: "https://agent-fabric.ericmaster.ninja/",
    repoUrl: "https://github.com/ericmaster/agent-fabric",
    badge: {
      en: "Core Framework",
      es: "Framework Principal",
    },
  },
  {
    id: "agent-hub",
    title: "Agent Hub",
    tagline: {
      en: "Public Catalog & Distribution Hub for Portable Agents",
      es: "Catálogo público y distribución para agentes portátiles",
    },
    description: {
      en: "The community catalog and distribution repository for portable custom agents that extend Agent Fabric with specialized capabilities.",
      es: "El catálogo comunitario y repositorio de distribución para agentes portátiles personalizados que amplían Agent Fabric con capacidades avanzadas.",
    },
    benefits: {
      en: [
        "Discover & install battle-tested agents (e.g., `mr-meeseeks`, `simplification-planner`)",
        "Automated dependency graph validation prior to installation to prevent broken states",
        "Canonical Schema v1 contract with portable capability policies",
        "Decoupled architecture: credentials and provider keys remain private and host-owned",
      ],
      es: [
        "Descubre e instala agentes probados en producción (ej. `mr-meeseeks`, `simplification-planner`)",
        "Validación automática del grafo de dependencias antes de la instalación",
        "Contrato canónico Schema v1 con políticas de capacidad portátiles",
        "Arquitectura desacoplada: credenciales y claves de proveedor se mantienen seguras y privadas",
      ],
    },
    stack: ["Agent Fabric", "Git / Tarballs", "Catalog Hub", "Markdown Schema"],
    image: "/assets/images/from-prompting-pixels-to-coding-images.jpg",
    imageAlt: {
      en: "Agent Hub distribution network visual",
      es: "Visual de la red de distribución de Agent Hub",
    },
    landingUrl: "/resources/agent-hub",
    repoUrl: "https://github.com/ericmaster/agent-hub",
    badge: {
      en: "Ecosystem",
      es: "Ecosistema",
    },
  },
  {
    id: "artifacts-manager",
    title: "Artifacts Manager",
    tagline: {
      en: "Multi-Project Visualizer & Delivery Hub for Agent Artifacts",
      es: "Visualizador multi-proyecto y hub de artefactos de IA",
    },
    description: {
      en: "Interactive management hub and sandbox viewer for HTML mockups, SVGs, prototypes, and Markdown artifacts generated by AI coding agents across local workspaces.",
      es: "Hub de gestión y visualizador aislado para mockups HTML, SVGs, prototipos y artefactos Markdown generados por agentes de IA en tus espacios de trabajo.",
    },
    benefits: {
      en: [
        "Centralized project registry with automatic workspace and manifest scanning",
        "Secure sandboxed iframe rendering for live interactive apps, charts, and prototypes",
        "Fast command-line interface (`artman`) to register repos and query artifacts",
        "Seamless integration with the `with-artifact` agent skill for effortless authoring",
        "Styled with the sleek Nimblersoft Dark design token theme",
      ],
      es: [
        "Registro centralizado multi-proyecto con escaneo automático de directorios de trabajo",
        "Renderizado seguro en iframes aislados para apps interactivas, gráficos y prototipos",
        "Interfaz CLI veloz (`artman`) para registrar repositorios y consultar entregables",
        "Integración directa con el skill `with-artifact` para creación fluida por agentes",
        "Diseñado con los tokens de estilo Nimblersoft Dark",
      ],
    },
    stack: ["SvelteKit 5", "Svelte 5", "Node.js", "Tailwind CSS", "Sandboxed IFrames"],
    image: "/assets/images/stop-reading-llm-text-why-i-built-artifacts-manager.jpg",
    imageAlt: {
      en: "Artifacts Manager interactive sandbox dashboard",
      es: "Panel interactivo de Artifacts Manager",
    },
    landingUrl: "https://artifacts-manager.ericmaster.ninja/",
    repoUrl: "https://github.com/ericmaster/artifacts-manager",
    badge: {
      en: "Visual Tool",
      es: "Herramienta Visual",
    },
  },
  {
    id: "quiz-generator",
    title: "Quiz Generator",
    tagline: {
      en: "AI-Powered Document-to-Quiz Engine with RAG",
      es: "Generador de cuestionarios con IA vía RAG en Cloudflare",
    },
    description: {
      en: "Upload PDFs or text files to instantly generate grounded multiple-choice quizzes, powered by hybrid semantic + full-text search on Cloudflare Workers edge.",
      es: "Sube PDFs o archivos de texto para generar de inmediato cuestionarios de opción múltiple con búsqueda híbrida semántica y de texto completo en Cloudflare Workers.",
    },
    benefits: {
      en: [
        "Instant document ingestion with background chunking and vector embeddings (`@cf/baai/bge-m3`)",
        "Hybrid search fusing Cloudflare Vectorize (semantic ANN) and D1 (FTS5 keyword) via RRF",
        "OpenRouter multi-model integration for high-fidelity grounded question generation",
        "Zero-server edge infrastructure with lightning fast global response times",
      ],
      es: [
        "Ingesta instantánea de documentos con chunking en segundo plano y embeddings vectoriales",
        "Búsqueda híbrida combinando Cloudflare Vectorize (ANN) y D1 (FTS5) mediante RRF",
        "Integración multi-modelo con OpenRouter para preguntas fieles y contextualizadas",
        "Infraestructura 100% serverless en el edge con velocidad global ultrarrápida",
      ],
    },
    stack: ["SvelteKit 5", "Cloudflare Workers", "Vectorize", "D1 SQLite", "Workers AI", "OpenRouter"],
    image: "/assets/images/developer-launching-rocket-towards-cloudflare-cloud.png",
    imageAlt: {
      en: "Quiz Generator Cloudflare edge architecture",
      es: "Arquitectura edge de Quiz Generator en Cloudflare",
    },
    landingUrl: "/resources/quiz-generator",
    liveUrl: "https://quiz-generator.ericmaster.ninja",
    badge: {
      en: "Live Application",
      es: "Aplicación Web",
    },
  },
];

export const curatedCheatsheets: CheatsheetItem[] = [
  {
    id: "silverbullet-ai",
    title: "Using SilverBullet AI",
    description: {
      en: "Practical cheatsheet for the `silverbullet-ai` plug — LLM chat, semantic embeddings search, and MCP tools inside the SilverBullet Markdown knowledge base.",
      es: "Guía práctica para el plugin `silverbullet-ai` — chat con LLMs, búsqueda semántica con embeddings y herramientas MCP dentro de SilverBullet.",
    },
    type: "guide",
    typeLabel: {
      en: "Guide & Cheatsheet",
      es: "Guía y Cheatsheet",
    },
    tags: ["SilverBullet", "MCP", "AI Chat", "Markdown", "Embeddings"],
    url: "/resources/silverbullet-ai",
  },
  {
    id: "pandas-visualizer",
    title: "Pandas Interactive Visualizer",
    description: {
      en: "Interactive cheatsheet and visualizer for common Python Pandas operations including filtering, grouping, reshaping, and time series analysis.",
      es: "Hoja de trucos interactiva y visualizador para operaciones comunes de Pandas en Python: filtros, agrupaciones, pivotes y series temporales.",
    },
    type: "interactive",
    typeLabel: {
      en: "Interactive App",
      es: "Herramienta Interactiva",
    },
    tags: ["Python", "Pandas", "Data Science", "Interactive", "Alpine.js"],
    url: "/resources/pandas-visualizer",
  },
];
