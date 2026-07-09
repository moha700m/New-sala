import { useState, useMemo } from "react";
import {
  Search,
  Sparkles,
  Code2,
  Megaphone,
  Headphones,
  BarChart3,
  Palette,
  Zap,
  Languages,
  PenLine,
  ArrowLeft,
  ArrowRight,
  Plus,
  Globe,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

/* ---------------------------------------------------------
   Fonts: Tajawal / IBM Plex Sans Arabic for Arabic,
   Space Grotesk / Inter for English + numerals & logo mark
--------------------------------------------------------- */
const FontImport = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;900&family=IBM+Plex+Sans+Arabic:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');
    .font-display-ar { font-family: 'Tajawal', 'IBM Plex Sans Arabic', sans-serif; }
    .font-body-ar { font-family: 'IBM Plex Sans Arabic', 'Tajawal', sans-serif; }
    .font-display-en { font-family: 'Space Grotesk', sans-serif; }
    .font-body-en { font-family: 'Inter', sans-serif; }
  `}</style>
);

/* ---------------------------------------------------------
   Sadu-inspired triangle band — the signature element.
   A repeating zig-zag of triangles evoking Najdi Sadu
   weaving, standing in for the "market alley" divider.
--------------------------------------------------------- */
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
   Content
--------------------------------------------------------- */
const CATEGORIES = [
  { id: "writing", icon: PenLine, ar: "الكتابة والمحتوى", en: "Writing & Content" },
  { id: "code", icon: Code2, ar: "البرمجة والتطوير", en: "Coding & Dev" },
  { id: "marketing", icon: Megaphone, ar: "التسويق والمبيعات", en: "Marketing & Sales" },
  { id: "support", icon: Headphones, ar: "خدمة العملاء", en: "Customer Support" },
  { id: "data", icon: BarChart3, ar: "تحليل البيانات", en: "Data Analysis" },
  { id: "design", icon: Palette, ar: "التصميم والصور", en: "Design & Images" },
  { id: "productivity", icon: Zap, ar: "الإنتاجية", en: "Productivity" },
  { id: "lang", icon: Languages, ar: "الترجمة واللغات", en: "Translation & Languages" },
];

const AGENTS = [
  { id: 1, cat: "writing", pricing: "paid", link: "https://www.jasper.ai", ar: { name: "Jasper", desc: "أداة كتابة تسويقية معروفة عالميًا، تبني لك مقالات وحملات إعلانية كاملة بناءً على هوية علامتك التجارية." }, en: { name: "Jasper", desc: "A widely-used marketing writing tool that builds full articles and ad campaigns around your brand voice." } },
  { id: 2, cat: "writing", pricing: "freemium", link: "https://www.copy.ai", ar: { name: "Copy.ai", desc: "يولّد نصوص تسويقية ومنشورات سوشيال ميديا بسرعة، ومناسب للفرق الصغيرة اللي تبي محتوى يومي." }, en: { name: "Copy.ai", desc: "Generates marketing copy and social posts quickly — built for small teams needing daily content." } },
  { id: 3, cat: "code", pricing: "paid", link: "https://github.com/features/copilot", ar: { name: "GitHub Copilot", desc: "مساعد برمجة من GitHub يقترح أكواد كاملة أثناء كتابتك، ويشتغل جوّا أغلب المحررات المشهورة." }, en: { name: "GitHub Copilot", desc: "GitHub's coding assistant suggests full code as you type, built into most popular editors." } },
  { id: 4, cat: "code", pricing: "freemium", link: "https://www.cursor.com", ar: { name: "Cursor", desc: "محرر أكواد كامل مبني حول الذكاء الاصطناعي، يفهم مشروعك ويعدّل ملفات متعددة بأمر وحد." }, en: { name: "Cursor", desc: "A full code editor built around AI — understands your project and edits multiple files from one instruction." } },
  { id: 5, cat: "marketing", pricing: "paid", link: "https://surferseo.com", ar: { name: "Surfer SEO", desc: "يحلل صفحات المنافسين ويعطيك خطة كتابة تزيد ترتيبك في محركات البحث." }, en: { name: "Surfer SEO", desc: "Analyzes competitor pages and gives you a content plan to improve search rankings." } },
  { id: 6, cat: "support", pricing: "paid", link: "https://www.intercom.com/fin", ar: { name: "Intercom Fin", desc: "وكيل دعم عملاء يرد تلقائيًا على استفسارات عملائك اعتمادًا على قاعدة معرفة شركتك." }, en: { name: "Intercom Fin", desc: "A customer-support agent that auto-answers queries using your company's knowledge base." } },
  { id: 7, cat: "data", pricing: "freemium", link: "https://julius.ai", ar: { name: "Julius AI", desc: "ترفع له ملف إكسل أو بيانات خام، ويسولف وياك عنها ويطلع لك رسوم بيانية وتحليل فوري." }, en: { name: "Julius AI", desc: "Upload a spreadsheet or raw data and chat with it directly for instant charts and analysis." } },
  { id: 8, cat: "design", pricing: "paid", link: "https://www.midjourney.com", ar: { name: "Midjourney", desc: "من أشهر أدوات توليد الصور بالذكاء الاصطناعي، مناسب للأعمال الفنية والتصاميم الإبداعية." }, en: { name: "Midjourney", desc: "One of the best-known AI image generators, suited for artwork and creative visual design." } },
  { id: 9, cat: "design", pricing: "freemium", link: "https://www.heygen.com", ar: { name: "HeyGen", desc: "ينشئ فيديوهات بأفاتار رقمي ناطق من مجرد نص، ويدعم لهجات ولغات متعددة." }, en: { name: "HeyGen", desc: "Creates talking-avatar videos straight from text, supporting multiple languages and dialects." } },
  { id: 10, cat: "productivity", pricing: "freemium", link: "https://www.notion.so/product/ai", ar: { name: "Notion AI", desc: "يلخّص ملاحظاتك، يكتب مسودات، ويرتب مهامك — كله جوّا مساحة العمل اللي تستخدمها أصلًا." }, en: { name: "Notion AI", desc: "Summarizes notes, drafts text, and organizes tasks right inside the workspace you already use." } },
  { id: 11, cat: "productivity", pricing: "free", link: "https://n8n.io", ar: { name: "n8n", desc: "منصة أتمتة مفتوحة المصدر تربط تطبيقاتك ببعض وتشغّل وكلاء ذكاء اصطناعي داخل مسارات العمل." }, en: { name: "n8n", desc: "An open-source automation platform that connects your apps and runs AI agents inside workflows." } },
  { id: 12, cat: "lang", pricing: "freemium", link: "https://www.deepl.com", ar: { name: "DeepL", desc: "ترجمة تعتبر من الأدق بالسوق، خصوصًا بين العربي والإنجليزي والألماني والفرنسي." }, en: { name: "DeepL", desc: "Considered one of the most accurate translators on the market, especially across Arabic, English, German, and French." } },
];

const PRICING_STYLES = {
  free: "bg-teal-50 text-teal-700 border border-teal-200",
  freemium: "bg-amber-50 text-amber-700 border border-amber-200",
  paid: "bg-stone-100 text-stone-700 border border-stone-300",
};
const PRICING_LABEL = {
  ar: { free: "مجاني", freemium: "مجاني جزئي", paid: "مدفوع" },
  en: { free: "Free", freemium: "Freemium", paid: "Paid" },
};

/* ---------------------------------------------------------
   Translations for chrome / UI text
--------------------------------------------------------- */
const T = {
  ar: {
    brand: "سوق الوكلاء",
    navExplore: "استكشف",
    navCats: "الفئات",
    navSubmit: "أضف وكيلك",
    navAbout: "عن المنصة",
    heroEyebrow: "أول سوق عربي لوكلاء الذكاء الاصطناعي",
    heroTitle: "كل أدوات الذكاء الاصطناعي… في سوق واحد",
    heroSub: "تصفح، قارن، وجرّب مئات وكلاء الذكاء الاصطناعي المصممين يساعدونك تنجز شغلك أسرع — من غير ما تبحث بعشر مواقع.",
    searchPlaceholder: "وش تبي تسوي اليوم؟ اكتب اللي تدوره…",
    ctaBrowse: "استعرض الوكلاء",
    ctaSubmit: "أضف وكيلك مجانًا",
    statAgents: "وكيل مسجّل",
    statCats: "فئة متخصصة",
    statUsers: "زائر شهريًا",
    catsTitle: "تسوّق حسب الفئة",
    catsSub: "كل ركن في السوق له تخصص، اختر اللي يناسب شغلك",
    featuredTitle: "الأكثر رواجًا هالأسبوع",
    featuredSub: "وكلاء جربها المستخدمين وأعطوها تقييم عالي",
    openAgent: "افتح الوكيل",
    ctaBannerTitle: "عندك أداة ذكاء اصطناعي وتبي الناس تكتشفها؟",
    ctaBannerSub: "سجّلها في السوق مجانًا ووصّلها لآلاف الباحثين عن حلول زي حلك.",
    ctaBannerBtn: "سجّل وكيلك الآن",
    footerRights: "جميع الحقوق محفوظة",
    footerTag: "سوق الوكلاء — دليلك العربي لأدوات الذكاء الاصطناعي",
  },
  en: {
    brand: "Agent Souq",
    navExplore: "Explore",
    navCats: "Categories",
    navSubmit: "List Your Agent",
    navAbout: "About",
    heroEyebrow: "The Arab world's marketplace for AI agents",
    heroTitle: "Every AI agent, in one souq",
    heroSub: "Browse, compare, and try hundreds of AI agents built to get your work done faster — without hunting across ten different sites.",
    searchPlaceholder: "What do you want to get done today?",
    ctaBrowse: "Browse Agents",
    ctaSubmit: "List Your Agent Free",
    statAgents: "Listed Agents",
    statCats: "Specialized Categories",
    statUsers: "Monthly Visitors",
    catsTitle: "Shop by category",
    catsSub: "Every corner of the souq has its specialty — pick what fits your work",
    featuredTitle: "Trending this week",
    featuredSub: "Agents users have tried and rated highly",
    openAgent: "Open Agent",
    ctaBannerTitle: "Built an AI tool people should discover?",
    ctaBannerSub: "List it in the souq for free and reach thousands searching for solutions like yours.",
    ctaBannerBtn: "List Your Agent",
    footerRights: "All rights reserved",
    footerTag: "Agent Souq — your Arabic guide to AI tools",
  },
};

export default function AgentSouq() {
  const [lang, setLang] = useState("ar");
  const [activeCat, setActiveCat] = useState(null);
  const [query, setQuery] = useState("");

  const isAr = lang === "ar";
  const t = T[lang];
  const dir = isAr ? "rtl" : "ltr";
  const fontDisplay = isAr ? "font-display-ar" : "font-display-en";
  const fontBody = isAr ? "font-body-ar" : "font-body-en";
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const filtered = useMemo(() => {
    return AGENTS.filter((a) => {
      const name = a[lang].name.toLowerCase();
      const desc = a[lang].desc.toLowerCase();
      const q = query.trim().toLowerCase();
      const matchesQuery = !q || name.includes(q) || desc.includes(q);
      const matchesCat = !activeCat || a.cat === activeCat;
      return matchesQuery && matchesCat;
    });
  }, [query, activeCat, lang]);

  return (
    <div dir={dir} className={`min-h-screen bg-stone-50 ${fontBody} text-stone-900`}>
      <FontImport />

      {/* Header */}
      <header className="sticky top-0 z-20 bg-stone-950/95 backdrop-blur border-b border-stone-800">
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between gap-4">
          <div className={`flex items-center gap-2 ${fontDisplay}`}>
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-stone-950" />
            </div>
            <span className="text-lg font-bold text-stone-50">{t.brand}</span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm text-stone-300">
            <a href="#explore" className="hover:text-amber-400 transition-colors">{t.navExplore}</a>
            <a href="#categories" className="hover:text-amber-400 transition-colors">{t.navCats}</a>
            <a href="#submit" className="hover:text-amber-400 transition-colors">{t.navSubmit}</a>
            <a href="#about" className="hover:text-amber-400 transition-colors">{t.navAbout}</a>
          </nav>

          <button
            onClick={() => setLang(isAr ? "en" : "ar")}
            className="flex items-center gap-1.5 text-sm text-stone-200 border border-stone-700 rounded-full px-3 py-1.5 hover:border-amber-500 hover:text-amber-400 transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            {isAr ? "English" : "العربية"}
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-stone-950 text-stone-50 pb-14 pt-14 md:pt-20">
        <div className="max-w-6xl mx-auto px-5">
          <div className="max-w-2xl">
            <span className="inline-block text-xs tracking-wide text-amber-400 border border-amber-500/40 rounded-full px-3 py-1 mb-5">
              {t.heroEyebrow}
            </span>
            <h1 className={`${fontDisplay} text-4xl md:text-5xl font-black leading-[1.15] mb-5`}>
              {t.heroTitle}
            </h1>
            <p className="text-stone-300 text-base md:text-lg leading-relaxed mb-8">
              {t.heroSub}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 flex items-center gap-2 bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 focus-within:border-amber-500 transition-colors">
                <Search className="w-4 h-4 text-stone-500 shrink-0" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className={`bg-transparent outline-none w-full text-sm placeholder:text-stone-500 ${fontBody}`}
                />
              </div>
              <a
                href="#explore"
                className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold rounded-xl px-5 py-3 text-sm transition-colors"
              >
                {t.ctaBrowse}
                <ArrowIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-12 max-w-lg">
            {[
              [AGENTS.length + "+", t.statAgents],
              [CATEGORIES.length, t.statCats],
              ["40K+", t.statUsers],
            ].map(([num, label]) => (
              <div key={label}>
                <div className={`${fontDisplay} text-2xl font-bold text-amber-400`}>{num}</div>
                <div className="text-xs text-stone-400 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SaduBand />

      {/* Categories */}
      <section id="categories" className="bg-stone-50 py-14">
        <div className="max-w-6xl mx-auto px-5">
          <h2 className={`${fontDisplay} text-2xl font-bold mb-1`}>{t.catsTitle}</h2>
          <p className="text-stone-500 text-sm mb-7">{t.catsSub}</p>

          <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 snap-x">
            <button
              onClick={() => setActiveCat(null)}
              className={`shrink-0 snap-start rounded-2xl border px-4 py-3 text-sm font-medium transition-colors ${
                activeCat === null
                  ? "bg-stone-900 text-stone-50 border-stone-900"
                  : "bg-white text-stone-700 border-stone-200 hover:border-amber-400"
              }`}
            >
              {isAr ? "الكل" : "All"}
            </button>
            {CATEGORIES.map((c) => {
              const Icon = c.icon;
              const active = activeCat === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveCat(active ? null : c.id)}
                  className={`shrink-0 snap-start flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition-colors ${
                    active
                      ? "bg-teal-700 text-white border-teal-700"
                      : "bg-white text-stone-700 border-stone-200 hover:border-teal-400"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {isAr ? c.ar : c.en}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured / Grid */}
      <section id="explore" className="bg-white py-14 border-t border-stone-100">
        <div className="max-w-6xl mx-auto px-5">
          <h2 className={`${fontDisplay} text-2xl font-bold mb-1`}>{t.featuredTitle}</h2>
          <p className="text-stone-500 text-sm mb-8">{t.featuredSub}</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((a) => (
              <div
                key={a.id}
                className="group rounded-2xl border border-stone-200 hover:border-amber-400 hover:shadow-lg transition-all p-5 flex flex-col"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-700 flex items-center justify-center text-white font-bold shrink-0">
                    {a[lang].name.charAt(0)}
                  </div>
                  <span className={`text-xs rounded-full px-2.5 py-1 ${PRICING_STYLES[a.pricing]}`}>
                    {PRICING_LABEL[lang][a.pricing]}
                  </span>
                </div>

                <h3 className={`${fontDisplay} font-bold text-lg mb-1.5`}>{a[lang].name}</h3>
                <p className="text-sm text-stone-600 leading-relaxed mb-4 flex-1">{a[lang].desc}</p>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-teal-700 text-xs font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {isAr ? "أداة حقيقية" : "Real tool"}
                  </span>
                  <a
                    href={a.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-teal-700 flex items-center gap-1 group-hover:gap-2 transition-all"
                  >
                    {t.openAgent}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-stone-400 py-14 text-sm">
              {isAr ? "ما لقينا وكيل يطابق بحثك، جرّب كلمة ثانية." : "No agents match your search — try another term."}
            </p>
          )}
        </div>
      </section>

      {/* Submit CTA */}
      <section id="submit" className="bg-stone-950 text-stone-50 py-16">
        <div className="max-w-3xl mx-auto px-5 text-center">
          <Plus className="w-8 h-8 text-amber-400 mx-auto mb-4" />
          <h2 className={`${fontDisplay} text-2xl md:text-3xl font-bold mb-3`}>{t.ctaBannerTitle}</h2>
          <p className="text-stone-400 text-sm md:text-base mb-7 max-w-xl mx-auto leading-relaxed">
            {t.ctaBannerSub}
          </p>
          <button className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold rounded-xl px-6 py-3 text-sm transition-colors">
            {t.ctaBannerBtn}
          </button>
        </div>
      </section>

      <SaduBand />

      {/* Footer */}
      <footer id="about" className="bg-stone-50 py-8">
        <div className="max-w-6xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <span>{t.footerTag}</span>
          <span>© 2026 {t.brand} — {t.footerRights}</span>
        </div>
      </footer>
    </div>
  );
}
