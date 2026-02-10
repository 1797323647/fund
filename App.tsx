
import React, { useState, useMemo } from 'react';
import { Search, TrendingUp, TrendingDown, Star, Sparkles, X, Share2, Check, ShieldCheck, Globe, Zap, ArrowRight, Info, LineChart } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { FUNDS, CATEGORIES } from './constants';
import { FundItem, FundType } from './types';

const Header: React.FC<{ onShare: () => void }> = ({ onShare }) => (
  <header className="bg-white/90 backdrop-blur-xl border-b sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between py-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-red-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-red-200">
          F
        </div>
        <div className="flex flex-col">
          <div className="flex items-center">
            <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-amber-600 leading-none">
              FundMaster
            </span>
            <span className="ml-2 px-1.5 py-0.5 bg-red-50 text-red-600 text-[9px] font-black rounded-lg border border-red-100">Live</span>
          </div>
          <span className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">Smart Investment Navigator</span>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button 
          onClick={onShare}
          className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
        >
          <Share2 size={22} />
        </button>
      </div>
    </div>
  </header>
);

const FundCard: React.FC<{ fund: FundItem; onClick: () => void }> = ({ fund, onClick }) => {
  const isUp = fund.changePercent >= 0;
  
  return (
    <div 
      onClick={onClick}
      className="group bg-white rounded-[2.5rem] p-7 border border-gray-100/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 transition-all duration-500 cursor-pointer flex flex-col h-full relative"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest block mb-1">{fund.code}</span>
          <h3 className="text-xl font-black text-gray-900 group-hover:text-red-600 transition-colors">{fund.name}</h3>
        </div>
        <div className={`flex items-center px-3 py-1.5 rounded-2xl border ${isUp ? 'bg-red-50 border-red-100 text-red-600' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}>
          {isUp ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
          <span className="text-xs font-black">{isUp ? '+' : ''}{fund.changePercent.toFixed(2)}%</span>
        </div>
      </div>

      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">单位净值</p>
          <span className="text-3xl font-black text-gray-900 tracking-tighter">{fund.currentNav.toFixed(4)}</span>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">风险等级</p>
          <span className={`text-xs font-black px-2 py-0.5 rounded-lg border ${fund.riskLevel.includes('高') ? 'bg-red-50 text-red-500 border-red-100' : 'bg-blue-50 text-blue-500 border-blue-100'}`}>
            {fund.riskLevel}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-auto">
        {fund.tags.map(tag => (
          <span key={tag} className="px-3 py-1 bg-slate-50 text-slate-400 text-[10px] font-black rounded-xl border border-gray-50">#{tag}</span>
        ))}
      </div>
      
      <div className="absolute bottom-6 right-7 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
        <ArrowRight size={20} className="text-red-500" />
      </div>
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
        contents: "分析当前宏观经济背景下，对于场外基金（股票型、指数型、债券型）的投资建议，并预测未来一个月的市场情绪。请以精炼的 Markdown 格式返回。",
      });
      setAiAnalysis(response.text);
    } catch (error) {
      setAiAnalysis("获取 AI 建议失败，请检查网络连接。");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFCFD]">
      <Header onShare={handleShare} />
      
      <main className="flex-grow">
        {/* Hero */}
        <section className="relative py-24 px-4 bg-white overflow-hidden text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#FEF2F2,transparent_70%)] opacity-60"></div>
          <div className="max-w-5xl mx-auto relative z-10">
            <div className="inline-flex items-center space-x-3 bg-white text-red-600 px-6 py-2.5 rounded-full text-xs font-black mb-12 border border-red-50 shadow-xl shadow-red-500/5">
              <ShieldCheck size={18} />
              <span className="uppercase tracking-[0.2em]">Verified Real-time Market Data</span>
            </div>
            <h1 className="text-6xl md:text-9xl font-black text-gray-900 mb-10 tracking-tighter leading-none">
              洞察<span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-amber-600">财富趋势</span>
            </h1>
            <p className="text-gray-400 text-xl md:text-2xl max-w-2xl mx-auto mb-16 font-bold opacity-80 leading-relaxed">
              实时追踪场外基金行情，智能筛选热门赛道，<br />助力每一位投资者的决策。
            </p>

            <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-4 px-2">
              <div className="relative flex-grow flex items-center bg-white rounded-3xl shadow-2xl shadow-gray-200 border border-gray-100 p-2 focus-within:ring-8 focus-within:ring-red-50 transition-all">
                <Search className="ml-5 text-gray-300" size={24} />
                <input
                  type="text"
                  placeholder="搜索基金名称或代码..."
                  className="w-full px-5 py-4 outline-none text-xl font-black text-gray-800 placeholder:text-gray-200 bg-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button 
                onClick={getAiRecommendation}
                className="bg-red-600 text-white flex items-center justify-center px-10 py-5 rounded-3xl hover:bg-red-700 transition-all shadow-2xl shadow-red-200 active:scale-95 group"
              >
                <Sparkles size={24} className="mr-2 group-hover:rotate-12 transition-transform" />
                <span className="font-black text-lg">AI 分析</span>
              </button>
            </div>
          </div>
        </section>

        {/* AI Insight Section */}
        {aiAnalysis && (
          <section className="px-4 max-w-4xl mx-auto -mt-10 mb-20 relative z-20">
            <div className="bg-white/70 backdrop-blur-2xl p-10 rounded-[3rem] border border-red-100 shadow-2xl relative">
              <button onClick={() => setAiAnalysis(null)} className="absolute top-6 right-6 text-gray-400 hover:text-red-500">
                <X size={24} />
              </button>
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-red-600 rounded-2xl text-white shadow-lg"><Sparkles size={20} /></div>
                <h4 className="text-2xl font-black text-gray-900 tracking-tight">AI 投研分析建议</h4>
              </div>
              <div className="prose prose-red max-w-none text-gray-500 font-semibold leading-relaxed">
                {aiAnalysis.split('\n').map((line, i) => <p key={i}>{line}</p>)}
              </div>
            </div>
          </section>
        )}

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-xl border-y sticky top-[72px] z-40 overflow-x-auto no-scrollbar shadow-sm">
          <div className="max-w-7xl mx-auto px-4 flex space-x-4 py-6">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-shrink-0 px-10 py-4 rounded-3xl text-[14px] font-black transition-all border-2 ${
                  selectedCategory === cat.id 
                  ? 'bg-red-600 text-white border-red-600 shadow-2xl shadow-red-200 scale-105' 
                  : 'bg-white text-gray-400 border-gray-50 hover:border-red-100 hover:text-red-600'
                }`}
              >
                <span className="mr-3 text-lg">{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <section className="py-24 px-4 max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-16 px-2">
            <div>
              <p className="text-red-500 font-black text-[10px] uppercase tracking-[0.4em] mb-3">Today's Hot Selection</p>
              <h2 className="text-5xl font-black text-gray-900 tracking-tight leading-none">
                {selectedCategory === 'all' ? '全部实时行情' : selectedCategory}
              </h2>
            </div>
            <div className="px-6 py-3 bg-red-50/50 rounded-2xl text-red-500 font-black text-sm border border-red-100/30">
              {filteredFunds.length} 只基金在场
            </div>
          </div>
          
          {filteredFunds.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
              {filteredFunds.map(fund => (
                <FundCard key={fund.id} fund={fund} onClick={() => setSelectedFund(fund)} />
              ))}
            </div>
          ) : (
            <div className="py-40 text-center">
              <div className="w-32 h-32 bg-red-50 rounded-[3.5rem] flex items-center justify-center mx-auto mb-10">
                <Search size={54} className="text-red-200" />
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">未找到匹配基金</h3>
              <p className="text-gray-400 font-bold text-lg opacity-70">试试搜索其它代码，或者使用 AI 智能分析。</p>
            </div>
          )}
        </section>
      </main>

      {/* Detail Modal */}
      {selectedFund && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-2xl animate-fade-in" onClick={() => setSelectedFund(null)}></div>
          <div className="relative bg-white rounded-[4rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-fade-in border border-gray-100">
            <div className="p-12 border-b flex items-center justify-between bg-gradient-to-br from-red-600 to-amber-600 text-white">
              <div className="flex items-center space-x-7">
                <div className="w-20 h-20 bg-white/20 rounded-[2.5rem] flex items-center justify-center backdrop-blur-2xl border border-white/30 text-white">
                  <LineChart size={40} />
                </div>
                <div>
                  <h3 className="font-black text-4xl tracking-tighter leading-none">{selectedFund.name}</h3>
                  <p className="text-[11px] text-white/70 font-black uppercase tracking-[0.4em] mt-3">{selectedFund.code} · {selectedFund.category}</p>
                </div>
              </div>
              <button onClick={() => setSelectedFund(null)} className="w-14 h-14 flex items-center justify-center hover:bg-white/10 rounded-full transition-all">
                <X size={32} />
              </button>
            </div>
            
            <div className="p-12 bg-white space-y-10 max-h-[60vh] overflow-y-auto no-scrollbar">
              <div className="grid grid-cols-2 gap-8">
                <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">单位净值 (NAV)</p>
                  <p className="text-4xl font-black text-gray-900 tracking-tighter">{selectedFund.currentNav.toFixed(4)}</p>
                </div>
                <div className={`p-8 rounded-[2.5rem] border ${selectedFund.changePercent >= 0 ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">日增长率</p>
                  <p className={`text-4xl font-black tracking-tighter ${selectedFund.changePercent >= 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                    {selectedFund.changePercent >= 0 ? '+' : ''}{selectedFund.changePercent.toFixed(2)}%
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <Info size={18} className="text-red-500" />
                  <h4 className="font-black text-xl text-gray-900 tracking-tight">基金详情</h4>
                </div>
                <p className="text-lg text-gray-500 font-semibold leading-relaxed">{selectedFund.description}</p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-300 font-black uppercase tracking-widest mb-1">基金经理</span>
                    <span className="text-xl font-black text-gray-900">{selectedFund.manager}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-300 font-black uppercase tracking-widest mb-1">风险提示</span>
                    <span className="text-xl font-black text-red-600">{selectedFund.riskLevel}风险</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-12 bg-gray-50/50 border-t flex gap-4">
              <button className="flex-grow bg-red-600 text-white py-6 rounded-[2rem] font-black text-xl hover:bg-red-700 transition-all shadow-xl shadow-red-200">
                立即定投
              </button>
              <button onClick={() => setSelectedFund(null)} className="px-10 py-6 border border-gray-200 bg-white rounded-[2rem] font-black text-gray-400 hover:text-gray-600 transition-all">
                返回
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t py-32 px-4 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <div className="flex items-center space-x-4 mb-10">
            <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-red-200">F</div>
            <span className="text-3xl font-black text-gray-900 tracking-tighter">FundMaster</span>
          </div>
          <p className="text-gray-400 text-sm font-black uppercase tracking-[0.4em] mb-12">© 2024 Market Data Powered by FundMaster</p>
          <p className="text-gray-300 text-xs font-bold max-w-lg text-center leading-relaxed">
            风险提示：基金有风险，投资需谨慎。本站提供行情数据仅供参考，不构成任何投资建议。过往业绩不预示未来表现。
          </p>
        </div>
      </footer>

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] bg-gray-900 text-white px-12 py-7 rounded-[3rem] shadow-2xl flex items-center space-x-6 animate-fade-in">
          <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center"><Check size={24} /></div>
          <span className="font-black text-lg">链接已复制</span>
        </div>
      )}
    </div>
  );
}
