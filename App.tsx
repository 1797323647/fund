
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

  // Simulate intra-day price fluctuations (Every 8 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      const newPrices: Record<string, number> = {};
      FUNDS.forEach(f => {
        const drift = (Math.random() - 0.5) * 0.03;
        newPrices[f.id] = (marketPrices[f.id] || f.changePercent) + drift;
      });
      setMarketPrices(newPrices);
    }, 8000);
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
    
    // Sector Filtering
    if (selectedSector !== '全部分类') {
      base = base.filter(f => f.sector === selectedSector);
    }
    
    // Global Search
    const query = searchTerm.toLowerCase();
    if (query) {
      base = base.filter(fund => 
        fund.name.toLowerCase().includes(query) || 
        fund.code.includes(query) || 
        fund.manager.includes(query) ||
        fund.sector.toLowerCase().includes(query)
      );
    }
    
    return base;
  }, [searchTerm, selectedSector, view, favorites]);

  const handleAiDeepAnalysis = async (fund?: FundItem) => {
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = fund 
        ? `请联网搜索并分析基金 ${fund.name}(${fund.code}) 当下的最新动态。包括最新的净值变动原因、基金经理最新的调仓观点以及该基金所属板块（${fund.sector}）的近期宏观展望。`
        : "请联网分析今日 A 股各大热门板块（人工智能、白酒、半导体、高股息红利）的资金流向与短期投资逻辑。";
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { tools: [{ googleSearch: {} }] }
      });
      setAiReport(response.text);
    } catch (e) {
      setAiReport("深度分析获取失败，请检查网络或 API 配置。");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-[#1E293B] overflow-hidden selection:bg-blue-100 font-sans">
      
      {/* Sidebar - Pro Design with Folding */}
      <aside className={`${isSidebarCollapsed ? 'w-20' : 'w-64'} bg-white border-r flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out shadow-sm z-30`}>
        <div className={`p-6 border-b flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isSidebarCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-100">
                 <Briefcase size={18} strokeWidth={2.5} />
              </div>
              <span className="font-black text-lg tracking-tight">FundMaster</span>
            </div>
          )}
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-blue-600 transition-colors"
          >
            {isSidebarCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
        
        <div className="flex-grow overflow-y-auto py-4 px-3 custom-scrollbar">
          <div className="mb-6">
            {!isSidebarCollapsed && <h5 className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">资产管理</h5>}
            <button 
              onClick={() => { setView('market'); setSelectedSector('全部分类'); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-sm font-bold ${view === 'market' && selectedSector === '全部分类' ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
              title="行情全览"
            >
              <LayoutGrid size={18} />
              {!isSidebarCollapsed && <span>行情全览</span>}
            </button>
            <button 
              onClick={() => setView('favorites')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-sm font-bold mt-1 ${view === 'favorites' ? 'bg-amber-50 text-amber-600' : 'text-slate-500 hover:bg-slate-50'}`}
              title="我的自选"
            >
              <Star size={18} className={favorites.length > 0 ? "fill-amber-400 text-amber-400" : ""} />
              {!isSidebarCollapsed && (
                <div className="flex justify-between flex-grow items-center">
                   <span>我的自选</span>
                   <span className="text-[10px] bg-amber-200 text-amber-800 px-1.5 rounded-full">{favorites.length}</span>
                </div>
              )}
            </button>
          </div>

          <div>
            {!isSidebarCollapsed && <h5 className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">细分板块 ({SECTORS.length})</h5>}
            <div className="space-y-1">
              {SECTORS.map(sector => (
                <button
                  key={sector.id}
                  onClick={() => { setSelectedSector(sector.id); setView('market'); }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all text-sm font-bold ${selectedSector === sector.id && view === 'market' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                  title={sector.name}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-base">{sector.icon}</span>
                    {!isSidebarCollapsed && <span className="truncate">{sector.name}</span>}
                  </div>
                  {!isSidebarCollapsed && <ChevronRight size={14} className={selectedSector === sector.id ? "opacity-100" : "opacity-0"} />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {!isSidebarCollapsed && (
          <div className="p-4 border-t">
            <div className="bg-slate-50 rounded-xl p-3 flex items-center space-x-3 text-[10px] font-bold text-slate-500">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>数据来源：沪深北交易所实时模拟</span>
            </div>
          </div>
        )}
      </aside>

      {/* Main Work Area */}
      <main className="flex-grow flex flex-col min-w-0">
        
        {/* Top Control Header */}
        <header className="bg-white h-16 border-b flex items-center justify-between px-8 flex-shrink-0 z-20">
          <div className="flex items-center space-x-6 flex-grow max-w-2xl">
            <div className="relative w-full group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
              <input
                type="text"
                placeholder="搜索 60+ 基金：键入名称、代码、板块(如 AI) 或 经理姓名..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-transparent rounded-xl text-sm focus:bg-white focus:border-blue-100 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
             <div className="hidden md:flex items-center text-[10px] font-black text-emerald-500 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                <Clock size={12} className="mr-2" />
                <span>实时估值：{new Date().toLocaleTimeString('zh-CN', { hour12: false })}</span>
             </div>
             <button 
               onClick={() => handleAiDeepAnalysis()}
               disabled={isAiLoading}
               className="flex items-center space-x-2 px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 active:scale-95 transition-all shadow-lg shadow-slate-200"
             >
               {isAiLoading ? <Activity size={14} className="animate-spin" /> : <Zap size={14} className="text-amber-400" />}
               <span className="hidden sm:inline">全盘 AI 深度分析</span>
               <span className="sm:hidden">AI</span>
             </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-grow p-6 lg:p-10 overflow-y-auto custom-scrollbar bg-[#F8FAFC]">
          
          <div className="mb-6 flex items-center justify-between">
             <div className="flex flex-col">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center">
                  {view === 'favorites' ? '我的自选投资组合' : `${selectedSector}`}
                  <span className="ml-3 text-xs font-bold text-slate-400 bg-white border px-2 py-0.5 rounded-full shadow-sm">
                    {filteredFunds.length} 只基金
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-1 font-medium">覆盖市面上各行业核心赛道，数据每 8 秒实时轮询模拟</p>
             </div>
          </div>

          {aiReport && (
            <div className="mb-8 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl p-8 relative shadow-2xl shadow-blue-200 overflow-hidden group border border-blue-400/20">
               <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl group-hover:scale-110 transition-transform"></div>
               <button onClick={() => setAiReport(null)} className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-full transition-colors z-10"><X size={20} /></button>
               <h4 className="text-xs font-black uppercase tracking-widest mb-4 flex items-center text-blue-100">
                  <Sparkles size={16} className="mr-2 text-amber-300 fill-amber-300" /> 
                  FundMaster AI 实时研报结论
               </h4>
               <p className="text-sm leading-relaxed opacity-95 whitespace-pre-wrap font-medium">{aiReport}</p>
               <div className="mt-6 flex items-center space-x-3 text-[10px] text-blue-200 font-bold uppercase tracking-wider">
                  <span>Google Search Grounding Enabled</span>
                  <span className="w-1 h-1 bg-blue-300 rounded-full"></span>
                  <span>Gemini 3 Pro Intelligence</span>
               </div>
            </div>
          )}

          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1200px]">
                <thead>
                  <tr className="bg-slate-50/80 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b">
                    <th className="px-6 py-4 w-12 text-center">自选</th>
                    <th className="px-6 py-4">基金信息 / 核心经理</th>
                    <th className="px-6 py-4">分类</th>
                    <th className="px-6 py-4 text-right">单位净值</th>
                    <th className="px-6 py-4 text-right">当日估涨</th>
                    <th className="px-6 py-4 text-right">近1月</th>
                    <th className="px-6 py-4 text-right">近1年</th>
                    <th className="px-6 py-4 text-right">近3年</th>
                    <th className="px-6 py-4 text-right">历史回撤</th>
                    <th className="px-6 py-4 text-center">风险等级</th>
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
                        className="hover:bg-blue-50/30 cursor-pointer transition-all group animate-fade-in"
                      >
                        <td className="px-6 py-6 text-center" onClick={(e) => toggleFavorite(e, fund.id)}>
                          <Star 
                            size={18} 
                            className={favorites.includes(fund.id) ? "fill-amber-400 text-amber-400" : "text-slate-200 hover:text-amber-400 transition-colors"} 
                          />
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">{fund.name}</span>
                            <div className="flex items-center space-x-2 mt-1.5">
                               <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">{fund.code}</span>
                               <span className="text-[10px] font-bold text-slate-500">经理：{fund.manager}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                           <div className="flex flex-col space-y-1">
                              <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full w-fit">{fund.sector}</span>
                              <span className="text-[9px] font-bold text-slate-400 ml-1">{fund.category}</span>
                           </div>
                        </td>
                        <td className="px-6 py-6 text-right font-mono text-sm font-black text-slate-700">{fund.currentNav.toFixed(4)}</td>
                        <td className={`px-6 py-6 text-right font-mono text-sm font-black ${isUp ? 'text-rose-600' : 'text-emerald-600'}`}>
                          {isUp ? '+' : ''}{price.toFixed(2)}%
                        </td>
                        <td className={`px-6 py-6 text-right font-mono text-xs font-bold ${fund.return1M >= 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                          {fund.return1M > 0 ? '+' : ''}{fund.return1M.toFixed(2)}%
                        </td>
                        <td className={`px-6 py-6 text-right font-mono text-xs font-bold ${fund.return1Y >= 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                          {fund.return1Y > 0 ? '+' : ''}{fund.return1Y.toFixed(2)}%
                        </td>
                        <td className={`px-6 py-6 text-right font-mono text-xs font-bold ${fund.return3Y >= 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                          {fund.return3Y > 0 ? '+' : ''}{fund.return3Y.toFixed(2)}%
                        </td>
                        <td className="px-6 py-6 text-right font-mono text-xs font-bold text-emerald-600">{fund.maxDrawdown.toFixed(2)}%</td>
                        <td className="px-6 py-6 text-center">
                           <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${fund.riskLevel.includes('高') ? 'bg-rose-50 text-rose-500 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                             {fund.riskLevel}
                           </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filteredFunds.length === 0 && (
              <div className="py-40 text-center bg-slate-50/50">
                <div className="w-20 h-20 bg-white shadow-sm border border-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300 animate-bounce">
                   <Search size={32} />
                </div>
                <h3 className="text-slate-900 font-black text-lg">搜索无结果</h3>
                <p className="text-slate-400 font-bold max-w-xs mx-auto mt-2">我们在 60+ 基金中未匹配到 "{searchTerm}"。请尝试代码(如 005827)或经理(如 张坤)进行全局查找。</p>
                <button 
                  onClick={() => setSearchTerm('')}
                  className="mt-6 text-blue-600 font-black text-sm hover:underline"
                >
                  清除搜索条件
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Detail Drawer */}
      {selectedFund && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setSelectedFund(null)}></div>
          <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl animate-fade-in flex flex-col overflow-hidden">
            
            <div className="p-8 border-b flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center space-x-5">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl shadow-blue-200">
                  {selectedFund.code.slice(-2)}
                </div>
                <div>
                  <h3 className="font-black text-2xl tracking-tight text-slate-900">{selectedFund.name}</h3>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="text-sm font-mono font-bold text-slate-400">{selectedFund.code}</span>
                    <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{selectedFund.category} • {selectedFund.sector}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedFund(null)} className="p-3 hover:bg-slate-50 rounded-full transition-colors text-slate-400 hover:text-slate-900">
                <X size={28} />
              </button>
            </div>
            
            <div className="flex-grow overflow-y-auto p-8 space-y-10 custom-scrollbar">
              
              <div className="grid grid-cols-2 gap-6">
                 <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">最新单位净值</span>
                    <div className="text-4xl font-black tabular-nums tracking-tighter text-slate-900">¥{selectedFund.currentNav.toFixed(4)}</div>
                    <div className="flex items-center text-[10px] text-slate-400 mt-4 font-bold">
                       <Clock size={12} className="mr-1.5" /> 更新：{new Date().toLocaleDateString()}
                    </div>
                 </div>
                 <div className={`p-6 rounded-3xl border ${selectedFund.changePercent >= 0 ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}>
                    <span className="text-[10px] font-black uppercase tracking-widest block mb-2 opacity-60">今日实时估算</span>
                    <div className="text-4xl font-black tabular-nums tracking-tighter">
                      {selectedFund.changePercent >= 0 ? '+' : ''}{selectedFund.changePercent.toFixed(2)}%
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleAiDeepAnalysis(selectedFund); }}
                      className="mt-4 flex items-center text-[10px] font-black uppercase tracking-widest hover:underline"
                    >
                      <Zap size={12} className="mr-1" /> 为什么涨跌？咨询 AI 导师
                    </button>
                 </div>
              </div>

              <section>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <BarChart3 size={20} className="text-blue-600" />
                    <h4 className="font-black text-base text-slate-800">阶段性业绩看板</h4>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { l: '最近一周', v: selectedFund.return1W },
                    { l: '最近一月', v: selectedFund.return1M },
                    { l: '最近一年', v: selectedFund.return1Y },
                    { l: '成立以来', v: selectedFund.return3Y }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center">
                      <span className="w-24 text-[11px] font-black text-slate-400">{item.l}</span>
                      <div className="flex-grow h-3 bg-slate-100 rounded-full overflow-hidden mx-4">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${item.v >= 0 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                          style={{ width: `${Math.min(100, Math.abs(item.v) * 2.5)}%` }}
                        ></div>
                      </div>
                      <span className={`w-16 text-right text-xs font-black tabular-nums ${item.v >= 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {item.v > 0 ? '+' : ''}{item.v.toFixed(2)}%
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <div className="flex items-center space-x-2 mb-6">
                  <PieChart size={20} className="text-blue-600" />
                  <h4 className="font-black text-base text-slate-800">底层持仓穿透 (Top 10)</h4>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-3xl overflow-hidden shadow-inner">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-slate-100/50 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
                        <th className="px-6 py-4">标的资产名称</th>
                        <th className="px-6 py-4 text-right">持仓权重</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedFund.holdings.length > 0 ? selectedFund.holdings.map((h, i) => (
                        <tr key={i} className="hover:bg-white transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-700 flex items-center">
                             <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-3"></span>
                             {h.name}
                          </td>
                          <td className="px-6 py-4 text-right font-black text-blue-600 tabular-nums">{h.weight}</td>
                        </tr>
                      )) : (
                        <tr>
                           <td colSpan={2} className="px-6 py-12 text-center text-slate-400 font-bold italic">
                              该基金持仓详情请参考最新季度报表
                           </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="bg-slate-900 text-white rounded-[40px] p-10 relative overflow-hidden group shadow-2xl shadow-slate-400">
                 <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform"></div>
                 <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-8">风险矩阵与专家点评</h4>
                 <div className="grid grid-cols-2 gap-10 relative z-10">
                    <div>
                       <span className="text-[10px] block text-slate-500 mb-2 font-black uppercase">历史最大回撤</span>
                       <span className="text-4xl font-black text-emerald-400 tracking-tighter">{selectedFund.maxDrawdown.toFixed(2)}%</span>
                       <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">风控指标位居全市场前 {90 - Math.abs(Math.round(selectedFund.maxDrawdown))}%</p>
                    </div>
                    <div>
                       <span className="text-[10px] block text-slate-500 mb-2 font-black uppercase">核心管理经理</span>
                       <span className="text-4xl font-black tracking-tighter">{selectedFund.manager}</span>
                       <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">擅长赛道：{selectedFund.sector}</p>
                    </div>
                 </div>
                 <div className="mt-8 pt-8 border-t border-slate-800 text-sm text-slate-300 leading-relaxed font-medium italic">
                    "{selectedFund.description}"
                 </div>
              </section>
            </div>

            <div className="p-8 bg-slate-50 border-t flex space-x-4">
              <button 
                onClick={(e) => toggleFavorite(e, selectedFund.id)}
                className={`flex-grow py-5 rounded-2xl font-black text-sm flex items-center justify-center space-x-3 transition-all ${favorites.includes(selectedFund.id) ? 'bg-amber-100 text-amber-600 border border-amber-200 shadow-xl shadow-amber-500/10' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 shadow-sm'}`}
              >
                <Star size={20} className={favorites.includes(selectedFund.id) ? "fill-amber-600" : ""} />
                <span>{favorites.includes(selectedFund.id) ? '已在自选列表' : '加入每日自选'}</span>
              </button>
              <button className="flex-[2] py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm shadow-2xl shadow-blue-300 active:scale-95 transition-all">
                前往三方平台交易 (申购费0.1折)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
