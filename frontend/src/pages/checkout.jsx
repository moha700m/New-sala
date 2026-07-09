import { useState, useEffect } from "react";
import {
  Sparkles, Globe, Lock, CreditCard, ArrowLeft, ArrowRight,
  Check, X, Loader2, Shield, Phone,
} from "lucide-react";

const FontImport = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;900&family=IBM+Plex+Sans+Arabic:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');
    .font-display-ar { font-family: 'Tajawal', 'IBM Plex Sans Arabic', sans-serif; }
    .font-body-ar    { font-family: 'IBM Plex Sans Arabic', 'Tajawal', sans-serif; }
    .font-display-en { font-family: 'Space Grotesk', sans-serif; }
    .font-body-en    { font-family: 'Inter', sans-serif; }
  `}</style>
);

function SaduBand() {
  const colors = ["#f59e0b", "#0f766e", "#f5f5f4", "#f59e0b", "#0f766e"];
  return (
    <div className="w-full overflow-hidden h-5 flex select-none" aria-hidden="true">
      {Array.from({ length: 40 }).map((_, i) => (
        <div key={i} className="shrink-0" style={{
          width: 0, height: 0,
          borderLeft: "10px solid transparent",
          borderRight: "10px solid transparent",
          borderBottom: `20px solid ${colors[i % colors.length]}`,
          transform: i % 2 === 0 ? "rotate(0deg)" : "rotate(180deg)",
          opacity: 0.9,
        }} />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Configuration
───────────────────────────────────────────────────────────── */
const API_BASE_URL = "https://myagentstore.pro";
const MOYASAR_PUBLISHABLE_KEY = "pk_live_DRP5ZEpQshA8PtrJUAgetjuW6ZjhGkBC82DQ8Unb";

/* ─────────────────────────────────────────────────────────────
   Moyasar helpers
───────────────────────────────────────────────────────────── */
async function tokenizeCard({ name, number, cvc, month, year }) {
  const res = await fetch("https://api.moyasar.com/v1/tokens", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + btoa(`${MOYASAR_PUBLISHABLE_KEY}:`),
    },
    body: JSON.stringify({ name, number: number.replace(/\s+/g, ""), cvc, month, year }),
  });
  const token = await res.json();
  if (!res.ok) throw new Error(token.message || "فشل في تحويل بيانات البطاقة");
  return token;
}

async function chargeToken({ tokenId, amountSAR, description, name, email, method }) {
  const res = await fetch(`${API_BASE_URL}/api/payments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: tokenId, amountSAR, description, name, email, method }),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || "فشلت عملية الدفع");
  return result;
}

async function initiateStcPay({ mobile, amountSAR, description, name, email }) {
  const res = await fetch(`${API_BASE_URL}/api/payments/stcpay`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mobile, amountSAR, description, name, email }),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || "فشلت عملية STC Pay");
  return result;
}

function readRedirectResult() {
  const p = new URLSearchParams(window.location.search);
  const status = p.get("status");
  if (!status) return null;
  return { status, id: p.get("id") };
}

/* ─────────────────────────────────────────────────────────────
   Payment methods
───────────────────────────────────────────────────────────── */
const METHODS = [
  { id: "mada",   ar: "مدى",              en: "Mada",            icon: "mada" },
  { id: "visa",   ar: "فيزا / ماستركارد", en: "Visa / Mastercard", icon: "card" },
  { id: "stcpay", ar: "STC Pay",          en: "STC Pay",         icon: "stc"  },
];

