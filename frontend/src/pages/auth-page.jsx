import { useState } from "react";
import { Sparkles, Globe, Mail, Lock, User, Eye, EyeOff, ArrowLeft, ArrowRight } from "lucide-react";

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

const T = {
  ar: {
    brand: "سوق الوكلاء",
    back: "رجوع للسوق",
    welcomeTitle: "أهلًا فيك من جديد",
    welcomeSub: "سجّل دخولك عشان تتابع الوكلاء المفضلة عندك وتدير وكيلك",
    signupTitle: "افتح حساب جديد",
    signupSub: "انضم للسوق عشان تكتشف الوكلاء وتضيف وكيلك الخاص",
    name: "الاسم",
    namePh: "اسمك الكامل",
    email: "البريد الإلكتروني",
    emailPh: "example@email.com",
    password: "كلمة المرور",
    passwordPh: "••••••••",
    forgot: "نسيت كلمة المرور؟",
    login: "تسجيل الدخول",
    signup: "إنشاء الحساب",
    or: "أو تابع عبر",
    noAccount: "ما عندك حساب؟",
    haveAccount: "عندك حساب؟",
    createOne: "أنشئ واحد",
    loginInstead: "سجّل دخولك",
    terms: "بإنشائك الحساب، انت موافق على شروط الاستخدام وسياسة الخصوصية",
  },
  en: {
    brand: "Agent Souq",
    back: "Back to Souq",
    welcomeTitle: "Welcome back",
    welcomeSub: "Sign in to follow your favorite agents and manage your listing",
    signupTitle: "Create your account",
    signupSub: "Join the souq to discover agents and list your own",
    name: "Name",
    namePh: "Your full name",
    email: "Email address",
    emailPh: "example@email.com",
    password: "Password",
    passwordPh: "••••••••",
    forgot: "Forgot password?",
    login: "Sign In",
    signup: "Create Account",
    or: "Or continue with",
    noAccount: "Don't have an account?",
    haveAccount: "Already have an account?",
    createOne: "Create one",
    loginInstead: "Sign in",
    terms: "By creating an account, you agree to our Terms of Use and Privacy Policy",
  },
};

export default function AuthPage() {
  const [lang, setLang] = useState("ar");
  const [mode, setMode] = useState("login");
  const [showPw, setShowPw] = useState(false);

  const isAr = lang === "ar";
  const t = T[lang];
  const dir = isAr ? "rtl" : "ltr";
  const fontDisplay = isAr ? "font-display-ar" : "font-display-en";
  const fontBody = isAr ? "font-body-ar" : "font-body-en";
  const BackIcon = isAr ? ArrowRight : ArrowLeft;
  const isLogin = mode === "login";

  const inputWrap = "flex items-center gap-2.5 bg-white border border-stone-300 rounded-xl px-4 py-3 focus-within:border-teal-600 transition-colors";
  const inputEl = `bg-transparent outline-none w-full text-sm placeholder:text-stone-400 ${fontBody}`;

  return (
    <div dir={dir} className={`min-h-screen bg-stone-50 ${fontBody} text-stone-900 flex flex-col`}>
      <FontImport />

      <header className="bg-stone-950/95 backdrop-blur border-b border-stone-800">
        <div className="max-w-md mx-auto px-5 py-4 flex items-center justify-between gap-4">
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

      <div className="flex-1 flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-sm">
          <a href="#" className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-teal-700 mb-6 transition-colors">
            <BackIcon className="w-3.5 h-3.5" />
            {t.back}
          </a>

          <h1 className={`${fontDisplay} text-2xl font-bold mb-1.5`}>
            {isLogin ? t.welcomeTitle : t.signupTitle}
          </h1>
          <p className="text-stone-500 text-sm mb-7">{isLogin ? t.welcomeSub : t.signupSub}</p>

          <div className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-2">{t.name}</label>
                <div className={inputWrap}>
                  <User className="w-4 h-4 text-stone-400 shrink-0" />
                  <input className={inputEl} placeholder={t.namePh} />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">{t.email}</label>
              <div className={inputWrap}>
                <Mail className="w-4 h-4 text-stone-400 shrink-0" />
                <input type="email" className={inputEl} placeholder={t.emailPh} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">{t.password}</label>
                {isLogin && (
                  <button className="text-xs text-teal-700 hover:underline">{t.forgot}</button>
                )}
              </div>
              <div className={inputWrap}>
                <Lock className="w-4 h-4 text-stone-400 shrink-0" />
                <input type={showPw ? "text" : "password"} className={inputEl} placeholder={t.passwordPh} />
                <button onClick={() => setShowPw(!showPw)} className="text-stone-400 hover:text-stone-600 shrink-0">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold rounded-xl px-6 py-3 text-sm transition-colors mt-2">
              {isLogin ? t.login : t.signup}
            </button>
          </div>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-stone-200" />
            <span className="text-xs text-stone-400">{t.or}</span>
            <div className="flex-1 h-px bg-stone-200" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 border border-stone-300 hover:border-stone-400 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors bg-white">
              Google
            </button>
            <button className="flex items-center justify-center gap-2 border border-stone-300 hover:border-stone-400 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors bg-white">
              Apple
            </button>
          </div>

          <p className="text-center text-sm text-stone-500 mt-7">
            {isLogin ? t.noAccount : t.haveAccount}{" "}
            <button
              onClick={() => setMode(isLogin ? "signup" : "login")}
              className="text-teal-700 font-medium hover:underline"
            >
              {isLogin ? t.createOne : t.loginInstead}
            </button>
          </p>

          {!isLogin && (
            <p className="text-center text-xs text-stone-400 mt-4 leading-relaxed">{t.terms}</p>
          )}
        </div>
      </div>

      <SaduBand />
    </div>
  );
}
