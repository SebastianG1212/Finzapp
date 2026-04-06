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
  Menu,
  LogOut,
  ArrowRight,
  Sparkles,
  Twitter,
  Github,
  Zap,
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
  method?: string;
  status?: 'completado' | 'pendiente';
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
  { id: '1', category: 'Alimentación', amount: 45.50, date: '2026-04-05', type: 'expense', description: 'Supermercado Semanal', method: 'Tarjeta' },
  { id: '2', category: 'Transporte', amount: 12.00, date: '2026-04-04', type: 'expense', description: 'Uber al trabajo', method: 'Efectivo' },
  { id: '3', category: 'Sueldo', amount: 2500.00, date: '2026-04-01', type: 'income', description: 'Nómina Marzo', method: 'Transferencia' },
  { id: '4', category: 'Entretenimiento', amount: 15.99, date: '2026-03-30', type: 'expense', description: 'Netflix', method: 'Tarjeta' },
  { id: '5', category: 'Hogar', amount: 120.00, date: '2026-03-28', type: 'expense', description: 'Luz y Agua', method: 'Transferencia' },
  { id: '6', category: 'Alimentación', amount: 8.50, date: '2026-04-06', type: 'expense', description: 'Café y Pan', method: 'Efectivo' },
];

const MOCK_GOALS: Goal[] = [
  { id: '1', title: 'Fondo de Emergencia', target: 5000, current: 3200, deadline: '2026-12-31', color: '#004bca' },
  { id: '2', title: 'Viaje a Japón', target: 3000, current: 1200, deadline: '2027-06-15', color: '#006c4a' },
  { id: '3', title: 'Nuevo MacBook', target: 2000, current: 1800, deadline: '2026-08-01', color: '#f59e0b' },
];

const CATEGORY_DATA = [
  { name: 'Alimentación', value: 400, color: '#004bca', budget: 500 },
  { name: 'Transporte', value: 300, color: '#006c4a', budget: 250 },
  { name: 'Hogar', value: 600, color: '#f59e0b', budget: 700 },
  { name: 'Ocio', value: 200, color: '#ef4444', budget: 150 },
  { name: 'Educación', value: 150, color: '#8b5cf6', budget: 300 },
];

