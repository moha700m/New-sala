import { useState } from "react";
import {
  Sparkles,
  Globe,
  ArrowLeft,
  ArrowRight,
  Check,
  UploadCloud,
  PenLine,
  Code2,
  Megaphone,
  Headphones,
  BarChart3,
  Palette,
  Zap,
  Languages,
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

const PRICING_OPTIONS = [
  { id: "free", ar: "مجاني بالكامل", en: "Fully Free" },
  { id: "freemium", ar: "مجاني جزئي", en: "Freemium" },
  { id: "paid", ar: "مدفوع", en: "Paid" },
];

const T = {
  ar: {
    brand: "سوق الوكلاء",
    back: "رجوع للسوق",
    stepLabel: "خطوة",
    of: "من",
    step1Title: "عرّفنا بوكيلك",
    step1Sub: "معلومات أساسية يشوفها الزوار أول ما يفتحون صفحتك",
    name: "اسم الوكيل",
    namePh: "مثال: قلمي",
    tagline: "وصف قصير (سطر وحد)",
    taglinePh: "مثال: يصيغ لك مقالات بصوتك الخاص خلال ثواني",
    website: "رابط الموقع أو التطبيق",
    websitePh: "https://",
    step2Title: "اختر الفئة والتسعير",
    step2Sub: "يساعدنا نصنّف وكيلك صح عشان يوصل للجمهور المناسب",
    category: "الفئة",
    pricing: "نموذج التسعير",
    step3Title: "التفاصيل والمميزات",
    step3Sub: "وش يميز وكيلك عن غيره؟",
    description: "نبذة كاملة",
    descriptionPh: "اشرح وظيفة الوكيل، كيف يشتغل، ولمين يناسب...",
    features: "أبرز المميزات (كل ميزة بسطر)",
    featuresPh: "يتعلم أسلوبك من ٣ نصوص بس\nيدعم اللهجات المحلية\nتكامل مع منصات السوشيال ميديا",
    logo: "شعار الوكيل",
    logoHint: "اسحب صورة هنا أو اضغط للرفع (PNG أو SVG)",
    next: "التالي",
    back2: "رجوع",
    submit: "إرسال للمراجعة",
    doneTitle: "تم استلام طلبك!",
    doneSub: "فريقنا بيراجع وكيلك خلال ٢-٣ أيام عمل، وبنرسل لك إيميل بمجرد ما يُنشر بالسوق.",
    doneBack: "رجوع للرئيسية",
    footerTag: "سوق الوكلاء — دليلك العربي لأدوات الذكاء الاصطناعي",
    footerRights: "جميع الحقوق محفوظة",
    freeListing: "التسجيل بالسوق مجاني بالكامل",
  },
  en: {
    brand: "Agent Souq",
    back: "Back to Souq",
    stepLabel: "Step",
    of: "of",
    step1Title: "Introduce your agent",
    step1Sub: "Basic info visitors see first when they open your page",
    name: "Agent name",
    namePh: "e.g. Qalami",
    tagline: "Short tagline (one line)",
    taglinePh: "e.g. Drafts articles in your own voice, in seconds",
    website: "Website or app link",
    websitePh: "https://",
    step2Title: "Choose category & pricing",
    step2Sub: "Helps us classify your agent correctly to reach the right audience",
    category: "Category",
    pricing: "Pricing model",
    step3Title: "Details & features",
    step3Sub: "What makes your agent stand out?",
    description: "Full description",
    descriptionPh: "Explain what the agent does, how it works, and who it's for...",
    features: "Key features (one per line)",
    featuresPh: "Learns your style from 3 samples\nSupports regional dialects\nIntegrates with social platforms",
    logo: "Agent logo",
    logoHint: "Drag an image here or click to upload (PNG or SVG)",
    next: "Next",
    back2: "Back",
    submit: "Submit for Review",
    doneTitle: "Submission received!",
    doneSub: "Our team reviews new agents within 2–3 business days, and we'll email you once it's live in the souq.",
    doneBack: "Back to Home",
    footerTag: "Agent Souq — your Arabic guide to AI tools",
    footerRights: "All rights reserved",
    freeListing: "Listing in the souq is completely free",
  },
};

export default function SubmitAgent() {
  const [lang, setLang] = useState("ar");
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    name: "",
    tagline: "",
    website: "",
    category: null,
    pricing: null,
    description: "",
    features: "",
  });

  const isAr = lang === "ar";
  const t = T[lang];
  const dir = isAr ? "rtl" : "ltr";
  const fontDisplay = isAr ? "font-display-ar" : "font-display-en";
  const fontBody = isAr ? "font-body-ar" : "font-body-en";
  const BackIcon = isAr ? ArrowRight : ArrowLeft;
  const NextIcon = isAr ? ArrowLeft : ArrowRight;

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const canProceedStep1 = form.name.trim() && form.tagline.trim();
  const canProceedStep2 = form.category && form.pricing;

  const inputClass =
    "w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-teal-600 transition-colors placeholder:text-stone-400";

  return (
    <div dir={dir} className={`min-h-screen bg-stone-50 ${fontBody} text-stone-900`}>
      <FontImport />

      {/* Header */}
      <header className="sticky top-0 z-20 bg-stone-950/95 backdrop-blur border-b border-stone-800">
        <div className="max-w-2xl mx-auto px-5 py-4 flex items-center justify-between gap-4">
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

      <div className="max-w-2xl mx-auto px-5 py-8">
        {!done && (
          <a href="#" className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-teal-700 mb-6 transition-colors">
            <BackIcon className="w-3.5 h-3.5" />
            {t.back}
          </a>
        )}

        {done ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-teal-700 flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h1 className={`${fontDisplay} text-2xl font-bold mb-3`}>{t.doneTitle}</h1>
            <p className="text-stone-600 text-sm md:text-base max-w-md mx-auto leading-relaxed mb-8">
              {t.doneSub}
            </p>
            <button className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold rounded-xl px-6 py-3 text-sm transition-colors">
              {t.doneBack}
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-teal-700 font-semibold">
                {t.stepLabel} {step} {t.of} 3
              </span>
              <span className="text-xs text-amber-600 font-medium ms-auto">{t.freeListing}</span>
            </div>
            <div className="flex gap-1.5 mb-8">
              {[1, 2, 3].map((s) => (
                <div key={s} className={`h-1.5 flex-1 rounded-full ${s <= step ? "bg-teal-700" : "bg-stone-200"}`} />
              ))}
            </div>

            {step === 1 && (
              <div>
                <h1 className={`${fontDisplay} text-xl font-bold mb-1`}>{t.step1Title}</h1>
                <p className="text-stone-500 text-sm mb-6">{t.step1Sub}</p>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.name}</label>
                    <input
                      className={inputClass}
                      placeholder={t.namePh}
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.tagline}</label>
                    <input
                      className={inputClass}
                      placeholder={t.taglinePh}
                      value={form.tagline}
                      onChange={(e) => update("tagline", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.website}</label>
                    <input
                      className={inputClass}
                      placeholder={t.websitePh}
                      value={form.website}
                      onChange={(e) => update("website", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.logo}</label>
                    <div className="border-2 border-dashed border-stone-300 rounded-xl py-8 text-center hover:border-teal-500 transition-colors cursor-pointer">
                      <UploadCloud className="w-6 h-6 text-stone-400 mx-auto mb-2" />
                      <p className="text-xs text-stone-500">{t.logoHint}</p>
                    </div>
                  </div>
                </div>

                <button
                  disabled={!canProceedStep1}
                  onClick={() => setStep(2)}
                  className="mt-8 w-full flex items-center justify-center gap-2 bg-stone-900 disabled:bg-stone-300 disabled:cursor-not-allowed hover:bg-stone-800 text-white font-semibold rounded-xl px-6 py-3 text-sm transition-colors"
                >
                  {t.next}
                  <NextIcon className="w-4 h-4" />
                </button>
              </div>
            )}

            {step === 2 && (
              <div>
                <h1 className={`${fontDisplay} text-xl font-bold mb-1`}>{t.step2Title}</h1>
                <p className="text-stone-500 text-sm mb-6">{t.step2Sub}</p>

                <label className="block text-sm font-medium mb-3">{t.category}</label>
                <div className="grid grid-cols-2 gap-2.5 mb-7">
                  {CATEGORIES.map((c) => {
                    const Icon = c.icon;
                    const active = form.category === c.id;
                    return (
                      <button
                        key={c.id}
                        onClick={() => update("category", c.id)}
                        className={`flex items-center gap-2 rounded-xl border px-3.5 py-3 text-sm font-medium text-start transition-colors ${
                          active
                            ? "bg-teal-700 text-white border-teal-700"
                            : "bg-white text-stone-700 border-stone-200 hover:border-teal-400"
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        {isAr ? c.ar : c.en}
                      </button>
                    );
                  })}
                </div>

                <label className="block text-sm font-medium mb-3">{t.pricing}</label>
                <div className="grid grid-cols-3 gap-2.5 mb-8">
                  {PRICING_OPTIONS.map((p) => {
                    const active = form.pricing === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => update("pricing", p.id)}
                        className={`rounded-xl border px-3 py-3 text-sm font-medium transition-colors ${
                          active
                            ? "bg-amber-500 text-stone-950 border-amber-500"
                            : "bg-white text-stone-700 border-stone-200 hover:border-amber-400"
                        }`}
                      >
                        {isAr ? p.ar : p.en}
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 flex items-center justify-center gap-2 border border-stone-300 hover:border-stone-400 rounded-xl px-6 py-3 text-sm font-medium transition-colors"
                  >
                    <BackIcon className="w-4 h-4" />
                    {t.back2}
                  </button>
                  <button
                    disabled={!canProceedStep2}
                    onClick={() => setStep(3)}
                    className="flex-1 flex items-center justify-center gap-2 bg-stone-900 disabled:bg-stone-300 disabled:cursor-not-allowed hover:bg-stone-800 text-white font-semibold rounded-xl px-6 py-3 text-sm transition-colors"
                  >
                    {t.next}
                    <NextIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h1 className={`${fontDisplay} text-xl font-bold mb-1`}>{t.step3Title}</h1>
                <p className="text-stone-500 text-sm mb-6">{t.step3Sub}</p>

                <div className="space-y-5 mb-8">
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.description}</label>
                    <textarea
                      rows={4}
                      className={inputClass}
                      placeholder={t.descriptionPh}
                      value={form.description}
                      onChange={(e) => update("description", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.features}</label>
                    <textarea
                      rows={4}
                      className={inputClass}
                      placeholder={t.featuresPh}
                      value={form.features}
                      onChange={(e) => update("features", e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 flex items-center justify-center gap-2 border border-stone-300 hover:border-stone-400 rounded-xl px-6 py-3 text-sm font-medium transition-colors"
                  >
                    <BackIcon className="w-4 h-4" />
                    {t.back2}
                  </button>
                  <button
                    onClick={() => setDone(true)}
                    className="flex-1 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold rounded-xl px-6 py-3 text-sm transition-colors"
                  >
                    {t.submit}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <SaduBand />

      <footer className="bg-stone-50 py-8">
        <div className="max-w-2xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <span>{t.footerTag}</span>
          <span>© 2026 {t.brand} — {t.footerRights}</span>
        </div>
      </footer>
    </div>
  );
}
