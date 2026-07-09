/**
 * Agent Souq — Demo Chat Engine
 * -----------------------------------------------
 * Provides intelligent mock responses for each AI Employee type.
 * Architecture: The `generateResponse` function is the ONLY place
 * that needs to change when replacing mocks with a real LLM API
 * (OpenAI, Anthropic, Gemini, OpenRouter, etc.).
 *
 * To add real AI:
 *   1. Set OPENAI_API_KEY (or similar) in .env
 *   2. Replace the mock logic in `generateResponse` with a real API call
 *   3. Frontend stays unchanged — it only consumes the SSE stream
 */

// ─── Employee Knowledge Base ──────────────────────────────────────────────────
const EMPLOYEE_KNOWLEDGE = {
  "sales-employee": {
    name: { ar: "موظف المبيعات الذكي", en: "AI Sales Employee" },
    role: { ar: "مبيعات وخدمة عملاء", en: "Sales & Customer Service" },
    personality: "professional, helpful, persuasive, friendly",
    systemPrompt: {
      ar: `أنت موظف مبيعات محترف في شركة متخصصة في التقنية والإلكترونيات. 
تتحدث بلهجة سعودية مهنية. تساعد العملاء في اختيار المنتجات المناسبة.
تعرف كل شيء عن المنتجات: الأسعار، المواصفات، الضمانات، والعروض.
ردودك مختصرة ومفيدة (3-5 جمل). لا تتجاهل أي سؤال.`,
      en: `You are a professional sales employee at a tech & electronics company.
You speak professionally and helpfully. You assist customers in choosing the right products.
You know everything about products: prices, specs, warranties, and offers.
Keep responses concise and helpful (3-5 sentences).`
    },
    mockResponses: {
      ar: [
        "أهلاً وسهلاً! أنا هنا أساعدك تلاقي المنتج المناسب. وش تحتاج اليوم؟",
        "ممتاز! عندنا مجموعة رائعة من المنتجات بأسعار تنافسية. خليني أساعدك تختار الأفضل لاحتياجك.",
        "بالتأكيد! هذا المنتج يجي مع ضمان سنتين وخدمة ما بعد البيع. هل تبي أعرفك بالمواصفات الكاملة؟",
        "سعر ممتاز وجودة عالية! كثير من عملاؤنا راضين عنه. هل تبي أضيفه لسلة مشترياتك؟",
        "عندنا عرض خاص هالأسبوع على هذا المنتج. وفّر 20% إذا اشتريت اليوم!",
      ],
      en: [
        "Welcome! I'm here to help you find the perfect product. What are you looking for today?",
        "Great choice! We have an excellent range with competitive prices. Let me help you pick the best option.",
        "Absolutely! This product comes with a 2-year warranty and after-sales service. Want the full specs?",
        "Great value and high quality! Many of our customers love it. Would you like to add it to your cart?",
        "We have a special offer this week on this product — save 20% if you buy today!",
      ]
    }
  },
  "support-employee": {
    name: { ar: "موظف الدعم الفني", en: "AI Support Employee" },
    role: { ar: "دعم فني وحل المشاكل", en: "Technical Support" },
    personality: "patient, technical, solution-focused",
    systemPrompt: {
      ar: `أنت موظف دعم فني محترف. تساعد العملاء في حل المشاكل التقنية.
تتحدث بوضوح وصبر. تعطي خطوات واضحة لحل المشاكل.
ردودك مختصرة ومنظمة (استخدم قوائم عند الحاجة).`,
      en: `You are a professional technical support employee. You help customers solve technical issues.
Speak clearly and patiently. Provide clear steps to resolve issues.
Keep responses organized (use lists when needed).`
    },
    mockResponses: {
      ar: [
        "مرحباً! أنا هنا أساعدك في حل أي مشكلة تقنية. وش المشكلة اللي تواجهها؟",
        "فاهم المشكلة. جرّب هذه الخطوات: أولاً أعد تشغيل الجهاز، ثانياً تحقق من الاتصال بالإنترنت، ثالثاً أعد تثبيت التطبيق.",
        "هذه مشكلة شائعة وعندها حل سهل. خليني أشرح لك الخطوات بالتفصيل.",
        "ممتاز! المشكلة انحلت. إذا واجهت أي شيء ثاني لا تتردد تتواصل معنا.",
        "إذا المشكلة استمرت، نقدر نرسل لك تقنياً متخصص. هل تبي نرتب موعد؟",
      ],
      en: [
        "Hello! I'm here to help you resolve any technical issue. What problem are you facing?",
        "I understand the issue. Try these steps: First restart the device, Second check your internet, Third reinstall the app.",
        "This is a common issue with an easy fix. Let me walk you through the steps in detail.",
        "Great! The issue should be resolved. If you face anything else, don't hesitate to contact us.",
        "If the problem persists, we can send a specialist technician. Would you like to schedule an appointment?",
      ]
    }
  },
  "marketing-employee": {
    name: { ar: "موظف التسويق الذكي", en: "AI Marketing Employee" },
    role: { ar: "تسويق ومحتوى رقمي", en: "Marketing & Digital Content" },
    personality: "creative, strategic, data-driven",
    systemPrompt: {
      ar: `أنت موظف تسويق رقمي محترف. تساعد الشركات في بناء استراتيجيات تسويقية فعّالة.
تعرف كل شيء عن التسويق الرقمي: السوشيال ميديا، SEO، الإعلانات المدفوعة، المحتوى.
ردودك إبداعية ومبنية على البيانات.`,
      en: `You are a professional digital marketing employee. You help companies build effective marketing strategies.
You know everything about digital marketing: social media, SEO, paid ads, content marketing.
Your responses are creative and data-driven.`
    },
    mockResponses: {
      ar: [
        "أهلاً! أنا متخصص في التسويق الرقمي. خليني أساعدك تنمّي علامتك التجارية.",
        "استراتيجية رائعة! لتحسين تواجدك على السوشيال ميديا، ركّز على المحتوى المرئي والتفاعل مع جمهورك يومياً.",
        "لزيادة المبيعات، أنصح بحملة إعلانية مستهدفة على إنستغرام وسناب. الميزانية المثالية تبدأ من 500 ريال.",
        "المحتوى هو الملك! اكتب محتوى يحل مشاكل جمهورك وشارك قصص نجاح عملاؤك.",
        "SEO مهم جداً. تأكد أن موقعك سريع، محتواه أصلي، ومحسّن للكلمات المفتاحية الصحيحة.",
      ],
      en: [
        "Hello! I specialize in digital marketing. Let me help you grow your brand.",
        "Great strategy! To improve your social media presence, focus on visual content and daily audience engagement.",
        "To boost sales, I recommend a targeted ad campaign on Instagram and Snapchat. Ideal budget starts at $150.",
        "Content is king! Write content that solves your audience's problems and share customer success stories.",
        "SEO is crucial. Make sure your site is fast, has original content, and is optimized for the right keywords.",
      ]
    }
  },
  "hr-employee": {
    name: { ar: "موظف الموارد البشرية", en: "AI HR Employee" },
    role: { ar: "موارد بشرية وتوظيف", en: "Human Resources & Recruitment" },
    personality: "professional, empathetic, organized",
    systemPrompt: {
      ar: `أنت موظف موارد بشرية محترف. تساعد في التوظيف، تقييم المرشحين، وبناء بيئة عمل صحية.
تعرف قوانين العمل السعودية وأفضل ممارسات الموارد البشرية.`,
      en: `You are a professional HR employee. You help with recruitment, candidate evaluation, and building healthy work environments.
You know Saudi labor laws and HR best practices.`
    },
    mockResponses: {
      ar: [
        "مرحباً! أنا موظف الموارد البشرية. كيف أقدر أساعدك في شؤون التوظيف والموارد البشرية؟",
        "لاستقطاب أفضل المواهب، أنصح بنشر الوظيفة على LinkedIn وبيت.كوم مع وصف وظيفي واضح ومحفّز.",
        "في مقابلة العمل، ركّز على الأسئلة السلوكية: 'حدثني عن موقف تحديت فيه...' للكشف عن شخصية المرشح.",
        "نظام العمل السعودي يلزم بإعطاء الموظف 21 يوم إجازة سنوية بعد سنة خدمة.",
        "لبناء بيئة عمل صحية، استثمر في تدريب الموظفين وأنشئ قنوات تواصل مفتوحة.",
      ],
      en: [
        "Hello! I'm the HR employee. How can I help you with recruitment and HR matters?",
        "To attract top talent, I recommend posting on LinkedIn and Bayt.com with a clear and compelling job description.",
        "In interviews, focus on behavioral questions: 'Tell me about a time you faced a challenge...' to reveal personality.",
        "Saudi labor law requires 21 days annual leave after one year of service.",
        "To build a healthy work environment, invest in employee training and create open communication channels.",
      ]
    }
  },
  "finance-employee": {
    name: { ar: "موظف المالية الذكي", en: "AI Finance Employee" },
    role: { ar: "تحليل مالي ومحاسبة", en: "Financial Analysis & Accounting" },
    personality: "analytical, precise, trustworthy",
    systemPrompt: {
      ar: `أنت موظف مالي محترف. تساعد في التحليل المالي، الميزانيات، والتقارير المالية.
تعرف الأنظمة المحاسبية السعودية ومعايير IFRS.`,
      en: `You are a professional finance employee. You help with financial analysis, budgets, and financial reports.
You know Saudi accounting systems and IFRS standards.`
    },
    mockResponses: {
      ar: [
        "مرحباً! أنا موظف المالية. كيف أقدر أساعدك في الشؤون المالية والمحاسبية؟",
        "لتحسين التدفق النقدي، راجع دورة تحصيل المستحقات وحاول تقليصها من 60 يوم لـ 30 يوم.",
        "الميزانية الصحية تبدأ بتصنيف المصروفات: ثابتة (إيجار، رواتب) ومتغيرة (تسويق، مشتريات).",
        "لتقليل الضرائب بشكل قانوني، استفد من الخصومات المسموح بها في نظام ضريبة القيمة المضافة السعودي.",
        "التقرير المالي الشهري يجب أن يشمل: الإيرادات، المصروفات، الربح الصافي، والتدفق النقدي.",
      ],
      en: [
        "Hello! I'm the finance employee. How can I help you with financial and accounting matters?",
        "To improve cash flow, review your receivables cycle and try to reduce it from 60 days to 30 days.",
        "A healthy budget starts with categorizing expenses: fixed (rent, salaries) and variable (marketing, purchases).",
        "To legally minimize taxes, utilize the deductions allowed under Saudi VAT regulations.",
        "Monthly financial reports should include: revenue, expenses, net profit, and cash flow.",
      ]
    }
  }
};

