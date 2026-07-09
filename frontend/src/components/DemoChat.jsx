/**
 * DemoChat — ChatGPT-style demo chat component
 * ─────────────────────────────────────────────
 * Features:
 * - Streaming SSE responses with typing animation
 * - Message limit (10 messages or 5 minutes)
 * - Hire CTA after limit reached
 * - Avatars for user and AI employee
 * - Mobile responsive
 * - RTL/LTR support
 */

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  X,
  Bot,
  User,
  Sparkles,
  Clock,
  MessageSquare,
  Zap,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
} from "lucide-react";

const MAX_MESSAGES = 10;
const MAX_MINUTES = 5;

const TRANSLATIONS = {
  ar: {
    demoTitle: "جرّب الموظف الذكي",
    demoSubtitle: "محادثة مجانية — حتى 10 رسائل",
    placeholder: "اكتب سؤالك هنا...",
    send: "إرسال",
    typing: "يكتب...",
    limitTitle: "استمتعت بالتجربة؟",
    limitSub: "وظّف هذا الموظف الذكي وابدأ العمل الحقيقي",
    hireBtn: "وظّف الآن",
    messagesLeft: "رسائل متبقية",
    timeLeft: "دقائق متبقية",
    welcomeMsg: "أهلاً! أنا موظفك الذكي. كيف أقدر أساعدك اليوم؟",
    close: "إغلاق",
    newChat: "محادثة جديدة",
    poweredBy: "مدعوم بالذكاء الاصطناعي",
    errorMsg: "عذراً، حدث خطأ. حاول مرة ثانية.",
    limitReached: "وصلت لحد الرسائل المجانية",
  },
  en: {
    demoTitle: "Try the AI Employee",
    demoSubtitle: "Free chat — up to 10 messages",
    placeholder: "Type your question here...",
    send: "Send",
    typing: "Typing...",
    limitTitle: "Enjoying this AI Employee?",
    limitSub: "Hire this employee to continue working",
    hireBtn: "Hire Now",
    messagesLeft: "messages left",
    timeLeft: "minutes left",
    welcomeMsg: "Hello! I'm your AI employee. How can I help you today?",
    close: "Close",
    newChat: "New Chat",
    poweredBy: "Powered by AI",
    errorMsg: "Sorry, an error occurred. Please try again.",
    limitReached: "You've reached the free message limit",
  }
};

// Employee avatar colors
const AVATAR_COLORS = {
  "sales-employee": "from-amber-500 to-orange-500",
  "support-employee": "from-blue-500 to-cyan-500",
  "marketing-employee": "from-purple-500 to-pink-500",
  "hr-employee": "from-green-500 to-emerald-500",
  "finance-employee": "from-teal-500 to-cyan-600",
};

const EMPLOYEE_ICONS = {
  "sales-employee": "💼",
  "support-employee": "🛠️",
  "marketing-employee": "📣",
  "hr-employee": "👥",
  "finance-employee": "📊",
};