const MONTHLY_DATA = [
  { month: 'May', income: 2400, expenses: 1700 },
  { month: 'Jun', income: 2400, expenses: 1900 },
  { month: 'Jul', income: 2600, expenses: 2000 },
  { month: 'Ago', income: 2400, expenses: 1800 },
  { month: 'Sep', income: 2500, expenses: 2100 },
  { month: 'Oct', income: 2500, expenses: 1950 },
  { month: 'Nov', income: 2700, expenses: 2200 },
  { month: 'Dic', income: 3000, expenses: 2500 },
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

const ExpensesView = ({ onAddExpense }: { onAddExpense: () => void }) => {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const filteredTransactions = MOCK_TRANSACTIONS
    .filter(t => (selectedCategory === 'Todos' || t.category === selectedCategory))
    .filter(t => t.description.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => sortOrder === 'desc' ? b.amount - a.amount : a.amount - b.amount);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gestión de Gastos</h2>
          <p className="text-slate-500 text-sm">Controla cada centavo de tu flujo de caja</p>
        </div>
        <button 
          onClick={onAddExpense}
          className="bg-primary text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
        >
          <Plus size={18} /> Nuevo Gasto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Calendar size={20} /></div>
          <div>
            <p className="text-slate-500 text-xs font-medium">Gastos Hoy</p>
            <p className="text-xl font-bold text-slate-900">$8.50</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl"><TrendingUp size={20} /></div>
          <div>
            <p className="text-slate-500 text-xs font-medium">Gastos esta Semana</p>
            <p className="text-xl font-bold text-slate-900">$66.00</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><BarChart3 size={20} /></div>
          <div>
            <p className="text-slate-500 text-xs font-medium">Gasto Promedio Diario</p>
            <p className="text-xl font-bold text-slate-900">$42.30</p>
          </div>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2">
        {['Todos', 'Alimentación', 'Transporte', 'Entretenimiento', 'Hogar', 'Educación'].map((cat) => (
          <button 
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              "px-4 py-2 rounded-full text-xs font-bold transition-all",
              cat === selectedCategory ? "bg-primary text-white" : "bg-white text-slate-500 border border-slate-200 hover:border-primary/50"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="overflow-hidden p-0">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div className="relative w-full max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Buscar..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none" 
                />
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                  className="p-2 text-slate-400 hover:text-slate-600 flex items-center gap-1 text-xs font-bold"
                >
                  <Filter size={18} /> {sortOrder === 'desc' ? 'Mayor' : 'Menor'}
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              {filteredTransactions.length > 0 ? (
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-slate-400 text-[10px] uppercase tracking-widest border-b border-slate-50">
                      <th className="px-6 py-4 font-bold">Descripción</th>
                      <th className="px-6 py-4 font-bold">Categoría</th>
                      <th className="px-6 py-4 font-bold">Método</th>
                      <th className="px-6 py-4 font-bold">Fecha</th>
                      <th className="px-6 py-4 font-bold text-right">Monto</th>
                      <th className="px-6 py-4 font-bold text-center">Estado</th>
                      <th className="px-6 py-4 font-bold text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredTransactions.map((t) => (
                      <tr key={t.id} className="group hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-100 rounded-lg text-slate-500 group-hover:bg-white transition-colors">
                              <Receipt size={16} />
                            </div>
                            <span className="text-sm font-semibold text-slate-800">{t.description}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-[10px] font-bold uppercase">{t.category}</span>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500 font-medium">{t.method || 'Tarjeta'}</td>
                        <td className="px-6 py-4 text-xs text-slate-500">{t.date}</td>
                        <td className="px-6 py-4 text-right font-bold text-sm text-slate-900">
                          ${t.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                            <CheckCircle2 size={10} /> Completado
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-1 text-slate-300 hover:text-slate-600 transition-colors"><MoreVertical size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-20 text-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search size={40} className="text-slate-200" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">No se encontraron gastos</h3>
                  <p className="text-slate-500 text-sm max-w-xs mx-auto">Intenta ajustar tus filtros o busca algo diferente.</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Insight del Mes">
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp size={32} />
              </div>
              <h4 className="font-bold text-slate-900 mb-1">Mayor Gasto</h4>
              <p className="text-primary font-bold text-lg">Alimentación</p>
              <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                Representa el 42% de tus gastos totales este mes.
              </p>
            </div>
            <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2 text-primary mb-2">
                <BrainCircuit size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Sugerencia IA</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                "Si reduces tus gastos en entretenimiento un <span className="font-bold text-slate-900">10%</span>, podrías ahorrar $45 adicionales este mes."
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const BudgetView = () => {
  const [budgets, setBudgets] = useState(CATEGORY_DATA);

  const handleSliderChange = (name: string, newValue: number) => {
    setBudgets(prev => prev.map(b => b.name === name ? { ...b, budget: newValue } : b));
  };

  const totalBudget = budgets.reduce((acc, curr) => acc + curr.budget, 0);
  const totalSpent = budgets.reduce((acc, curr) => acc + curr.value, 0);
  const remaining = totalBudget - totalSpent;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Presupuesto Mensual</h2>
          <p className="text-slate-500 text-sm">Define tus límites y optimiza tu ahorro</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all">
            Optimizar IA
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
            Guardar Cambios
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-4">
          <p className="text-slate-500 text-xs font-medium mb-1">Presupuesto Total</p>
          <p className="text-2xl font-bold text-slate-900">${totalBudget.toLocaleString()}</p>
        </Card>
        <Card className="p-4">
          <p className="text-slate-500 text-xs font-medium mb-1">Gastado</p>
          <p className="text-2xl font-bold text-slate-900">${totalSpent.toLocaleString()}</p>
        </Card>
        <Card className="p-4">
          <p className="text-slate-500 text-xs font-medium mb-1">Disponible</p>
          <p className="text-2xl font-bold text-green-600">${remaining.toLocaleString()}</p>
        </Card>
        <Card className="p-4 bg-slate-900 text-white border-none">
          <p className="text-slate-400 text-xs font-medium mb-1">Predicción Fin de Mes</p>
          <p className="text-2xl font-bold text-primary">${(totalSpent * 1.2).toFixed(0)}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {budgets.map((cat) => {
            const percentage = (cat.value / cat.budget) * 100;
            const isWarning = percentage > 80;
            return (
              <Card key={cat.name} className="relative">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${cat.color}15`, color: cat.color }}>
                      <PieChart size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">{cat.name}</h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Límite: ${cat.budget}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn("text-sm font-bold", isWarning ? "text-red-500" : "text-slate-900")}>
                      ${cat.value} / ${cat.budget}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">Restante: ${cat.budget - cat.value}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(percentage, 100)}%` }}
                      className={cn("h-full rounded-full transition-colors", isWarning ? "bg-red-500" : "bg-primary")}
                    />
                  </div>
                  <input 
                    type="range" 
                    min="100" 
                    max="2000" 
                    step="50"
                    value={cat.budget}
                    onChange={(e) => handleSliderChange(cat.name, parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
                {isWarning && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-lg">
                    ALERTA 80%
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        <div className="space-y-6">
          <Card title="Distribución de Presupuesto">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={budgets}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="budget"
                  >
                    {budgets.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RePieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {budgets.map(b => (
                <div key={b.name} className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: b.color }} />
                    <span className="text-slate-600 font-medium">{b.name}</span>
                  </div>
                  <span className="font-bold text-slate-900">{Math.round((b.budget / totalBudget) * 100)}%</span>
                </div>
              ))}
            </div>
          </Card>

          <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10">
            <div className="flex items-center gap-2 text-primary mb-3">
              <BrainCircuit size={20} />
              <h4 className="font-bold text-sm">Smart Panel</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              "Tu presupuesto en <span className="font-bold text-slate-900">Entretenimiento</span> excederá el límite en 5 días si mantienes el ritmo actual de gasto."
            </p>
            <button className="w-full py-2 bg-primary text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-primary/90 transition-all">
              Ajustar Automáticamente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const LandingPageView = ({ onLogin }: { onLogin: () => void }) => (
  <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-primary/10 selection:text-primary">
    {/* Navigation */}
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <Zap size={24} fill="currentColor" />
          </div>
          <span className="text-xl font-black tracking-tight text-slate-900">Finzapp</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500">
          <a href="#features" className="hover:text-primary transition-colors">Características</a>
          <a href="#pricing" className="hover:text-primary transition-colors">Precios</a>
          <a href="#testimonials" className="hover:text-primary transition-colors">Comunidad</a>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={onLogin} className="text-sm font-bold text-slate-600 hover:text-primary transition-colors">Entrar</button>
          <button onClick={onLogin} className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all hover:-translate-y-0.5">
            Empezar Gratis
          </button>
        </div>
      </div>
    </nav>

    {/* Hero Section */}
    <section className="pt-40 pb-20 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold mb-6">
            <Sparkles size={14} />
            <span>NUEVA ERA DE FINANZAS PERSONALES</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1] mb-6">
            Domina tu dinero, <span className="text-primary">sin estrés.</span>
          </h1>
          <p className="text-xl text-slate-500 mb-10 leading-relaxed max-w-lg">
            La app de finanzas diseñada para estudiantes y jóvenes profesionales. Controla gastos, ahorra para tus metas y recibe consejos de IA.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={onLogin} className="bg-primary text-white px-8 py-4 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all hover:-translate-y-1 flex items-center justify-center gap-2">
              Crear mi cuenta <ArrowRight size={20} />
            </button>
            <div className="flex items-center gap-4 px-4">
              <div className="flex -space-x-3">
                {[1,2,3].map(i => (
                  <img key={i} src={`https://i.pravatar.cc/100?u=${i}`} className="w-10 h-10 rounded-full border-2 border-white" referrerPolicy="no-referrer" />
                ))}
              </div>
              <p className="text-sm text-slate-500 font-medium">+10k usuarios activos</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="relative z-10 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-4 transform rotate-2">
            <img src="https://picsum.photos/seed/finzapp/800/600" alt="Dashboard Preview" className="rounded-[2rem]" referrerPolicy="no-referrer" />
          </div>
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-green-100 rounded-full blur-3xl -z-10" />
        </motion.div>
      </div>
    </section>

    {/* Features */}
    <section id="features" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-4xl font-black text-slate-900 mb-4">Todo lo que necesitas para crecer</h2>
          <p className="text-slate-500">Herramientas potentes simplificadas para tu día a día.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: <Zap />, title: "Registro Veloz", desc: "Anota tus gastos en segundos con nuestra interfaz optimizada." },
            { icon: <BrainCircuit />, title: "IA Financiera", desc: "Recibe consejos personalizados para optimizar tu presupuesto." },
            { icon: <Target />, title: "Metas Claras", desc: "Visualiza el progreso de tus ahorros con gráficas interactivas." }
          ].map((f, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100"
            >
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
              <p className="text-slate-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Testimonials */}
    <section id="testimonials" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-black text-slate-900 mb-6">Amado por la nueva generación</h2>
            <p className="text-slate-500 text-lg mb-8">Estudiantes y profesionales ya están transformando su relación con el dinero.</p>
            <div className="space-y-6">
              {[
                { name: "Mateo García", role: "Estudiante de Diseño", text: "Finzapp me ayudó a ahorrar para mi primer MacBook en solo 6 meses." },
                { name: "Sofía Ruiz", role: "Junior Developer", text: "Los reportes de IA son increíbles, me dicen exactamente dónde estoy gastando de más." }
              ].map((t, i) => (
                <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-slate-700 italic mb-4">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-200 rounded-full" />
                    <div>
                      <p className="font-bold text-sm text-slate-900">{t.name}</p>
                      <p className="text-xs text-slate-500">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-primary rounded-[3rem] p-12 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-3xl font-black mb-6">¿Listo para tomar el control?</h3>
              <p className="text-primary-foreground/80 mb-10 text-lg">Únete a miles de personas que ya están construyendo su futuro financiero hoy mismo.</p>
              <button onClick={onLogin} className="bg-white text-primary px-8 py-4 rounded-2xl font-bold shadow-xl hover:bg-slate-50 transition-all">
                Empezar ahora gratis
              </button>
            </div>
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </section>

    {/* Footer */}
    <footer className="py-12 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:row justify-between items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
            <Zap size={18} fill="currentColor" />
          </div>
          <span className="text-lg font-black tracking-tight text-slate-900">Finzapp</span>
        </div>
        <p className="text-slate-400 text-sm">© 2026 Finzapp. Hecho con ❤️ para Latinoamérica.</p>
        <div className="flex gap-6 text-slate-400">
          <a href="#" className="hover:text-primary transition-colors"><Twitter size={20} /></a>
          <a href="#" className="hover:text-primary transition-colors"><Github size={20} /></a>
        </div>
      </div>
    </footer>
  </div>
);

const ReportsView = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Reportes Financieros</h2>
        <p className="text-slate-500 text-sm">Análisis profundo de tu salud financiera</p>
      </div>
      <div className="flex gap-2">
        {['7D', '30D', '6M', '1Y'].map(f => (
          <button key={f} className={cn(
            "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
            f === '30D' ? "bg-primary text-white shadow-md shadow-primary/20" : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
          )}>
            {f}
          </button>
        ))}
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="p-4 border-l-4 border-l-green-500">
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Ahorro este mes</p>
        <p className="text-xl font-bold text-slate-900">$1,300.00</p>
        <p className="text-[10px] text-green-600 font-bold mt-1">+15% vs mes anterior</p>
      </Card>
      <Card className="p-4 border-l-4 border-l-primary">
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Tendencia de Gasto</p>
        <p className="text-xl font-bold text-slate-900">-8.4%</p>
        <p className="text-[10px] text-primary font-bold mt-1">Mejorando eficiencia</p>
      </Card>
      <Card className="p-4 border-l-4 border-l-orange-500">
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Racha de Ahorro</p>
        <p className="text-xl font-bold text-slate-900">4 Meses</p>
        <p className="text-[10px] text-orange-600 font-bold mt-1">¡Sigue así!</p>
      </Card>
      <Card className="p-4 border-l-4 border-l-red-500">
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Gastos Hormiga</p>
        <p className="text-xl font-bold text-slate-900">$142.00</p>
        <p className="text-[10px] text-red-600 font-bold mt-1">Detectados este mes</p>
      </Card>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2" title="Tendencia de Gastos vs Ingresos (12 Meses)">
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
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              <Area type="monotone" dataKey="income" name="Ingresos" stroke="#006c4a" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={3} />
              <Area type="monotone" dataKey="expenses" name="Gastos" stroke="#004bca" fillOpacity={1} fill="url(#colorExpenses)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="space-y-6">
        <Card title="Resumen IA de Abril">
          <div className="p-4 bg-slate-900 text-white rounded-2xl border-none">
            <div className="flex items-center gap-2 text-primary mb-3">
              <BrainCircuit size={20} />
              <span className="text-xs font-bold uppercase tracking-widest">Análisis Inteligente</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              "Este mes gastaste <span className="text-white font-bold">18% menos</span> en transporte comparado con Marzo. Tu capacidad de ahorro ha subido a un <span className="text-green-400 font-bold">24%</span> de tus ingresos totales."
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Salud Financiera</span>
                <span className="text-primary">Excelente</span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[85%] rounded-full" />
              </div>
            </div>
          </div>
        </Card>

        <Card title="Oportunidades">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><TrendingDown size={16} /></div>
              <div>
                <p className="text-xs font-bold text-slate-800">Suscripciones Olvidadas</p>
                <p className="text-[10px] text-slate-500">Detectamos 2 servicios sin uso en 30 días.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-50 text-green-600 rounded-lg"><TrendingUp size={16} /></div>
              <div>
                <p className="text-xs font-bold text-slate-800">Día de Ahorro Máximo</p>
                <p className="text-[10px] text-slate-500">Los Martes son tus días de menor gasto.</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2" title="Ingresos vs Gastos (Mensual)">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MONTHLY_DATA.slice(-6)}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <Tooltip cursor={{ fill: '#f8f9ff' }} />
              <Bar dataKey="income" name="Ingresos" fill="#006c4a" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" name="Gastos" fill="#004bca" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
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
      </Card>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card title="Progreso de Metas vs Tiempo">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MOCK_GOALS}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="title" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <Tooltip cursor={{ fill: '#f8f9ff' }} />
              <Bar dataKey="current" name="Actual" radius={[4, 4, 0, 0]}>
                {MOCK_GOALS.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
              <Bar dataKey="target" name="Meta" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
      
      <Card title="Exportar Reportes">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button className="p-6 border-2 border-slate-100 rounded-2xl hover:border-primary/20 hover:bg-slate-50 transition-all text-center group">
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <BarChart3 size={24} />
            </div>
            <p className="font-bold text-slate-900 text-sm">Reporte PDF</p>
            <p className="text-[10px] text-slate-500 mt-1">Resumen visual detallado</p>
          </button>
          <button className="p-6 border-2 border-slate-100 rounded-2xl hover:border-primary/20 hover:bg-slate-50 transition-all text-center group">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Receipt size={24} />
            </div>
            <p className="font-bold text-slate-900 text-sm">Excel (CSV)</p>
            <p className="text-[10px] text-slate-500 mt-1">Todas las transacciones</p>
          </button>
        </div>
      </Card>
    </div>
  </div>
);

// --- Main App ---

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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

  if (!isLoggedIn) {
    return <LandingPageView onLogin={() => setIsLoggedIn(true)} />;
  }

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

          <div className="mt-auto pt-6 border-t border-slate-100 space-y-4">
            <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="User" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">Alex Rivera</p>
                <p className="text-xs text-slate-500 truncate">Plan Básico</p>
              </div>
            </div>
            <button 
              onClick={() => setIsLoggedIn(false)}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all duration-200 font-medium text-sm"
            >
              <LogOut size={20} />
              <span>Cerrar Sesión</span>
            </button>
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
              {activeView === 'expenses' && <ExpensesView onAddExpense={() => setIsModalOpen(true)} />}
              {activeView === 'budget' && <BudgetView />}
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
