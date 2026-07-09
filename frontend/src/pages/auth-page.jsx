/**
 * Auth Page — Agent Souq
 * Login / Register / Reset Password powered by Supabase
 */
import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Sparkles, Globe, Mail, Lock, User, Eye, EyeOff, ArrowLeft, ArrowRight, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { signIn, signUp, resetPassword, getSession } from '../lib/supabase'

const FontImport = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;900&family=IBM+Plex+Sans+Arabic:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');
    .font-display-ar { font-family: 'Tajawal', 'IBM Plex Sans Arabic', sans-serif; }
    .font-body-ar { font-family: 'IBM Plex Sans Arabic', 'Tajawal', sans-serif; }
    .font-display-en { font-family: 'Space Grotesk', sans-serif; }
    .font-body-en { font-family: 'Inter', sans-serif; }
  `}</style>
)

function SaduBand() {
  const colors = ['#f59e0b', '#0f766e', '#f5f5f4', '#f59e0b', '#0f766e']
  const tris = Array.from({ length: 40 })
  return (
    <div className="w-full overflow-hidden h-5 flex select-none" aria-hidden="true">
      {tris.map((_, i) => (
        <div key={i} className="shrink-0" style={{
          width: 0, height: 0,
          borderLeft: '10px solid transparent',
          borderRight: '10px solid transparent',
          borderBottom: `20px solid ${colors[i % colors.length]}`,
          transform: i % 2 === 0 ? 'rotate(0deg)' : 'rotate(180deg)',
          opacity: 0.9,
        }} />
      ))}
    </div>
  )
}

const T = {
  ar: {
    brand: 'سوق الموظفين',
    back: 'رجوع للسوق',
    welcomeTitle: 'أهلًا فيك من جديد',
    welcomeSub: 'سجّل دخولك عشان تتابع موظفيك الذكيين وتدير اشتراكاتك',
    signupTitle: 'افتح حساب جديد',
    signupSub: 'انضم للسوق عشان تكتشف الموظفين الذكيين وتوظّفهم',
    resetTitle: 'استعادة كلمة المرور',
    resetSub: 'أدخل بريدك الإلكتروني وراح نرسل لك رابط الاستعادة',
    name: 'الاسم الكامل',
    namePh: 'محمد العمري',
    email: 'البريد الإلكتروني',
    emailPh: 'example@email.com',
    password: 'كلمة المرور',
    passwordPh: '6 أحرف على الأقل',
    forgot: 'نسيت كلمة المرور؟',
    loginBtn: 'تسجيل الدخول',
    signupBtn: 'إنشاء الحساب',
    resetBtn: 'إرسال رابط الاستعادة',
    or: 'أو',
    noAccount: 'ما عندك حساب؟',
    haveAccount: 'عندك حساب؟',
    createOne: 'أنشئ واحد',
    loginInstead: 'سجّل دخولك',
    backToLogin: 'رجوع لتسجيل الدخول',
    terms: 'بإنشائك الحساب، انت موافق على شروط الاستخدام وسياسة الخصوصية',
    resetSent: 'تم إرسال رابط الاستعادة! تحقق من بريدك الإلكتروني.',
    checkEmail: 'تم إنشاء الحساب! تحقق من بريدك الإلكتروني لتأكيد الحساب.',
    loginSuccess: 'تم تسجيل الدخول بنجاح! جاري التحويل...',
  },
  en: {
    brand: 'AgentSouq',
    back: 'Back to Marketplace',
    welcomeTitle: 'Welcome back',
    welcomeSub: 'Sign in to manage your AI employees and subscriptions',
    signupTitle: 'Create your account',
    signupSub: 'Join the marketplace to discover and hire AI employees',
    resetTitle: 'Reset Password',
    resetSub: 'Enter your email and we will send you a reset link',
    name: 'Full Name',
    namePh: 'John Smith',
    email: 'Email Address',
    emailPh: 'example@email.com',
    password: 'Password',
    passwordPh: 'At least 6 characters',
    forgot: 'Forgot password?',
    loginBtn: 'Sign In',
    signupBtn: 'Create Account',
    resetBtn: 'Send Reset Link',
    or: 'or',
    noAccount: "Don't have an account?",
    haveAccount: 'Already have an account?',
    createOne: 'Create one',
    loginInstead: 'Sign in',
    backToLogin: 'Back to login',
    terms: 'By creating an account, you agree to our Terms of Service and Privacy Policy',
    resetSent: 'Reset link sent! Check your email.',
    checkEmail: 'Account created! Check your email to confirm.',
    loginSuccess: 'Signed in successfully! Redirecting...',
  }
}

export default function AuthPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const initialMode = searchParams.get('mode') || 'login'
  const [mode, setMode] = useState(initialMode)
  const [lang, setLang] = useState('ar')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const t = T[lang]
  const isAr = lang === 'ar'
  const dir = isAr ? 'rtl' : 'ltr'
  const fontDisplay = isAr ? 'font-display-ar' : 'font-display-en'
  const fontBody = isAr ? 'font-body-ar' : 'font-body-en'
  const BackIcon = isAr ? ArrowRight : ArrowLeft

  useEffect(() => {
    getSession().then(session => {
      if (session) navigate('/dashboard')
    })
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password)
        if (error) throw error
        setMessage({ type: 'success', text: t.loginSuccess })
        setTimeout(() => navigate('/dashboard'), 900)
      } else if (mode === 'signup') {
        const { error } = await signUp(email, password, name)
        if (error) throw error
        setMessage({ type: 'success', text: t.checkEmail })
      } else if (mode === 'reset') {
        const { error } = await resetPassword(email)
        if (error) throw error
        setMessage({ type: 'success', text: t.resetSent })
      }
    } catch (err) {
      const errMap = {
        'Invalid login credentials': isAr ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة' : 'Invalid email or password',
        'User already registered': isAr ? 'هذا البريد مسجّل بالفعل' : 'Email already registered',
        'Password should be at least 6 characters': isAr ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Password must be at least 6 characters',
        'Email not confirmed': isAr ? 'يرجى تأكيد بريدك الإلكتروني أولاً' : 'Please confirm your email first',
      }
      setMessage({ type: 'error', text: errMap[err.message] || (isAr ? 'حدث خطأ، حاول مرة أخرى' : 'An error occurred, please try again') })
    } finally {
      setLoading(false)
    }
  }

  const inputWrap = 'flex items-center gap-2.5 bg-white border border-stone-300 rounded-xl px-4 py-3 focus-within:border-teal-600 transition-colors'
  const inputEl = `bg-transparent outline-none w-full text-sm placeholder:text-stone-400 ${fontBody}`

  return (
    <div dir={dir} className={`min-h-screen bg-stone-50 ${fontBody} text-stone-900 flex flex-col`}>
      <FontImport />

      {/* Header */}
      <header className="bg-stone-950/95 backdrop-blur border-b border-stone-800">
        <div className="max-w-md mx-auto px-5 py-4 flex items-center justify-between gap-4">
          <div className={`flex items-center gap-2 ${fontDisplay}`}>
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-stone-950" />
            </div>
            <span className="text-lg font-bold text-stone-50">{t.brand}</span>
          </div>
          <button
            onClick={() => setLang(isAr ? 'en' : 'ar')}
            className="flex items-center gap-1.5 text-sm text-stone-200 border border-stone-700 rounded-full px-3 py-1.5 hover:border-amber-500 hover:text-amber-400 transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            {isAr ? 'English' : 'العربية'}
          </button>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-sm">
          <a href="/" className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-teal-700 mb-6 transition-colors">
            <BackIcon className="w-3.5 h-3.5" />
            {t.back}
          </a>

          <h1 className={`${fontDisplay} text-2xl font-bold mb-1.5`}>
            {mode === 'login' ? t.welcomeTitle : mode === 'signup' ? t.signupTitle : t.resetTitle}
          </h1>
          <p className="text-stone-500 text-sm mb-7">
            {mode === 'login' ? t.welcomeSub : mode === 'signup' ? t.signupSub : t.resetSub}
          </p>

          {/* Alert */}
          {message && (
            <div className={`flex items-start gap-2.5 p-3.5 rounded-xl mb-5 text-sm ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message.type === 'success'
                ? <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
                : <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              }
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium mb-2">{t.name}</label>
                <div className={inputWrap}>
                  <User className="w-4 h-4 text-stone-400 shrink-0" />
                  <input
                    className={inputEl}
                    placeholder={t.namePh}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">{t.email}</label>
              <div className={inputWrap}>
                <Mail className="w-4 h-4 text-stone-400 shrink-0" />
                <input
                  type="email"
                  className={inputEl}
                  placeholder={t.emailPh}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  dir="ltr"
                />
              </div>
            </div>

            {mode !== 'reset' && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">{t.password}</label>
                  {mode === 'login' && (
                    <button type="button" onClick={() => { setMode('reset'); setMessage(null) }} className="text-xs text-teal-700 hover:underline">
                      {t.forgot}
                    </button>
                  )}
                </div>
                <div className={inputWrap}>
                  <Lock className="w-4 h-4 text-stone-400 shrink-0" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    className={inputEl}
                    placeholder={t.passwordPh}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    minLength={6}
                    dir="ltr"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="text-stone-400 hover:text-stone-600 shrink-0">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-stone-950 font-semibold rounded-xl px-6 py-3 text-sm transition-colors mt-2 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === 'login' ? t.loginBtn : mode === 'signup' ? t.signupBtn : t.resetBtn}
            </button>
          </form>

          {mode === 'reset' && (
            <button
              onClick={() => { setMode('login'); setMessage(null) }}
              className="w-full text-center text-sm text-teal-700 hover:underline mt-4"
            >
              {t.backToLogin}
            </button>
          )}

          {mode !== 'reset' && (
            <>
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-stone-200" />
                <span className="text-xs text-stone-400">{t.or}</span>
                <div className="flex-1 h-px bg-stone-200" />
              </div>

              <p className="text-center text-sm text-stone-500">
                {mode === 'login' ? t.noAccount : t.haveAccount}{' '}
                <button
                  onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setMessage(null) }}
                  className="text-teal-700 font-medium hover:underline"
                >
                  {mode === 'login' ? t.createOne : t.loginInstead}
                </button>
              </p>

              {mode === 'signup' && (
                <p className="text-center text-xs text-stone-400 mt-4 leading-relaxed">{t.terms}</p>
              )}
            </>
          )}
        </div>
      </div>

      <SaduBand />
    </div>
  )
}