/* ─────────────────────────────────────────────────────────────
   Translations
───────────────────────────────────────────────────────────── */
const T = {
  ar: {
    brand: "سوق الموظفين الذكيين",
    back: "رجوع",
    checkoutTitle: "إتمام الاشتراك",
    plan: "خطة احترافي — موظف المبيعات الذكي",
    monthly: "شهريًا",
    orderSummary: "ملخص الطلب",
    subtotal: "المجموع الفرعي",
    vat: "ضريبة القيمة المضافة (١٥٪)",
    total: "الإجمالي",
    paymentMethod: "طريقة الدفع",
    cardNumber: "رقم البطاقة",
    cardName: "الاسم على البطاقة",
    month: "الشهر",
    year: "السنة",
    cvv: "رمز CVV",
    payNow: "ادفع الآن",
    processing: "جاري معالجة الدفع...",
    secureNote: "بياناتك مشفّرة ومحمية — لا نخزّن رقم بطاقتك على سيرفراتنا",
    stcMobile: "رقم جوال STC Pay",
    stcMobilePlaceholder: "05XXXXXXXX",
    stcNote: "سيصلك رمز تحقق OTP على جوالك لإتمام الدفع",
    stcSend: "أرسل رمز OTP — ",
    successTitle: "تم الدفع بنجاح! 🎉",
    successSub: "تم تفعيل اشتراكك. سيصلك إيصال على بريدك الإلكتروني خلال دقائق.",
    failedTitle: "ما تم الدفع",
    failedSub: "صار خطأ أثناء معالجة عملية الدفع. تأكد من بيانات البطاقة وحاول مرة ثانية.",
    tryAgain: "حاول مرة ثانية",
    doneBtn: "رجوع للرئيسية",
    errorGeneric: "صار خطأ غير متوقع، حاول مرة ثانية.",
    nameLabel: "الاسم الكامل",
    emailLabel: "البريد الإلكتروني",
    namePlaceholder: "محمد العلي",
    emailPlaceholder: "email@example.com",
    securePayment: "دفع آمن",
    poweredBy: "مدعوم بـ",
  },
  en: {
    brand: "AI Employee Marketplace",
    back: "Back",
    checkoutTitle: "Complete Your Subscription",
    plan: "Pro Plan — AI Sales Employee",
    monthly: "per month",
    orderSummary: "Order Summary",
    subtotal: "Subtotal",
    vat: "VAT (15%)",
    total: "Total",
    paymentMethod: "Payment Method",
    cardNumber: "Card Number",
    cardName: "Name on Card",
    month: "Month",
    year: "Year",
    cvv: "CVV",
    payNow: "Pay Now",
    processing: "Processing payment...",
    secureNote: "Your data is encrypted — we never store your card number on our servers",
    stcMobile: "STC Pay Mobile Number",
    stcMobilePlaceholder: "05XXXXXXXX",
    stcNote: "You will receive an OTP on your mobile to complete the payment",
    stcSend: "Send OTP — ",
    successTitle: "Payment Successful! 🎉",
    successSub: "Your subscription is now active. A receipt will be emailed to you shortly.",
    failedTitle: "Payment Not Completed",
    failedSub: "Something went wrong processing your payment. Double-check your card details and try again.",
    tryAgain: "Try Again",
    doneBtn: "Back to Home",
    errorGeneric: "Something unexpected happened — please try again.",
    nameLabel: "Full Name",
    emailLabel: "Email Address",
    namePlaceholder: "John Smith",
    emailPlaceholder: "email@example.com",
    securePayment: "Secure Payment",
    poweredBy: "Powered by",
  },
};

