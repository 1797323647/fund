
import React, { useState, useMemo } from 'react';
import { Search, TrendingUp, TrendingDown, Star, Sparkles, X, Share2, Info, ChevronRight, Activity, LayoutGrid, Clock } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { FUNDS, CATEGORIES } from './constants';
import { FundItem } from './types';

const Header: React.FC = () => (
  <header className="bg-white border-b sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
          F
        </div>
        <span className="text-xl font-bold text-slate-800 tracking-tight">FundMaster</span>
      </div>
      <div className="hidden md:flex items-center space-x-6">
        <nav className="flex space-x-6 text-sm font-medium text-slate-500">
          <a href="#" className="text-blue-600">行情中心</a>
          <a href="#" className="hover:text-slate-900 transition-colors">研报解读</a>
          <a href="#" className="hover:text-slate-900 transition-colors">自选基金</a>
        </nav>
        <div className="h-4 w-px bg-slate-200"></div>
        <div className="flex items-center space-x-2 text-[11px] font-semibold text-emerald-500 bg-emerald-50 px-2 py-1 rounded">
          <Clock size={12} />
          <span>市场已开盘 (09:30-15:00)</span>
        </div>
      </div>
    </div>
  </header>
);

const MetricItem: React.FC<{ label: string; value: string; colorClass?: string; isBold?: boolean }> = ({ label, value, colorClass = "text-slate-900", isBold = false }) => (
  <div className="flex flex-col items-center justify-center py-4 px-2">
    <span className="text-[11px] text-slate-400 mb-2 font-medium">{label}</span>
    <span className={`text-lg tabular-nums ${isBold ? 'font-bold' : 'font-semibold'} ${colorClass}`}>{value}</span>
  </div>
);

