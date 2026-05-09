import { useState } from 'react';
import { Upload, FileText, AlertTriangle, XCircle, Info, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

export default function AuditWizard() {
  const [step, setStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    reason: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [result, setResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const startAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const data = new FormData();
      data.append('amount', formData.amount);
      data.append('reason', formData.reason);
      data.append('date', formData.date);
      selectedFiles.forEach(file => {
        data.append('files', file);
      });

      const response = await fetch('/api/audit/analyze', {
        method: 'POST',
        body: data
      });

      if (!response.ok) throw new Error('Analysis failed');
      
      const auditResult = await response.json();
      setResult(auditResult);
      setStep(3);

      // Save to history
      await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: formData.date,
          amount: formData.amount,
          reason: formData.reason,
          status: auditResult.compliance ? 'Approved' : 'Rejected',
          risk: auditResult.riskLevel,
          findings: auditResult.detailedFindings
        })
      });

    } catch (err) {
      console.error(err);
      alert('审计分析出错，请稍后重试。');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setStep(1);
    setResult(null);
    setSelectedFiles([]);
    setFormData({ amount: '', reason: '', date: new Date().toISOString().split('T')[0] });
  };

  return (
    <div className="max-w-5xl mx-auto p-12">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-16 mb-16 border-b border-slate-200 pb-4">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-4 relative group">
            <span className={cn(
               "text-[10px] font-bold uppercase tracking-widest",
               step >= s ? "text-slate-900" : "text-slate-300"
            )}>
              {s === 1 ? '材料录入阶' : s === 2 ? '逻辑校验中' : '最终审计报告'}
            </span>
            {step === s && <motion.div layoutId="stepLine" className="absolute -bottom-[17px] left-0 right-0 h-[2px] bg-slate-900" />}
          </div>
        ))}
        <div className="ml-auto text-[10px] text-slate-400 font-mono tracking-tighter uppercase">
          审计协议: v1.2 / Layer 4
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-5 gap-16"
          >
            <div className="lg:col-span-3 space-y-12">
              <div>
                <h2 className="text-4xl font-serif italic mb-4 text-slate-900 leading-tight">审计材料提交</h2>
                <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-md">
                   请输入报修申请详情。系统将结合结构化审计逻辑与 Gemini 3 进行双重校验。
                </p>
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">报修项目描述</label>
                  <textarea 
                    value={formData.reason}
                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                    placeholder="请详细描述维修需求及部位..."
                    className="w-full h-40 p-6 bg-white border border-slate-200 focus:border-slate-900 focus:outline-none transition-colors italic font-serif text-lg leading-relaxed shadow-sm"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">审计金额 (RMB)</label>
                    <input 
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                      placeholder="0.00"
                      className="w-full p-4 bg-white border border-slate-200 focus:border-slate-900 focus:outline-none font-mono text-xl tracking-tighter shadow-sm"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">申请日期</label>
                    <input 
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full p-4 bg-white border border-slate-200 focus:border-slate-900 focus:outline-none font-mono text-sm shadow-sm"
                    />
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setStep(2)}
                disabled={!formData.amount || !formData.reason}
                className="group w-full md:w-auto flex items-center justify-center gap-4 bg-slate-900 text-white px-10 py-4 font-bold uppercase tracking-[0.2em] text-xs disabled:opacity-20 transition-all hover:bg-slate-800"
              >
                执行校验路径
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="lg:col-span-2">
               <label className="h-full border border-slate-200 border-dashed rounded-xl bg-white p-10 flex flex-col justify-between hover:border-slate-900 transition-colors cursor-pointer group relative overflow-hidden">
                  <input type="file" multiple className="hidden" onChange={handleFileChange} />
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                     <FileText className="w-24 h-24" />
                  </div>
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-slate-900 flex items-center justify-center rounded">
                       {selectedFiles.length > 0 ? <Check className="w-5 h-5 text-emerald-400" /> : <Upload className="w-5 h-5 text-white" />}
                    </div>
                    <h3 className="font-serif italic text-2xl leading-none">证据上传</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {selectedFiles.length > 0 
                        ? `已选择 ${selectedFiles.length} 个文件: ${selectedFiles.map(f => f.name).join(', ')}`
                        : "上传数字化蓝图、发票或现场照片。系统将通过 OCR 进行文本提取并于政策库进行比对。"
                      }
                    </p>
                  </div>
                  <div className="space-y-3 pt-12 border-t border-slate-100">
                    <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-slate-400">
                       <span>OCR 安全层</span>
                       <span className="text-emerald-600">已激活</span>
                    </div>
                    <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                       <motion.div initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="w-1/2 h-full bg-slate-900 opacity-20" />
                    </div>
                  </div>
               </label>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-32 space-y-12"
          >
            <div className="relative">
               <div className="w-32 h-32 border border-slate-200 rounded-full flex items-center justify-center animate-pulse">
                  <div className="w-24 h-24 border border-slate-900/10 rounded-full flex items-center justify-center">
                     <ShieldCheck className="w-8 h-8 text-slate-900" />
                  </div>
               </div>
               <motion.div 
                 animate={{ rotate: 360 }} 
                 transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                 className="absolute inset-0 border-t border-slate-900 rounded-full" 
               />
            </div>
            
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-serif italic text-slate-900">正在验证关联逻辑...</h3>
              <div className="space-y-1">
                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">应用行业标准: SHARED_FACILITY_REG</p>
                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">查询政策知识库... 204 OK</p>
              </div>
            </div>

            {!isAnalyzing && (
              <button 
                onClick={startAnalysis}
                className="px-12 py-4 bg-slate-900 text-white font-bold uppercase tracking-[0.3em] text-[10px] hover:scale-105 transition-all shadow-xl"
              >
                执行审计
              </button>
            )}
          </motion.div>
        )}

        {step === 3 && result && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-16 pb-24"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-900 pb-12">
               <div>
                  <div className="flex items-center gap-4 mb-4">
                     <span className={cn(
                        "text-[10px] font-bold px-3 py-1 uppercase tracking-tighter",
                        result.riskLevel === 'Low' ? "bg-emerald-50 text-emerald-700" :
                        result.riskLevel === 'Medium' ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"
                     )}>
                       风险指数: {result.riskLevel === 'Low' ? '低' : result.riskLevel === 'Medium' ? '中' : '高'}
                     </span>
                     <span className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">系统自动判定</span>
                  </div>
                  <h3 className="text-5xl font-serif italic leading-none text-slate-900">
                    {result.compliance ? '建议通过授权' : '合规性预警已发出'}
                  </h3>
               </div>
               <div className="text-right">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-2">报告序列号</p>
                  <p className="text-2xl font-mono tracking-tighter font-medium underline underline-offset-8 decoration-slate-200">
                    #{Math.random().toString(36).substr(2, 9).toUpperCase()}
                  </p>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
              <div className="lg:col-span-3 space-y-16">
                <section className="space-y-6">
                  <div className="flex items-center gap-4 text-slate-400">
                     <div className="h-[1px] flex-1 bg-slate-200" />
                     <span className="text-[10px] font-bold uppercase tracking-widest">执行摘要</span>
                     <div className="h-[1px] flex-1 bg-slate-200" />
                  </div>
                  <div className="bg-white border border-slate-100 p-10 shadow-sm relative">
                     <Info className="absolute top-6 right-6 w-5 h-5 text-slate-200" />
                     <p className="text-2xl font-serif leading-relaxed text-slate-800">
                       “{result.conclusion}”
                     </p>
                  </div>
                </section>

                <section className="space-y-8">
                  <h4 className="text-xs font-bold uppercase tracking-[0.2em] border-l-4 border-slate-900 pl-4">结构化逻辑发现</h4>
                  <div className="grid grid-cols-1 gap-6">
                     {result.detailedFindings.map((finding: string, i: number) => (
                       <div key={i} className="group flex gap-8 p-8 border border-slate-200 bg-white hover:border-slate-900 transition-all">
                          <div className="text-3xl font-serif italic text-slate-200 group-hover:text-slate-900 transition-colors">
                            {String(i + 1).padStart(2, '0')}
                          </div>
                          <p className="text-sm font-medium leading-relaxed text-slate-600">
                            {finding}
                          </p>
                       </div>
                     ))}
                  </div>
                </section>
              </div>

              <aside className="space-y-8">
                <div className="bg-slate-900 text-white p-8 space-y-8 shadow-2xl">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 mb-4 italic">元数据快照</p>
                    <div className="space-y-4">
                      <div className="flex justify-between items-baseline opacity-80 border-b border-white/10 pb-2">
                        <span className="text-[9px] uppercase tracking-tighter">金额</span>
                        <span className="font-mono text-sm tracking-tighter">¥{parseFloat(formData.amount).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-baseline opacity-80 border-b border-white/10 pb-2">
                        <span className="text-[9px] uppercase tracking-tighter">模型置信度</span>
                        <span className="font-mono text-sm tracking-tighter">98.4%</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button className="w-full bg-white text-slate-900 py-3 font-bold uppercase text-[10px] tracking-widest hover:bg-slate-100 transition-all">
                      定稿并打印报告
                    </button>
                    <button 
                      onClick={reset}
                      className="w-full border border-white/20 py-3 font-bold uppercase text-[10px] tracking-widest opacity-60 hover:opacity-100 transition-opacity"
                    >
                      重置审计引擎
                    </button>
                  </div>
                </div>

                <div className="p-6 border border-slate-100 bg-white shadow-sm flex flex-col gap-4">
                   <AlertTriangle className="w-6 h-6 text-amber-600" />
                   <p className="text-[11px] font-medium text-slate-500 italic leading-snug">
                     注：审计金额超过 ¥100,000 将触发二级存档验证层。
                   </p>
                </div>
              </aside>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