/* ─────────────────────────────────────────────────────────────
   Main component
───────────────────────────────────────────────────────────── */
export default function Checkout() {
  const [lang, setLang] = useState("ar");
  const [method, setMethod] = useState("mada");
  const [view, setView] = useState("form"); // form | processing | success | failed
  const [errorMsg, setErrorMsg] = useState("");
  const [card, setCard] = useState({ name: "", number: "", month: "", year: "", cvc: "" });
  const [customer, setCustomer] = useState({ name: "", email: "" });
  const [stcMobile, setStcMobile] = useState("");

  const isAr = lang === "ar";
  const t = T[lang];
  const dir = isAr ? "rtl" : "ltr";
  const fontDisplay = isAr ? "font-display-ar" : "font-display-en";
  const fontBody = isAr ? "font-body-ar" : "font-body-en";
  const BackIcon = isAr ? ArrowRight : ArrowLeft;

  const subtotal = 299;
  const vat = +(subtotal * 0.15).toFixed(2);
  const total = +(subtotal + vat).toFixed(2);

  useEffect(() => {
    const redirect = readRedirectResult();
    if (redirect) setView(redirect.status === "success" ? "success" : "failed");
  }, []);

  const updateCard = (key, val) => setCard(c => ({ ...c, [key]: val }));
  const updateCustomer = (key, val) => setCustomer(c => ({ ...c, [key]: val }));

  const inputClass =
    "w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition-all placeholder:text-stone-400";

  /* ── Card / Mada payment ── */
  async function handlePayWithCard() {
    setErrorMsg("");
    setView("processing");
    try {
      const token = await tokenizeCard(card);
      const result = await chargeToken({
        tokenId: token.id,
        amountSAR: total,
        description: "Agent Souq — Pro Plan (AI Sales Employee)",
        name: customer.name || card.name,
        email: customer.email,
        method,
      });
      if (result.transactionUrl) {
        window.location.href = result.transactionUrl;
        return;
      }
      setView(result.status === "paid" ? "success" : "failed");
    } catch (err) {
      setErrorMsg(err.message || t.errorGeneric);
      setView("failed");
    }
  }

  /* ── STC Pay ── */
  async function handleStcPay() {
    setErrorMsg("");
    setView("processing");
    try {
      const result = await initiateStcPay({
        mobile: stcMobile,
        amountSAR: total,
        description: "Agent Souq — Pro Plan (AI Sales Employee)",
        name: customer.name,
        email: customer.email,
      });
      if (result.transactionUrl) {
        // Redirect to Moyasar OTP page
        window.location.href = result.transactionUrl;
        return;
      }
      setView(result.status === "paid" ? "success" : "failed");
    } catch (err) {
      setErrorMsg(err.message || t.errorGeneric);
      setView("failed");
    }
  }

  const isCardMethod = method === "mada" || method === "visa";

  return (
    <div className={`min-h-screen bg-stone-50 ${fontBody} text-stone-900`} dir={dir}>
      <FontImport />
      <SaduBand />

      {/* Header */}
      <header className="bg-stone-950 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-stone-950" />
          </div>
          <div>
            <div className={`text-base font-bold text-stone-50 ${fontDisplay}`}>{t.brand}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950 border border-emerald-800 rounded-full px-3 py-1.5">
            <Shield className="w-3 h-3" />
            {t.securePayment}
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

      <div className="max-w-lg mx-auto px-5 py-8">
        {(view === "form") && (
          <a href="/" className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-teal-700 mb-6 transition-colors">
            <BackIcon className="w-3.5 h-3.5" />
            {t.back}
          </a>
        )}

        {/* Processing */}
        {view === "processing" && (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-teal-50 border-2 border-teal-200 flex items-center justify-center mx-auto mb-5">
              <Loader2 className="w-8 h-8 text-teal-700 animate-spin" />
            </div>
            <p className={`${fontDisplay} text-lg font-semibold mb-2`}>{t.processing}</p>
            <p className="text-sm text-stone-500">{isAr ? "لا تغلق الصفحة..." : "Please don't close this page..."}</p>
          </div>
        )}

        {/* Success */}
        {view === "success" && (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-200">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h1 className={`${fontDisplay} text-2xl font-bold mb-3`}>{t.successTitle}</h1>
            <p className="text-stone-600 text-sm md:text-base max-w-md mx-auto leading-relaxed mb-8">{t.successSub}</p>
            <a href="/" className="inline-block bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl px-8 py-3.5 text-sm transition-colors">
              {t.doneBtn}
            </a>
          </div>
        )}

        {/* Failed */}
        {view === "failed" && (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-200">
              <X className="w-10 h-10 text-white" />
            </div>
            <h1 className={`${fontDisplay} text-2xl font-bold mb-3`}>{t.failedTitle}</h1>
            <p className="text-stone-600 text-sm md:text-base max-w-md mx-auto leading-relaxed mb-2">{t.failedSub}</p>
            {errorMsg && (
              <p className="text-red-600 text-xs mb-6 bg-red-50 border border-red-200 rounded-lg px-4 py-2 max-w-sm mx-auto">
                {errorMsg}
              </p>
            )}
            <button
              onClick={() => { setView("form"); setErrorMsg(""); }}
              className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl px-8 py-3.5 text-sm transition-colors"
            >
              {t.tryAgain}
            </button>
          </div>
        )}

        {/* Form */}
        {view === "form" && (
          <>
            <h1 className={`${fontDisplay} text-xl font-bold mb-6`}>{t.checkoutTitle}</h1>

            {/* Order Summary */}
            <div className="bg-white border border-stone-200 rounded-2xl p-5 mb-5 shadow-sm">
              <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-4">{t.orderSummary}</h2>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-sm font-semibold">{t.plan}</div>
                  <div className="text-xs text-stone-400 mt-0.5">{t.monthly}</div>
                </div>
                <span className="text-sm font-bold text-teal-700">{subtotal} SAR</span>
              </div>
              <div className="space-y-2 pt-3 border-t border-stone-100 text-sm">
                <div className="flex justify-between text-stone-500">
                  <span>{t.subtotal}</span><span>{subtotal.toFixed(2)} SAR</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>{t.vat}</span><span>{vat.toFixed(2)} SAR</span>
                </div>
                <div className="flex justify-between font-bold text-base pt-2 border-t border-stone-100">
                  <span>{t.total}</span>
                  <span className="text-teal-700">{total.toFixed(2)} SAR</span>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-white border border-stone-200 rounded-2xl p-5 mb-5 shadow-sm space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">{t.nameLabel}</label>
                <input className={inputClass} placeholder={t.namePlaceholder} value={customer.name} onChange={e => updateCustomer("name", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t.emailLabel}</label>
                <input className={inputClass} type="email" placeholder={t.emailPlaceholder} value={customer.email} onChange={e => updateCustomer("email", e.target.value)} />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="mb-5">
              <h2 className="text-sm font-semibold mb-3">{t.paymentMethod}</h2>
              <div className="grid grid-cols-3 gap-2.5">
                {METHODS.map(m => {
                  const active = method === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => { setMethod(m.id); setErrorMsg(""); }}
                      className={`flex flex-col items-center gap-2 rounded-xl border-2 px-3 py-4 text-xs font-semibold transition-all ${
                        active
                          ? "bg-teal-700 text-white border-teal-700 shadow-md shadow-teal-100"
                          : "bg-white text-stone-700 border-stone-200 hover:border-teal-400 hover:bg-teal-50"
                      }`}
                    >
                      {m.icon === "stc" ? (
                        <Phone className={`w-5 h-5 ${active ? "text-white" : "text-stone-600"}`} />
                      ) : (
                        <CreditCard className={`w-5 h-5 ${active ? "text-white" : "text-stone-600"}`} />
                      )}
                      {isAr ? m.ar : m.en}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STC Pay Form */}
            {method === "stcpay" && (
              <div className="bg-white border border-stone-200 rounded-2xl p-5 mb-5 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-stone-700">
                  <Phone className="w-4 h-4 text-teal-600" />
                  STC Pay
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t.stcMobile}</label>
                  <input
                    className={inputClass}
                    placeholder={t.stcMobilePlaceholder}
                    value={stcMobile}
                    onChange={e => setStcMobile(e.target.value)}
                    type="tel"
                    dir="ltr"
                  />
                  <p className="text-xs text-stone-400 mt-1.5">{t.stcNote}</p>
                </div>
                {errorMsg && (
                  <p className="text-red-600 text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2">{errorMsg}</p>
                )}
                <button
                  onClick={handleStcPay}
                  disabled={!stcMobile || stcMobile.replace(/\s/g, "").length < 10}
                  className="w-full bg-teal-700 hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl px-6 py-4 text-sm transition-colors flex items-center justify-center gap-2 shadow-md shadow-teal-100"
                >
                  <Phone className="w-4 h-4" />
                  {t.stcSend}{total.toFixed(2)} SAR
                </button>
              </div>
            )}

            {/* Card Form (Mada / Visa) */}
            {isCardMethod && (
              <div className="bg-white border border-stone-200 rounded-2xl p-5 mb-5 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-stone-700">
                  <CreditCard className="w-4 h-4 text-teal-600" />
                  {method === "mada"
                    ? (isAr ? "بطاقة مدى" : "Mada Card")
                    : (isAr ? "فيزا / ماستركارد" : "Visa / Mastercard")}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t.cardNumber}</label>
                  <input
                    className={inputClass}
                    placeholder="0000 0000 0000 0000"
                    value={card.number}
                    onChange={e => updateCard("number", e.target.value.replace(/[^\d\s]/g, ""))}
                    maxLength={19}
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t.cardName}</label>
                  <input
                    className={inputClass}
                    placeholder={isAr ? "الاسم كما يظهر بالبطاقة" : "Name as shown on card"}
                    value={card.name}
                    onChange={e => updateCard("name", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.month}</label>
                    <input className={inputClass} placeholder="MM" value={card.month}
                      onChange={e => updateCard("month", e.target.value)} maxLength={2} dir="ltr" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.year}</label>
                    <input className={inputClass} placeholder="YYYY" value={card.year}
                      onChange={e => updateCard("year", e.target.value)} maxLength={4} dir="ltr" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.cvv}</label>
                    <input className={inputClass} placeholder="123" value={card.cvc}
                      onChange={e => updateCard("cvc", e.target.value)} maxLength={4} dir="ltr" type="password" />
                  </div>
                </div>
                {errorMsg && (
                  <p className="text-red-600 text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2">{errorMsg}</p>
                )}
                <button
                  onClick={handlePayWithCard}
                  disabled={!card.number || !card.name || !card.month || !card.year || !card.cvc}
                  className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-stone-950 font-bold rounded-xl px-6 py-4 text-sm transition-colors shadow-md shadow-amber-100"
                >
                  {t.payNow} — {total.toFixed(2)} SAR
                </button>
              </div>
            )}

            {/* Security note */}
            <div className="flex items-center gap-2 justify-center text-xs text-stone-400 mt-4">
              <Lock className="w-3.5 h-3.5" />
              {t.secureNote}
            </div>
            <div className="text-center mt-3">
              <span className="text-xs text-stone-400">
                {t.poweredBy}{" "}
                <a href="https://moyasar.com" target="_blank" rel="noopener noreferrer"
                  className="text-teal-600 hover:underline font-medium">
                  Moyasar
                </a>
              </span>
            </div>
          </>
        )}
      </div>

      <SaduBand />
    </div>
  );
}
