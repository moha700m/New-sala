import { useState } from "react";
import { Sparkles, Globe, Target, Users, ShieldCheck, Heart, Mail, ArrowLeft, ArrowRight } from "lucide-react";

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

const VALUES = [
  { icon: Target, ar: { title: "وضوح لا تعقيد", text: "نختصر عليك البحث والمقارنة، ونعرض المعلومة الصح من أول نظرة." }, en: { title: "Clarity over clutter", text: "We cut the research and comparison for you, showing the right info at a glance." } },
  { icon: ShieldCheck, ar: { title: "مراجعة قبل النشر", text: "كل وكيل يدخل السوق يمر على فريقنا أول، عشان تثق باللي تختاره." }, en: { title: "Reviewed before listing", text: "Every agent is checked by our team first, so you can trust what you pick." } },
  { icon: Users, ar: { title: "صوت المستخدم", text: "التقييمات والمراجعات من مستخدمين حقيقيين، ما نلمّعها ولا نخفيها." }, en: { title: "The user's voice", text: "Ratings and reviews come from real users — never polished or hidden." } },
  { icon: Heart, ar: { title: "مبني للسوق العربي", text: "نفهم اللهجات، نفهم احتياج السوق المحلي، وما نترجم بس من الإنجليزي." }, en: { title: "Built for the Arab market", text: "We understand dialects and local needs — not just a translation of English." } },
];

const STATS = [
  { ar: "٤٠٠+", en: "400+", ar_l: "وكيل مسجّل", en_l: "Listed agents" },
  { ar: "٨", en: "8", ar_l: "فئات متخصصة", en_l: "Specialized categories" },
  { ar: "٤٠ ألف+", en: "40K+", ar_l: "زائر شهريًا", en_l: "Monthly visitors" },
  { ar: "٢٠٢٥", en: "2025", ar_l: "سنة التأسيس", en_l: "Founded" },
];

const T = {
  ar: {
    brand: "سوق الوكلاء",
    back: "رجوع للسوق",
    heroEyebrow: "قصتنا",
    heroTitle: "بنينا سوق الوكلاء عشان نفس السؤال يتكرر علينا كل مرة",
    heroText: "\"وش أفضل أداة ذكاء اصطناعي أستخدمها لكذا؟\" — سؤال كنا نجاوب عليه لأصحابنا كل أسبوع، لين قررنا نجمع الإجابة كلها بمكان واحد، بلغتنا، وبطريقة سهلة نثق فيها.",
    valuesTitle: "وش يميزنا",
    statsTitle: "بالأرقام",
    contactTitle: "عندك سؤال أو اقتراح؟",
    contactText: "فريقنا يسمعك، تواصل وياه في أي وقت.",
    contactBtn: "راسلنا",
    footerTag: "سوق الوكلاء — دليلك العربي لأدوات الذكاء الاصطناعي",
    footerRights: "جميع الحقوق محفوظة",
  },
  en: {
    brand: "Agent Souq",
    back: "Back to Souq",
    heroEyebrow: "Our Story",
    heroTitle: "We built Agent Souq because we kept hearing the same question",
    heroText: '"What\'s the best AI tool for this?" — a question we answered for friends every week, until we decided to gather every answer in one place, in our language, in a way we could trust.',
    valuesTitle: "What sets us apart",
    statsTitle: "By the numbers",
    contactTitle: "Have a question or suggestion?",
    contactText: "Our team is listening — reach out any time.",
    contactBtn: "Contact Us",
    footerTag: "Agent Souq — your Arabic guide to AI tools",
    footerRights: "All rights reserved",
  },
};

export default function AboutPage() {
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
        <div className="max-w-2xl mt-8 mb-14">
          <span className="inline-block text-xs tracking-wide text-teal-700 border border-teal-200 bg-teal-50 rounded-full px-3 py-1 mb-5">
            {t.heroEyebrow}
          </span>
          <h1 className={`${fontDisplay} text-3xl md:text-4xl font-black leading-[1.2] mb-5`}>
            {t.heroTitle}
          </h1>
          <p className="text-stone-600 text-base leading-relaxed">{t.heroText}</p>
        </div>

        {/* Values */}
        <section className="mb-14">
          <h2 className={`${fontDisplay} text-xl font-bold mb-6`}>{t.valuesTitle}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {VALUES.map((v, i) => {
              const Icon = v.icon;
              const content = isAr ? v.ar : v.en;
              return (
                <div key={i} className="bg-white border border-stone-200 rounded-2xl p-5">
                  <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center mb-4">
                    <Icon className="w-4.5 h-4.5 text-amber-600" />
                  </div>
                  <h3 className={`${fontDisplay} font-bold text-sm mb-1.5`}>{content.title}</h3>
                  <p className="text-sm text-stone-600 leading-relaxed">{content.text}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Stats */}
        <section className="mb-14 bg-stone-950 text-stone-50 rounded-2xl p-8">
          <h2 className={`${fontDisplay} text-lg font-bold mb-6 text-center`}>{t.statsTitle}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {STATS.map((s, i) => (
              <div key={i}>
                <div className={`${fontDisplay} text-2xl md:text-3xl font-black text-amber-400`}>
                  {isAr ? s.ar : s.en}
                </div>
                <div className="text-xs text-stone-400 mt-1.5">{isAr ? s.ar_l : s.en_l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="mb-16 text-center">
          <Mail className="w-7 h-7 text-teal-700 mx-auto mb-4" />
          <h2 className={`${fontDisplay} text-xl font-bold mb-2`}>{t.contactTitle}</h2>
          <p className="text-stone-500 text-sm mb-6">{t.contactText}</p>
          <button className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold rounded-xl px-6 py-3 text-sm transition-colors">
            {t.contactBtn}
          </button>
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
