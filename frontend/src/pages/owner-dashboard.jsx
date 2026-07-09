import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Sparkles,
  Globe,
  Users,
  Star,
  Eye,
  TrendingUp,
  Settings,
  MessageCircle,
  ArrowUpRight,
  ArrowDownRight,
  LogOut,
  Loader2,
} from "lucide-react";
import { getSession, getUser, signOut } from '../lib/supabase'

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

const WEEKLY_VISITS = [420, 380, 510, 460, 610, 730, 690];
const DAY_LABELS = {
  ar: ["سبت", "أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة"],
  en: ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"],
};

const RECENT_REVIEWS = [
  { name: { ar: "نورة", en: "Noura" }, rating: 5, text: { ar: "وفّر علي وقت كبير في كتابة بوستات حسابي.", en: "Saved me a ton of time writing posts." }, time: { ar: "قبل يومين", en: "2 days ago" } },
  { name: { ar: "عبدالله", en: "Abdullah" }, rating: 4, text: { ar: "ممتاز للمحتوى العربي، ودي لو يدعم قوالب أكثر.", en: "Great for Arabic content, wish it had more templates." }, time: { ar: "قبل ٤ أيام", en: "4 days ago" } },
  { name: { ar: "سارة", en: "Sarah" }, rating: 5, text: { ar: "أول أداة تفهم اللهجة السعودية صح.", en: "First tool that actually gets Saudi dialect right." }, time: { ar: "قبل أسبوع", en: "A week ago" } },
];

const T = {
  ar: {
    brand: "سوق الوكلاء",
    dashboard: "لوحة التحكم",
    greeting: "أهلًا، مالك وكيل \"قلمي\"",
    settings: "الإعدادات",
    visitsThisWeek: "الزيارات هالأسبوع",
    rating: "التقييم العام",
    reviews: "عدد المراجعات",
    conversion: "نسبة التحويل للتجربة",
    vsLastWeek: "مقارنة بالأسبوع اللي فات",
    visitsChart: "الزيارات اليومية",
    recentReviews: "أحدث المراجعات",
    viewAll: "عرض الكل",
    tip: "نصيحة",
    tipText: "الوكلاء اللي يردّون على المراجعات يزيد تفاعل زوارهم بنسبة ٣٠٪ تقريبًا.",
  },
  en: {
    brand: "Agent Souq",
    dashboard: "Dashboard",
    greeting: 'Hey, owner of "Qalami"',
    settings: "Settings",
    visitsThisWeek: "Visits this week",
    rating: "Overall Rating",
    reviews: "Total Reviews",
    conversion: "Trial Conversion",
    vsLastWeek: "vs. last week",
    visitsChart: "Daily visits",
    recentReviews: "Recent Reviews",
    viewAll: "View All",
    tip: "Tip",
    tipText: "Agents that reply to reviews see about 30% more visitor engagement.",
  },
};

export default function OwnerDashboard() {
  const navigate = useNavigate()
  const [lang, setLang] = useState("ar");
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const isAr = lang === "ar";
  const t = T[lang];
  const dir = isAr ? "rtl" : "ltr";
  const fontDisplay = isAr ? "font-display-ar" : "font-display-en";
  const fontBody = isAr ? "font-body-ar" : "font-body-en";

  useEffect(() => {
    getSession().then(session => {
      if (!session) {
        navigate('/auth')
      } else {
        getUser().then(u => setUser(u))
        setAuthLoading(false)
      }
    })
  }, [navigate])

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    )
  }

  const maxVisit = Math.max(...WEEKLY_VISITS);
  const days = DAY_LABELS[lang];

  const stats = [
    { label: t.visitsThisWeek, value: "4,120", delta: "+12%", up: true, icon: Eye },
    { label: t.rating, value: "4.8", delta: "+0.1", up: true, icon: Star },
    { label: t.reviews, value: "312", delta: "+8", up: true, icon: MessageCircle },
    { label: t.conversion, value: "18%", delta: "-2%", up: false, icon: TrendingUp },
  ];

  return (
    <div dir={dir} className={`min-h-screen bg-stone-50 ${fontBody} text-stone-900`}>
      <FontImport />

      <header className="sticky top-0 z-20 bg-stone-950/95 backdrop-blur border-b border-stone-800">
        <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between gap-4">
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

      <div className="max-w-5xl mx-auto px-5 py-8">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
          <div>
            <span className="text-xs text-teal-700 font-semibold uppercase tracking-wide">{t.dashboard}</span>
            <h1 className={`${fontDisplay} text-2xl font-bold mt-1`}>{isAr ? `أهلًا، ${user?.user_metadata?.full_name || user?.email || 'بك'}` : `Hey, ${user?.user_metadata?.full_name || user?.email || 'there'}`}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 border border-stone-300 hover:border-stone-400 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors bg-white">
              <Settings className="w-4 h-4" />
              {t.settings}
            </button>
            <button onClick={handleSignOut} className="flex items-center gap-2 border border-red-200 hover:border-red-400 text-red-600 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors bg-white">
              <LogOut className="w-4 h-4" />
              {isAr ? 'تسجيل الخروج' : 'Sign Out'}
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => {
            const Icon = s.icon;
            const DeltaIcon = s.up ? ArrowUpRight : ArrowDownRight;
            return (
              <div key={s.label} className="bg-white border border-stone-200 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center">
                    <Icon className="w-4.5 h-4.5 text-teal-700" />
                  </div>
                  <span
                    className={`flex items-center gap-0.5 text-xs font-medium ${
                      s.up ? "text-teal-700" : "text-red-500"
                    }`}
                  >
                    <DeltaIcon className="w-3 h-3" />
                    {s.delta}
                  </span>
                </div>
                <div className={`${fontDisplay} text-2xl font-bold`}>{s.value}</div>
                <div className="text-xs text-stone-500 mt-1">{s.label}</div>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Visits chart */}
          <div className="lg:col-span-2 bg-white border border-stone-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className={`${fontDisplay} font-bold`}>{t.visitsChart}</h2>
              <span className="text-xs text-stone-400">{t.vsLastWeek}</span>
            </div>
            <div className="flex items-end justify-between gap-2 h-40">
              {WEEKLY_VISITS.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t-md bg-teal-700 hover:bg-amber-500 transition-colors"
                    style={{ height: `${(v / maxVisit) * 100}%` }}
                    title={`${v}`}
                  />
                  <span className="text-xs text-stone-400">{days[i]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tip + reviews summary */}
          <div className="flex flex-col gap-6">
            <div className="bg-stone-950 text-stone-50 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wide">{t.tip}</span>
              </div>
              <p className="text-sm text-stone-300 leading-relaxed">{t.tipText}</p>
            </div>
          </div>
        </div>

        {/* Recent reviews */}
        <div className="mt-6 bg-white border border-stone-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className={`${fontDisplay} font-bold`}>{t.recentReviews}</h2>
            <button className="text-sm text-teal-700 font-medium hover:underline">{t.viewAll}</button>
          </div>
          <div className="space-y-3">
            {RECENT_REVIEWS.map((r, i) => (
              <div key={i} className="flex items-start justify-between gap-4 border-b border-stone-100 last:border-0 pb-3 last:pb-0">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{r.name[lang]}</span>
                    <span className="flex items-center gap-0.5 text-amber-500 text-xs">
                      <Star className="w-3 h-3 fill-amber-500" />
                      {r.rating}
                    </span>
                  </div>
                  <p className="text-sm text-stone-600">{r.text[lang]}</p>
                </div>
                <span className="text-xs text-stone-400 shrink-0">{r.time[lang]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10">
        <SaduBand />
      </div>
    </div>
  );
}