// ─── Response Generator ────────────────────────────────────────────────────────
/**
 * generateResponse — the SINGLE function to replace with real AI later.
 *
 * @param {string} employeeId - e.g. "sales-employee"
 * @param {Array}  messages   - chat history [{role, content}]
 * @param {string} lang       - "ar" | "en"
 * @returns {AsyncGenerator<string>} - yields text chunks for SSE streaming
 */
async function* generateResponse(employeeId, messages, lang = "ar") {
  const employee = EMPLOYEE_KNOWLEDGE[employeeId] || EMPLOYEE_KNOWLEDGE["sales-employee"];
  const lastUserMessage = messages.filter(m => m.role === "user").pop()?.content || "";

  // ── REAL AI INTEGRATION POINT ──────────────────────────────────────────────
  // To use OpenAI, replace this block:
  //
  // const { OpenAI } = await import('openai');
  // const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  // const stream = await client.chat.completions.create({
  //   model: "gpt-4o-mini",
  //   messages: [
  //     { role: "system", content: employee.systemPrompt[lang] },
  //     ...messages
  //   ],
  //   stream: true,
  // });
  // for await (const chunk of stream) {
  //   const text = chunk.choices[0]?.delta?.content || "";
  //   if (text) yield text;
  // }
  // return;
  // ──────────────────────────────────────────────────────────────────────────

  // ── MOCK RESPONSES (used when no API key is available) ────────────────────
  const response = buildSmartMockResponse(employee, lastUserMessage, lang, messages.length);

  // Simulate streaming by yielding word by word
  const words = response.split(" ");
  for (let i = 0; i < words.length; i++) {
    yield words[i] + (i < words.length - 1 ? " " : "");
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 30 + Math.random() * 40));
  }
}

