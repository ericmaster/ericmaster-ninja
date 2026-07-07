export interface ChatResponse {
  text: string;
  cta?: {
    text: string;
    url: string;
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  content: ChatResponse;
  timestamp: Date;
}

export class ChatServiceMock {
  private exchangeCount: number = 0;
  private readonly MAX_EXCHANGES = 3;
  private readonly WHATSAPP_NUMBER = "593983337611";
  private lang: 'en' | 'es';

  private readonly keywordMaps: Record<'en' | 'es', Record<string, string[]>> = {
    en: {
      auditor: ["auditor", "audit", "fact-checking", "accuracy", "hallucination", "verify", "certification", "check"],
      hiring: ["hiring", "interviewer", "interview", "recruitment", "screening", "candidates", "smoke filter", "employ"],
      sme: ["sme", "small business", "turnkey", "automation", "local business", "workflow", "startup", "company"],
      privacy: ["privacy", "concierge", "data protection", "security", "secure", "hardening", "confidential", "secret"],
      cost: ["cost", "price", "pricing", "budget", "expensive", "fee", "rate", "investment"],
      affirmative: ["yes", "yeah", "yep", "sure", "ok", "okay", "please", "absolutely", "definitely", "i do", "i would"],
      greeting: ["hi", "hello", "hey", "greetings", "howdy", "sup", "morning", "afternoon"]
    },
    es: {
      auditor: ["auditor", "auditoría", "verificación", "exactitud", "alucinación", "verificar", "certificación", "revisar"],
      hiring: ["contratación", "entrevistador", "entrevista", "reclutamiento", "candidatos", "filtro anti-humo", "emplear"],
      sme: ["pyme", "pequeña empresa", "llave en mano", "automatización", "negocio local", "flujo de trabajo", "startup", "empresa"],
      privacy: ["privacidad", "conserje", "protección de datos", "seguridad", "seguro", "endurecimiento", "confidencial", "secreto"],
      cost: ["costo", "precio", "presupuesto", "caro", "tarifa", "inversión"],
      affirmative: ["sí", "si", "claro", "por supuesto", "ok", "okay", "vale", "seguro", "me gustaría"],
      greeting: ["hola", "buenas", "saludos", "qué tal", "buenos días", "buenas tardes"]
    }
  };

  private readonly responsesMaps: Record<'en' | 'es', Record<string, string[]>> = {
    en: {
      auditor: ["Our AI Hallucination & Fact-Checking Auditor ensures your AI outputs are medically and technically sound with a human-in-the-loop approach. (Lite model) Would you like to schedule a deep dive into your current models?"],
      hiring: ["The Technical Interviewer 'Smoke Filter' helps you distinguish real engineering talent from LLM-assisted mimicry. (Lite model) Ready to optimize your hiring?"],
      sme: ["We offer Turnkey AI for SMEs. We build end-to-end automation and custom bots to streamline your local business workflows. (Lite model) Looking to automate a specific process?"],
      privacy: ["For high-level professionals, our AI Concierge & Data Privacy service provides specialized consulting on secure AI adoption and personal data hardening. (Lite model) Is data security your priority right now?"],
      cost: ["Every project is unique, but our focus is on high-ROI, mission-critical AI implementations. (Lite model) Let's discuss your specific needs on a consultation call to provide an accurate estimate."],
      greeting: [
        "Hi there! I'm Eric's AI assistant. I can help answer basic questions about his services, but for the best experience, you can also reach out to him directly.",
        "Hello! I am operating on a lite logic model right now, but I'd be happy to point you in the right direction!"
      ],
      default: [
        "I'm Eric's AI Assistant (operating on a lite model). To get the most accurate and secure advice for your business, I recommend connecting with Eric directly. Would you like to do that?",
        "As a lite mock AI, my responses are limited here. Eric would be the best person to answer that in detail. Should I help you get in touch with him?",
        "That's an interesting point! For details beyond my training, I suggest we loop in Eric. Would you like his WhatsApp contact?",
        "I am currently a lite chatbot, so my capabilities are constrained. Would you like to chat with Eric directly to dive deeper?"
      ]
    },
    es: {
      auditor: ["Nuestro Auditor de Alucinaciones y Verificación de IA garantiza que los resultados de tu IA sean médica y técnicamente sólidos con un enfoque humano en el bucle. (Modelo lite) ¿Te gustaría programar una revisión profunda de tus modelos actuales?"],
      hiring: ["El 'Filtro Anti-humo' para Entrevistas Técnicas te ayuda a distinguir el verdadero talento de ingeniería de la imitación asistida por LLM. (Modelo lite) ¿Listo para optimizar tu contratación?"],
      sme: ["Ofrecemos IA Llave en Mano para PYMES. Construimos automatización integral y bots personalizados para optimizar los flujos de trabajo de tu negocio local. (Modelo lite) ¿Buscas automatizar un proceso específico?"],
      privacy: ["Para profesionales de alto nivel, nuestro servicio de Conserjería de IA y Privacidad de Datos ofrece consultoría especializada sobre adopción segura de IA y protección de datos personales. (Modelo lite) ¿La seguridad de tus datos es tu prioridad en este momento?"],
      cost: ["Cada proyecto es único, pero nuestro enfoque está en implementaciones de IA de alto ROI y misión crítica. (Modelo lite) Discutamos tus necesidades específicas en una llamada de consultoría para proporcionarte un presupuesto exacto."],
      greeting: [
        "¡Hola! Soy el asistente de IA de Eric. Puedo ayudarte a responder preguntas básicas sobre sus servicios, pero para la mejor experiencia, también puedes contactarlo directamente.",
        "¡Hola! Actualmente opero con un modelo lógico lite, ¡pero estaré encantado de orientarte en la dirección correcta!"
      ],
      default: [
        "Soy el Asistente de IA de Eric (operando con un modelo lite). Para obtener el consejo más preciso y seguro para tu negocio, te recomiendo conectar directamente con Eric. ¿Te gustaría hacer eso?",
        "Como una IA de prueba lite, mis respuestas son limitadas aquí. Eric sería la mejor persona para responder eso en detalle. ¿Te ayudo a ponerte en contacto con él?",
        "¡Es un punto interesante! Para detalles más allá de mi entrenamiento, sugiero que incluyamos a Eric. ¿Te gustaría su contacto de WhatsApp?",
        "Actualmente soy un chatbot lite, por lo que mis capacidades están limitadas. ¿Te gustaría charlar con Eric directamente para profundizar?"
      ]
    }
  };

  private lastDefaultIndex: number = -1;

  constructor(lang: string = 'en') {
    this.lang = lang === 'es' ? 'es' : 'en';
  }

  /**
   * Calculates Levenshtein distance between two strings.
   */
  private levenshtein(a: string, b: string): number {
    // Only two rows of the DP matrix are ever needed at once (the current row
    // depends solely on the previous one), so keep O(a.length) space instead of
    // allocating the full O(a.length * b.length) matrix.
    let prevRow = new Array(a.length + 1);
    for (let j = 0; j <= a.length; j++) {
        prevRow[j] = j;
    }
    let currRow = new Array(a.length + 1);
    for (let i = 1; i <= b.length; i++) {
        currRow[0] = i;
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) == a.charAt(j - 1)) {
                currRow[j] = prevRow[j - 1];
            } else {
                currRow[j] = Math.min(prevRow[j - 1] + 1, Math.min(currRow[j - 1] + 1, prevRow[j] + 1));
            }
        }
        [prevRow, currRow] = [currRow, prevRow];
    }
    return prevRow[a.length];
  }

  /**
   * Checks if word matches a keyword either exactly or via fuzzy matching
   */
  private isFuzzyMatch(word: string, target: string): boolean {
    word = word.toLowerCase();
    target = target.toLowerCase();
    
    if (word === target || target.includes(word) || word.includes(target)) return true;
    
    // Allow 1 typo for words length 4-6, 2 typos for 7+
    const maxDistance = word.length >= 7 ? 2 : (word.length >= 4 ? 1 : 0);
    if (maxDistance === 0) return false;

    const distance = this.levenshtein(word, target);
    return distance <= maxDistance;
  }

  private detectIntent(message: string): string {
    const words = message.toLowerCase().replace(/[^\w\s]/gi, '').split(/\s+/);
    
    for (const word of words) {
        if (word.length < 3) continue; // Skip very short words

        for (const [intent, synonyms] of Object.entries(this.keywordMaps[this.lang])) {
            for (const synonym of synonyms) {
                // If the synonym is multiple words, check the whole message
                if (synonym.includes(' ')) {
                   if (message.toLowerCase().includes(synonym)) return intent;
                } else if (this.isFuzzyMatch(word, synonym)) {
                    return intent;
                }
            }
        }
    }
    return "default";
  }

  private getWhatsAppFallback(customReason?: string): ChatResponse {
    let text, reason;
    if (this.lang === 'es') {
      text = encodeURIComponent("Hola Eric, estuve chateando con tu asistente de IA y me gustaría agendar una consultoría profesional.");
      reason = customReason || "Para asegurarnos de manejar tus requerimientos específicos de forma segura y profesional, por favor contacta a Eric directamente.";
    } else {
      text = encodeURIComponent("Hi Eric, I was chatting with your AI assistant and would like to book a professional consultation.");
      reason = customReason || "To ensure we handle your specific requirements securely and professionally, please reach out to Eric directly.";
    }
    const url = `https://wa.me/${this.WHATSAPP_NUMBER}?text=${text}`;
    
    return {
      text: `${reason} ${this.lang === 'es' ? '(Nota: Usando modelo lite)' : '(Note: Using lite model)'}`,
      cta: {
        text: this.lang === 'es' ? "Haz clic aquí para chatear en WhatsApp" : "Click here to chat on WhatsApp",
        url: url
      }
    };
  }

  public async sendMessage(message: string): Promise<ChatResponse> {
    this.exchangeCount++;

    // Artificial network latency (600ms - 1500ms) to feel "smart"
    const latency = Math.floor(Math.random() * 900) + 600;
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const isQuestion = message.includes('?') || /^(what|how|who|where|can|could|why|when|help|qué|como|quién|donde|puedes|por qué|cuando|ayuda|cual)/i.test(message.trim());
        const lowerMsg = message.toLowerCase();
        const inquiryKeys = this.lang === 'es' 
          ? ["oferta", "servicio", "trabajo", "acerca", "haciendo"] 
          : ["offer", "service", "work", "about", "doing"];
        const isInquiry = isQuestion || inquiryKeys.some(key => lowerMsg.includes(key));

        if (this.exchangeCount > this.MAX_EXCHANGES) {
          resolve(this.getWhatsAppFallback());
          return;
        }

        const intent = this.detectIntent(message);

        if (intent === "affirmative") {
          const msg = this.lang === 'es' 
            ? "¡Genial! Te conectaremos directamente con Eric." 
            : "Great! Let's get you connected with Eric directly.";
          resolve(this.getWhatsAppFallback(msg));
          return;
        }

        if (isInquiry) {
          const msg = this.lang === 'es'
            ? "Para un desglose detallado de los servicios y cómo Eric puede ayudar específicamente a tu proyecto, te recomiendo una consultoría directa."
            : "For a detailed breakdown of services and how Eric can specifically help your project, I recommend a direct consultation.";
          resolve(this.getWhatsAppFallback(msg));
          return;
        }
        
        if (intent === "default" && this.exchangeCount === this.MAX_EXCHANGES) {
            resolve(this.getWhatsAppFallback());
        } else {
            const possibleResponses = this.responsesMaps[this.lang][intent] || this.responsesMaps[this.lang]["default"];
            
            let responseText = possibleResponses[0];
            if (possibleResponses.length > 1) {
              if (intent === "default") {
                this.lastDefaultIndex = (this.lastDefaultIndex + 1) % possibleResponses.length;
                responseText = possibleResponses[this.lastDefaultIndex];
              } else {
                responseText = possibleResponses[Math.floor(Math.random() * possibleResponses.length)];
              }
            }

            resolve({ text: responseText });
        }
      }, latency);
    });
  }

  public resetSession() {
    this.exchangeCount = 0;
    this.lastDefaultIndex = -1;
  }
}
