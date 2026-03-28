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

  private readonly keywordMap: Record<string, string[]> = {
    auditor: ["auditor", "audit", "fact-checking", "accuracy", "hallucination", "verify", "certification", "check"],
    hiring: ["hiring", "interviewer", "interview", "recruitment", "screening", "candidates", "smoke filter", "employ"],
    sme: ["sme", "small business", "turnkey", "automation", "local business", "workflow", "startup", "company"],
    privacy: ["privacy", "concierge", "data protection", "security", "secure", "hardening", "confidential", "secret"],
    cost: ["cost", "price", "pricing", "budget", "expensive", "fee", "rate", "investment"]
  };

  private readonly responses: Record<string, string> = {
    auditor: "Our AI Hallucination & Fact-Checking Auditor ensures your AI outputs are medically and technically sound with a human-in-the-loop approach. (Lite model) Would you like to schedule a deep dive into your current models?",
    hiring: "The Technical Interviewer 'Smoke Filter' helps you distinguish real engineering talent from LLM-assisted mimicry. (Lite model) Ready to optimize your hiring?",
    sme: "We offer Turnkey AI for SMEs. We build end-to-end automation and custom bots to streamline your local business workflows. (Lite model) Looking to automate a specific process?",
    privacy: "For high-level professionals, our AI Concierge & Data Privacy service provides specialized consulting on secure AI adoption and personal data hardening. (Lite model) Is data security your priority right now?",
    cost: "Every project is unique, but our focus is on high-ROI, mission-critical AI implementations. (Lite model) Let's discuss your specific needs on a consultation call to provide an accurate estimate.",
    default: "I'm Eric's AI Assistant (operating on a lite model). To get the most accurate and secure advice for your business, I recommend connecting with Eric directly. Would you like to do that?"
  };

  /**
   * Calculates Levenshtein distance between two strings.
   */
  private levenshtein(a: string, b: string): number {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) == a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1));
            }
        }
    }
    return matrix[b.length][a.length];
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

        for (const [intent, synonyms] of Object.entries(this.keywordMap)) {
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
    const text = encodeURIComponent("Hi Eric, I was chatting with your AI assistant and would like to book a professional consultation.");
    const url = `https://wa.me/${this.WHATSAPP_NUMBER}?text=${text}`;
    const reason = customReason || "To ensure we handle your specific requirements securely and professionally, please reach out to Eric directly.";
    return {
      text: `${reason} (Note: Using lite model)`,
      cta: {
        text: "Click here to chat on WhatsApp",
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
        const isQuestion = message.includes('?') || /^(what|how|who|where|can|could|why|when|help)/i.test(message.trim());
        const lowerMsg = message.toLowerCase();
        const isInquiry = isQuestion || ["offer", "service", "work", "about", "doing"].some(key => lowerMsg.includes(key));

        if (this.exchangeCount > this.MAX_EXCHANGES) {
          resolve(this.getWhatsAppFallback());
          return;
        }

        if (isInquiry) {
          resolve(this.getWhatsAppFallback("For a detailed breakdown of services and how Eric can specifically help your project, I recommend a direct consultation."));
          return;
        }

        const intent = this.detectIntent(message);
        
        if (intent === "default" && this.exchangeCount === this.MAX_EXCHANGES) {
            resolve(this.getWhatsAppFallback());
        } else {
            resolve({ text: this.responses[intent] });
        }
      }, latency);
    });
  }

  public resetSession() {
    this.exchangeCount = 0;
  }
}
