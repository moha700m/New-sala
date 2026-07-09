/**
 * Admin Dashboard — Agent Souq
 * لوحة تحكم المالك — محمية بـ local login (يوزر + باسورد)
 */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Sparkles, Globe, Users, ShoppingBag, TrendingUp, DollarSign,
  LogOut, RefreshCw, Search, BarChart2, Shield, Loader2,
  ArrowUpRight, ArrowDownRight, UserCheck, Eye, EyeOff, Lock
} from 'lucide-react'
import { supabase } from '../lib/supabase'

/* ─── Fonts ─────────────────────────────────────────────── */
const FontImport = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;900&family=Space+Grotesk:wght@500;600;700&display=swap');
    .font-ar { font-family: 'Tajawal', sans-serif; }
    .font-en { font-family: 'Space Grotesk', sans-serif; }
  `}</style>
)

/* ─── Sadu band ─────────────────────────────────────────── */
function SaduBand() {
  const colors = ['#f59e0b', '#0f766e', '#f5f5f4', '#f59e0b', '#0f766e']
  return (
    <div className="w-full overflow-hidden h-1.5 flex select-none" aria-hidden="true">
      {Array.from({ length: 60 }).map((_, i) => (
        <div key={i} className="shrink-0" style={{
          width: 0, height: 0,
          borderLeft: '8px solid transparent', borderRight: '8px solid transparent',
          borderBottom: `6px solid ${colors[i % colors.length]}`,
          transform: i % 2 === 0 ? 'rotate(0deg)' : 'rotate(180deg)',
        }} />
      ))}
    </div>
  )
}

/* ─── ADMIN CREDENTIALS ──────────────────────────────────── */
// بيانات الدخول الثابتة للأدمن — غيّرها حسب رغبتك
const ADMIN_USER = 'admin'
const ADMIN_PASS = 'AgentSouq2025!'

/* ─── Stat Card ─────────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, delta, up, color, loading }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        {delta && (
          <span className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-1 rounded-full ${
            up ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
          }`}>
            {up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {delta}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold font-en mb-1">
        {loading ? <div className="h-7 w-20 bg-stone-100 rounded animate-pulse" /> : value}
      </div>
      <div className="text-sm text-stone-500">{label}</div>
    </div>
  )
}

