import { useState } from "react";
import {
  Star,
  Sparkles,
  Globe,
  ArrowLeft,
  ArrowRight,
  Check,
  ExternalLink,
  Shield,
  Users,
  Clock,
  MessageCircle,
} from "lucide-react";

const FontImport = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;900&family=IBM+Plex+Sans+Arabic:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');
    .font-display-ar { font-family: 'Tajawal', 'IBM Plex Sans Arabic', sans-serif; }
    .font-body-ar { font-family: 'IBM Plex Sans Arabic', 'Tajawal', sans-serif; }
    .font-display-en { font-family: 'Space Grotesk', sans-serif; }
    .font-body-en { font-family: 'Inter', sans-serif; }
  `}</style>
);

function SaduBand() {
  const colors = ["#f59e0b", "#0f766e", "#f5f5f4", "#f59e0b", "#0f766e"];
  const tris = Array.from({ length: 40 });
  return (
    <div className="w-full overflow-hidden h-5 flex select-none" aria-hidden="true">
      {tris.map((_, i) => (
        <div
          key={i}
          className="shrink-0"
          style={{
            width: 0,
            height: 0,
            borderLeft: "10px solid transparent",
            borderRight: "10px solid transparent",
            borderBottom: `20px solid ${colors[i % colors.length]}`,
            transform: i % 2 === 0 ? "rotate(0deg)" : "rotate(180deg)",
            opacity: 0.9,
          }}
        />
      ))}
    </div>
  );
}

/* ---------------------------------------------------------
   Sample agent data (would come from the directory in the
   real product — this page focuses on one: "قلمي / Qalami")
--------------------------------------------------------- */
const AGENT = {
  name: { ar: "قلمي", en: "Qalami" },
  tagline: {
    ar: "يصيغ لك مقالات وبوستات سوشيال ميديا بصوتك الخاص خلال ثواني",
    en: "Drafts articles and social posts in your own voice, in seconds",
  },
  category: { ar: "الكتابة والمحتوى", en: "Writing & Content" },
  pricing: "freemium",
  rating: 4.8,
  reviews: 312,
  users: "12,000+",
  responseTime: { ar: "فوري", en: "Instant" },
  description: {
    ar: "قلمي وكيل ذكاء اصطناعي متخصص بالكتابة العربية والإنجليزية. يفهم أسلوبك من نصوص سابقة تعطيه إياها، وبعدين يقدر يكتب مقالات، بوستات سوشيال ميديا، وأوصاف منتجات بنفس نبرتك. مبني خصيصًا للسوق العربي، فاهم للهجات المحلية ومو بس الفصحى.",
    en: "Qalami is an AI agent specialized in Arabic and English writing. It learns your style from sample text you provide, then writes articles, social posts, and product descriptions in your own tone. Built for the Arabic market, it understands regional dialects, not just formal Arabic.",
  },
  features: {
    ar: [
      "يتعلم أسلوبك من ٣ نصوص بس",
      "يدعم اللهجات المحلية (سعودي، خليجي، مصري)",
      "تكامل مباشر مع منصات السوشيال ميديا",
      "مراجعة وتحرير تلقائي قبل النشر",
      "قوالب جاهزة لأكثر من ٢٠ نوع محتوى",
    ],
    en: [
      "Learns your style from just 3 samples",
      "Supports regional dialects (Saudi, Gulf, Egyptian)",
      "Direct integration with social platforms",
      "Automatic review and editing before publishing",
      "20+ ready-made content templates",
    ],
  },
  plans: {
    ar: [
      { name: "مجاني", price: "٠ ريال", desc: "٥٠ كلمة يوميًا، قالبين فقط" },
      { name: "احترافي", price: "٤٩ ريال/شهر", desc: "كتابة غير محدودة، كل القوالب" },
      { name: "فرق العمل", price: "١٩٩ ريال/شهر", desc: "حتى ١٠ مستخدمين + تقارير" },
    ],
    en: [
      { name: "Free", price: "SAR 0", desc: "50 words/day, 2 templates" },
      { name: "Pro", price: "SAR 49/mo", desc: "Unlimited writing, all templates" },
      { name: "Team", price: "SAR 199/mo", desc: "Up to 10 seats + reporting" },
    ],
  },
  reviewsList: {
    ar: [
      { name: "نورة", text: "وفّر علي وقت كبير في كتابة بوستات حسابي، والأسلوب يطلع طبيعي مو آلي.", rating: 5 },
      { name: "عبدالله", text: "ممتاز للمحتوى العربي، بس ودي لو يدعم قوالب أكثر بالخطة المجانية.", rating: 4 },
      { name: "سارة", text: "أول أداة أشوفها تفهم اللهجة السعودية صح.", rating: 5 },
    ],
    en: [
      { name: "Noura", text: "Saved me a ton of time writing posts, and the tone feels natural, not robotic.", rating: 5 },
      { name: "Abdullah", text: "Great for Arabic content, though I wish the free plan had more templates.", rating: 4 },
      { name: "Sarah", text: "First tool I've seen that actually gets Saudi dialect right.", rating: 5 },
    ],
  },
};

const T = {
  ar: {
    brand: "سوق الوكلاء",
    back: "رجوع للسوق",
    tryFree: "جرّبه الآن مجانًا",
    visitSite: "زيارة الموقع الرسمي",
    overview: "نبذة عن الوكيل",
    features: "المميزات",
    plans: "خطط الأسعار",
    reviews: "آراء المستخدمين",
    verified: "وكيل موثّق",
    monthlyUsers: "مستخدم شهريًا",
    avgResponse: "زمن الاستجابة",
    footerTag: "سوق الوكلاء — دليلك العربي لأدوات الذكاء الاصطناعي",
    footerRights: "جميع الحقوق محفوظة",
    mostPopular: "الأكثر اختيارًا",
  },
  en: {
    brand: "Agent Souq",
    back: "Back to Souq",
    tryFree: "Try it Free Now",
    visitSite: "Visit Official Site",
    overview: "About This Agent",
    features: "Features",
    plans: "Pricing Plans",
    reviews: "User Reviews",
    verified: "Verified Agent",
    monthlyUsers: "monthly users",
    avgResponse: "Response time",
    footerTag: "Agent Souq — your Arabic guide to AI tools",
    footerRights: "All rights reserved",
    mostPopular: "Most Popular",
  },
};

export default function AgentDetail() {
  const [lang, setLang] = useState("ar");
  const isAr = lang === "ar";
  const t = T[lang];
  const dir = isAr ? "rtl" : "ltr";
  const fontDisplay = isAr ? "font-display-ar" : "font-display-en";
  const fontBody = isAr ? "font-body-ar" : "font-body-en";
  const BackIcon = isAr ? ArrowRight : ArrowLeft;

  return (
    <div dir={dir} className={`min-h-screen bg-stone-50 ${fontBody} text-stone-900`}>
      <FontImport />

      {/* Header */}
      <header className="sticky top-0 z-20 bg-stone-950/95 backdrop-blur border-b border-stone-800">
        <div className="max-w-4xl mx-auto px-5 py-4 flex items-center justify-between gap-4">
          <div className={`flex items-center gap-2 ${fontDisplay}`}>
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-stone-950" />
            </div>
            <span className="text-lg font-bold text-stone-50">{t.brand}</span>
          </div>
          <button
            onClick={() => setLang(isAr ? "en" : "ar")}
            className="flex items-center gap-1.5 text-sm text-stone-200 border border-stone-700 rounded-full px-3 py-1.5 hover:border-amber-500 hover:text-amber-400 transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            {isAr ? "English" : "العربية"}
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-5">
        <a href="#" className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-teal-700 mt-5 transition-colors">
          <BackIcon className="w-3.5 h-3.5" />
          {t.back}
        </a>

        {/* Hero */}
        <div className="flex flex-col sm:flex-row items-start gap-5 mt-6 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-teal-700 flex items-center justify-center text-white font-bold text-2xl shrink-0">
            {AGENT.name[lang].charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <h1 className={`${fontDisplay} text-2xl md:text-3xl font-black`}>{AGENT.name[lang]}</h1>
              <span className="flex items-center gap-1 text-xs bg-teal-50 text-teal-700 border border-teal-200 rounded-full px-2.5 py-1">
                <Shield className="w-3 h-3" />
                {t.verified}
              </span>
            </div>
            <p className="text-stone-600 text-sm md:text-base leading-relaxed mb-3">{AGENT.tagline[lang]}</p>
            <div className="flex items-center gap-4 text-sm flex-wrap">
              <span className="flex items-center gap-1 text-amber-500 font-medium">
                <Star className="w-4 h-4 fill-amber-500" />
                {AGENT.rating} <span className="text-stone-400">({AGENT.reviews})</span>
              </span>
              <span className="text-stone-500">{AGENT.category[lang]}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-10">
          <button className="flex-1 sm:flex-none bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold rounded-xl px-6 py-3 text-sm transition-colors">
            {t.tryFree}
          </button>
          <button className="flex items-center justify-center gap-2 border border-stone-300 hover:border-stone-400 rounded-xl px-6 py-3 text-sm font-medium transition-colors">
            {t.visitSite}
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-12 border-y border-stone-200 py-6">
          <div className="flex items-center gap-2.5">
            <Users className="w-5 h-5 text-teal-700 shrink-0" />
            <div>
              <div className={`${fontDisplay} font-bold text-sm`}>{AGENT.users}</div>
              <div className="text-xs text-stone-500">{t.monthlyUsers}</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-teal-700 shrink-0" />
            <div>
              <div className={`${fontDisplay} font-bold text-sm`}>{AGENT.responseTime[lang]}</div>
              <div className="text-xs text-stone-500">{t.avgResponse}</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <MessageCircle className="w-5 h-5 text-teal-700 shrink-0" />
            <div>
              <div className={`${fontDisplay} font-bold text-sm`}>{AGENT.reviews}</div>
              <div className="text-xs text-stone-500">{t.reviews}</div>
            </div>
          </div>
        </div>

        {/* Overview */}
        <section className="mb-12">
          <h2 className={`${fontDisplay} text-xl font-bold mb-3`}>{t.overview}</h2>
          <p className="text-stone-600 leading-relaxed text-sm md:text-base">{AGENT.description[lang]}</p>
        </section>

        {/* Features */}
        <section className="mb-12">
          <h2 className={`${fontDisplay} text-xl font-bold mb-4`}>{t.features}</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {AGENT.features[lang].map((f, i) => (
              <div key={i} className="flex items-start gap-2.5 bg-white border border-stone-200 rounded-xl px-4 py-3">
                <Check className="w-4 h-4 text-teal-700 mt-0.5 shrink-0" />
                <span className="text-sm text-stone-700">{f}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Plans */}
        <section className="mb-12">
          <h2 className={`${fontDisplay} text-xl font-bold mb-4`}>{t.plans}</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {AGENT.plans[lang].map((p, i) => (
              <div
                key={i}
                className={`relative rounded-2xl border p-5 ${
                  i === 1 ? "border-amber-400 bg-amber-50/40" : "border-stone-200 bg-white"
                }`}
              >
                {i === 1 && (
                  <span className="absolute -top-3 rtl:right-4 ltr:left-4 bg-amber-500 text-stone-950 text-xs font-semibold rounded-full px-2.5 py-1">
                    {t.mostPopular}
                  </span>
                )}
                <div className={`${fontDisplay} font-bold text-base mb-1`}>{p.name}</div>
                <div className="text-teal-700 font-semibold text-lg mb-2">{p.price}</div>
                <p className="text-xs text-stone-500 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Reviews */}
        <section className="mb-14">
          <h2 className={`${fontDisplay} text-xl font-bold mb-4`}>{t.reviews}</h2>
          <div className="space-y-3">
            {AGENT.reviewsList[lang].map((r, i) => (
              <div key={i} className="bg-white border border-stone-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{r.name}</span>
                  <span className="flex items-center gap-1 text-amber-500 text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    {r.rating}
                  </span>
                </div>
                <p className="text-sm text-stone-600 leading-relaxed">{r.text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <SaduBand />

      <footer className="bg-stone-50 py-8">
        <div className="max-w-4xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <span>{t.footerTag}</span>
          <span>© 2026 {t.brand} — {t.footerRights}</span>
        </div>
      </footer>
    </div>
  );
}
