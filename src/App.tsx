import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Receipt, 
  PieChart, 
  Target, 
  BarChart3, 
  CreditCard, 
  Plus, 
  Search, 
  Bell, 
  ChevronRight, 
  TrendingUp, 
  TrendingDown, 
  Wallet,
  Calendar,
  Filter,
  MoreVertical,
  CheckCircle2,
  BrainCircuit,
  ArrowUpRight,
  X,
  Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart as RePieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utilities ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
type View = 'dashboard' | 'expenses' | 'budget' | 'goals' | 'reports' | 'subscription';

interface Transaction {
  id: string;
  category: string;
  amount: number;
  date: string;
  type: 'expense' | 'income';
  description: string;
}

interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  deadline: string;
  color: string;
}

// --- Mock Data ---
const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', category: 'Alimentación', amount: 45.50, date: '2026-04-05', type: 'expense', description: 'Supermercado Semanal' },
  { id: '2', category: 'Transporte', amount: 12.00, date: '2026-04-04', type: 'expense', description: 'Uber al trabajo' },
  { id: '3', category: 'Sueldo', amount: 2500.00, date: '2026-04-01', type: 'income', description: 'Nómina Marzo' },
  { id: '4', category: 'Entretenimiento', amount: 15.99, date: '2026-03-30', type: 'expense', description: 'Netflix' },
  { id: '5', category: 'Hogar', amount: 120.00, date: '2026-03-28', type: 'expense', description: 'Luz y Agua' },
];

const MOCK_GOALS: Goal[] = [
  { id: '1', title: 'Fondo de Emergencia', target: 5000, current: 3200, deadline: '2026-12-31', color: '#004bca' },
  { id: '2', title: 'Viaje a Japón', target: 3000, current: 1200, deadline: '2027-06-15', color: '#006c4a' },
  { id: '3', title: 'Nuevo MacBook', target: 2000, current: 1800, deadline: '2026-08-01', color: '#f59e0b' },
];

const CATEGORY_DATA = [
  { name: 'Alimentación', value: 400, color: '#004bca' },
  { name: 'Transporte', value: 300, color: '#006c4a' },
  { name: 'Hogar', value: 600, color: '#f59e0b' },
  { name: 'Ocio', value: 200, color: '#ef4444' },
];

const MONTHLY_DATA = [
  { month: 'Ene', income: 2500, expenses: 1800 },
  { month: 'Feb', income: 2500, expenses: 2100 },
  { month: 'Mar', income: 2800, expenses: 1900 },
  { month: 'Abr', income: 2500, expenses: 1200 },
];

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200",
      active 
        ? "bg-primary text-white shadow-lg shadow-primary/20" 
        : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
    )}
  >
    <Icon size={20} />
    <span className="font-medium text-sm">{label}</span>
  </button>
);

const Card = ({ children, className, title, action }: { children: React.ReactNode, className?: string, title?: string, action?: React.ReactNode, key?: string | number }) => (
  <div className={cn("bg-white rounded-2xl p-6 card-shadow border border-slate-100", className)}>
    {(title || action) && (
      <div className="flex justify-between items-center mb-6">
        {title && <h3 className="font-semibold text-slate-800">{title}</h3>}
        {action}
      </div>
    )}
    {children}
  </div>
);

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>
          {children}
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

// --- Views ---