export default function DemoChat({ employeeId, employeeName, lang = "ar", onClose, onHire }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ar;
  const isAr = lang === "ar";
  const ArrowIcon = isAr ? ChevronLeft : ChevronRight;
  const avatarGradient = AVATAR_COLORS[employeeId] || "from-amber-500 to-orange-500";
  const employeeIcon = EMPLOYEE_ICONS[employeeId] || "🤖";

  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      content: t.welcomeMsg,
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [userMessageCount, setUserMessageCount] = useState(0);
  const [startTime] = useState(Date.now());
  const [timeLeft, setTimeLeft] = useState(MAX_MINUTES);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000 / 60;
      const remaining = Math.max(0, MAX_MINUTES - elapsed);
      setTimeLeft(Math.ceil(remaining));
      if (remaining <= 0 && !limitReached) {
        setLimitReached(true);
      }
    }, 10000);
    return () => clearInterval(timer);
  }, [startTime, limitReached]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming || limitReached) return;

    const newCount = userMessageCount + 1;
    setUserMessageCount(newCount);

    if (newCount > MAX_MESSAGES) {
      setLimitReached(true);
      return;
    }

    const userMsg = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsStreaming(true);

    // Add streaming placeholder
    const aiMsgId = `ai-${Date.now()}`;
    setMessages(prev => [...prev, {
      id: aiMsgId,
      role: "assistant",
      content: "",
      isStreaming: true,
      timestamp: new Date(),
    }]);

    try {
      abortControllerRef.current = new AbortController();

      const allMessages = [...messages, userMsg].map(m => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch("/api/demo/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId,
          messages: allMessages,
          lang,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (response.status === 429) {
        setLimitReached(true);
        setMessages(prev => prev.filter(m => m.id !== aiMsgId));
        setIsStreaming(false);
        return;
      }

      if (!response.ok) {
        throw new Error("API error");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.text) {
                fullText += data.text;
                setMessages(prev => prev.map(m =>
                  m.id === aiMsgId
                    ? { ...m, content: fullText, isStreaming: true }
                    : m
                ));
              }
              if (data.done) {
                setMessages(prev => prev.map(m =>
                  m.id === aiMsgId
                    ? { ...m, content: fullText, isStreaming: false }
                    : m
                ));
              }
            } catch (e) {
              // Skip malformed SSE lines
            }
          }
        }
      }

      // Check if limit reached after this message
      if (newCount >= MAX_MESSAGES) {
        setLimitReached(true);
      }

    } catch (err) {
      if (err.name !== "AbortError") {
        setMessages(prev => prev.map(m =>
          m.id === aiMsgId
            ? { ...m, content: t.errorMsg, isStreaming: false, isError: true }
            : m
        ));
      }
    } finally {
      setIsStreaming(false);
    }
  }, [input, isStreaming, limitReached, messages, employeeId, lang, userMessageCount, t]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetChat = () => {
    setMessages([{
      id: "welcome",
      role: "assistant",
      content: t.welcomeMsg,
      timestamp: new Date(),
    }]);
    setUserMessageCount(0);
    setLimitReached(false);
    setInput("");
    inputRef.current?.focus();
  };

  const messagesLeft = Math.max(0, MAX_MESSAGES - userMessageCount);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full sm:w-[440px] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden"
        style={{ height: "min(600px, 90vh)" }}
      >
        {/* Header */}
        <div className={`bg-gradient-to-r ${avatarGradient} p-4 flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-xl">
              {employeeIcon}
            </div>
            <div>
              <div className="text-white font-bold text-sm">{employeeName || "AI Employee"}</div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
                <span className="text-white/80 text-xs">{t.poweredBy}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Message counter */}
            {!limitReached && (
              <div className="bg-white/20 rounded-full px-2.5 py-1 flex items-center gap-1">
                <MessageSquare className="w-3 h-3 text-white" />
                <span className="text-white text-xs font-medium">{messagesLeft}</span>
              </div>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 chat-scroll bg-stone-50">
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isAr={isAr}
              avatarGradient={avatarGradient}
              employeeIcon={employeeIcon}
              t={t}
            />
          ))}

          {/* Typing indicator when streaming starts */}
          {isStreaming && messages[messages.length - 1]?.content === "" && (
            <TypingIndicator avatarGradient={avatarGradient} employeeIcon={employeeIcon} />
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Limit reached CTA */}
        {limitReached && (
          <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 border-t border-amber-200">
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-3 shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm mb-1">{t.limitTitle}</h3>
              <p className="text-stone-500 text-xs mb-3">{t.limitSub}</p>
              <div className="flex gap-2">
                <button
                  onClick={resetChat}
                  className="flex-1 border border-stone-300 text-stone-600 text-xs font-medium rounded-xl py-2.5 hover:bg-stone-100 transition-colors"
                >
                  {t.newChat}
                </button>
                <button
                  onClick={onHire}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-xl py-2.5 hover:from-amber-400 hover:to-orange-400 transition-all shadow-md flex items-center justify-center gap-1"
                >
                  {t.hireBtn}
                  <ArrowIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Input area */}
        {!limitReached && (
          <div className="p-3 bg-white border-t border-stone-100">
            <div className="flex items-end gap-2 bg-stone-100 rounded-2xl p-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t.placeholder}
                disabled={isStreaming}
                rows={1}
                className="flex-1 bg-transparent text-sm text-stone-800 placeholder-stone-400 resize-none outline-none px-2 py-1.5 max-h-24 leading-relaxed disabled:opacity-50"
                style={{ direction: isAr ? "rtl" : "ltr" }}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isStreaming}
                className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:from-amber-400 hover:to-orange-400 transition-all shadow-md hover:shadow-amber-500/30 shrink-0"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
            <div className="flex items-center justify-between mt-2 px-1">
              <span className="text-xs text-stone-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {t.poweredBy}
              </span>
              <span className="text-xs text-stone-400">
                {messagesLeft} {t.messagesLeft}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Message Bubble Component ─────────────────────────────────────────────────
function MessageBubble({ message, isAr, avatarGradient, employeeIcon, t }) {
  const isUser = message.role === "user";
  const isError = message.isError;
  const isStreaming = message.isStreaming;

  return (
    <div className={`flex items-end gap-2.5 ${isUser ? (isAr ? "flex-row-reverse" : "flex-row") : (isAr ? "flex-row" : "flex-row-reverse")} animate-fade-in-up`}>
      {/* Avatar */}
      {!isUser && (
        <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-sm shrink-0 shadow-sm`}>
          {employeeIcon}
        </div>
      )}
      {isUser && (
        <div className="w-8 h-8 rounded-xl bg-stone-700 flex items-center justify-center shrink-0 shadow-sm">
          <User className="w-4 h-4 text-white" />
        </div>
      )}

      {/* Bubble */}
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
          isUser
            ? "bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-br-sm"
            : isError
            ? "bg-red-50 border border-red-200 text-red-700 rounded-bl-sm"
            : "bg-white border border-stone-200 text-stone-800 rounded-bl-sm"
        }`}
        style={{ direction: isAr ? "rtl" : "ltr" }}
      >
        {isStreaming && !message.content ? (
          <TypingDots />
        ) : (
          <span>
            {message.content}
            {isStreaming && <span className="inline-block w-0.5 h-4 bg-stone-400 ml-0.5 animate-pulse" />}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Typing Indicator ─────────────────────────────────────────────────────────
function TypingIndicator({ avatarGradient, employeeIcon }) {
  return (
    <div className="flex items-end gap-2.5 animate-fade-in">
      <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-sm shrink-0`}>
        {employeeIcon}
      </div>
      <div className="bg-white border border-stone-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <TypingDots />
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 h-4">
      <div className="typing-dot" />
      <div className="typing-dot" />
      <div className="typing-dot" />
    </div>
  );
}