const FundCard: React.FC<{ fund: FundItem; onClick: () => void }> = ({ fund, onClick }) => {
  const isUp = fund.changePercent >= 0;
  
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden">
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-col">
            <h3 className="text-base font-bold text-slate-900 mb-1 leading-tight">{fund.name}</h3>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium text-slate-400 font-mono tracking-tight">{fund.code}</span>
              <span className="text-[10px] font-bold text-blue-500 uppercase bg-blue-50 px-1.5 py-0.5 rounded leading-none">
                {fund.category}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 bg-slate-50/50 rounded-lg border border-slate-100 mb-4">
          <MetricItem label="单位净值" value={`¥${fund.currentNav.toFixed(4)}`} isBold />
          <MetricItem 
            label="日涨跌" 
            value={`${isUp ? '+' : ''}${fund.changePercent.toFixed(2)}%`} 
            colorClass={isUp ? 'text-red-600' : 'text-emerald-600'} 
          />
          <MetricItem 
            label="近一年" 
            value={`${fund.return1Y >= 0 ? '+' : ''}${fund.return1Y.toFixed(2)}%`}
            colorClass={fund.return1Y >= 0 ? 'text-red-600' : 'text-emerald-600'}
          />
          <MetricItem 
            label="近三年" 
            value={`${fund.return3Y >= 0 ? '+' : ''}${fund.return3Y.toFixed(2)}%`}
            colorClass={fund.return3Y >= 0 ? 'text-red-600' : 'text-emerald-600'}
          />
        </div>
      </div>

      <div className="p-4 border-t border-slate-100 flex gap-2">
        <button 
          onClick={onClick}
          className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-colors"
        >
          查看详情
        </button>
        <button className="px-4 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-bold transition-colors">
          关注
        </button>
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

  const filteredFunds = useMemo(() => {
    return FUNDS.filter((fund) => {
      const matchesSearch = fund.name.toLowerCase().includes(searchTerm.toLowerCase()) || fund.code.includes(searchTerm);
      const matchesCategory = selectedCategory === 'all' || fund.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const handleAiAsk = async () => {
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "请简要分析当前市场环境下，创业板与价值股的博弈逻辑，并给出近期的配置建议（300字以内）。",
      });
      setAiAnalysis(response.text);
    } catch (e) {
      setAiAnalysis("获取研报失败，请重试。");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* 工具栏 */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="搜索基金名称或代码..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={handleAiAsk}
            disabled={isAiLoading}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50 shadow-sm"
          >
            {isAiLoading ? <Activity size={18} className="animate-spin" /> : <Sparkles size={18} className="text-amber-400" />}
            <span className="text-sm font-bold">AI 智能分析</span>
          </button>
        </div>

        {/* AI 报告区域 */}
        {aiAnalysis && (
          <div className="mb-10 bg-white border border-blue-100 rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <div className="flex justify-between items-start mb-4 relative">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Info size={18} /></div>
                <h4 className="font-bold text-slate-800">市场情绪分析研报</h4>
              </div>
              <button onClick={() => setAiAnalysis(null)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <div className="text-sm text-slate-600 leading-relaxed font-medium">
              {aiAnalysis}
            </div>
          </div>
        )}

        {/* 分类标签 */}
        <div className="flex space-x-2 overflow-x-auto no-scrollbar mb-8 pb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex-shrink-0 px-5 py-2 rounded-full text-xs font-bold transition-all border ${
                selectedCategory === cat.id 
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                : 'bg-white text-slate-500 border-slate-200 hover:border-blue-400 hover:text-blue-600'
              }`}
            >
              <span className="mr-1.5">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* 基金列表网格 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFunds.map(fund => (
            <FundCard key={fund.id} fund={fund} onClick={() => setSelectedFund(fund)} />
          ))}
          {filteredFunds.length === 0 && (
            <div className="col-span-full py-20 bg-white border border-dashed border-slate-200 rounded-2xl text-center">
               <LayoutGrid size={48} className="mx-auto text-slate-200 mb-4" />
               <p className="text-slate-400 font-medium">未找到相关基金</p>
            </div>
          )}
        </div>
      </main>

      {/* 详情弹窗 */}
      {selectedFund && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedFund(null)}></div>
          <div className="relative bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-fade-in">
            <div className="p-6 border-b flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg font-bold text-xs">{selectedFund.code}</div>
                <h3 className="font-bold text-xl text-slate-900">{selectedFund.name}</h3>
              </div>
              <button onClick={() => setSelectedFund(null)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-slate-50 rounded-xl">
                  <span className="text-xs text-slate-400 font-bold uppercase mb-1 block">当前净值</span>
                  <span className="text-3xl font-bold text-slate-900 tabular-nums">¥{selectedFund.currentNav.toFixed(4)}</span>
                </div>
                <div className={`p-5 rounded-xl ${selectedFund.changePercent >= 0 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  <span className="text-xs font-bold uppercase mb-1 block">今日涨跌幅</span>
                  <span className="text-3xl font-bold tabular-nums">
                    {selectedFund.changePercent >= 0 ? '+' : ''}{selectedFund.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 flex items-center space-x-2">
                  <Info size={16} />
                  <span>基金摘要</span>
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed font-medium bg-slate-50 p-4 rounded-xl">
                  {selectedFund.description}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-6">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400 font-bold mb-1">基金经理</span>
                  <span className="font-bold text-slate-800">{selectedFund.manager}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400 font-bold mb-1">风险等级</span>
                  <span className={`font-bold ${selectedFund.riskLevel.includes('高') ? 'text-red-600' : 'text-blue-600'}`}>{selectedFund.riskLevel}风险</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400 font-bold mb-1">申购费率</span>
                  <span className="font-bold text-slate-800">0.10% (起)</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 flex gap-3">
              <button className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-md">
                立即购买
              </button>
              <button onClick={() => setSelectedFund(null)} className="px-8 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all">
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="max-w-7xl mx-auto px-4 py-12 text-center text-slate-400 border-t mt-12">
        <p className="text-[11px] font-bold uppercase tracking-widest mb-2">FundMaster Institutional Grade Data Dashboard</p>
        <p className="text-xs font-medium max-w-2xl mx-auto leading-relaxed opacity-60">
          风险提示：基金投资有风险，过往业绩不代表未来表现。本站所有数据源自模拟接口及公开市场参考值。AI 分析内容仅供投研参考，不构成任何形式的投资建议。
        </p>
      </footer>
    </div>
  );
}
