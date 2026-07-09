/**
 * Agent Souq — Demo Chat Engine v2
 * Uses OpenAI GPT-4o-mini with real streaming. Falls back to mock if key missing.
 */

const https = require("https");

const EMPLOYEE_KNOWLEDGE = {
  "sales-employee": {
    name: { ar: "موظف المبيعات الذكي", en: "AI Sales Employee" },
    role: { ar: "مبيعات وخدمة عملاء", en: "Sales & Customer Service" },
    systemPrompt: {
      ar: `أنت موظف مبيعات محترف في شركة متخصصة في التقنية والإلكترونيات. تتحدث بلهجة سعودية مهنية ودافئة. تساعد العملاء في اختيار المنتجات المناسبة. تعرف كل شيء عن المنتجات: الأسعار، المواصفات، الضمانات، والعروض. ردودك مختصرة ومفيدة (3-5 جمل فقط). استخدم الإيموجي باعتدال.`,
      en: `You are a professional sales employee at a tech & electronics company. You speak professionally and warmly. You help customers choose the right products. Keep responses concise (3-5 sentences). Use emojis sparingly.`
    },
    mockResponses: {
      ar: ["أهلاً وسهلاً! أنا هنا أساعدك تلاقي المنتج المناسب. وش تحتاج اليوم؟","ممتاز! عندنا مجموعة رائعة من المنتجات بأسعار تنافسية. خليني أساعدك تختار الأفضل.","بالتأكيد! هذا المنتج يجي مع ضمان سنتين وخدمة ما بعد البيع. هل تبي أعرفك بالمواصفات؟","عندنا عرض خاص هالأسبوع — وفّر 20% إذا اشتريت اليوم! 🎉"],
      en: ["Welcome! I am here to help you find the perfect product. What are you looking for today?","Great choice! We have an excellent range with competitive prices. Let me help you pick the best.","This product comes with a 2-year warranty and after-sales service. Want the full specs?","We have a special offer this week — save 20% if you buy today! 🎉"]
    }
  },
  "support-employee": {
    name: { ar: "موظف الدعم الفني", en: "AI Support Employee" },
    role: { ar: "دعم فني وحل المشاكل", en: "Technical Support" },
    systemPrompt: {
      ar: `أنت موظف دعم فني محترف. تساعد العملاء في حل المشاكل التقنية بصبر ووضوح. تعطي خطوات واضحة ومرقّمة. ردودك مختصرة ومنظمة (3-5 جمل).`,
      en: `You are a professional technical support employee. You help customers solve technical issues patiently. Provide clear numbered steps. Keep responses organized (3-5 sentences).`
    },
    mockResponses: {
      ar: ["أهلاً! أنا هنا لمساعدتك في حل أي مشكلة تقنية. وش المشكلة اللي تواجهها؟","فاهم مشكلتك. جرّب: 1) أعد تشغيل الجهاز 2) تحقق من الاتصال 3) حدّث البرنامج.","المشكلة هذي شائعة وعندها حل بسيط. خليني أشرح لك خطوة بخطوة.","إذا المشكلة استمرت، تواصل مع فريق الدعم وسيساعدونك فوراً."],
      en: ["Hello! I am here to help you solve any technical issue. What problem are you facing?","I understand. Try: 1) Restart device 2) Check connection 3) Update software.","This is a common issue with a simple fix. Let me walk you through it.","If the issue persists, contact our support team and they will assist you immediately."]
    }
  },
  "marketing-employee": {
    name: { ar: "موظف التسويق الذكي", en: "AI Marketing Employee" },
    role: { ar: "تسويق رقمي واستراتيجية", en: "Digital Marketing & Strategy" },
    systemPrompt: {
      ar: `أنت موظف تسويق رقمي محترف. تساعد الشركات في بناء استراتيجيات تسويقية فعّالة. تعرف SEO، وسائل التواصل الاجتماعي، الإعلانات المدفوعة، والمحتوى. ردودك عملية ومباشرة (3-5 جمل).`,
      en: `You are a professional digital marketing employee. You help companies build effective marketing strategies. You know SEO, social media, paid ads, and content marketing. Keep responses practical and direct (3-5 sentences).`
    },
    mockResponses: {
      ar: ["أهلاً! أنا موظف التسويق. كيف أقدر أساعد شركتك تنمو؟","لزيادة المبيعات، ركّز على محتوى يحل مشاكل جمهورك وشارك قصص نجاح عملاؤك.","إنستغرام وسناب شات هم الأقوى للسوق السعودي. ميزانية 500 ريال أسبوعياً تعطيك نتائج ممتازة.","SEO مهم جداً! تأكد أن موقعك سريع، محتواه أصلي، ومحسّن للكلمات المفتاحية الصحيحة."],
      en: ["Hello! I am the marketing employee. How can I help your company grow?","To boost sales, focus on content that solves your audience problems and share customer success stories.","Instagram and Snapchat are strongest for the Saudi market. A 150 dollar weekly ad budget gives excellent results.","SEO is crucial! Make sure your site is fast, has original content, and targets the right keywords."]
    }
  },
  "hr-employee": {
    name: { ar: "موظف الموارد البشرية", en: "AI HR Employee" },
    role: { ar: "موارد بشرية وتوظيف", en: "Human Resources & Recruitment" },
    systemPrompt: {
      ar: `أنت موظف موارد بشرية محترف. تساعد في التوظيف، تقييم المرشحين، وبناء بيئة عمل صحية. تعرف قوانين العمل السعودية وأفضل ممارسات الموارد البشرية. ردودك مهنية وعملية (3-5 جمل).`,
      en: `You are a professional HR employee. You help with recruitment, candidate evaluation, and healthy work environments. You know Saudi labor laws and HR best practices. Keep responses professional and practical (3-5 sentences).`
    },
    mockResponses: {
      ar: ["مرحباً! أنا موظف الموارد البشرية. كيف أقدر أساعدك في شؤون التوظيف؟","لاستقطاب أفضل المواهب، انشر الوظيفة على LinkedIn وبيت.كوم مع وصف وظيفي واضح.","نظام العمل السعودي يلزم بإعطاء الموظف 21 يوم إجازة سنوية بعد سنة خدمة.","لبناء بيئة عمل صحية، استثمر في تدريب الموظفين وأنشئ قنوات تواصل مفتوحة."],
      en: ["Hello! I am the HR employee. How can I help you with recruitment and HR matters?","To attract top talent, post on LinkedIn and Bayt.com with a clear and compelling job description.","Saudi labor law requires 21 days annual leave after one year of service.","To build a healthy work environment, invest in employee training and open communication channels."]
    }
  },
  "finance-employee": {
    name: { ar: "موظف المالية الذكي", en: "AI Finance Employee" },
    role: { ar: "تحليل مالي ومحاسبة", en: "Financial Analysis & Accounting" },
    systemPrompt: {
      ar: `أنت موظف مالي محترف. تساعد في التحليل المالي، الميزانيات، والتقارير المالية. تعرف الأنظمة المحاسبية السعودية ومعايير IFRS. ردودك دقيقة وموثوقة (3-5 جمل).`,
      en: `You are a professional finance employee. You help with financial analysis, budgets, and financial reports. You know Saudi accounting systems and IFRS standards. Keep responses precise and trustworthy (3-5 sentences).`
    },
    mockResponses: {
      ar: ["مرحباً! أنا موظف المالية. كيف أقدر أساعدك في الشؤون المالية؟","لتحسين التدفق النقدي، راجع دورة تحصيل المستحقات وحاول تقليصها من 60 يوم لـ 30 يوم.","الميزانية الصحية تبدأ بتصنيف المصروفات: ثابتة (إيجار، رواتب) ومتغيرة (تسويق، مشتريات).","التقرير المالي الشهري يجب أن يشمل: الإيرادات، المصروفات، الربح الصافي، والتدفق النقدي."],
      en: ["Hello! I am the finance employee. How can I help you with financial matters?","To improve cash flow, reduce your receivables cycle from 60 days to 30 days.","A healthy budget starts with categorizing expenses: fixed (rent, salaries) and variable (marketing).","Monthly reports should include: revenue, expenses, net profit, and cash flow."]
    }
  }
};

