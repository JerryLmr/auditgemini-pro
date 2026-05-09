import { useState, useEffect } from 'react';
import { History as HistoryIcon, Download, Search, Filter, ShieldCheck, XCircle } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function AuditHistory({ onSelect }: { onSelect: (record: any) => void }) {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    // Attempt to fetch from real backend
    fetch('/api/history')
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          setHistory(data);
        } else {
          setHistory([
            { id: '1', date: '2024-05-01', amount: '125,000', status: 'Approved', reason: '楼顶防水修补', risk: 'Low', findings: ['工程资质符合', '金额在合理区间', '现场勘查一致'] },
            { id: '2', date: '2024-04-28', amount: '8,400', status: 'Rejected', reason: '绿化带补栽', risk: 'Critical', findings: ['属于日常运维支出', '不符合维修资金列支范围'] },
            { id: '3', date: '2024-04-15', amount: '45,000', status: 'Approved', reason: '电梯控制柜更换', risk: 'Low', findings: ['核心部件报废认定', '施工总额比价合理'] },
          ]);
        }
      })
      .catch(() => {
         setHistory([
            { id: '1', date: '2024-05-01', amount: '125,000', status: 'Approved', reason: '楼顶防水修补', risk: 'Low', findings: ['工程资质符合', '金额在合理区间', '现场勘查一致'] },
            { id: '2', date: '2024-04-28', amount: '8,400', status: 'Rejected', reason: '绿化带补栽', risk: 'Critical', findings: ['属于日常运维支出', '不符合维修资金列支范围'] },
            { id: '3', date: '2024-04-15', amount: '45,000', status: 'Approved', reason: '电梯控制柜更换', risk: 'Low', findings: ['核心部件报废认定', '施工总额比价合理'] },
          ]);
      });
  }, []);

  return (
    <div className="p-12 space-y-12">
      <div className="flex justify-between items-end border-b border-slate-900 pb-12">
        <div className="space-y-4">
          <h2 className="text-5xl font-serif italic text-slate-900 tracking-tighter">审计历史档案</h2>
          <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-md">
            所有判定结果及逻辑校验路径的完整存档。每一份记录均经过加密校验。
          </p>
        </div>
        <div className="flex gap-4">
           <button className="px-6 py-2 border border-slate-200 text-[10px] font-bold uppercase tracking-widest hover:border-slate-900 transition-all">
             导出数据
           </button>
           <button className="px-6 py-2 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all">
             归档全部任务
           </button>
        </div>
      </div>

      <div className="bg-white border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
             <tr className="bg-slate-50/50 border-b border-slate-100">
               <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">日期</th>
               <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">申请事由</th>
               <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">金额</th>
               <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 text-center">状态</th>
               <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">操作</th>
             </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {history.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                <td className="p-6 font-mono text-xs opacity-60">{item.date}</td>
                <td className="p-6">
                  <div className="font-serif italic text-lg text-slate-900 tracking-tight">{item.reason}</div>
                  <div className="text-[10px] uppercase tracking-widest text-slate-400 mt-1">序列号: ARCHIVE_{item.id.padStart(4, '0')}</div>
                </td>
                <td className="p-6">
                   <span className="font-mono text-base font-medium tracking-tighter">¥{item.amount}</span>
                </td>
                <td className="p-6 text-center">
                  <div className={cn(
                    "inline-flex items-center px-3 py-1 text-[10px] font-bold uppercase tracking-tighter",
                    item.status === 'Approved' ? "text-emerald-600 bg-emerald-50" : "text-red-600 bg-red-50"
                  )}>
                    {item.status === 'Approved' ? '通过' : '驳回'}
                  </div>
                </td>
                <td className="p-6">
                   <button 
                     onClick={() => onSelect(item)}
                     className="text-[10px] font-bold uppercase tracking-widest border-b border-slate-900 pb-0.5 hover:opacity-40 transition-all"
                   >
                     查看审计报告
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
