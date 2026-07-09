import { useState, useEffect } from "react";
import { Sparkles, Globe, Lock, CreditCard, Smartphone, ArrowLeft, ArrowRight, Check, X, Loader2 } from "lucide-react";

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
   Backend wiring
   -----------------------------------------------------------
   Change these two constants once the moyasar-backend folder
   is deployed. Everything else in this file talks to Moyasar
   and to your own backend through them — nothing is mocked
   below this point.
--------------------------------------------------------- */
const API_BASE_URL = "http://localhost:4000"; // ← your deployed backend URL
const MOYASAR_PUBLISHABLE_KEY = "YOUR_MOYASAR_PUBLISHABLE_KEY_HERE"; // ← safe to expose

async function tokenizeCard({ name, number, cvc, month, year }) {
  const response = await fetch("https://api.moyasar.com/v1/tokens", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + btoa(`${MOYASAR_PUBLISHABLE_KEY}:`),
    },
    body: JSON.stringify({ name, number: number.replace(/\s+/g, ""), cvc, month, year }),
  });
  const token = await response.json();
  if (!response.ok) throw new Error(token.message || "Card tokenization failed");
  return token;
}

async function chargeToken({ tokenId, amountSAR, description, name, email }) {
  const response = await fetch(`${API_BASE_URL}/api/payments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: tokenId, amountSAR, description, name, email, method: "creditcard" }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Payment failed");
  return result;
}

function readRedirectResult() {
  const params = new URLSearchParams(window.location.search);
  const status = params.get("status");
  if (!status) return null;
  return { status, id: params.get("id") };
}

const METHODS = [
  { id: "mada", ar: "مدى", en: "Mada" },
  { id: "visa", ar: "فيزا / ماستركارد", en: "Visa / Mastercard" },
  { id: "applepay", ar: "آبل باي", en: "Apple Pay" },
];

const T = {
  ar: {
    brand: "سوق الوكلاء",
    back: "رجوع",
    checkoutTitle: "إتمام الاشتراك",
    plan: "خطة احترافي — Jasper",
    monthly: "شهريًا",
    orderSummary: "ملخص الطلب",
    subtotal: "المجموع الفرعي",
    vat: "ضريبة القيمة المضافة (١٥٪)",
    total: "الإجمالي",
    paymentMethod: "طريقة الدفع",
    cardNumber: "رقم البطاقة",
    cardName: "الاسم على البطاقة",
    expiry: "تاريخ الانتهاء (شهر/سنة)",
    cvv: "رمز التحقق CVV",
    payNow: "ادفع الآن",
    processing: "جاري معالجة الدفع...",
    secureNote: "بياناتك مشفّرة ومحمية، ما نخزّن رقم بطاقتك على سيرفراتنا",
    applePayBtn: "الدفع عبر آبل باي",
    applePayNote: "آبل باي يحتاج نطاق حقيقي مفعّل بحساب Merchant ID — لا يشتغل على المعاينة المحلية.",
    successTitle: "تم الدفع بنجاح!",
    successSub: "تم تفعيل اشتراكك، وبيوصلك إيصال على إيميلك خلال دقائق.",
    failedTitle: "ما تم الدفع",
    failedSub: "صار خطأ أثناء معالجة عملية الدفع. تقدر تتأكد من بيانات البطاقة وتحاول مرة ثانية.",
    tryAgain: "حاول مرة ثانية",
    doneBtn: "رجوع للوحة التحكم",
    errorGeneric: "صار خطأ غير متوقع، حاول مرة ثانية.",
  },
  en: {
    brand: "Agent Souq",
    back: "Back",
    checkoutTitle: "Complete Your Subscription",
    plan: "Pro Plan — Jasper",
    monthly: "per month",
    orderSummary: "Order Summary",
    subtotal: "Subtotal",
    vat: "VAT (15%)",
    total: "Total",
    paymentMethod: "Payment Method",
    cardNumber: "Card Number",
    cardName: "Name on Card",
    expiry: "Expiry (month/year)",
    cvv: "CVV",
    payNow: "Pay Now",
    processing: "Processing payment...",
    secureNote: "Your data is encrypted — we never store your card number on our servers",
    applePayBtn: "Pay with Apple Pay",
    applePayNote: "Apple Pay requires a real verified domain and Merchant ID — it won't work in local preview.",
    successTitle: "Payment Successful!",
    successSub: "Your subscription is now active. A receipt will be emailed to you shortly.",
    failedTitle: "Payment Not Completed",
    failedSub: "Something went wrong processing your payment. Double-check your card details and try again.",
    tryAgain: "Try Again",
    doneBtn: "Back to Dashboard",
    errorGeneric: "Something unexpected happened — please try again.",
  },
};

export default function Checkout() {
  const [lang, setLang] = useState("ar");
  const [method, setMethod] = useState("mada");
  // view: 'form' | 'processing' | 'success' | 'failed'
  const [view, setView] = useState("form");
  const [errorMsg, setErrorMsg] = useState("");
  const [card, setCard] = useState({ name: "", number: "", month: "", year: "", cvc: "" });

  const isAr = lang === "ar";
  const t = T[lang];
  const dir = isAr ? "rtl" : "ltr";
  const fontDisplay = isAr ? "font-display-ar" : "font-display-en";
  const fontBody = isAr ? "font-body-ar" : "font-body-en";
  const BackIcon = isAr ? ArrowRight : ArrowLeft;

  const subtotal = 49;
  const vat = +(subtotal * 0.15).toFixed(2);
  const total = +(subtotal + vat).toFixed(2);

  // Handle the shopper coming back from Moyasar's 3-D Secure redirect.
  useEffect(() => {
    const redirect = readRedirectResult();
    if (redirect) setView(redirect.status === "success" ? "success" : "failed");
  }, []);

  const updateCard = (key, val) => setCard((c) => ({ ...c, [key]: val }));

  const inputClass =
    "w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-teal-600 transition-colors placeholder:text-stone-400";

  async function handlePayWithCard() {
    setErrorMsg("");
    setView("processing");
    try {
      const token = await tokenizeCard(card);
      const result = await chargeToken({
        tokenId: token.id,
        amountSAR: total,
        description: "Agent Souq — Pro Plan (Jasper)",
        name: card.name,
      });

      if (result.transactionUrl) {
        // 3-D Secure required — leaving this page is expected here.
        window.location.href = result.transactionUrl;
        return;
      }
      setView(result.status === "paid" ? "success" : "failed");
    } catch (err) {
      setErrorMsg(err.message || t.errorGeneric);
      setView("failed");
    }
  }

  function handleApplePay() {
    // Real Apple Pay needs: a domain-verification file served from your
    // real domain, a registered Apple Merchant ID, and a backend endpoint
    // that proxies Moyasar's merchant-validation call (see README.md in
    // moyasar-backend/ for the exact steps) — none of that exists on a
    // localhost preview, so this only simulates the button here.
    setErrorMsg(t.applePayNote);
  }

  return (
    <div dir={dir} className={`min-h-screen bg-stone-50 ${fontBody} text-stone-900`}>
      <FontImport />

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
        {(view === "form" || view === "processing") && (
          <a href="#" className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-teal-700 mb-6 transition-colors">
            <BackIcon className="w-3.5 h-3.5" />
            {t.back}
          </a>
        )}

        {view === "processing" && (
          <div className="text-center py-20">
            <Loader2 className="w-10 h-10 text-teal-700 animate-spin mx-auto mb-5" />
            <p className="text-sm text-stone-600">{t.processing}</p>
          </div>
        )}

        {view === "success" && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-teal-700 flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h1 className={`${fontDisplay} text-2xl font-bold mb-3`}>{t.successTitle}</h1>
            <p className="text-stone-600 text-sm md:text-base max-w-md mx-auto leading-relaxed mb-8">{t.successSub}</p>
            <button className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold rounded-xl px-6 py-3 text-sm transition-colors">
              {t.doneBtn}
            </button>
          </div>
        )}

        {view === "failed" && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center mx-auto mb-6">
              <X className="w-8 h-8 text-white" />
            </div>
            <h1 className={`${fontDisplay} text-2xl font-bold mb-3`}>{t.failedTitle}</h1>
            <p className="text-stone-600 text-sm md:text-base max-w-md mx-auto leading-relaxed mb-2">{t.failedSub}</p>
            {errorMsg && <p className="text-red-500 text-xs mb-6">{errorMsg}</p>}
            <button
              onClick={() => setView("form")}
              className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold rounded-xl px-6 py-3 text-sm transition-colors"
            >
              {t.tryAgain}
            </button>
          </div>
        )}

        {view === "form" && (
          <>
            <h1 className={`${fontDisplay} text-xl font-bold mb-6`}>{t.checkoutTitle}</h1>

            {/* Order summary */}
            <div className="bg-white border border-stone-200 rounded-2xl p-5 mb-6">
              <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-4">{t.orderSummary}</h2>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">{t.plan}</span>
                <span className="text-sm text-stone-500">{t.monthly}</span>
              </div>
              <div className="space-y-2 pt-3 border-t border-stone-100 text-sm">
                <div className="flex justify-between text-stone-500">
                  <span>{t.subtotal}</span>
                  <span>{subtotal.toFixed(2)} SAR</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>{t.vat}</span>
                  <span>{vat.toFixed(2)} SAR</span>
                </div>
                <div className="flex justify-between font-bold text-base pt-2 border-t border-stone-100">
                  <span>{t.total}</span>
                  <span className="text-teal-700">{total.toFixed(2)} SAR</span>
                </div>
              </div>
            </div>

            {/* Payment method */}
            <h2 className="text-sm font-medium mb-3">{t.paymentMethod}</h2>
            <div className="grid grid-cols-3 gap-2.5 mb-6">
              {METHODS.map((m) => {
                const active = method === m.id;
                const Icon = m.id === "applepay" ? Smartphone : CreditCard;
                return (
                  <button
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    className={`flex flex-col items-center gap-1.5 rounded-xl border px-3 py-3.5 text-xs font-medium transition-colors ${
                      active
                        ? "bg-teal-700 text-white border-teal-700"
                        : "bg-white text-stone-700 border-stone-200 hover:border-teal-400"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {isAr ? m.ar : m.en}
                  </button>
                );
              })}
            </div>

            {method === "applepay" ? (
              <div className="mb-6">
                <button
                  onClick={handleApplePay}
                  className="w-full bg-stone-950 hover:bg-stone-800 text-white font-semibold rounded-xl px-6 py-3.5 text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Smartphone className="w-4 h-4" />
                  {t.applePayBtn}
                </button>
                {errorMsg && <p className="text-xs text-stone-500 mt-2 text-center">{errorMsg}</p>}
              </div>
            ) : (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">{t.cardNumber}</label>
                  <input
                    className={inputClass}
                    placeholder="0000 0000 0000 0000"
                    value={card.number}
                    onChange={(e) => updateCard("number", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t.cardName}</label>
                  <input
                    className={inputClass}
                    placeholder={isAr ? "الاسم كما يظهر بالبطاقة" : "Name as shown on card"}
                    value={card.name}
                    onChange={(e) => updateCard("name", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.expiry}</label>
                    <div className="flex gap-2">
                      <input
                        className={inputClass}
                        placeholder="MM"
                        value={card.month}
                        onChange={(e) => updateCard("month", e.target.value)}
                      />
                      <input
                        className={inputClass}
                        placeholder="YYYY"
                        value={card.year}
                        onChange={(e) => updateCard("year", e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.cvv}</label>
                    <input
                      className={inputClass}
                      placeholder="123"
                      value={card.cvc}
                      onChange={(e) => updateCard("cvc", e.target.value)}
                    />
                  </div>
                </div>

                {errorMsg && <p className="text-red-500 text-xs">{errorMsg}</p>}

                <button
                  onClick={handlePayWithCard}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold rounded-xl px-6 py-3.5 text-sm transition-colors mt-2"
                >
                  {t.payNow} — {total.toFixed(2)} SAR
                </button>
              </div>
            )}

            <div className="flex items-center gap-2 justify-center text-xs text-stone-400 mt-2">
              <Lock className="w-3.5 h-3.5" />
              {t.secureNote}
            </div>
          </>
        )}
      </div>

      <SaduBand />
    </div>
  );
}
