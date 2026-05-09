import { useState } from 'react';
import { cn } from '@/src/lib/utils';
import Shell from './components/layout/Shell';
import AuditWizard from './components/audit/AuditWizard';
import AuditHistory from './components/history/AuditHistory';
import PolicyLibrary from './components/policy/PolicyLibrary';
import { Activity, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="p-12 space-y-16">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { label: "活跃审计项目", value: "24", delta: "处理中", color: "text-slate-900" },
                  { label: "合规通过率", value: "98.4%", delta: "+0.2%", color: "text-emerald-600" },
                  { label: "预警发现", value: "12", delta: "-4", color: "text-red-500" },
                  { label: "法规覆盖范围", value: "100%", delta: "完整", color: "text-slate-400" },
                ].map((stat, i) => (
                  <div key={i} className="bg-white border border-slate-100 p-8 space-y-4 shadow-sm hover:border-slate-900 transition-all">
                     <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 leading-none">{stat.label}</span>
                     <div className="flex items-baseline justify-between">
                        <span className={cn("text-4xl font-serif italic tracking-tighter leading-none", stat.color)}>{stat.value}</span>
                        <span className="text-[10px] font-mono font-medium opacity-40">{stat.delta}</span>
                     </div>
                  </div>
                ))}
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
                <div className="lg:col-span-3 space-y-8">
                   <div className="flex items-center justify-between border-b border-slate-900 pb-4">
                      <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-900">近期审计判定</h3>
                      <button 
                        onClick={() => setActiveTab('history')}
                        className="text-[10px] font-semibold text-slate-400 hover:text-slate-900 uppercase underline underline-offset-4"
                      >
                        查看全量档案
                      </button>
                   </div>
                   <div className="space-y-4">
                      {[1,2,3,4].map(i => (
                        <div 
                           key={i} 
                           onClick={() => setSelectedRecord({
                             reason: `${i === 1 ? '电梯制动器专项维修' : i === 2 ? '消防泵房漏水补强' : i === 3 ? '监控外壳整体换新' : '发电机组维护保养'} - #${i}042`,
                             date: '2026-05-09',
                             amount: (6540 * i).toLocaleString(),
                             status: 'Approved',
                             findings: ['发票金额匹配', '施工方案符合紧急维修目录', '物业办初审通过']
                           })}
                           className="p-8 border border-slate-100 bg-white flex items-center justify-between hover:border-slate-300 transition-all cursor-pointer group shadow-sm"
                        >
                           <div className="flex items-center gap-8">
                              <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                              <div>
                                 <div className="text-xl font-serif italic text-slate-900 leading-none mb-1 group-hover:underline underline-offset-4">{i === 1 ? '电梯制动器专项维修' : i === 2 ? '消防泵房漏水补强' : i === 3 ? '监控外壳整体换新' : '发电机组维护保养'} - #{i}042</div>
                                 <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">审计完成于 {i * 2} 小时前</div>
                              </div>
                           </div>
                           <span className="font-mono text-base font-medium tracking-tighter text-slate-600">¥{(6540 * i).toLocaleString()}</span>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="lg:col-span-2 space-y-8">
                   <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400 border-b border-slate-200 pb-4">系统公告 / Bulletin</h3>
                   <div className="bg-slate-900 text-white p-10 space-y-10 shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-10">
                         <Activity className="w-32 h-32" />
                      </div>
                      <div className="space-y-3 relative">
                        <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest leading-none">2026年5月9日</div>
                        <p className="text-2xl font-serif italic leading-tight">“政策更新：紧急维修流程 V2.1 已上线。自动化匹配系统同步完成。”</p>
                      </div>
                      <div className="space-y-4 pt-10 border-t border-white/10 relative">
                        <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">引擎追踪</div>
                        <p className="text-sm italic opacity-60">Gemini 3 Flash 实时真实性验证层已跨所有逻辑层部署。</p>
                      </div>
                   </div>
                   
                   <div className="p-8 border border-slate-100 bg-slate-50 italic font-serif text-slate-500 leading-relaxed text-sm shadow-inner">
                      “结构化逻辑与语言推理的交汇，定义了财政透明度的新标准。”
                   </div>
                </div>
             </div>
          </div>
        );
      case 'audit':
        return <AuditWizard />;
      case 'history':
        return <AuditHistory onSelect={setSelectedRecord} />;
      case 'policies':
        return <PolicyLibrary />;
      default:
        return null;
    }
  };

  return (
    <Shell activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
      
      <AnimatePresence>
        {selectedRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               className="bg-white max-w-2xl w-full border border-slate-900 overflow-hidden shadow-2xl"
            >
               <div className="p-12 space-y-10">
                  <div className="flex justify-between items-start border-b border-slate-900 pb-8">
                     <div className="space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">审计报告摘要</span>
                        <h4 className="text-3xl font-serif italic text-slate-900 leading-tight">{selectedRecord.reason}</h4>
                     </div>
                     <button onClick={() => setSelectedRecord(null)} className="text-slate-400 hover:text-slate-900">
                        <XCircle className="w-6 h-6" />
                     </button>
                  </div>

                  <div className="grid grid-cols-2 gap-12">
                     <div className="space-y-8">
                        <div className="space-y-1">
                           <span className="text-[10px] font-mono uppercase opacity-40">申请日期</span>
                           <p className="font-mono text-sm">{selectedRecord.date}</p>
                        </div>
                        <div className="space-y-1">
                           <span className="text-[10px] font-mono uppercase opacity-40">审计金额</span>
                           <p className="font-mono text-lg font-bold">¥{selectedRecord.amount}</p>
                        </div>
                     </div>
                     <div className="space-y-8">
                        <div className="space-y-1">
                           <span className="text-[10px] font-mono uppercase opacity-40">状态</span>
                           <p className="text-emerald-600 font-bold uppercase tracking-tighter italic">Recommended</p>
                        </div>
                        <div className="space-y-1">
                           <span className="text-[10px] font-mono uppercase opacity-40">逻辑层一致性</span>
                           <p className="font-bold">98.2%</p>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">核查要点 Findings</span>
                     <ul className="space-y-3">
                        {(selectedRecord.findings || selectedRecord.detailedFindings || []).map((f: string, i: number) => (
                           <li key={i} className="flex gap-4 text-sm font-medium border-l-2 border-slate-900 pl-4 py-1 italic text-slate-600">
                              {f}
                           </li>
                        ))}
                     </ul>
                  </div>

                  <div className="pt-8 border-t border-slate-100 flex justify-end">
                     <button className="px-8 py-3 bg-slate-900 text-white font-bold uppercase text-[10px] tracking-widest hover:bg-slate-800">
                        下载完整审计追踪包
                     </button>
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Shell>
  );
}
