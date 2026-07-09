/**
 * Agent Souq — AI Employee Marketplace Homepage
 * ───────────────────────────────────────────────
 * Sections: Hero, Stats, Categories, Featured, Top Rated,
 *           Trending, Search, Popular Searches, CTA
 */
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles, Search, Star, Users, Clock, Zap, ArrowLeft, ArrowRight,
  Globe, TrendingUp, Award, Shield, MessageCircle, ChevronRight, ChevronLeft,
  Bot, Briefcase, HeadphonesIcon, Megaphone, DollarSign, BarChart2,
  FileText, Code, ShoppingCart, Filter, X, CheckCircle,
} from "lucide-react";

const FontImport = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Inter:wght@400;500;600;700;800&display=swap');
    * { font-family: 'Cairo', 'Inter', sans-serif; }
    @keyframes fadeInUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
    .fade-up { animation: fadeInUp 0.5s ease forwards; }
    @keyframes float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-8px); } }
    .float { animation: float 3s ease-in-out infinite; }
    @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
    .shimmer { background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
    .glass { background: rgba(255,255,255,0.08); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.12); }
    .card-hover { transition: all 0.25s ease; }
    .card-hover:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0,0,0,0.12); }
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
    .gradient-text { background: linear-gradient(135deg, #f59e0b, #ef4444, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  `}</style>
);

// ── Data ──────────────────────────────────────────────────────────────────────
const EMPLOYEES = [
  {
    id: "sales-employee", emoji: "💼",
    color: "from-amber-500 to-orange-500",
    colorLight: "from-amber-50 to-orange-50",
    colorText: "text-amber-600",
    colorBg: "bg-amber-500",
    rating: 4.9, reviews: 847, users: "12,400+",
    badge: { ar: "الأكثر مبيعاً", en: "Best Seller" },
    badgeColor: "bg-amber-500",
    category: "sales",
    ar: { name: "موظف المبيعات الذكي", role: "متخصص مبيعات وخدمة عملاء", desc: "يرد على عملاؤك ويغلق الصفقات 24/7 بأسلوب مهني احترافي", price: "من 299 ريال/شهر" },
    en: { name: "AI Sales Employee", role: "Sales & Customer Service", desc: "Responds to customers and closes deals 24/7 professionally", price: "From $79/month" },
    featured: true, trending: true, topRated: true,
  },
  {
    id: "support-employee", emoji: "🛠️",
    color: "from-blue-500 to-cyan-500",
    colorLight: "from-blue-50 to-cyan-50",
    colorText: "text-blue-600",
    colorBg: "bg-blue-500",
    rating: 4.8, reviews: 623, users: "8,900+",
    badge: { ar: "مجاني للبدء", en: "Free to Start" },
    badgeColor: "bg-green-500",
    category: "support",
    ar: { name: "موظف الدعم الفني", role: "متخصص دعم فني وحل المشاكل", desc: "يحل مشاكل عملاؤك بدقة تقنية عالية قبل ما يشكون", price: "مجاناً للبدء" },
    en: { name: "AI Support Employee", role: "Technical Support Specialist", desc: "Solves customer problems with high technical accuracy", price: "Free to start" },
    featured: true, trending: false, topRated: true,
  },
  {
    id: "marketing-employee", emoji: "📣",
    color: "from-purple-500 to-pink-500",
    colorLight: "from-purple-50 to-pink-50",
    colorText: "text-purple-600",
    colorBg: "bg-purple-500",
    rating: 4.7, reviews: 412, users: "6,200+",
    badge: { ar: "جديد", en: "New" },
    badgeColor: "bg-purple-500",
    category: "marketing",
    ar: { name: "موظف التسويق الذكي", role: "متخصص تسويق رقمي ومحتوى", desc: "ينشئ المحتوى ويدير الحملات ويحلل النتائج كل يوم", price: "من 399 ريال/شهر" },
    en: { name: "AI Marketing Employee", role: "Digital Marketing Specialist", desc: "Creates content, manages campaigns, analyzes results daily", price: "From $99/month" },
    featured: true, trending: true, topRated: false,
  },
  {
    id: "hr-employee", emoji: "👥",
    color: "from-green-500 to-emerald-500",
    colorLight: "from-green-50 to-emerald-50",
    colorText: "text-green-600",
    colorBg: "bg-green-500",
    rating: 4.6, reviews: 289, users: "4,100+",
    badge: { ar: "قريباً", en: "Coming Soon" },
    badgeColor: "bg-stone-500",
    category: "hr",
    ar: { name: "موظف الموارد البشرية", role: "متخصص توظيف وإدارة الكفاءات", desc: "يصفّي المتقدمين ويجري المقابلات الأولية ويدير الإجازات", price: "من 599 ريال/شهر" },
    en: { name: "AI HR Employee", role: "Recruitment & HR Specialist", desc: "Screens candidates, conducts initial interviews, manages leave", price: "From $149/month" },
    featured: false, trending: true, topRated: false,
  },
  {
    id: "finance-employee", emoji: "📊",
    color: "from-teal-500 to-cyan-600",
    colorLight: "from-teal-50 to-cyan-50",
    colorText: "text-teal-600",
    colorBg: "bg-teal-500",
    rating: 4.8, reviews: 198, users: "3,300+",
    badge: { ar: "قريباً", en: "Coming Soon" },
    badgeColor: "bg-stone-500",
    category: "finance",
    ar: { name: "موظف المالية الذكي", role: "متخصص محاسبة وتقارير مالية", desc: "يعد التقارير المالية ويتتبع المصروفات ويحلل الأرباح", price: "من 799 ريال/شهر" },
    en: { name: "AI Finance Employee", role: "Accounting & Financial Reports", desc: "Prepares financial reports, tracks expenses, analyzes profits", price: "From $199/month" },
    featured: false, trending: false, topRated: true,
  },
  {
    id: "content-employee", emoji: "✍️",
    color: "from-rose-500 to-red-500",
    colorLight: "from-rose-50 to-red-50",
    colorText: "text-rose-600",
    colorBg: "bg-rose-500",
    rating: 4.7, reviews: 334, users: "5,600+",
    badge: { ar: "قريباً", en: "Coming Soon" },
    badgeColor: "bg-stone-500",
    category: "content",
    ar: { name: "موظف المحتوى الذكي", role: "كاتب محتوى ومدوّن احترافي", desc: "يكتب المقالات والبلوغ والمحتوى التسويقي بأسلوبك", price: "من 299 ريال/شهر" },
    en: { name: "AI Content Employee", role: "Content Writer & Blogger", desc: "Writes articles, blogs, and marketing content in your style", price: "From $79/month" },
    featured: false, trending: true, topRated: false,
  },
];

const CATEGORIES = [
  { id: "all", icon: Bot, ar: "الكل", en: "All", count: 6 },
  { id: "sales", icon: Briefcase, ar: "مبيعات", en: "Sales", count: 1 },
  { id: "support", icon: HeadphonesIcon, ar: "دعم فني", en: "Support", count: 1 },
  { id: "marketing", icon: Megaphone, ar: "تسويق", en: "Marketing", count: 1 },
  { id: "hr", icon: Users, ar: "موارد بشرية", en: "HR", count: 1 },
  { id: "finance", icon: DollarSign, ar: "مالية", en: "Finance", count: 1 },
  { id: "content", icon: FileText, ar: "محتوى", en: "Content", count: 1 },
];

const POPULAR_SEARCHES = {
  ar: ["موظف مبيعات", "دعم عملاء", "كتابة محتوى", "تسويق رقمي", "موارد بشرية", "محاسبة"],
  en: ["sales employee", "customer support", "content writing", "digital marketing", "HR", "accounting"],
};

const STATS = {
  ar: [
    { value: "50,000+", label: "شركة تستخدمنا" },
    { value: "2M+", label: "محادثة شهرياً" },
    { value: "99.9%", label: "وقت التشغيل" },
    { value: "4.8/5", label: "متوسط التقييم" },
  ],
  en: [
    { value: "50,000+", label: "Companies using us" },
    { value: "2M+", label: "Conversations/month" },
    { value: "99.9%", label: "Uptime" },
    { value: "4.8/5", label: "Average rating" },
  ],
};

const T = {
  ar: {
    brand: "سوق الموظفين", tagline: "وظّف موظفين AI لشركتك",
    heroSub: "موظفون ذكيون يعملون 24/7 — يردون على عملاؤك، يبيعون، يدعمون، ويسوّقون بدون توقف",
    searchPlaceholder: "ابحث عن موظف ذكي...",
    searchBtn: "بحث",
    categories: "تصفّح حسب التخصص",
    featured: "موظفون مميزون",
    topRated: "الأعلى تقييماً",
    trending: "الأكثر طلباً",
    allEmployees: "كل الموظفين",
    tryDemo: "جرّب مجاناً",
    hire: "وظّف الآن",
    viewAll: "عرض الكل",
    popularSearches: "عمليات بحث شائعة:",
    reviews: "تقييم",
    users: "مستخدم",
    ctaTitle: "جاهز لتوظيف موظفك الذكي؟",
    ctaSub: "انضم لـ 50,000+ شركة تستخدم موظفين AI لتنمية أعمالها",
    ctaBtn: "ابدأ مجاناً الآن",
    ctaBtnSub: "لا يلزم بطاقة ائتمان",
    noResults: "لا توجد نتائج",
    noResultsSub: "جرّب كلمات بحث مختلفة",
    filterAll: "الكل",
    sortBy: "ترتيب حسب",
    sortRating: "التقييم",
    sortUsers: "المستخدمين",
    sortNew: "الأحدث",
    heroLabel: "منصة الموظفين الذكيين #1 في المنطقة",
    available: "متاح الآن",
    comingSoon: "قريباً",
  },
  en: {
    brand: "Agent Souq", tagline: "Hire AI Employees for Your Business",
    heroSub: "Smart employees working 24/7 — responding to customers, selling, supporting, and marketing without stopping",
    searchPlaceholder: "Search for an AI employee...",
    searchBtn: "Search",
    categories: "Browse by Specialty",
    featured: "Featured Employees",
    topRated: "Top Rated",
    trending: "Trending",
    allEmployees: "All Employees",
    tryDemo: "Try Free",
    hire: "Hire Now",
    viewAll: "View All",
    popularSearches: "Popular searches:",
    reviews: "reviews",
    users: "users",
    ctaTitle: "Ready to hire your AI employee?",
    ctaSub: "Join 50,000+ companies using AI employees to grow their business",
    ctaBtn: "Start Free Now",
    ctaBtnSub: "No credit card required",
    noResults: "No results found",
    noResultsSub: "Try different search terms",
    filterAll: "All",
    sortBy: "Sort by",
    sortRating: "Rating",
    sortUsers: "Users",
    sortNew: "Newest",
    heroLabel: "#1 AI Employee Platform in the Region",
    available: "Available Now",
    comingSoon: "Coming Soon",
  },
};

// ── Employee Card ─────────────────────────────────────────────────────────────
function EmployeeCard({ emp, lang, t, navigate, compact = false }) {
  const isAr = lang === "ar";
  const data = emp[lang];
  const isComingSoon = emp.badge.en === "Coming Soon";

  return (
    <div
      className={`bg-white border border-stone-200 rounded-3xl overflow-hidden card-hover cursor-pointer group ${compact ? "" : ""}`}
      onClick={() => !isComingSoon && navigate(`/agent/${emp.id}`)}
    >
      {/* Card header gradient */}
      <div className={`bg-gradient-to-br ${emp.colorLight} p-5 relative`}>
        <div className="flex items-start justify-between mb-3">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${emp.color} flex items-center justify-center text-2xl shadow-lg`}>
            {emp.emoji}
          </div>
          <span className={`${emp.badgeColor} text-white text-xs font-bold rounded-full px-2.5 py-1`}>
            {emp.badge[lang]}
          </span>
        </div>
        <h3 className="font-bold text-stone-900 text-sm leading-snug mb-0.5">{data.name}</h3>
        <p className={`text-xs ${emp.colorText} font-medium`}>{data.role}</p>
      </div>

      {/* Card body */}
      <div className="p-4">
        <p className="text-xs text-stone-500 leading-relaxed mb-3 line-clamp-2">{data.desc}</p>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="w-3.5 h-3.5 fill-amber-500" />
            <span className="font-bold text-xs text-stone-800">{emp.rating}</span>
            <span className="text-xs text-stone-400">({emp.reviews})</span>
          </div>
          <div className="flex items-center gap-1 text-stone-400 text-xs">
            <Users className="w-3 h-3" />
            {emp.users}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className={`text-xs font-bold ${emp.colorText}`}>{data.price}</span>
          {isComingSoon ? (
            <span className="text-xs text-stone-400 bg-stone-100 rounded-xl px-3 py-1.5">{t.comingSoon}</span>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); navigate(`/agent/${emp.id}`); }}
              className={`text-xs font-bold bg-gradient-to-r ${emp.color} text-white rounded-xl px-3 py-1.5 hover:opacity-90 transition-opacity flex items-center gap-1`}
            >
              {t.tryDemo}
              {isAr ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function AgentSouq() {
  const navigate = useNavigate();
  const [lang, setLang] = useState("ar");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  const [showSearch, setShowSearch] = useState(false);

  const isAr = lang === "ar";
  const t = T[lang];
  const dir = isAr ? "rtl" : "ltr";
  const FwdIcon = isAr ? ChevronLeft : ChevronRight;

  const stats = STATS[lang];
  const popularSearches = POPULAR_SEARCHES[lang];

  // Filtered & sorted employees
  const filtered = useMemo(() => {
    let list = [...EMPLOYEES];
    if (activeCategory !== "all") list = list.filter(e => e.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(e =>
        e[lang].name.toLowerCase().includes(q) ||
        e[lang].role.toLowerCase().includes(q) ||
        e[lang].desc.toLowerCase().includes(q)
      );
    }
    if (sortBy === "rating") list.sort((a, b) => b.rating - a.rating);
    else if (sortBy === "users") list.sort((a, b) => parseInt(b.users) - parseInt(a.users));
    return list;
  }, [activeCategory, search, sortBy, lang]);

  const featured = EMPLOYEES.filter(e => e.featured);
  const trending = EMPLOYEES.filter(e => e.trending);
  const topRated = EMPLOYEES.filter(e => e.topRated);

  return (
    <div dir={dir} className={`min-h-screen bg-stone-50`}>
      <FontImport />

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-stone-950/95 backdrop-blur border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-base font-bold text-stone-50">{t.brand}</span>
              <div className="text-xs text-stone-500 leading-none hidden sm:block">{isAr ? "سوق الموظفين الذكيين" : "AI Employee Marketplace"}</div>
            </div>
          </div>

          {/* Desktop search */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 ${isAr ? "right-3" : "left-3"}`} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t.searchPlaceholder}
                className={`w-full bg-stone-800 border border-stone-700 rounded-2xl py-2.5 text-sm text-stone-200 placeholder-stone-500 outline-none focus:border-amber-500 transition-colors ${isAr ? "pr-9 pl-4" : "pl-9 pr-4"}`}
                style={{ direction: isAr ? "rtl" : "ltr" }}
              />
              {search && (
                <button onClick={() => setSearch("")} className={`absolute top-1/2 -translate-y-1/2 ${isAr ? "left-3" : "right-3"}`}>
                  <X className="w-3.5 h-3.5 text-stone-400" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setLang(isAr ? "en" : "ar")} className="text-stone-400 hover:text-amber-400 text-sm transition-colors flex items-center gap-1">
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">{isAr ? "EN" : "عربي"}</span>
            </button>
            <button onClick={() => navigate("/auth")} className="hidden sm:flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl px-4 py-2 text-sm transition-colors">
              <Zap className="w-3.5 h-3.5" />
              {isAr ? "ابدأ مجاناً" : "Start Free"}
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative bg-stone-950 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-5 py-16 md:py-24 text-center">
          {/* Label */}
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6 fade-up">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-stone-300 text-xs font-medium">{t.heroLabel}</span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight fade-up" style={{ animationDelay: "0.1s" }}>
            <span className="gradient-text">{t.tagline}</span>
          </h1>
          <p className="text-stone-400 text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed fade-up" style={{ animationDelay: "0.2s" }}>
            {t.heroSub}
          </p>

          {/* Hero search */}
          <div className="max-w-xl mx-auto mb-6 fade-up" style={{ animationDelay: "0.3s" }}>
            <div className="relative flex gap-2">
              <div className="relative flex-1">
                <Search className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 ${isAr ? "right-4" : "left-4"}`} />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className={`w-full bg-stone-800/80 border border-stone-700 rounded-2xl py-4 text-sm text-stone-200 placeholder-stone-500 outline-none focus:border-amber-500 transition-all ${isAr ? "pr-12 pl-4" : "pl-12 pr-4"}`}
                  style={{ direction: isAr ? "rtl" : "ltr" }}
                />
              </div>
              <button
                onClick={() => { if (search) { document.getElementById("all-employees")?.scrollIntoView({ behavior: "smooth" }); } }}
                className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-2xl px-6 py-4 text-sm transition-colors whitespace-nowrap"
              >
                {t.searchBtn}
              </button>
            </div>
          </div>

          {/* Popular searches */}
          <div className="flex flex-wrap items-center justify-center gap-2 fade-up" style={{ animationDelay: "0.4s" }}>
            <span className="text-stone-500 text-xs">{t.popularSearches}</span>
            {popularSearches.map(s => (
              <button
                key={s}
                onClick={() => { setSearch(s); document.getElementById("all-employees")?.scrollIntoView({ behavior: "smooth" }); }}
                className="text-xs text-stone-400 hover:text-amber-400 bg-stone-800/60 hover:bg-stone-800 border border-stone-700 hover:border-amber-500/50 rounded-full px-3 py-1 transition-all"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Floating employee cards preview */}
          <div className="mt-12 flex items-center justify-center gap-4 overflow-hidden">
            {EMPLOYEES.slice(0, 4).map((emp, i) => (
              <div
                key={emp.id}
                className={`glass rounded-2xl px-4 py-3 flex items-center gap-2.5 cursor-pointer hover:border-amber-500/30 transition-all float`}
                style={{ animationDelay: `${i * 0.5}s`, animationDuration: `${3 + i * 0.5}s` }}
                onClick={() => navigate(`/agent/${emp.id}`)}
              >
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${emp.color} flex items-center justify-center text-base`}>{emp.emoji}</div>
                <div className="text-start">
                  <div className="text-white text-xs font-semibold">{emp[lang].name}</div>
                  <div className="flex items-center gap-1">
                    <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                    <span className="text-stone-400 text-xs">{emp.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-5 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl md:text-3xl font-black text-stone-900 mb-1">{s.value}</div>
                <div className="text-xs text-stone-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ─────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-5 py-10">
        <h2 className="text-xl font-bold text-stone-900 mb-5 flex items-center gap-2">
          <Filter className="w-5 h-5 text-amber-500" />
          {t.categories}
        </h2>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`shrink-0 flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition-all ${
                activeCategory === cat.id
                  ? "bg-amber-500 text-stone-950 shadow-lg shadow-amber-500/25"
                  : "bg-white border border-stone-200 text-stone-600 hover:border-amber-300 hover:text-amber-600"
              }`}
            >
              <cat.icon className="w-4 h-4" />
              {cat[lang]}
              <span className={`text-xs rounded-full px-1.5 py-0.5 ${activeCategory === cat.id ? "bg-stone-950/20 text-stone-950" : "bg-stone-100 text-stone-500"}`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Featured Employees ─────────────────────────────────────────────── */}
      {!search && activeCategory === "all" && (
        <section className="max-w-7xl mx-auto px-5 pb-12">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              {t.featured}
            </h2>
            <button className={`text-sm text-amber-600 hover:text-amber-500 font-medium flex items-center gap-1`}>
              {t.viewAll} <FwdIcon className="w-4 h-4" />
            </button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map(emp => (
              <EmployeeCard key={emp.id} emp={emp} lang={lang} t={t} navigate={navigate} />
            ))}
          </div>
        </section>
      )}

      {/* ── Trending ───────────────────────────────────────────────────────── */}
      {!search && activeCategory === "all" && (
        <section className="bg-gradient-to-br from-stone-900 to-stone-950 py-12">
          <div className="max-w-7xl mx-auto px-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-400" />
                {t.trending}
              </h2>
            </div>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
              {trending.map(emp => (
                <div
                  key={emp.id}
                  className="shrink-0 w-64 glass rounded-3xl overflow-hidden cursor-pointer hover:border-amber-500/30 transition-all card-hover"
                  onClick={() => navigate(`/agent/${emp.id}`)}
                >
                  <div className={`bg-gradient-to-br ${emp.color} p-4`}>
                    <div className="text-3xl mb-2">{emp.emoji}</div>
                    <div className="text-white font-bold text-sm">{emp[lang].name}</div>
                    <div className="text-white/70 text-xs mt-0.5">{emp[lang].role}</div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1 text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span className="text-white text-xs font-bold">{emp.rating}</span>
                      </div>
                      <span className="text-stone-400 text-xs">{emp.users}</span>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); navigate(`/agent/${emp.id}`); }}
                      className={`w-full bg-gradient-to-r ${emp.color} text-white text-xs font-bold rounded-xl py-2 hover:opacity-90 transition-opacity`}
                    >
                      {t.tryDemo}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Top Rated ──────────────────────────────────────────────────────── */}
      {!search && activeCategory === "all" && (
        <section className="max-w-7xl mx-auto px-5 py-12">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              {t.topRated}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {topRated.map(emp => (
              <EmployeeCard key={emp.id} emp={emp} lang={lang} t={t} navigate={navigate} />
            ))}
          </div>
        </section>
      )}

      {/* ── All Employees (with search/filter results) ─────────────────────── */}
      <section id="all-employees" className="max-w-7xl mx-auto px-5 pb-16">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <Bot className="w-5 h-5 text-amber-500" />
            {search ? `${isAr ? "نتائج البحث عن" : "Results for"} "${search}"` : t.allEmployees}
            <span className="text-sm font-normal text-stone-400">({filtered.length})</span>
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500">{t.sortBy}:</span>
            {[
              { id: "rating", label: t.sortRating },
              { id: "users", label: t.sortUsers },
            ].map(s => (
              <button
                key={s.id}
                onClick={() => setSortBy(s.id)}
                className={`text-xs rounded-xl px-3 py-1.5 transition-all ${sortBy === s.id ? "bg-amber-500 text-stone-950 font-bold" : "bg-white border border-stone-200 text-stone-600 hover:border-amber-300"}`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="font-bold text-stone-800 text-lg mb-2">{t.noResults}</h3>
            <p className="text-stone-500 text-sm">{t.noResultsSub}</p>
            <button onClick={() => { setSearch(""); setActiveCategory("all"); }} className="mt-4 text-amber-600 hover:text-amber-500 text-sm font-medium">
              {isAr ? "مسح الفلاتر" : "Clear filters"}
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(emp => (
              <EmployeeCard key={emp.id} emp={emp} lang={lang} t={t} navigate={navigate} />
            ))}
          </div>
        )}
      </section>

      {/* ── CTA Banner ─────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-amber-500 to-orange-500 py-16">
        <div className="max-w-3xl mx-auto px-5 text-center">
          <div className="text-4xl mb-4 float">🚀</div>
          <h2 className="text-2xl md:text-3xl font-black text-white mb-3">{t.ctaTitle}</h2>
          <p className="text-white/80 text-sm md:text-base mb-6 leading-relaxed">{t.ctaSub}</p>
          <button
            onClick={() => navigate("/auth")}
            className="bg-white text-stone-900 font-black rounded-2xl px-8 py-4 text-base hover:bg-stone-100 transition-colors shadow-xl inline-flex items-center gap-2"
          >
            <Zap className="w-5 h-5" />
            {t.ctaBtn}
          </button>
          <p className="text-white/60 text-xs mt-3">{t.ctaBtnSub}</p>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="bg-stone-950 text-stone-400 py-10">
        <div className="max-w-7xl mx-auto px-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-stone-200 font-bold">{t.brand}</div>
                <div className="text-stone-500 text-xs">{isAr ? "سوق الموظفين الذكيين" : "AI Employee Marketplace"}</div>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-xs">
              {[
                { ar: "عن المنصة", en: "About", path: "/about" },
                { ar: "التسعير", en: "Pricing", path: "/checkout" },
                { ar: "تسجيل الدخول", en: "Login", path: "/auth" },
                { ar: "لوحة التحكم", en: "Dashboard", path: "/dashboard" },
              ].map(link => (
                <button key={link.path} onClick={() => navigate(link.path)} className="hover:text-amber-400 transition-colors">
                  {link[lang]}
                </button>
              ))}
            </div>
          </div>
          <div className="border-t border-stone-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span>© 2026 Agent Souq — {isAr ? "جميع الحقوق محفوظة" : "All rights reserved"}</span>
            <div className="flex items-center gap-1 text-stone-500">
              <Shield className="w-3 h-3" />
              <span>{isAr ? "آمن ومشفّر" : "Secure & Encrypted"}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