const DashboardView = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-primary text-white border-none">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-white/20 rounded-lg">
            <Wallet size={20} />
          </div>
          <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">Abril 2026</span>
        </div>
        <p className="text-white/70 text-sm mb-1">Balance Total</p>
        <h2 className="text-3xl font-bold mb-4">$12,450.00</h2>
        <div className="flex items-center gap-2 text-xs text-white/90">
          <TrendingUp size={14} className="text-green-300" />
          <span>+12.5% respecto al mes pasado</span>
        </div>
      </Card>

      <Card title="Ingresos Mensuales">
        <div className="flex items-end gap-4 mb-4">
          <h2 className="text-2xl font-bold text-slate-900">$3,200.00</h2>
          <span className="text-green-600 text-sm font-medium mb-1 flex items-center gap-1">
            <ArrowUpRight size={14} /> 8%
          </span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 w-[75%]" />
        </div>
        <p className="text-slate-500 text-xs mt-2">75% de la meta mensual alcanzada</p>
      </Card>

      <Card title="Gastos Mensuales">
        <div className="flex items-end gap-4 mb-4">
          <h2 className="text-2xl font-bold text-slate-900">$1,850.00</h2>
          <span className="text-red-500 text-sm font-medium mb-1 flex items-center gap-1">
            <TrendingDown size={14} /> 12%
          </span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-red-500 w-[45%]" />
        </div>
        <p className="text-slate-500 text-xs mt-2">45% del presupuesto utilizado</p>
      </Card>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card title="Actividad Reciente" action={<button className="text-primary text-sm font-medium hover:underline">Ver todo</button>}>
        <div className="space-y-4">
          {MOCK_TRANSACTIONS.map((t) => (
            <div key={t.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "p-2.5 rounded-xl",
                  t.type === 'income' ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"
                )}>
                  {t.type === 'income' ? <TrendingUp size={18} /> : <Receipt size={18} />}
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{t.description}</p>
                  <p className="text-slate-500 text-xs">{t.category} • {t.date}</p>
                </div>
              </div>
              <p className={cn(
                "font-bold text-sm",
                t.type === 'income' ? "text-green-600" : "text-slate-900"
              )}>
                {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Distribución de Gastos">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RePieChart>
              <Pie
                data={CATEGORY_DATA}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {CATEGORY_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RePieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {CATEGORY_DATA.map((cat) => (
            <div key={cat.name} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
              <span className="text-xs text-slate-600 font-medium">{cat.name}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  </div>
);

const GoalsView = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Tus Metas</h2>
        <p className="text-slate-500">Planifica tu futuro paso a paso</p>
      </div>
      <button className="bg-primary text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium hover:bg-primary/90 transition-colors">
        <Plus size={18} /> Nueva Meta
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {MOCK_GOALS.map((goal) => (
        <Card key={goal.id} className="relative overflow-hidden">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 rounded-2xl" style={{ backgroundColor: `${goal.color}15`, color: goal.color }}>
              <Target size={24} />
            </div>
            <button className="text-slate-400 hover:text-slate-600">
              <MoreVertical size={20} />
            </button>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">{goal.title}</h3>
          <p className="text-slate-500 text-sm mb-6">Meta: ${goal.target.toLocaleString()}</p>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 font-medium">${goal.current.toLocaleString()}</span>
              <span className="text-slate-400">{Math.round((goal.current / goal.target) * 100)}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(goal.current / goal.target) * 100}%` }}
                className="h-full rounded-full"
                style={{ backgroundColor: goal.color }}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Calendar size={14} />
            <span>Vence el {goal.deadline}</span>
          </div>
        </Card>
      ))}
    </div>

    <Card className="bg-slate-900 text-white border-none p-8">
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <div className="p-4 bg-white/10 rounded-3xl">
          <BrainCircuit size={48} className="text-primary" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-xl font-bold mb-2">Recomendación de IA</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Basado en tus gastos actuales en "Ocio", si reduces un 15% podrías completar tu meta de "Viaje a Japón" 3 meses antes de lo previsto.
          </p>
        </div>
        <button className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors whitespace-nowrap">
          Aplicar Ajuste
        </button>
      </div>
    </Card>
  </div>
);

const SubscriptionView = () => (
  <div className="max-w-4xl mx-auto py-8">
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold text-slate-900 mb-4">Elige tu Plan</h2>
      <p className="text-slate-500">Desbloquea todo el potencial de tu arquitectura financiera</p>
      
      <div className="flex items-center justify-center gap-4 mt-8">
        <span className="text-sm font-medium text-slate-600">Mensual</span>
        <button className="w-12 h-6 bg-primary rounded-full relative p-1">
          <div className="w-4 h-4 bg-white rounded-full absolute right-1" />
        </button>
        <span className="text-sm font-medium text-slate-600">Anual <span className="text-green-600 text-xs bg-green-100 px-2 py-0.5 rounded-full">-20%</span></span>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card className="p-8 border-2 border-slate-100">
        <h3 className="text-xl font-bold mb-2">Plan Básico</h3>
        <p className="text-slate-500 text-sm mb-6">Para quienes empiezan su camino</p>
        <div className="flex items-baseline gap-1 mb-8">
          <span className="text-4xl font-bold">$0</span>
          <span className="text-slate-400">/mes</span>
        </div>
        
        <ul className="space-y-4 mb-8">
          {['Registro de gastos ilimitado', '3 Metas de ahorro', 'Reportes mensuales básicos', 'Soporte por email'].map((feature) => (
            <li key={feature} className="flex items-center gap-3 text-sm text-slate-600">
              <CheckCircle2 size={18} className="text-slate-300" />
              {feature}
            </li>
          ))}
        </ul>
        
        <button className="w-full py-3 rounded-xl border-2 border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-colors">
          Tu Plan Actual
        </button>
      </Card>

      <Card className="p-8 border-2 border-primary relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-primary text-white px-4 py-1 text-xs font-bold rounded-bl-xl">
          RECOMENDADO
        </div>
        <h3 className="text-xl font-bold mb-2">Plan Plus</h3>
        <p className="text-slate-500 text-sm mb-6">Control total con inteligencia artificial</p>
        <div className="flex items-baseline gap-1 mb-8">
          <span className="text-4xl font-bold text-primary">$9.99</span>
          <span className="text-slate-400">/mes</span>
        </div>
        
        <ul className="space-y-4 mb-8">
          {['Todo lo del Plan Básico', 'Metas ilimitadas', 'IA de recomendaciones financieras', 'Exportación de datos (PDF/Excel)', 'Soporte prioritario 24/7'].map((feature) => (
            <li key={feature} className="flex items-center gap-3 text-sm text-slate-600">
              <CheckCircle2 size={18} className="text-primary" />
              {feature}
            </li>
          ))}
        </ul>
        
        <button className="w-full py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
          Mejorar a Plus
        </button>
      </Card>
    </div>
  </div>
);

const ReportsView = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-slate-900">Reportes Financieros</h2>
      <div className="flex gap-2">
        <button className="p-2 bg-white rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50">
          <Calendar size={20} />
        </button>
        <button className="p-2 bg-white rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50">
          <Filter size={20} />
        </button>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2" title="Tendencia de Gastos vs Ingresos">
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MONTHLY_DATA}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#006c4a" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#006c4a" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#004bca" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#004bca" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="income" stroke="#006c4a" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={3} />
              <Area type="monotone" dataKey="expenses" stroke="#004bca" fillOpacity={1} fill="url(#colorExpenses)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="space-y-6">
        <Card title="Resumen Anual">
          <div className="space-y-6">
            <div>
              <p className="text-slate-500 text-xs mb-1">Ahorro Total</p>
              <p className="text-2xl font-bold text-green-600">$4,250.00</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs mb-1">Promedio Gasto Mensual</p>
              <p className="text-2xl font-bold text-slate-900">$1,920.00</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs mb-1">Categoría más alta</p>
              <p className="text-lg font-bold text-slate-800">Alquiler (42%)</p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-primary text-white border-none">
          <h3 className="font-bold mb-2">¿Necesitas un reporte detallado?</h3>
          <p className="text-white/70 text-sm mb-4">Exporta todos tus movimientos en formato PDF o Excel para tu contador.</p>
          <button className="w-full py-2 bg-white text-primary rounded-lg font-bold text-sm">Exportar Datos</button>
        </Card>
      </div>
    </div>
  </div>
);

// --- Main App ---

export default function App() {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Responsive sidebar handling
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-100 transition-transform duration-300 lg:translate-x-0",
        !isSidebarOpen && "-translate-x-full"
      )}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <TrendingUp size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-none">Finzapp</h1>
              <p className="text-[10px] text-slate-400 font-medium tracking-widest uppercase mt-1">Wealth Builder</p>
            </div>
          </div>

          <nav className="flex-1 space-y-2">
            <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} />
            <SidebarItem icon={Receipt} label="Gastos" active={activeView === 'expenses'} onClick={() => setActiveView('expenses')} />
            <SidebarItem icon={PieChart} label="Presupuesto" active={activeView === 'budget'} onClick={() => setActiveView('budget')} />
            <SidebarItem icon={Target} label="Metas" active={activeView === 'goals'} onClick={() => setActiveView('goals')} />
            <SidebarItem icon={BarChart3} label="Reportes" active={activeView === 'reports'} onClick={() => setActiveView('reports')} />
            <SidebarItem icon={CreditCard} label="Suscripción" active={activeView === 'subscription'} onClick={() => setActiveView('subscription')} />
          </nav>

          <div className="mt-auto pt-6 border-t border-slate-100">
            <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="User" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">Alex Rivera</p>
                <p className="text-xs text-slate-500 truncate">Plan Básico</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {!isSidebarOpen && window.innerWidth < 1024 && (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <main className={cn(
        "flex-1 transition-all duration-300",
        isSidebarOpen ? "lg:ml-64" : "ml-0"
      )}>
        {/* Header */}
        <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg lg:hidden"
            >
              <Menu size={20} />
            </button>
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar transacciones..." 
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-64 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-primary text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Nuevo Gasto</span>
            </button>
          </div>
        </header>

        {/* View Content */}
        <div className="p-6 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeView === 'dashboard' && <DashboardView />}
              {activeView === 'goals' && <GoalsView />}
              {activeView === 'subscription' && <SubscriptionView />}
              {activeView === 'reports' && <ReportsView />}
              {activeView === 'expenses' && (
                <Card title="Gestión de Gastos" action={
                  <div className="flex gap-2">
                    <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50"><Filter size={18} /></button>
                    <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50"><Calendar size={18} /></button>
                  </div>
                }>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-slate-100">
                          <th className="pb-4 font-semibold">Descripción</th>
                          <th className="pb-4 font-semibold">Categoría</th>
                          <th className="pb-4 font-semibold">Fecha</th>
                          <th className="pb-4 font-semibold text-right">Monto</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {MOCK_TRANSACTIONS.map((t) => (
                          <tr key={t.id} className="group hover:bg-slate-50/50 transition-colors">
                            <td className="py-4 font-medium text-slate-800 text-sm">{t.description}</td>
                            <td className="py-4">
                              <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium">{t.category}</span>
                            </td>
                            <td className="py-4 text-slate-500 text-sm">{t.date}</td>
                            <td className={cn(
                              "py-4 text-right font-bold text-sm",
                              t.type === 'income' ? "text-green-600" : "text-slate-900"
                            )}>
                              {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}
              {activeView === 'budget' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-slate-900">Presupuesto Mensual</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {CATEGORY_DATA.map((cat) => (
                      <Card key={cat.name}>
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${cat.color}15`, color: cat.color }}>
                              <PieChart size={20} />
                            </div>
                            <h3 className="font-bold text-slate-800">{cat.name}</h3>
                          </div>
                          <span className="text-slate-400 text-sm">Límite: $1,000</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-bold text-slate-900">${cat.value}</span>
                            <span className="text-slate-400">{Math.round((cat.value / 1000) * 100)}%</span>
                          </div>
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${(cat.value / 1000) * 100}%`, backgroundColor: cat.color }} />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Add Expense Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nuevo Gasto">
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Monto</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">$</span>
              <input 
                type="number" 
                placeholder="0.00" 
                className="w-full pl-10 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-3xl font-bold focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none"
                autoFocus
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Descripción</label>
            <input 
              type="text" 
              placeholder="¿En qué gastaste?" 
              className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Categoría</label>
              <select className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none appearance-none">
                <option>Alimentación</option>
                <option>Transporte</option>
                <option>Hogar</option>
                <option>Ocio</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Fecha</label>
              <input 
                type="date" 
                defaultValue={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none"
              />
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
            >
              Guardar Gasto
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