/**
 * Build a smart mock response based on user message keywords.
 */
function buildSmartMockResponse(employee, userMessage, lang, messageCount) {
  const msg = userMessage.toLowerCase();
  const isAr = lang === "ar";

  // Keyword-based smart responses
  const keywords = {
    // Greetings
    greet: ["مرحبا", "هلا", "السلام", "أهلا", "hello", "hi", "hey", "greet"],
    // Products/items
    product: ["مكيف", "تلفزيون", "جوال", "لابتوب", "سيارة", "منتج", "بضاعة", "air conditioner", "tv", "phone", "laptop", "product"],
    // Price
    price: ["سعر", "كم", "تكلفة", "ريال", "price", "cost", "how much", "cheap", "expensive"],
    // Compare
    compare: ["قارن", "مقارنة", "الفرق", "أفضل", "compare", "difference", "better", "vs"],
    // Warranty
    warranty: ["ضمان", "كفالة", "warranty", "guarantee"],
    // Shipping
    shipping: ["شحن", "توصيل", "متى", "shipping", "delivery", "when"],
    // Help
    help: ["مساعدة", "ساعدني", "help", "assist", "support"],
    // Thanks
    thanks: ["شكرا", "شكراً", "ممتاز", "رائع", "thanks", "thank you", "great", "perfect"],
  };

  // Detect intent
  let intent = "general";
  for (const [key, words] of Object.entries(keywords)) {
    if (words.some(w => msg.includes(w))) {
      intent = key;
      break;
    }
  }

  // Smart responses by intent
  const responses = {
    ar: {
      greet: "أهلاً وسهلاً! يسعدني أساعدك. وش تحتاج اليوم؟",
      product: `ممتاز! عندنا تشكيلة واسعة من هذا المنتج. ${employee.mockResponses.ar[1]}`,
      price: "الأسعار عندنا تنافسية جداً وتبدأ من 299 ريال. هل تبي أعطيك عرض أسعار مفصّل؟",
      compare: "بالتأكيد! الفرق الرئيسي بين المنتجين هو في المواصفات والسعر. المنتج الأول أقوى في الأداء، والثاني أفضل في السعر. وش أهم شيء بالنسبة لك؟",
      warranty: "كل منتجاتنا تجي مع ضمان سنتين شامل، وخدمة ما بعد البيع متاحة 7 أيام في الأسبوع.",
      shipping: "التوصيل خلال 2-3 أيام عمل داخل المملكة، وبالمجان للطلبات فوق 200 ريال!",
      help: `${employee.mockResponses.ar[0]} أنا هنا لأي سؤال أو استفسار.`,
      thanks: "العفو! يسعدني خدمتك. هل في شيء ثاني أقدر أساعدك فيه؟",
      general: employee.mockResponses.ar[messageCount % employee.mockResponses.ar.length],
    },
    en: {
      greet: "Welcome! I'm happy to help you. What do you need today?",
      product: `Excellent! We have a wide range of this product. ${employee.mockResponses.en[1]}`,
      price: "Our prices are very competitive, starting from $79. Would you like a detailed price quote?",
      compare: "Absolutely! The main difference between the two products is in specs and price. The first is more powerful, the second is better value. What matters most to you?",
      warranty: "All our products come with a 2-year comprehensive warranty, and after-sales service is available 7 days a week.",
      shipping: "Delivery within 2-3 business days, and free shipping on orders over $50!",
      help: `${employee.mockResponses.en[0]} I'm here for any question or inquiry.`,
      thanks: "You're welcome! Happy to serve you. Is there anything else I can help you with?",
      general: employee.mockResponses.en[messageCount % employee.mockResponses.en.length],
    }
  };

  return responses[lang][intent] || responses[lang].general;
}

module.exports = { generateResponse, EMPLOYEE_KNOWLEDGE };
