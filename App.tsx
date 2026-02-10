
import React, { useState, useMemo } from 'react';
import { Search, TrendingUp, TrendingDown, Star, Sparkles, X, Share2, Check, ShieldCheck, Globe, Zap, ArrowRight, Info, LineChart, Clock, Calendar, BarChart3 } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { FUNDS, CATEGORIES } from './constants';
import { FundItem, FundType } from './types';

// 迷你趋势图组件
const MiniChart: React.FC<{ data: number[]; isUp: boolean }> = ({ data, isUp }) => {
  if (!data || data.length < 2) return <div className="h-10 w-24 bg-gray-50 rounded-lg flex items-center justify-center text-[10px] text-gray-300">暂无走势</div>;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * 100},${100 - ((v - min) / range) * 100}`).join(' ');
  
  return (
    <svg className="h-10 w-24 overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke={isUp ? '#ef4444' : '#10b981'}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};

const Header: React.FC<{ onShare: () => void }> = ({ onShare }) => (
  <header className="bg-white/90 backdrop-blur-xl border-b sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-red-600 rounded-[1.25rem] flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-red-200 rotate-3 group hover:rotate-0 transition-transform cursor-pointer">
          F
        </div>
        <div className="flex flex-col">
          <div className="flex items-center">
            <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-amber-600 leading-none">
              FundMaster
            </span>
            <span className="ml-2 px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-black rounded-full border border-red-100 animate-pulse">LIVE</span>
          </div>
          <div className="flex items-center space-x-2 mt-1">
             <Clock size={10} className="text-gray-400" />
             <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Market Status: <span className="text-emerald-500">Trading Open</span></span>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <button 
          onClick={onShare}
          className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all border border-transparent hover:border-red-100"
        >
          <Share2 size={20} />
        </button>
      </div>
    </div>
  </header>
);

const FundCard: React.FC<{ fund: FundItem; onClick: () => void }> = ({ fund, onClick }) => {
  const isUp = fund.changePercent >= 0;
  const historyNavs = fund.history.map(h => h.nav);
  
  return (
    <div 
      onClick={onClick}
      className="group bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_40px_80px_rgba(239,68,68,0.08)] hover:-translate-y-2 transition-all duration-500 cursor-pointer flex flex-col h-full relative overflow-hidden"
    >
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div>
          <div className="flex items-center space-x-2 mb-1.5">
            <span className="text-[11px] font-black text-gray-300 uppercase tracking-widest">{fund.code}</span>
            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${fund.category === 'QDII' ? 'bg-blue-50 text-blue-500' : 'bg-gray-50 text-gray-500'}`}>{fund.category}</span>
          </div>
          <h3 className="text-xl font-black text-gray-900 group-hover:text-red-600 transition-colors leading-tight">{fund.name}</h3>
        </div>
        <div className={`flex flex-col items-end`}>
          <div className={`flex items-center px-3 py-1.5 rounded-2xl font-black text-sm border ${isUp ? 'bg-red-50 border-red-100 text-red-600' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}>
            {isUp ? '+' : ''}{fund.changePercent.toFixed(2)}%
          </div>
          <div className="mt-3">
            <MiniChart data={historyNavs} isUp={isUp} />
          </div>
        </div>
      </div>

      <div className="mt-auto pt-6 flex items-end justify-between relative z-10">
        <div>
          <p className="text-[10px] text-gray-400 font-bold uppercase mb-1.5 tracking-tighter">单位净值</p>
          <span className="text-4xl font-black text-gray-900 tracking-tighter tabular-nums">{fund.currentNav.toFixed(4)}</span>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center space-x-1.5 mb-2">
            <Star size={12} className="text-amber-400 fill-amber-400" />
            <span className="text-xs font-black text-gray-900">HOT</span>
          </div>
          <div className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 group-hover:bg-red-600 group-hover:text-white transition-all">
            <ArrowRight size={20} />
          </div>
        </div>
      </div>
      
      {/* Decorative background element */}
      <div className={`absolute -right-8 -bottom-8 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-700 ${isUp ? 'bg-red-400' : 'bg-emerald-400'}`}></div>
    </div>
  );
};

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFund, setSelectedFund] = useState<FundItem | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  const filteredFunds = useMemo(() => {
    return FUNDS.filter((fund) => {
      const matchesSearch = fund.name.toLowerCase().includes(searchTerm.toLowerCase()) || fund.code.includes(searchTerm);
      const matchesCategory = selectedCategory === 'all' || fund.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const getAiRecommendation = async () => {
    setIsAiLoading(true);
    setAiAnalysis(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "作为一名资深特许金融分析师(CFA)，请针对当前全球宏观环境（考虑通胀、利率及地缘因素），分析中国A股、港股科技、及高股息红利基金的投资逻辑。请给出明确的仓位建议及避险提示。使用专业且精炼的中文Markdown格式，增加一些金融术语，不要废话。",
      });
      setAiAnalysis(response.text);
    } catch (error) {
      setAiAnalysis("### 投研助手暂时无法连接\n\n请检查网络连接或 API Key 设置。");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFE]">
      <Header onShare={handleShare} />
      
      <main className="flex-grow">
        {/* Modern Hero Section */}
        <section className="relative py-28 px-4 bg-white overflow-hidden text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#FEF2F2,transparent_60%)] opacity-70"></div>
          <div className="max-w-5xl mx-auto relative z-10">
            <div className="inline-flex items-center space-x-3 bg-white/80 backdrop-blur-md px-6 py-2.5 rounded-full text-[10px] font-black mb-12 border border-red-50 shadow-2xl shadow-red-500/5 uppercase tracking-[0.3em] text-red-600">
              <ShieldCheck size={16} />
              <span>Professional Institutional Data Portal</span>
            </div>
            <h1 className="text-7xl md:text-[8rem] font-black text-gray-900 mb-10 tracking-tighter leading-[0.85]">
              掌握<span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 via-amber-500 to-red-600 animate-gradient-x">投资先机</span>
            </h1>
            <p className="text-gray-400 text-xl md:text-2xl max-w-2xl mx-auto mb-20 font-bold opacity-80 leading-relaxed">
              实时追踪全球场外基金动态，<br />通过 AI 深度学习算法为你筛选最优资产配置。
            </p>

            <div className="max-w-3xl mx-auto flex flex-col md:flex-row gap-5 px-4">
              <div className="relative flex-grow group">
                <div className="absolute inset-0 bg-red-100 rounded-[2rem] blur-xl opacity-0 group-focus-within:opacity-40 transition-opacity"></div>
                <div className="relative flex items-center bg-white rounded-[2rem] shadow-2xl shadow-gray-200/50 border border-gray-100 p-2.5 transition-all focus-within:ring-4 focus-within:ring-red-50">
                  <Search className="ml-5 text-gray-300" size={28} />
                  <input
                    type="text"
                    placeholder="输入代码或关键词..."
                    className="w-full px-5 py-5 outline-none text-2xl font-black text-gray-800 placeholder:text-gray-200 bg-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <button 
                onClick={getAiRecommendation}
                disabled={isAiLoading}
                className="bg-gray-900 text-white flex items-center justify-center px-12 py-6 rounded-[2rem] hover:bg-red-600 transition-all shadow-2xl shadow-gray-400 active:scale-95 group disabled:opacity-50"
              >
                {isAiLoading ? (
                  <Zap size={24} className="animate-spin" />
                ) : (
                  <>
                    <Sparkles size={24} className="mr-3 group-hover:rotate-12 transition-transform text-amber-400" />
                    <span className="font-black text-xl">AI 投研助手</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* AI Response Card */}
        {aiAnalysis && (
          <section className="px-4 max-w-5xl mx-auto -mt-10 mb-24 relative z-20 animate-fade-in">
            <div className="bg-white/80 backdrop-blur-3xl p-12 rounded-[4rem] border border-red-100 shadow-[0_50px_100px_rgba(239,68,68,0.1)] relative group overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50"></div>
              <button onClick={() => setAiAnalysis(null)} className="absolute top-10 right-10 text-gray-300 hover:text-red-500 transition-colors">
                <X size={32} />
              </button>
              <div className="flex items-center space-x-4 mb-10 relative z-10">
                <div className="p-4 bg-red-600 rounded-3xl text-white shadow-2xl shadow-red-200"><Sparkles size={28} /></div>
                <div>
                  <h4 className="text-3xl font-black text-gray-900 tracking-tight leading-none">AI 实时投研研报</h4>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.4em] mt-2">Generated by Gemini 3.0 Pro Analyzer</p>
                </div>
              </div>
              <div className="prose prose-red max-w-none text-gray-600 font-bold text-lg leading-relaxed relative z-10">
                 {aiAnalysis.split('\n').map((line, i) => (
                   <p key={i} className={line.startsWith('#') ? 'text-gray-900 font-black text-2xl mt-8 mb-4' : 'mb-3'}>
                     {line}
                   </p>
                 ))}
              </div>
            </div>
          </section>
        )}

        {/* Categories Tab */}
        <div className="bg-white/90 backdrop-blur-2xl border-y sticky top-20 z-40 overflow-x-auto no-scrollbar shadow-sm">
          <div className="max-w-7xl mx-auto px-4 flex space-x-5 py-8">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-shrink-0 px-10 py-5 rounded-[1.75rem] text-[15px] font-black transition-all border-2 ${
                  selectedCategory === cat.id 
                  ? 'bg-gray-900 text-white border-gray-900 shadow-2xl shadow-gray-200 scale-105' 
                  : 'bg-white text-gray-400 border-gray-50 hover:border-red-100 hover:text-red-600'
                }`}
              >
                <span className="mr-3 text-xl">{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* App Grid */}
        <section className="py-24 px-4 max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-20 px-4">
            <div>
              <p className="text-red-500 font-black text-[11px] uppercase tracking-[0.5em] mb-4">Real-time Performance</p>
              <h2 className="text-6xl font-black text-gray-900 tracking-tighter leading-none">
                {selectedCategory === 'all' ? '全部场外基金' : selectedCategory}
              </h2>
            </div>
            <div className="hidden md:flex items-center space-x-8 text-gray-300 font-black text-xs uppercase tracking-widest">
              <div className="flex items-center space-x-2"><Calendar size={14} /> <span>Latest: Oct 21</span></div>
              <div className="flex items-center space-x-2"><BarChart3 size={14} /> <span>Vol: Normal</span></div>
            </div>
          </div>
          
          {filteredFunds.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
              {filteredFunds.map(fund => (
                <FundCard key={fund.id} fund={fund} onClick={() => setSelectedFund(fund)} />
              ))}
            </div>
          ) : (
            <div className="py-48 text-center bg-gray-50 rounded-[5rem] border border-dashed border-gray-200">
              <Search size={64} className="text-gray-200 mx-auto mb-8" />
              <h3 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">未发现目标标的</h3>
              <p className="text-gray-400 font-bold text-xl opacity-60">请尝试输入其他基金代码或行业关键词</p>
            </div>
          )}
        </section>
      </main>

      {/* Detail Modal Optimized */}
      {selectedFund && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-3xl animate-fade-in" onClick={() => setSelectedFund(null)}></div>
          <div className="relative bg-white rounded-[4rem] w-full max-w-3xl shadow-[0_80px_160px_rgba(0,0,0,0.2)] overflow-hidden animate-fade-in border border-white/50">
            <div className="p-16 border-b flex items-center justify-between bg-gradient-to-br from-gray-900 to-slate-800 text-white relative">
              <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                 <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0 50 Q 25 25 50 50 T 100 50" fill="none" stroke="white" strokeWidth="0.5" />
                 </svg>
              </div>
              <div className="flex items-center space-x-10 relative z-10">
                <div className="w-24 h-24 bg-white/10 rounded-[2.5rem] flex items-center justify-center backdrop-blur-2xl border border-white/20 text-white shadow-inner">
                  <LineChart size={48} />
                </div>
                <div>
                  <h3 className="font-black text-5xl tracking-tighter leading-none mb-4">{selectedFund.name}</h3>
                  <div className="flex items-center space-x-4">
                    <span className="px-3 py-1 bg-white/10 rounded-xl text-xs font-black tracking-widest text-white/70">{selectedFund.code}</span>
                    <span className="px-3 py-1 bg-red-500 rounded-xl text-xs font-black tracking-widest text-white">{selectedFund.category}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedFund(null)} className="w-16 h-16 flex items-center justify-center hover:bg-white/10 rounded-full transition-all relative z-10 group">
                <X size={40} className="group-hover:rotate-90 transition-transform" />
              </button>
            </div>
            
            <div className="p-16 bg-white space-y-12 max-h-[60vh] overflow-y-auto no-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="p-10 bg-slate-50 rounded-[3.5rem] border border-slate-100 group hover:bg-white hover:shadow-2xl transition-all">
                  <p className="text-[11px] text-gray-400 font-black uppercase tracking-widest mb-3">单位净值 (NAV)</p>
                  <p className="text-6xl font-black text-gray-900 tracking-tighter tabular-nums mb-2">{selectedFund.currentNav.toFixed(4)}</p>
                  <div className="flex items-center space-x-2 text-emerald-500 font-black text-xs uppercase">
                    <ShieldCheck size={14} /> <span>官方权威发布</span>
                  </div>
                </div>
                <div className={`p-10 rounded-[3.5rem] border transition-all ${selectedFund.changePercent >= 0 ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
                  <p className="text-[11px] text-gray-400 font-black uppercase tracking-widest mb-3">24H 涨跌幅</p>
                  <p className={`text-6xl font-black tracking-tighter tabular-nums ${selectedFund.changePercent >= 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                    {selectedFund.changePercent >= 0 ? '+' : ''}{selectedFund.changePercent.toFixed(2)}%
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-center space-x-3 border-b border-gray-100 pb-6">
                  <Info size={24} className="text-red-600" />
                  <h4 className="font-black text-2xl text-gray-900 tracking-tight">基金投资摘要</h4>
                </div>
                <p className="text-xl text-gray-500 font-bold leading-relaxed">{selectedFund.description}</p>
                
                <div className="grid grid-cols-3 gap-8">
                  <div className="flex flex-col">
                    <span className="text-[11px] text-gray-300 font-black uppercase tracking-widest mb-2">基金经理</span>
                    <span className="text-2xl font-black text-gray-900">{selectedFund.manager}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] text-gray-300 font-black uppercase tracking-widest mb-2">风险系数</span>
                    <span className={`text-2xl font-black ${selectedFund.riskLevel.includes('高') ? 'text-red-600' : 'text-blue-600'}`}>{selectedFund.riskLevel}风险</span>
                  </div>
                   <div className="flex flex-col">
                    <span className="text-[11px] text-gray-300 font-black uppercase tracking-widest mb-2">申购费率</span>
                    <span className="text-2xl font-black text-gray-900">0.10% (起)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-16 bg-gray-50/50 border-t flex flex-col md:flex-row gap-6">
              <button className="flex-grow bg-red-600 text-white py-8 rounded-[2.5rem] font-black text-2xl hover:bg-red-700 transition-all shadow-[0_30px_60px_rgba(239,68,68,0.2)] active:scale-98">
                极速申购
              </button>
              <button onClick={() => setSelectedFund(null)} className="px-14 py-8 border-2 border-gray-200 bg-white rounded-[2.5rem] font-black text-xl text-gray-400 hover:text-gray-900 hover:border-gray-900 transition-all">
                暂不考虑
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Professional Footer */}
      <footer className="bg-white border-t py-48 px-4 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <div className="flex items-center space-x-4 mb-12">
            <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center text-white font-black text-2xl">F</div>
            <span className="text-4xl font-black text-gray-900 tracking-tighter">FundMaster.</span>
          </div>
          <div className="flex flex-wrap justify-center gap-12 mb-20 text-[11px] font-black text-gray-400 uppercase tracking-[0.4em]">
            <a href="#" className="hover:text-red-600 transition-colors">Risk Disclaimer</a>
            <a href="#" className="hover:text-red-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-red-600 transition-colors">Institutional API</a>
            <a href="#" className="hover:text-red-600 transition-colors">Support Center</a>
          </div>
          <p className="text-gray-300 text-sm font-bold max-w-2xl text-center leading-relaxed opacity-60">
            * 基金投资有风险，过往业绩不代表未来表现。本站数据及 AI 研报仅供投研参考，不构成任何投资建议或承诺。投资者应仔细阅读基金合同及风险揭示书。
          </p>
        </div>
      </footer>

      {showToast && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-[110] bg-gray-900 text-white px-12 py-7 rounded-[3rem] shadow-2xl flex items-center space-x-6 animate-fade-in border border-white/10 backdrop-blur-3xl">
          <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20"><Check size={24} /></div>
          <div className="flex flex-col">
             <span className="font-black text-lg tracking-tight">行情链接已生成</span>
             <span className="text-[10px] text-white/40 font-black uppercase tracking-widest mt-0.5">Ready to share insights</span>
          </div>
        </div>
      )}
    </div>
  );
}
