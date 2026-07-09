/**
 * Agent Detail Page — AI Employee Profile
 * Sections: Hero, Stats, Tabs, Features, Screenshots,
 *           Video, Pricing, Reviews, FAQ, Related Employees
 */
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Star, Sparkles, ArrowLeft, ArrowRight, Check, Shield, Users, Clock,
  MessageCircle, Play, ChevronDown, ChevronUp, Zap, Award, TrendingUp,
  Globe, Bot, CheckCircle2, Quote, BadgeCheck,
} from "lucide-react";
import DemoChat from "../components/DemoChat.jsx";

const FontImport = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Inter:wght@400;500;600;700;800&display=swap');
    .font-display-ar { font-family: 'Cairo', sans-serif; }
    .font-body-ar { font-family: 'Cairo', sans-serif; }
    .font-display-en { font-family: 'Inter', sans-serif; }
    .font-body-en { font-family: 'Inter', sans-serif; }
    @keyframes fadeInUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
    .animate-fade-in-up { animation: fadeInUp 0.35s ease forwards; }
    @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
    .animate-fade-in { animation: fadeIn 0.25s ease forwards; }
    .typing-dot { width:6px; height:6px; border-radius:50%; background:#94a3b8; animation: typingBounce 1.2s infinite; }
    .typing-dot:nth-child(2) { animation-delay:0.2s; }
    .typing-dot:nth-child(3) { animation-delay:0.4s; }
    @keyframes typingBounce { 0%,60%,100% { transform:translateY(0); } 30% { transform:translateY(-6px); } }
    .chat-scroll::-webkit-scrollbar { width:4px; }
    .chat-scroll::-webkit-scrollbar-track { background:transparent; }
    .chat-scroll::-webkit-scrollbar-thumb { background:#e2e8f0; border-radius:4px; }
  `}</style>
);

// ── Employee Data ─────────────────────────────────────────────────────────────
const EMPLOYEES = {
  "sales-employee": {
    id: "sales-employee", emoji: "💼",
    color: "from-amber-500 to-orange-500",
    colorLight: "from-amber-50 to-orange-50",
    colorBorder: "border-amber-200",
    colorText: "text-amber-600",
    rating: 4.9, reviews: 847, users: "12,400+",
    category: { ar: "مبيعات", en: "Sales" },
    ar: {
      name: "موظف المبيعات الذكي",
      role: "متخصص مبيعات وخدمة عملاء",
      tagline: "يرد على عملاؤك، يقنعهم، ويغلق الصفقات — 24/7 بدون توقف",
      description: "موظف المبيعات الذكي هو مساعد AI متخصص في المبيعات وخدمة العملاء. يعمل على مدار الساعة للرد على استفسارات العملاء، تقديم المنتجات، وإتمام الصفقات بأسلوب مهني واحترافي.\n\nيتعلم من بيانات شركتك ويتكيف مع أسلوبك في البيع، مما يجعله امتداداً حقيقياً لفريق المبيعات لديك.",
      features: ["رد فوري على استفسارات العملاء 24/7","تقديم المنتجات والخدمات بأسلوب مقنع","مقارنة المنتجات وتقديم التوصيات","إتمام عمليات البيع وتحويل العملاء","تذكر تاريخ المحادثات مع كل عميل","دعم متعدد اللغات (عربي/إنجليزي)","تكامل مع WhatsApp وInstagram وموقعك","تقارير يومية عن أداء المبيعات"],
      useCases: ["متاجر إلكترونية تبي تزيد مبيعاتها","شركات خدمات تحتاج رد سريع على العملاء","وكالات عقارية لتصفية العملاء المحتملين","مطاعم لاستقبال الطلبات والاستفسارات"],
      plans: [
        { name: "أساسي", price: "299 ريال/شهر", desc: "حتى 500 محادثة شهرياً، رد خلال ثانية", popular: false },
        { name: "احترافي", price: "799 ريال/شهر", desc: "محادثات غير محدودة، تكامل كامل، تقارير", popular: true },
        { name: "مؤسسي", price: "تواصل معنا", desc: "حلول مخصصة للشركات الكبيرة", popular: false },
      ],
      reviewsList: [
        { name: "أحمد الغامدي", company: "متجر إلكتروني", rating: 5, text: "زاد مبيعاتنا 40% في أول شهر! الموظف يرد بشكل احترافي جداً ويقنع العملاء.", avatar: "أ" },
        { name: "سارة المطيري", company: "وكالة عقارية", rating: 5, text: "وفّر علينا 3 موظفين. يعمل 24 ساعة ويرد على كل استفسار بدقة.", avatar: "س" },
        { name: "محمد العتيبي", company: "مطعم", rating: 4, text: "ممتاز للرد على الطلبات والاستفسارات. أنصح فيه كل صاحب مطعم.", avatar: "م" },
        { name: "نورة الزهراني", company: "متجر ملابس", rating: 5, text: "العملاء ما يحسون أنهم يتكلمون مع AI! الردود طبيعية وذكية.", avatar: "ن" },
      ],
      faq: [
        { q: "كيف يتعلم الموظف عن منتجاتي؟", a: "تزوده بكتالوج منتجاتك أو رابط موقعك، وهو يتعلم تلقائياً خلال 24 ساعة." },
        { q: "هل يدعم اللهجة السعودية؟", a: "نعم! مدرّب خصيصاً على اللهجة السعودية والخليجية مع إمكانية الرد بالفصحى." },
        { q: "ماذا يصير لو ما عرف يجاوب؟", a: "يحيل السؤال لموظف بشري تلقائياً ويبلغك فوراً." },
        { q: "هل يمكن تخصيص شخصيته وأسلوبه؟", a: "بالكامل! تقدر تحدد اسمه، أسلوبه، ولهجته حسب هوية شركتك." },
        { q: "كيف يتكامل مع موقعي؟", a: "بسطر كود واحد تضيفه لموقعك، أو عبر API للتكامل مع أي نظام." },
      ],
    },
    en: {
      name: "AI Sales Employee",
      role: "Sales & Customer Service Specialist",
      tagline: "Responds to your customers, convinces them, and closes deals — 24/7 without stopping",
      description: "The AI Sales Employee is an AI assistant specialized in sales and customer service. It works around the clock to respond to customer inquiries, present products, and complete deals in a professional manner.\n\nIt learns from your company data and adapts to your sales style, making it a true extension of your sales team.",
      features: ["Instant 24/7 customer inquiry responses","Present products and services persuasively","Compare products and provide recommendations","Complete sales and convert customers","Remember conversation history with each customer","Multi-language support (Arabic/English)","Integration with WhatsApp, Instagram, and your website","Daily sales performance reports"],
      useCases: ["E-commerce stores looking to increase sales","Service companies needing quick customer responses","Real estate agencies for lead qualification","Restaurants for order and inquiry handling"],
      plans: [
        { name: "Basic", price: "$79/month", desc: "Up to 500 conversations/month, 1-second response", popular: false },
        { name: "Professional", price: "$199/month", desc: "Unlimited conversations, full integration, reports", popular: true },
        { name: "Enterprise", price: "Contact Us", desc: "Custom solutions for large companies", popular: false },
      ],
      reviewsList: [
        { name: "Ahmed Al-Ghamdi", company: "E-commerce Store", rating: 5, text: "Increased our sales by 40% in the first month! The employee responds very professionally.", avatar: "A" },
        { name: "Sara Al-Mutairi", company: "Real Estate Agency", rating: 5, text: "Saved us 3 employees. Works 24 hours and responds to every inquiry accurately.", avatar: "S" },
        { name: "Mohammed Al-Otaibi", company: "Restaurant", rating: 4, text: "Excellent for handling orders and inquiries. I recommend it to every restaurant owner.", avatar: "M" },
        { name: "Noura Al-Zahrani", company: "Clothing Store", rating: 5, text: "Customers don't feel they're talking to AI! The responses are natural and smart.", avatar: "N" },
      ],
      faq: [
        { q: "How does the employee learn about my products?", a: "Provide your product catalog or website URL, and it learns automatically within 24 hours." },
        { q: "Does it support Arabic dialects?", a: "Yes! Specially trained on Saudi and Gulf dialects with the ability to respond in formal Arabic." },
        { q: "What happens if it can't answer?", a: "It automatically escalates to a human employee and notifies you immediately." },
        { q: "Can I customize its personality and style?", a: "Completely! You can set its name, style, and tone to match your company identity." },
        { q: "How does it integrate with my website?", a: "With a single line of code added to your site, or via API for integration with any system." },
      ],
    },
    responseTime: { ar: "< ثانية", en: "< 1 sec" },
    link: "/checkout",
  },
  "support-employee": {
    id: "support-employee", emoji: "🛠️",
    color: "from-blue-500 to-cyan-500",
    colorLight: "from-blue-50 to-cyan-50",
    colorBorder: "border-blue-200",
    colorText: "text-blue-600",
    rating: 4.8, reviews: 623, users: "8,900+",
    category: { ar: "دعم فني", en: "Support" },
    ar: {
      name: "موظف الدعم الفني",
      role: "متخصص دعم فني وحل المشاكل",
      tagline: "يحل مشاكل عملاؤك قبل ما يشكون — بدقة تقنية عالية",
      description: "موظف الدعم الفني الذكي يحل مشاكل عملاؤك بسرعة ودقة. يعرف منتجاتك وأنظمتك بالكامل ويقدم حلولاً خطوة بخطوة.\n\nيتعلم من سجلات الدعم السابقة ويتحسن مع كل تذكرة جديدة.",
      features: ["تشخيص المشاكل التقنية تلقائياً","خطوات حل واضحة ومفصّلة","تصعيد المشاكل المعقدة للفريق البشري","قاعدة معرفة ذاتية التحديث","دعم متعدد القنوات","تتبع حالة التذاكر","تقارير أداء الدعم","تكامل مع Zendesk وFreshdesk"],
      useCases: ["شركات SaaS لدعم المستخدمين","شركات الاتصالات","مزودي خدمات الإنترنت","شركات الأجهزة والإلكترونيات"],
      plans: [
        { name: "مجاني", price: "مجاناً", desc: "100 تذكرة شهرياً", popular: false },
        { name: "احترافي", price: "499 ريال/شهر", desc: "تذاكر غير محدودة + تكامل", popular: true },
        { name: "مؤسسي", price: "تواصل معنا", desc: "حلول مخصصة", popular: false },
      ],
      reviewsList: [
        { name: "خالد السبيعي", company: "شركة SaaS", rating: 5, text: "قلّل تذاكر الدعم 60%! العملاء يحلون مشاكلهم بأنفسهم.", avatar: "خ" },
        { name: "ريم الحربي", company: "شركة اتصالات", rating: 4, text: "دقيق جداً في التشخيص. يوفر وقت فريقنا كثيراً.", avatar: "ر" },
        { name: "فهد القحطاني", company: "متجر إلكتروني", rating: 5, text: "أفضل استثمار عملناه. العملاء راضين والفريق مرتاح.", avatar: "ف" },
        { name: "هند العسيري", company: "شركة برمجيات", rating: 5, text: "يتعامل مع المشاكل التقنية المعقدة بشكل مذهل.", avatar: "ه" },
      ],
      faq: [
        { q: "كيف يتعلم عن منتجاتنا التقنية؟", a: "تزوده بوثائق المنتج والـ FAQ وسجلات الدعم السابقة." },
        { q: "هل يقدر يحل مشاكل معقدة؟", a: "نعم لمعظم المشاكل الشائعة. المشاكل المعقدة يحيلها للفريق البشري." },
        { q: "هل يتكامل مع نظام التذاكر الحالي؟", a: "يدعم Zendesk وFreshdesk وJira وأي نظام عبر API." },
        { q: "ما مدى دقة ردوده؟", a: "دقة 94%+ بناءً على بيانات عملاؤنا. يتحسن مع الوقت." },
        { q: "ماذا يصير لو أخطأ؟", a: "يُبلّغ الفريق فوراً ويتعلم من الخطأ لتحسين الأداء." },
      ],
    },
    en: {
      name: "AI Support Employee",
      role: "Technical Support Specialist",
      tagline: "Solves your customers' problems before they complain — with high technical accuracy",
      description: "The AI Technical Support Employee solves your customers' problems quickly and accurately. It knows your products and systems completely and provides step-by-step solutions.\n\nIt learns from previous support logs and improves with each new ticket.",
      features: ["Automatic technical problem diagnosis","Clear and detailed solution steps","Escalate complex issues to human team","Self-updating knowledge base","Multi-channel support","Ticket status tracking","Support performance reports","Integration with Zendesk and Freshdesk"],
      useCases: ["SaaS companies for user support","Telecommunications companies","Internet service providers","Hardware and electronics companies"],
      plans: [
        { name: "Free", price: "Free", desc: "100 tickets/month", popular: false },
        { name: "Professional", price: "$129/month", desc: "Unlimited tickets + integration", popular: true },
        { name: "Enterprise", price: "Contact Us", desc: "Custom solutions", popular: false },
      ],
      reviewsList: [
        { name: "Khalid Al-Subai'i", company: "SaaS Company", rating: 5, text: "Reduced support tickets by 60%! Customers solve their own problems.", avatar: "K" },
        { name: "Reem Al-Harbi", company: "Telecom Company", rating: 4, text: "Very accurate in diagnosis. Saves our team a lot of time.", avatar: "R" },
        { name: "Fahad Al-Qahtani", company: "E-commerce", rating: 5, text: "Best investment we've made. Customers are happy and team is relaxed.", avatar: "F" },
        { name: "Hind Al-Asiri", company: "Software Company", rating: 5, text: "Handles complex technical problems amazingly.", avatar: "H" },
      ],
      faq: [
        { q: "How does it learn about our technical products?", a: "Provide product documentation, FAQ, and previous support logs." },
        { q: "Can it solve complex problems?", a: "Yes for most common issues. Complex problems are escalated to the human team." },
        { q: "Does it integrate with our existing ticket system?", a: "Supports Zendesk, Freshdesk, Jira, and any system via API." },
        { q: "How accurate are its responses?", a: "94%+ accuracy based on our customer data. Improves over time." },
        { q: "What happens if it makes a mistake?", a: "Notifies the team immediately and learns from the error to improve performance." },
      ],
    },
    responseTime: { ar: "< ثانيتين", en: "< 2 sec" },
    link: "/checkout",
  },
  "marketing-employee": {
    id: "marketing-employee", emoji: "📣",
    color: "from-purple-500 to-pink-500",
    colorLight: "from-purple-50 to-pink-50",
    colorBorder: "border-purple-200",
    colorText: "text-purple-600",
    rating: 4.7, reviews: 412, users: "6,200+",
    category: { ar: "تسويق", en: "Marketing" },
    ar: {
      name: "موظف التسويق الذكي",
      role: "متخصص تسويق رقمي ومحتوى",
      tagline: "ينشئ المحتوى، يدير الحملات، ويحلل النتائج — كل يوم بدون كلل",
      description: "موظف التسويق الذكي يتولى كل مهام التسويق الرقمي: من إنشاء المحتوى وإدارة السوشيال ميديا إلى تحليل الأداء وتحسين الحملات الإعلانية.\n\nيتعلم من هوية علامتك التجارية ويكتب بأسلوبك الخاص.",
      features: ["إنشاء محتوى إبداعي للسوشيال ميديا","كتابة إعلانات مدفوعة عالية التحويل","تحليل أداء الحملات وتقديم توصيات","بحث الكلمات المفتاحية وتحسين SEO","إنشاء تقارير تسويقية أسبوعية","إدارة جدول النشر","تحليل المنافسين","اقتراح استراتيجيات نمو"],
      useCases: ["شركات ناشئة تبني حضورها الرقمي","متاجر إلكترونية تبي تزيد مبيعاتها","وكالات تسويق تبي تزيد إنتاجيتها","أصحاب العلامات التجارية الشخصية"],
      plans: [
        { name: "أساسي", price: "399 ريال/شهر", desc: "30 منشور شهرياً + تقارير", popular: false },
        { name: "احترافي", price: "999 ريال/شهر", desc: "محتوى غير محدود + إعلانات + SEO", popular: true },
        { name: "وكالة", price: "2,499 ريال/شهر", desc: "إدارة 10 حسابات + تقارير متقدمة", popular: false },
      ],
      reviewsList: [
        { name: "تركي الشمري", company: "متجر إلكتروني", rating: 5, text: "زاد متابعينا من 2K لـ 50K في 3 أشهر! المحتوى احترافي جداً.", avatar: "ت" },
        { name: "لمى الدوسري", company: "علامة تجارية", rating: 4, text: "يوفر وقت كبير في إنشاء المحتوى. الأفكار دائماً جديدة وإبداعية.", avatar: "ل" },
        { name: "عبدالله الرشيد", company: "شركة ناشئة", rating: 5, text: "أفضل قرار اتخذناه. وفّر علينا راتب موظف تسويق كامل.", avatar: "ع" },
        { name: "منى الحسيني", company: "وكالة تسويق", rating: 5, text: "يساعدنا ننجز أكثر بنفس الفريق. إنتاجيتنا ضاعفت.", avatar: "م" },
      ],
      faq: [
        { q: "هل يفهم اللهجة السعودية في المحتوى؟", a: "نعم! يكتب بالسعودي والخليجي والفصحى حسب ما تحتاج." },
        { q: "هل يقدر يدير إعلانات Google وMeta؟", a: "يقدر يكتب النصوص ويقترح الاستراتيجية، والإدارة الفعلية تحتاج ربط الحسابات." },
        { q: "كيف يعرف عن منتجاتي وجمهوري؟", a: "تزوده بمعلومات شركتك وجمهورك المستهدف، وهو يتكيف تلقائياً." },
        { q: "هل المحتوى أصلي وغير مكرر؟", a: "نعم، كل محتوى يُنشأ خصيصاً لك وفريد 100%." },
        { q: "كم منشور يقدر ينشئ يومياً؟", a: "غير محدود في الخطة الاحترافية. يقدر ينشئ عشرات المنشورات يومياً." },
      ],
    },
    en: {
      name: "AI Marketing Employee",
      role: "Digital Marketing & Content Specialist",
      tagline: "Creates content, manages campaigns, and analyzes results — every day without fatigue",
      description: "The AI Marketing Employee handles all digital marketing tasks: from content creation and social media management to performance analysis and advertising campaign optimization.\n\nIt learns from your brand identity and writes in your own style.",
      features: ["Create creative social media content","Write high-converting paid ads","Analyze campaign performance and provide recommendations","Keyword research and SEO optimization","Create weekly marketing reports","Manage publishing schedule","Competitor analysis","Suggest growth strategies"],
      useCases: ["Startups building their digital presence","E-commerce stores looking to increase sales","Marketing agencies looking to increase productivity","Personal brand owners"],
      plans: [
        { name: "Basic", price: "$99/month", desc: "30 posts/month + reports", popular: false },
        { name: "Professional", price: "$249/month", desc: "Unlimited content + ads + SEO", popular: true },
        { name: "Agency", price: "$599/month", desc: "Manage 10 accounts + advanced reports", popular: false },
      ],
      reviewsList: [
        { name: "Turki Al-Shamri", company: "E-commerce Store", rating: 5, text: "Grew our followers from 2K to 50K in 3 months! Very professional content.", avatar: "T" },
        { name: "Lama Al-Dosari", company: "Brand", rating: 4, text: "Saves a lot of time in content creation. Ideas are always fresh and creative.", avatar: "L" },
        { name: "Abdullah Al-Rashid", company: "Startup", rating: 5, text: "Best decision we made. Saved us a full marketing employee's salary.", avatar: "A" },
        { name: "Mona Al-Husseini", company: "Marketing Agency", rating: 5, text: "Helps us accomplish more with the same team. Our productivity doubled.", avatar: "M" },
      ],
      faq: [
        { q: "Does it understand Arabic dialects in content?", a: "Yes! Writes in Saudi, Gulf, and formal Arabic as needed." },
        { q: "Can it manage Google and Meta ads?", a: "It can write copy and suggest strategy; actual management requires account linking." },
        { q: "How does it know about my products and audience?", a: "Provide your company and target audience information, and it adapts automatically." },
        { q: "Is the content original and unique?", a: "Yes, all content is created specifically for you and 100% unique." },
        { q: "How many posts can it create daily?", a: "Unlimited on the professional plan. Can create dozens of posts daily." },
      ],
    },
    responseTime: { ar: "فوري", en: "Instant" },
    link: "/checkout",
  },
};

const getRelated = (currentId) =>
  Object.values(EMPLOYEES).filter(e => e.id !== currentId).slice(0, 3);

const T = {
  ar: {
    back: "رجوع للسوق", tryDemo: "جرّب مجاناً", hire: "وظّف الآن",
    overview: "نظرة عامة", features: "المميزات", useCases: "حالات الاستخدام",
    plans: "خطط الأسعار", reviews: "آراء العملاء", faq: "الأسئلة الشائعة",
    related: "موظفون مشابهون", monthlyUsers: "مستخدم شهرياً",
    avgResponse: "متوسط الرد", reviewsCount: "تقييم", mostPopular: "الأكثر طلباً",
    availability: "متاح 24/7", watchDemo: "شاهد الديمو", hirePlan: "اختر هذه الخطة",
    verifiedReview: "مراجعة موثّقة", useCasesTitle: "مناسب لـ",
    demoFree: "مجاناً", demoLimit: "10 رسائل", poweredBy: "مدعوم بالذكاء الاصطناعي",
    screenshots: "لقطات الشاشة",
  },
  en: {
    back: "Back to Marketplace", tryDemo: "Try Free", hire: "Hire Now",
    overview: "Overview", features: "Features", useCases: "Use Cases",
    plans: "Pricing Plans", reviews: "Customer Reviews", faq: "FAQ",
    related: "Similar Employees", monthlyUsers: "Monthly Users",
    avgResponse: "Avg Response", reviewsCount: "Reviews", mostPopular: "Most Popular",
    availability: "Available 24/7", watchDemo: "Watch Demo", hirePlan: "Choose This Plan",
    verifiedReview: "Verified Review", useCasesTitle: "Perfect for",
    demoFree: "Free", demoLimit: "10 messages", poweredBy: "Powered by AI",
    screenshots: "Screenshots",
  },
};

export default function AgentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lang, setLang] = useState("ar");
  const [showDemo, setShowDemo] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const isAr = lang === "ar";
  const t = T[lang];
  const dir = isAr ? "rtl" : "ltr";
  const fontClass = isAr ? "font-display-ar" : "font-display-en";
  const BackIcon = isAr ? ArrowRight : ArrowLeft;
  const FwdIcon = isAr ? ArrowLeft : ArrowRight;

  const AGENT = EMPLOYEES[id] || EMPLOYEES["sales-employee"];
  const data = AGENT[lang];
  const related = getRelated(AGENT.id);

  return (
    <div dir={dir} className={`min-h-screen bg-stone-50 ${fontClass}`}>
      <FontImport />

      {showDemo && (
        <DemoChat
          employeeId={AGENT.id}
          employeeName={data.name}
          lang={lang}
          onClose={() => setShowDemo(false)}
          onHire={() => { setShowDemo(false); navigate(AGENT.link); }}
        />
      )}

      {/* Header */}
      <header className="sticky top-0 z-20 bg-stone-950/95 backdrop-blur border-b border-stone-800">
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between gap-4">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-stone-300 hover:text-amber-400 transition-colors text-sm">
            <BackIcon className="w-4 h-4" />
            {t.back}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-stone-950" />
            </div>
            <span className="text-base font-bold text-stone-50">{isAr ? "سوق الموظفين" : "Agent Souq"}</span>
          </div>
          <button onClick={() => setLang(isAr ? "en" : "ar")} className="text-stone-400 hover:text-amber-400 text-sm transition-colors flex items-center gap-1">
            <Globe className="w-4 h-4" />
            {isAr ? "EN" : "عربي"}
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className={`bg-gradient-to-br ${AGENT.colorLight} border-b ${AGENT.colorBorder} py-10`}>
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${AGENT.color} flex items-center justify-center text-4xl shadow-xl shrink-0`}>
              {AGENT.emoji}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${AGENT.colorText} bg-white border ${AGENT.colorBorder}`}>{AGENT.category[lang]}</span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700 flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  {t.availability}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-1">{data.name}</h1>
              <p className={`${AGENT.colorText} font-medium text-sm mb-1`}>{data.role}</p>
              <p className="text-stone-600 text-sm md:text-base leading-relaxed mb-4 max-w-2xl">{data.tagline}</p>
              <div className="flex items-center gap-4 text-sm flex-wrap mb-5">
                <span className="flex items-center gap-1 text-amber-500 font-semibold">
                  <Star className="w-4 h-4 fill-amber-500" />
                  {AGENT.rating}
                  <span className="text-stone-400 font-normal">({AGENT.reviews} {t.reviewsCount})</span>
                </span>
                <span className="flex items-center gap-1 text-stone-500"><Users className="w-4 h-4" />{AGENT.users}</span>
                <span className="flex items-center gap-1 text-stone-500"><Clock className="w-4 h-4" />{AGENT.responseTime[lang]}</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => setShowDemo(true)} className={`flex items-center gap-2 bg-gradient-to-r ${AGENT.color} text-white font-bold rounded-2xl px-6 py-3 text-sm shadow-lg hover:opacity-90 transition-all hover:-translate-y-0.5`}>
                  <MessageCircle className="w-4 h-4" />
                  {t.tryDemo}
                  <span className="bg-white/20 rounded-full px-2 py-0.5 text-xs">{t.demoFree}</span>
                </button>
                <button onClick={() => navigate(AGENT.link)} className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-2xl px-6 py-3 text-sm transition-all">
                  <Zap className="w-4 h-4" />
                  {t.hire}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-white border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-5 py-5">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {[
              { icon: Users, label: t.monthlyUsers, value: AGENT.users },
              { icon: Clock, label: t.avgResponse, value: AGENT.responseTime[lang] },
              { icon: Star, label: isAr ? "التقييم" : "Rating", value: `${AGENT.rating}/5` },
              { icon: MessageCircle, label: t.reviewsCount, value: AGENT.reviews },
              { icon: Shield, label: isAr ? "الضمان" : "Guarantee", value: isAr ? "30 يوم" : "30 days" },
              { icon: Zap, label: isAr ? "الاستجابة" : "Uptime", value: "99.9%" },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <s.icon className={`w-5 h-5 ${AGENT.colorText} mb-1`} />
                <div className="font-bold text-sm text-stone-900">{s.value}</div>
                <div className="text-xs text-stone-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-5 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-12">

            {/* Overview */}
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Bot className={`w-5 h-5 ${AGENT.colorText}`} />
                {t.overview}
              </h2>
              <p className="text-stone-600 leading-relaxed text-sm md:text-base whitespace-pre-line">{data.description}</p>
            </section>

            {/* Features */}
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CheckCircle2 className={`w-5 h-5 ${AGENT.colorText}`} />
                {t.features}
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {data.features.map((f, i) => (
                  <div key={i} className={`flex items-start gap-3 bg-gradient-to-r ${AGENT.colorLight} border ${AGENT.colorBorder} rounded-2xl px-4 py-3`}>
                    <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${AGENT.color} flex items-center justify-center shrink-0 mt-0.5`}>
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm text-stone-700 font-medium">{f}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Use Cases */}
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className={`w-5 h-5 ${AGENT.colorText}`} />
                {t.useCasesTitle}
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {data.useCases.map((uc, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white border border-stone-200 rounded-2xl px-4 py-3">
                    <Award className={`w-4 h-4 ${AGENT.colorText} shrink-0`} />
                    <span className="text-sm text-stone-700">{uc}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Screenshots */}
            <section>
              <h2 className="text-xl font-bold mb-4">{t.screenshots}</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {["واجهة المحادثة","لوحة التحكم","التكامل"].map((label, i) => (
                  <div key={i} className={`rounded-2xl bg-gradient-to-br ${AGENT.color} p-0.5 shadow-lg`}>
                    <div className="bg-white rounded-[14px] overflow-hidden">
                      <div className={`h-32 bg-gradient-to-br ${AGENT.colorLight} flex items-center justify-center`}>
                        <div className="text-center">
                          <div className="text-3xl mb-2">{AGENT.emoji}</div>
                          <div className={`text-xs font-medium ${AGENT.colorText}`}>{label}</div>
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="font-semibold text-xs text-stone-800">{label}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Video / Demo CTA */}
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Play className={`w-5 h-5 ${AGENT.colorText}`} />
                {t.watchDemo}
              </h2>
              <div className={`relative rounded-3xl bg-gradient-to-br ${AGENT.color} overflow-hidden cursor-pointer group`} onClick={() => setShowDemo(true)}>
                <div className="aspect-video flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-2xl">
                      <Play className="w-8 h-8 text-white fill-white ms-1" />
                    </div>
                    <p className="text-white font-bold text-lg">{t.tryDemo}</p>
                    <p className="text-white/70 text-sm mt-1">{t.demoFree} · {t.demoLimit}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Pricing */}
            <section>
              <h2 className="text-xl font-bold mb-4">{t.plans}</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {data.plans.map((p, i) => (
                  <div key={i} className={`relative rounded-3xl border p-5 transition-all hover:shadow-lg ${p.popular ? `border-transparent bg-gradient-to-br ${AGENT.color} text-white shadow-xl` : "border-stone-200 bg-white"}`}>
                    {p.popular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-xs font-bold rounded-full px-3 py-1">{t.mostPopular}</span>
                    )}
                    <div className={`font-bold text-base mb-1 ${p.popular ? "text-white" : "text-stone-900"}`}>{p.name}</div>
                    <div className={`font-bold text-xl mb-2 ${p.popular ? "text-white" : AGENT.colorText}`}>{p.price}</div>
                    <p className={`text-xs leading-relaxed mb-4 ${p.popular ? "text-white/80" : "text-stone-500"}`}>{p.desc}</p>
                    <button onClick={() => navigate(AGENT.link)} className={`w-full rounded-xl py-2.5 text-xs font-bold transition-all ${p.popular ? "bg-white text-stone-900 hover:bg-stone-100" : `bg-gradient-to-r ${AGENT.color} text-white hover:opacity-90`}`}>
                      {t.hirePlan}
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Reviews */}
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Star className={`w-5 h-5 ${AGENT.colorText} fill-current`} />
                {t.reviews}
              </h2>
              <div className="flex items-center gap-3 mb-6">
                <div className={`text-4xl font-black ${AGENT.colorText}`}>{AGENT.rating}</div>
                <div>
                  <div className="flex gap-0.5 mb-1">
                    {[1,2,3,4,5].map(s => <Star key={s} className={`w-4 h-4 ${s <= Math.round(AGENT.rating) ? "fill-amber-400 text-amber-400" : "text-stone-300"}`} />)}
                  </div>
                  <div className="text-xs text-stone-500">{AGENT.reviews} {t.reviewsCount}</div>
                </div>
              </div>
              <div className="space-y-4">
                {data.reviewsList.map((r, i) => (
                  <div key={i} className="bg-white border border-stone-200 rounded-2xl p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${AGENT.color} flex items-center justify-center text-white font-bold text-sm`}>{r.avatar}</div>
                        <div>
                          <div className="font-semibold text-sm text-stone-900 flex items-center gap-1">
                            {r.name}
                            <BadgeCheck className={`w-3.5 h-3.5 ${AGENT.colorText}`} />
                          </div>
                          <div className="text-xs text-stone-500">{r.company}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[1,2,3,4,5].map(s => <Star key={s} className={`w-3.5 h-3.5 ${s <= r.rating ? "fill-amber-400 text-amber-400" : "text-stone-300"}`} />)}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Quote className={`w-4 h-4 ${AGENT.colorText} shrink-0 mt-0.5`} />
                      <p className="text-sm text-stone-600 leading-relaxed">{r.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQ */}
            <section>
              <h2 className="text-xl font-bold mb-4">{t.faq}</h2>
              <div className="space-y-3">
                {data.faq.map((item, i) => (
                  <div key={i} className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
                    <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-4 text-start hover:bg-stone-50 transition-colors">
                      <span className="font-semibold text-sm text-stone-800 flex-1 pe-4">{item.q}</span>
                      {openFaq === i ? <ChevronUp className={`w-4 h-4 ${AGENT.colorText} shrink-0`} /> : <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />}
                    </button>
                    {openFaq === i && (
                      <div className={`px-4 pb-4 text-sm text-stone-600 leading-relaxed border-t border-stone-100 pt-3 bg-gradient-to-r ${AGENT.colorLight} animate-fade-in`}>
                        {item.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-28 space-y-4">
              <div className={`rounded-3xl bg-gradient-to-br ${AGENT.color} p-5 text-white shadow-xl`}>
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">{AGENT.emoji}</div>
                  <div className="font-bold text-lg">{data.name}</div>
                  <div className="text-white/70 text-xs mt-1">{data.role}</div>
                </div>
                <div className="flex justify-center gap-1 mb-3">
                  {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-white text-white" />)}
                </div>
                <button onClick={() => setShowDemo(true)} className="w-full bg-white text-stone-900 font-bold rounded-2xl py-3 text-sm mb-3 hover:bg-stone-100 transition-colors flex items-center justify-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  {t.tryDemo}
                </button>
                <button onClick={() => navigate(AGENT.link)} className="w-full bg-stone-900/30 backdrop-blur text-white font-semibold rounded-2xl py-3 text-sm hover:bg-stone-900/50 transition-colors flex items-center justify-center gap-2">
                  <Zap className="w-4 h-4" />
                  {t.hire}
                </button>
              </div>
              <div className="bg-white border border-stone-200 rounded-3xl p-4 space-y-3">
                {[
                  { icon: Users, label: t.monthlyUsers, value: AGENT.users },
                  { icon: Star, label: isAr ? "التقييم" : "Rating", value: `${AGENT.rating}/5` },
                  { icon: Clock, label: t.avgResponse, value: AGENT.responseTime[lang] },
                  { icon: Shield, label: isAr ? "ضمان استرداد" : "Money-back", value: isAr ? "30 يوم" : "30 days" },
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-stone-500 text-xs"><s.icon className="w-3.5 h-3.5" />{s.label}</div>
                    <div className={`font-semibold text-xs ${AGENT.colorText}`}>{s.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related */}
        <section className="mt-16">
          <h2 className="text-xl font-bold mb-6">{t.related}</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {related.map(emp => (
              <button key={emp.id} onClick={() => navigate(`/agent/${emp.id}`)} className="bg-white border border-stone-200 hover:border-stone-300 rounded-2xl p-4 text-start hover:shadow-lg transition-all group">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${emp.color} flex items-center justify-center text-xl`}>{emp.emoji}</div>
                  <div>
                    <div className="font-bold text-sm text-stone-900">{emp[lang].name}</div>
                    <div className="text-xs text-stone-500">{emp[lang].role}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500 text-xs"><Star className="w-3 h-3 fill-amber-500" />{emp.rating}</div>
                  <span className={`text-xs font-medium ${emp.colorText} flex items-center gap-1`}>
                    {isAr ? "عرض" : "View"}
                    <FwdIcon className="w-3 h-3" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-stone-950 text-stone-400 py-8 mt-16">
        <div className="max-w-6xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-amber-500 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-stone-950" />
            </div>
            <span className="text-stone-300 font-medium">{isAr ? "سوق الموظفين الذكيين" : "Agent Souq"}</span>
          </div>
          <span>© 2026 Agent Souq</span>
        </div>
      </footer>
    </div>
  );
}