async function* openAIStream(apiKey, model, messages) {
  const body = JSON.stringify({ model, messages, stream: true, max_tokens: 500, temperature: 0.7 });
  const generator = await new Promise((resolve, reject) => {
    const req = https.request({
      hostname: "api.openai.com",
      path: "/v1/chat/completions",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + apiKey,
        "Content-Length": Buffer.byteLength(body)
      }
    }, (res) => {
      resolve((async function*() {
        let buffer = "";
        for await (const rawChunk of res) {
          buffer += rawChunk.toString();
          const lines = buffer.split("\n");
          buffer = lines.pop();
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith("data:")) continue;
            const data = trimmed.slice(5).trim();
            if (data === "[DONE]") return;
            try {
              const parsed = JSON.parse(data);
              const text = parsed.choices && parsed.choices[0] && parsed.choices[0].delta && parsed.choices[0].delta.content;
              if (text) yield text;
            } catch(e) {}
          }
        }
      })());
    });
    req.on("error", reject);
    req.write(body);
    req.end();
  });
  yield* generator;
}

async function* mockStream(employee, lang, messageCount) {
  const responses = (employee.mockResponses && employee.mockResponses[lang]) || (employee.mockResponses && employee.mockResponses.ar) || ["كيف أقدر أساعدك؟"];
  const text = responses[messageCount % responses.length];
  const words = text.split(" ");
  for (let i = 0; i < words.length; i++) {
    yield words[i] + (i < words.length - 1 ? " " : "");
    await new Promise(r => setTimeout(r, 25 + Math.random() * 35));
  }
}

async function* generateResponse(employeeId, messages, lang) {
  lang = lang || "ar";
  const employee = EMPLOYEE_KNOWLEDGE[employeeId] || EMPLOYEE_KNOWLEDGE["sales-employee"];
  const apiKey = process.env.OPENAI_API_KEY;

  if (apiKey && apiKey.startsWith("sk-")) {
    const systemContent = (employee.systemPrompt && employee.systemPrompt[lang]) || (employee.systemPrompt && employee.systemPrompt.ar) || "You are a helpful AI employee.";
    const openAIMessages = [
      { role: "system", content: systemContent },
      ...messages.slice(-10)
    ];
    try {
      yield* openAIStream(apiKey, "gpt-4o-mini", openAIMessages);
      return;
    } catch(err) {
      console.error("[demo-engine] OpenAI error, falling back to mock:", err.message);
    }
  }

  yield* mockStream(employee, lang, messages.length);
}

module.exports = { generateResponse, EMPLOYEE_KNOWLEDGE };
