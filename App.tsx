
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  X, 
  Activity, 
  Clock, 
  Star, 
  List, 
  ArrowUpDown,
  ChevronRight,
  PieChart,
  BarChart3,
  History,
  LayoutGrid,
  Settings,
  ShieldCheck,
  Zap,
  Briefcase,
  ChevronLeft,
  Menu,
  Filter
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { FUNDS, SECTORS } from './constants';
import { FundItem, SectorType } from './types';

export default function App() {
  const [view, setView] = useState<'market' | 'favorites'>('market');
  const [selectedSector, setSelectedSector] = useState<SectorType>('全部分类');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFund, setSelectedFund] = useState<FundItem | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('fund_favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [marketPrices, setMarketPrices] = useState<Record<string, number>>({});

  // 模拟价格波动更新
  useEffect(() => {
    const interval = setInterval(() => {
      const newPrices: Record<string, number> = {};
      // 仅对前 50 个或可见数据进行随机波动模拟，提升性能
      FUNDS.slice(0, 100).forEach(f => {
        const drift = (Math.random() - 0.5) * 0.05;
        newPrices[f.id] = (marketPrices[f.id] || f.changePercent) + drift;
      });
      setMarketPrices(prev => ({ ...prev, ...newPrices }));
    }, 10000);
    return () => clearInterval(interval);
  }, [marketPrices]);

  useEffect(() => {
    localStorage.setItem('fund_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavorites(prev => prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]);
  };

  const filteredFunds = useMemo(() => {
    let base = view === 'market' ? FUNDS : FUNDS.filter(f => favorites.includes(f.id));
    
    // 板块过滤逻辑
    if (selectedSector !== '全部分类') {
      base = base.filter(f => f.sector === selectedSector);
    }
    
    // 深度搜索逻辑
    const query = searchTerm.toLowerCase().trim();
    if (query) {
      base = base.filter(fund => 
        fund.name.toLowerCase().includes(query) || 
        fund.code.includes(query) || 
        fund.manager.toLowerCase().includes(query) ||
        fund.sector.toLowerCase().includes(query) ||
        fund.category.toLowerCase().includes(query)
      );
    }
    
    return base;
  }, [searchTerm, selectedSector, view, favorites]);

  const handleAiDeepAnalysis = async (fund?: FundItem) => {
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = fund 
        ? `分析基金 ${fund.name}(${fund.code})。最新动态、涨跌原因、经理观点及板块前景。`
        : "分析今日 A 股行情，特别是人工智能、中概股和高股息红利板块的博弈逻辑。";
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { tools: [{ googleSearch: {} }] }
      });
      setAiReport(response.text);
    } catch (e) {
      setAiReport("分析获取失败。");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-[#1E293B] overflow-hidden selection:bg-blue-100 font-sans">
      
      {/* 侧边栏 */}
      <aside className={`${isSidebarCollapsed ? 'w-20' : 'w-72'} bg-white border-r flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out shadow-sm z-30`}>
        <div className={`p-6 border-b flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isSidebarCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-xl shadow-blue-100">
                 <Briefcase size={20} strokeWidth={2.5} />
              </div>
              <span className="font-black text-xl tracking-tighter">FundMaster</span>
            </div>
          )}
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-blue-600 transition-colors"
          >
            {isSidebarCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
        
        <div className="flex-grow overflow-y-auto py-6 px-4 custom-scrollbar">
          <div className="mb-8">
            {!isSidebarCollapsed && <h5 className="px-4 text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">资产管理</h5>}
            <button 
              onClick={() => { setView('market'); setSelectedSector('全部分类'); }}
              className={`w-full flex items-center space-x-4 px-4 py-3.5 rounded-2xl transition-all text-sm font-bold ${view === 'market' && selectedSector === '全部分类' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <LayoutGrid size={18} />
              {!isSidebarCollapsed && <span>行情大厅</span>}
            </button>
            <button 
              onClick={() => setView('favorites')}
              className={`w-full flex items-center space-x-4 px-4 py-3.5 rounded-2xl transition-all text-sm font-bold mt-2 ${view === 'favorites' ? 'bg-amber-500 text-white shadow-lg shadow-amber-100' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <Star size={18} className={favorites.length > 0 ? "fill-white" : ""} />
              {!isSidebarCollapsed && (
                <div className="flex justify-between flex-grow items-center">
                   <span>我的自选</span>
                   <span className={`text-[10px] font-black px-2 rounded-full ${view === 'favorites' ? 'bg-white/20' : 'bg-slate-100 text-slate-500'}`}>{favorites.length}</span>
                </div>
              )}
            </button>
          </div>

          <div>
            {!isSidebarCollapsed && <h5 className="px-4 text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">细分板块分类</h5>}
            <div className="space-y-1.5">
              {SECTORS.map(sector => (
                <button
                  key={sector.id}
                  onClick={() => { setSelectedSector(sector.id); setView('market'); }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all text-sm font-bold ${selectedSector === sector.id && view === 'market' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'text-slate-500 hover:bg-slate-50 border border-transparent'}`}
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-lg">{sector.icon}</span>
                    {!isSidebarCollapsed && <span className="truncate">{sector.name}</span>}
                  </div>
                  {!isSidebarCollapsed && <ChevronRight size={14} className={selectedSector === sector.id ? "opacity-100" : "opacity-0"} />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* 主界面 */}
      <main className="flex-grow flex flex-col min-w-0">
        
        {/* Header */}
        <header className="bg-white h-20 border-b flex items-center justify-between px-10 flex-shrink-0 z-20">
          <div className="flex items-center space-x-6 flex-grow max-w-3xl">
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input
                type="text"
                placeholder="搜索 200+ 基金：代码(005827)、名称(蓝筹)、板块(AI)、经理(葛兰)..."
                className="w-full pl-12 pr-6 py-3 bg-slate-50 border border-transparent rounded-2xl text-sm focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all shadow-inner"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center space-x-5 ml-6">
             <div className="hidden lg:flex items-center text-[10px] font-black text-emerald-500 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
                <Clock size={12} className="mr-2" />
                <span>实时估值：{new Date().toLocaleTimeString('zh-CN', { hour12: false })}</span>
             </div>
             <button 
               onClick={() => handleAiDeepAnalysis()}
               disabled={isAiLoading}
               className="flex items-center space-x-3 px-6 py-3 bg-slate-900 text-white text-xs font-black rounded-2xl hover:bg-slate-800 active:scale-95 transition-all shadow-xl shadow-slate-200"
             >
               {isAiLoading ? <Activity size={16} className="animate-spin" /> : <Zap size={16} className="text-amber-400 fill-amber-400" />}
               <span>AI 研报洞察</span>
             </button>
          </div>
        </header>

        {/* 滚动列表 */}
        <div className="flex-grow p-10 overflow-y-auto custom-scrollbar bg-[#F8FAFC]">
          
          <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
             <div>
                <div className="flex items-center space-x-3">
                   <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
                     {view === 'favorites' ? '我的自选组合' : `${selectedSector}`}
                   </h2>
                   <span className="text-[11px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 shadow-sm">
                      {filteredFunds.length} 只标的
                   </span>
                </div>
                <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-wider">OTC Fund Market Real-time Monitoring Terminal</p>
             </div>
             {searchTerm && (
               <button 
                 onClick={() => setSearchTerm('')}
                 className="text-xs font-black text-red-500 hover:text-red-600 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100"
               >
                 清除搜索："{searchTerm}"
               </button>
             )}
          </div>

          {aiReport && (
            <div className="mb-12 bg-white border border-slate-100 rounded-[32px] p-10 relative shadow-2xl shadow-slate-200 overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
               <button onClick={() => setAiReport(null)} className="absolute top-8 right-8 p-2 hover:bg-slate-50 rounded-full transition-colors z-10"><X size={24} className="text-slate-400" /></button>
               <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                     <Sparkles size={20} className="fill-white" />
                  </div>
                  <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">
                     FundMaster 智能投研内参
                  </h4>
               </div>
               <p className="text-sm leading-8 text-slate-600 whitespace-pre-wrap font-medium">{aiReport}</p>
            </div>
          )}

          <div className="bg-white rounded-[40px] border border-slate-200 shadow-2xl shadow-slate-200/40 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1200px]">
                <thead>
                  <tr className="bg-slate-50/50 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] border-b">
                    <th className="px-8 py-5 w-16 text-center"></th>
                    <th className="px-8 py-5">基金信息</th>
                    <th className="px-8 py-5">板块分类</th>
                    <th className="px-8 py-5 text-right">单位净值</th>
                    <th className="px-8 py-5 text-right">当日估涨</th>
                    <th className="px-8 py-5 text-right">近1月</th>
                    <th className="px-8 py-5 text-right">近1年</th>
                    <th className="px-8 py-5 text-right">最大回撤</th>
                    <th className="px-8 py-5 text-center">风险指标</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredFunds.map(fund => {
                    const price = marketPrices[fund.id] || fund.changePercent;
                    const isUp = price >= 0;
                    return (
                      <tr 
                        key={fund.id} 
                        onClick={() => setSelectedFund(fund)}
                        className="hover:bg-slate-50/80 cursor-pointer transition-all group animate-fade-in"
                      >
                        <td className="px-8 py-7 text-center" onClick={(e) => toggleFavorite(e, fund.id)}>
                          <Star 
                            size={20} 
                            className={favorites.includes(fund.id) ? "fill-amber-400 text-amber-400" : "text-slate-200 hover:text-amber-400 transition-colors"} 
                          />
                        </td>
                        <td className="px-8 py-7">
                          <div className="flex flex-col">
                            <span className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors truncate max-w-[280px]">{fund.name}</span>
                            <div className="flex items-center space-x-3 mt-2">
                               <span className="text-[10px] font-mono font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{fund.code}</span>
                               <span className="text-[10px] font-black text-slate-500">经理：{fund.manager}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-7">
                           <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100 shadow-sm">{fund.sector}</span>
                        </td>
                        <td className="px-8 py-7 text-right font-mono text-sm font-black text-slate-700">{fund.currentNav.toFixed(4)}</td>
                        <td className={`px-8 py-7 text-right font-mono text-sm font-black ${isUp ? 'text-rose-600' : 'text-emerald-600'}`}>
                          {isUp ? '+' : ''}{price.toFixed(2)}%
                        </td>
                        <td className={`px-8 py-7 text-right font-mono text-xs font-bold ${fund.return1M >= 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                          {fund.return1M > 0 ? '+' : ''}{fund.return1M.toFixed(2)}%
                        </td>
                        <td className={`px-8 py-7 text-right font-mono text-xs font-bold ${fund.return1Y >= 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                          {fund.return1Y > 0 ? '+' : ''}{fund.return1Y.toFixed(2)}%
                        </td>
                        <td className="px-8 py-7 text-right font-mono text-xs font-bold text-emerald-600">{fund.maxDrawdown}%</td>
                        <td className="px-8 py-7 text-center">
                           <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${fund.riskLevel.includes('高') ? 'bg-rose-50 text-rose-500 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                             {fund.riskLevel}风险
                           </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filteredFunds.length === 0 && (
              <div className="py-48 text-center bg-slate-50/30">
                <div className="w-24 h-24 bg-white shadow-2xl rounded-[32px] flex items-center justify-center mx-auto mb-8 text-slate-200 animate-pulse">
                   <Search size={40} />
                </div>
                <h3 className="text-slate-900 font-black text-xl tracking-tight">库中未匹配到结果</h3>
                <p className="text-slate-400 font-bold max-w-sm mx-auto mt-4 text-sm leading-relaxed">
                   我们在 200+ 基金数据库中未检索到 "{searchTerm}"。
                   <br/>请检查代码是否正确（如 005827）或尝试搜索“白酒”、“人工智能”、“纳指”等板块名称。
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 详情抽屉 */}
      {selectedFund && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-all" onClick={() => setSelectedFund(null)}></div>
          <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl animate-fade-in flex flex-col overflow-hidden">
            <div className="p-10 border-b flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white font-black text-2xl shadow-2xl shadow-blue-200">
                  {selectedFund.code.slice(-2)}
                </div>
                <div>
                  <h3 className="font-black text-2xl tracking-tighter text-slate-900">{selectedFund.name}</h3>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-xs font-mono font-black text-slate-400">{selectedFund.code}</span>
                    <span className="w-1.5 h-1.5 bg-slate-200 rounded-full"></span>
                    <span className="text-[11px] font-black text-blue-600 uppercase tracking-widest">{selectedFund.sector} 精选标的</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedFund(null)} className="p-3 hover:bg-slate-50 rounded-full transition-all text-slate-300 hover:text-slate-900">
                <X size={32} />
              </button>
            </div>
            
            <div className="flex-grow overflow-y-auto p-10 space-y-12 custom-scrollbar">
              <div className="grid grid-cols-2 gap-8">
                 <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 shadow-inner">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-3">最新单位净值</span>
                    <div className="text-5xl font-black tabular-nums tracking-tighter text-slate-900">¥{selectedFund.currentNav.toFixed(4)}</div>
                 </div>
                 <div className={`p-8 rounded-[32px] border ${selectedFund.changePercent >= 0 ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}>
                    <span className="text-[11px] font-black uppercase tracking-widest block mb-3 opacity-60">盘中估涨 (15:00)</span>
                    <div className="text-5xl font-black tabular-nums tracking-tighter">
                      {selectedFund.changePercent >= 0 ? '+' : ''}{selectedFund.changePercent.toFixed(2)}%
                    </div>
                 </div>
              </div>

              <section>
                <h4 className="font-black text-lg text-slate-900 mb-8 flex items-center">
                   <BarChart3 size={24} className="mr-3 text-blue-600" /> 历史回报分析
                </h4>
                <div className="space-y-6">
                  {[
                    { l: '近一周', v: selectedFund.return1W },
                    { l: '近一月', v: selectedFund.return1M },
                    { l: '近一年', v: selectedFund.return1Y },
                    { l: '成立以来', v: selectedFund.return3Y }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center">
                      <span className="w-24 text-[12px] font-black text-slate-400">{item.l}</span>
                      <div className="flex-grow h-4 bg-slate-100 rounded-full overflow-hidden mx-6">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${item.v >= 0 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                          style={{ width: `${Math.min(100, Math.abs(item.v) * 1.5 + 5)}%` }}
                        ></div>
                      </div>
                      <span className={`w-20 text-right text-sm font-black tabular-nums ${item.v >= 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {item.v > 0 ? '+' : ''}{item.v.toFixed(2)}%
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-slate-900 text-white rounded-[48px] p-12 shadow-2xl shadow-slate-300 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]"></div>
                 <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-10">风险评估 & 经理点评</h4>
                 <div className="grid grid-cols-2 gap-12 relative z-10">
                    <div>
                       <span className="text-[11px] block text-slate-500 mb-3 font-black uppercase tracking-widest">历史最大回撤</span>
                       <span className="text-4xl font-black text-emerald-400 tracking-tighter">{selectedFund.maxDrawdown}%</span>
                    </div>
                    <div>
                       <span className="text-[11px] block text-slate-500 mb-3 font-black uppercase tracking-widest">现任基金经理</span>
                       <span className="text-4xl font-black tracking-tighter">{selectedFund.manager}</span>
                    </div>
                 </div>
                 <p className="mt-12 text-sm text-slate-300 leading-8 font-medium italic border-t border-slate-800 pt-10">
                    "{selectedFund.description}"
                 </p>
              </section>
            </div>

            <div className="p-10 bg-slate-50 border-t flex space-x-6">
              <button 
                onClick={(e) => toggleFavorite(e, selectedFund.id)}
                className={`flex-grow py-6 rounded-3xl font-black text-sm flex items-center justify-center space-x-4 transition-all ${favorites.includes(selectedFund.id) ? 'bg-amber-100 text-amber-600 border border-amber-200' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 shadow-sm'}`}
              >
                <Star size={24} className={favorites.includes(selectedFund.id) ? "fill-amber-600" : ""} />
                <span>{favorites.includes(selectedFund.id) ? '已在自选' : '加入自选'}</span>
              </button>
              <button className="flex-[2] py-6 bg-blue-600 hover:bg-blue-700 text-white rounded-3xl font-black text-sm shadow-2xl shadow-blue-400 active:scale-95 transition-all">
                前往平台申购 (费率0.1折)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