/* ─── Status Badge ───────────────────────────────────────── */
function StatusBadge({ status }) {
  const map = {
    active:    { label: 'نشط',    cls: 'bg-green-50 text-green-700 border-green-200' },
    cancelled: { label: 'ملغي',   cls: 'bg-red-50 text-red-600 border-red-200' },
    pending:   { label: 'معلّق',  cls: 'bg-amber-50 text-amber-700 border-amber-200' },
    paid:      { label: 'مدفوع',  cls: 'bg-teal-50 text-teal-700 border-teal-200' },
  }
  const s = map[status] || map.pending
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${s.cls}`}>
      {s.label}
    </span>
  )
}

/* ─── Mini Bar Chart ─────────────────────────────────────── */
function MiniBarChart({ data, color = '#f59e0b' }) {
  const max = Math.max(...data, 1)
  return (
    <div className="flex items-end gap-1 h-12">
      {data.map((v, i) => (
        <div key={i} className="flex-1 rounded-sm" style={{
          height: `${(v / max) * 100}%`,
          backgroundColor: color,
          opacity: 0.4 + (i / data.length) * 0.6,
          minHeight: 2,
        }} />
      ))}
    </div>
  )
}

/* ─── Login Screen ───────────────────────────────────────── */
function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setTimeout(() => {
      if (username.trim() === ADMIN_USER && password === ADMIN_PASS) {
        // Save to sessionStorage so refresh keeps you logged in
        sessionStorage.setItem('admin_auth', 'true')
        onLogin()
      } else {
        setError('اليوزر أو الباسورد غلط — حاول مرة ثانية')
      }
      setLoading(false)
    }, 600)
  }

  return (
    <div dir="rtl" className="min-h-screen bg-stone-950 flex flex-col font-ar">
      <FontImport />
      <SaduBand />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-amber-500 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-7 h-7 text-stone-950" />
            </div>
            <h1 className="text-2xl font-bold text-stone-50">سوق الموظفين</h1>
            <p className="text-stone-400 text-sm mt-1 flex items-center justify-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              لوحة تحكم المالك
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
            <div>
              <label className="text-xs font-medium text-stone-400 mb-1.5 block">اليوزر</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="أدخل اليوزر"
                className="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-3 text-stone-50 placeholder:text-stone-500 outline-none focus:border-amber-500 transition-colors text-sm"
                required
                autoComplete="username"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-stone-400 mb-1.5 block">الباسورد</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="أدخل الباسورد"
                  className="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-3 text-stone-50 placeholder:text-stone-500 outline-none focus:border-amber-500 transition-colors text-sm pr-12"
                  required
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-950 border border-red-800 rounded-xl px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              {loading ? 'جاري التحقق...' : 'دخول'}
            </button>
          </form>

          {/* Hint box */}
          <div className="mt-4 bg-stone-900/50 border border-stone-800 rounded-xl p-4 text-center">
            <p className="text-xs text-stone-500 mb-1">بيانات الدخول الافتراضية:</p>
            <p className="text-xs text-amber-400 font-mono">
              يوزر: <span className="text-stone-300">admin</span>
              &nbsp;&nbsp;|&nbsp;&nbsp;
              باسورد: <span className="text-stone-300">AgentSouq2025!</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Main Dashboard ─────────────────────────────────────── */
export default function AdminDashboard() {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [lang, setLang] = useState('ar')
  const [dataLoading, setDataLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [searchQ, setSearchQ] = useState('')
  const [orderFilter, setOrderFilter] = useState('all')

  const [stats, setStats] = useState({ users: 0, orders: 0, revenue: 0, active: 0 })
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const revenueChart = [12, 19, 8, 25, 31, 22, 40, 35, 28, 45, 38, 52]

  const isAr = lang === 'ar'
  const dir = isAr ? 'rtl' : 'ltr'
  const font = isAr ? 'font-ar' : 'font-en'

  // Check session on mount
  useEffect(() => {
    if (sessionStorage.getItem('admin_auth') === 'true') {
      setIsLoggedIn(true)
      loadData()
    }
  }, [])

  const handleLogin = () => {
    setIsLoggedIn(true)
    loadData()
  }

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth')
    setIsLoggedIn(false)
  }

  const loadData = async () => {
    setDataLoading(true)
    try {
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)

      if (ordersData) {
        setOrders(ordersData)
        const totalRevenue = ordersData.reduce((s, o) => s + (parseFloat(o.amount) || 0), 0)
        const activeOrders = ordersData.filter(o => o.status === 'active').length
        setStats(prev => ({ ...prev, orders: ordersData.length, revenue: totalRevenue, active: activeOrders }))
      }

      const { data: profilesData } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)

      if (profilesData) {
        setUsers(profilesData)
        setStats(prev => ({ ...prev, users: profilesData.length }))
      }
    } catch (err) {
      console.error('Error loading data:', err)
    } finally {
      setDataLoading(false)
    }
  }

  // Show login screen if not authenticated
  if (!isLoggedIn) return <AdminLogin onLogin={handleLogin} />

  const filteredOrders = orders.filter(o => {
    const matchSearch = !searchQ ||
      (o.employee_name || '').includes(searchQ) ||
      (o.plan || '').includes(searchQ) ||
      (o.id || '').toLowerCase().includes(searchQ.toLowerCase())
    const matchFilter = orderFilter === 'all' || o.status === orderFilter
    return matchSearch && matchFilter
  })

  const statCards = [
    { icon: Users,       label: isAr ? 'إجمالي المستخدمين' : 'Total Users',          value: stats.users.toLocaleString(),                    delta: '+12%', up: true, color: 'bg-blue-50 text-blue-600' },
    { icon: ShoppingBag, label: isAr ? 'إجمالي الطلبات'    : 'Total Orders',          value: stats.orders.toLocaleString(),                   delta: '+8%',  up: true, color: 'bg-amber-50 text-amber-600' },
    { icon: DollarSign,  label: isAr ? 'الإيرادات (ريال)'  : 'Revenue (SAR)',         value: `${stats.revenue.toLocaleString()} ﷼`,           delta: '+23%', up: true, color: 'bg-green-50 text-green-600' },
    { icon: UserCheck,   label: isAr ? 'اشتراكات نشطة'     : 'Active Subscriptions',  value: stats.active.toLocaleString(),                   delta: '+5%',  up: true, color: 'bg-teal-50 text-teal-600' },
  ]

  const tabs = [
    { id: 'overview', label: isAr ? 'نظرة عامة' : 'Overview', icon: BarChart2 },
    { id: 'orders',   label: isAr ? 'الطلبات'   : 'Orders',   icon: ShoppingBag },
    { id: 'users',    label: isAr ? 'المستخدمون': 'Users',    icon: Users },
  ]

  return (
    <div dir={dir} className={`min-h-screen bg-stone-100 ${font} text-stone-900`}>
      <FontImport />

      {/* ── Header ── */}
      <header className="sticky top-0 z-30 bg-stone-950/98 backdrop-blur border-b border-stone-800">
        <SaduBand />
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-stone-950" />
            </div>
            <div>
              <div className="text-stone-50 font-bold text-sm leading-tight">
                {isAr ? 'سوق الموظفين' : 'AgentSouq'}
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-3 h-3 text-amber-400" />
                <span className="text-xs text-amber-400 font-medium">{isAr ? 'لوحة المالك' : 'Admin Panel'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setLang(isAr ? 'en' : 'ar')}
              className="text-xs text-stone-400 border border-stone-700 rounded-full px-3 py-1.5 hover:border-amber-500 hover:text-amber-400 transition-colors hidden sm:flex items-center gap-1.5">
              <Globe className="w-3 h-3" />
              {isAr ? 'EN' : 'عربي'}
            </button>
            <button onClick={loadData}
              className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-amber-400 transition-colors">
              <RefreshCw className={`w-4 h-4 ${dataLoading ? 'animate-spin' : ''}`} />
            </button>
            <div className="flex items-center gap-2 border border-stone-700 rounded-xl px-3 py-2">
              <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-xs font-bold text-stone-950">A</div>
              <span className="text-xs text-stone-300 hidden sm:block">Admin</span>
            </div>
            <button onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs text-red-400 border border-red-900 rounded-xl px-3 py-2 hover:bg-red-950 transition-colors">
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:block">{isAr ? 'خروج' : 'Sign Out'}</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* ── Page title ── */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{isAr ? '🏠 لوحة تحكم المالك' : '🏠 Admin Dashboard'}</h1>
          <p className="text-stone-500 text-sm mt-1">
            {isAr ? 'مرحباً — إليك ملخص موقعك' : 'Welcome — here\'s your site overview'}
          </p>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statCards.map((s, i) => <StatCard key={i} {...s} loading={dataLoading} />)}
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 bg-white rounded-xl p-1 border border-stone-200 mb-6 w-fit">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id ? 'bg-stone-950 text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}>
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Overview ── */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold">{isAr ? 'الإيرادات الشهرية' : 'Monthly Revenue'}</h3>
                  <p className="text-xs text-stone-500 mt-0.5">{isAr ? 'آخر 12 شهر' : 'Last 12 months'}</p>
                </div>
                <span className="text-2xl font-bold font-en text-green-600">{stats.revenue.toLocaleString()} ﷼</span>
              </div>
              <MiniBarChart data={revenueChart} color="#f59e0b" />
              <div className="flex justify-between mt-2">
                {['يول','أغ','سب','أكت','نوف','ديس','يناير','فبر','مارس','أبر','مايو','يون'].map((m,i) => (
                  <span key={i} className="text-xs text-stone-400">{m}</span>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm">
                <h3 className="font-bold mb-4 text-sm">{isAr ? 'أكثر الموظفين طلباً' : 'Top Employees'}</h3>
                {[
                  { name: isAr ? 'موظف المبيعات'  : 'Sales',          pct: 38, color: '#f59e0b' },
                  { name: isAr ? 'خدمة العملاء'   : 'Customer Svc',   pct: 27, color: '#0f766e' },
                  { name: isAr ? 'موظف المحتوى'   : 'Content',        pct: 21, color: '#6366f1' },
                  { name: isAr ? 'موظف التسويق'   : 'Marketing',      pct: 14, color: '#ec4899' },
                ].map((e, i) => (
                  <div key={i} className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-stone-700">{e.name}</span>
                      <span className="font-semibold">{e.pct}%</span>
                    </div>
                    <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${e.pct}%`, backgroundColor: e.color }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-amber-600" />
                  <span className="font-bold text-sm text-amber-800">{isAr ? 'نصيحة' : 'Tip'}</span>
                </div>
                <p className="text-xs text-amber-700 leading-relaxed">
                  {isAr
                    ? 'أضف موظفين جدد لزيادة الإيرادات. المواقع التي تضيف موظفاً جديداً شهرياً تحقق 40% نمو أكثر.'
                    : 'Add new employees monthly to grow revenue by 40% more.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Orders ── */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-stone-100 flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-bold">{isAr ? 'جميع الطلبات' : 'All Orders'} ({filteredOrders.length})</h3>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 border border-stone-200 rounded-xl px-3 py-2">
                  <Search className="w-3.5 h-3.5 text-stone-400" />
                  <input
                    className="outline-none bg-transparent text-sm placeholder:text-stone-400 w-36"
                    placeholder={isAr ? 'بحث...' : 'Search...'}
                    value={searchQ}
                    onChange={e => setSearchQ(e.target.value)}
                    dir={isAr ? 'rtl' : 'ltr'}
                  />
                </div>
                <select value={orderFilter} onChange={e => setOrderFilter(e.target.value)}
                  className="border border-stone-200 rounded-xl px-3 py-2 text-sm outline-none bg-white">
                  <option value="all">{isAr ? 'الكل' : 'All'}</option>
                  <option value="active">{isAr ? 'نشط' : 'Active'}</option>
                  <option value="cancelled">{isAr ? 'ملغي' : 'Cancelled'}</option>
                  <option value="pending">{isAr ? 'معلّق' : 'Pending'}</option>
                </select>
              </div>
            </div>

            {dataLoading ? (
              <div className="p-10 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-amber-500 mx-auto mb-2" />
                <p className="text-stone-400 text-sm">{isAr ? 'جاري التحميل...' : 'Loading...'}</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="p-10 text-center">
                <ShoppingBag className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                <p className="text-stone-400 text-sm">{isAr ? 'لا توجد طلبات بعد' : 'No orders yet'}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-stone-50 border-b border-stone-100">
                    <tr>
                      {[isAr?'رقم الطلب':'Order ID', isAr?'الموظف':'Employee', isAr?'الخطة':'Plan', isAr?'المبلغ':'Amount', isAr?'الحالة':'Status', isAr?'التاريخ':'Date'].map((h,i) => (
                        <th key={i} className="text-right px-4 py-3 text-xs font-semibold text-stone-500 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-50">
                    {filteredOrders.map((order, i) => (
                      <tr key={order.id || i} className="hover:bg-stone-50 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs text-stone-400">#{(order.id||'').slice(0,8)}</td>
                        <td className="px-4 py-3 font-medium">{order.employee_name || '—'}</td>
                        <td className="px-4 py-3 text-stone-600">{order.plan || '—'}</td>
                        <td className="px-4 py-3 font-semibold text-green-700">{parseFloat(order.amount||0).toLocaleString()} ﷼</td>
                        <td className="px-4 py-3"><StatusBadge status={order.status||'pending'} /></td>
                        <td className="px-4 py-3 text-stone-500 text-xs whitespace-nowrap">
                          {order.created_at ? new Date(order.created_at).toLocaleDateString('ar-SA') : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Users ── */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-stone-100">
              <h3 className="font-bold">{isAr ? 'المستخدمون المسجّلون' : 'Registered Users'} ({users.length})</h3>
            </div>
            {dataLoading ? (
              <div className="p-10 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-amber-500 mx-auto mb-2" />
              </div>
            ) : users.length === 0 ? (
              <div className="p-10 text-center">
                <Users className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                <p className="text-stone-400 text-sm">{isAr ? 'لا يوجد مستخدمون بعد' : 'No users yet'}</p>
                <p className="text-stone-300 text-xs mt-1">{isAr ? 'المستخدمون سيظهرون هنا بعد التسجيل' : 'Users will appear after sign-up'}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-stone-50 border-b border-stone-100">
                    <tr>
                      {[isAr?'المستخدم':'User', isAr?'البريد':'Email', isAr?'الشركة':'Company', isAr?'تاريخ التسجيل':'Joined'].map((h,i) => (
                        <th key={i} className="text-right px-4 py-3 text-xs font-semibold text-stone-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-50">
                    {users.map((u, i) => (
                      <tr key={u.id||i} className="hover:bg-stone-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-sm font-bold text-amber-700 shrink-0">
                              {(u.full_name||u.email||'?')[0].toUpperCase()}
                            </div>
                            <span className="font-medium">{u.full_name || (isAr ? 'مستخدم' : 'User')}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-stone-500 font-mono text-xs">{u.email||'—'}</td>
                        <td className="px-4 py-3 text-stone-600">{u.company_name||'—'}</td>
                        <td className="px-4 py-3 text-stone-400 text-xs">
                          {u.created_at ? new Date(u.created_at).toLocaleDateString('ar-SA') : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
