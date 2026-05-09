import { useState, ReactNode } from 'react';
import { 
  ShieldCheck, 
  History, 
  BookOpen, 
  LayoutDashboard, 
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface ShellProps {
  children: ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Shell({ children, activeTab, setActiveTab }: ShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: '审计看板', icon: LayoutDashboard },
    { id: 'audit', label: '新建审计', icon: ShieldCheck },
    { id: 'history', label: '历史档案', icon: History },
    { id: 'policies', label: '政策知识库', icon: BookOpen },
  ];

  return (
    <div className="flex h-screen bg-[#FBFBF9] text-slate-900 font-sans selection:bg-slate-900 selection:text-[#FBFBF9]">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-60 border-r border-slate-200 bg-[#FBFBF9]">
        <div className="p-8 pb-12">
          <h1 className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400 mb-1">系统网关 / System</h1>
          <div className="font-serif text-2xl italic leading-none text-slate-900">Audit Gemini</div>
        </div>

        <nav className="flex-1 space-y-2 px-4">
          <h2 className="px-4 text-[10px] uppercase tracking-widest text-slate-400 mb-4 font-semibold">审计工作区 / Workspace</h2>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2.5 transition-all duration-200 group relative text-sm font-medium",
                activeTab === item.id 
                  ? "text-slate-900 bg-white border border-slate-200 shadow-sm" 
                  : "text-slate-500 hover:text-slate-900"
              )}
            >
              <item.icon className={cn("w-4 h-4", activeTab === item.id ? "text-slate-900" : "text-slate-400 group-hover:text-slate-600")} />
              <span>{item.label}</span>
              {activeTab === item.id && (
                <motion.div layoutId="activeInd" className="absolute left-0 w-[2px] h-4 bg-slate-900" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-8">
          <div className="p-4 bg-slate-100 rounded flex flex-col gap-1">
            <span className="text-[9px] text-slate-400 uppercase tracking-tighter font-bold">引擎状态</span>
            <span className="text-[11px] font-semibold text-slate-600">LLM v3.5 + 逻辑引擎启用</span>
          </div>
        </div>
      </aside>

      {/* Mobile Nav */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#FBFBF9] border-b border-slate-200 px-6 py-4 flex items-center justify-between">
         <h1 className="font-serif italic text-xl">Audit Gemini</h1>
         <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
           {isMobileMenuOpen ? <X /> : <Menu />}
         </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden fixed inset-0 z-40 bg-[#FBFBF9] pt-24 px-8"
          >
            <div className="space-y-6">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={cn(
                    "w-full text-left py-4 border-b border-slate-200 block text-2xl font-serif italic",
                    activeTab === item.id ? "text-slate-900 underline" : "text-slate-400"
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden pt-16 md:pt-0">
        <header className="h-20 border-b border-slate-200 px-10 flex items-center justify-between bg-white/80 backdrop-blur-md z-10">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 block mb-0.5">当前项目 / Context</span>
            <h2 className="text-lg font-serif italic text-slate-900">
               {menuItems.find(i => i.id === activeTab)?.label}
            </h2>
          </div>
          <div className="flex gap-4 items-center">
             <div className="flex h-8 items-center border border-slate-200 px-4">
                <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">安全档案库</span>
             </div>
             <button className="px-5 py-2 border border-slate-900 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">
               生成全量报告
             </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
