
import { FundItem, Category, SectorType } from './types';

export const SECTORS: Category[] = [
  { id: '全部分类', name: '全部分类', icon: '📊' },
  { id: '人工智能AI', name: '人工智能AI', icon: '🤖' },
  { id: '科技半导体', name: '科技半导体', icon: '💻' },
  { id: '消费白酒', name: '消费白酒', icon: '🍶' },
  { id: '医疗健康', name: '医疗健康', icon: '💊' },
  { id: '新能源', name: '新能源', icon: '⚡' },
  { id: '红利价值', name: '红利价值', icon: '💰' },
  { id: '指数宽基', name: '指数宽基', icon: '📈' },
  { id: 'QDII海外', name: 'QDII海外', icon: '🌍' },
  { id: '黄金贵金属', name: '黄金贵金属', icon: '🪙' },
  { id: '国防军工', name: '国防军工', icon: '🚀' },
  { id: '银行金融', name: '银行金融', icon: '🏦' },
  { id: '地产基建', name: '地产基建', icon: '🏗️' },
  { id: '债券固收', name: '债券固收', icon: '🛡️' } as any,
  { id: 'ESG绿色', name: 'ESG绿色', icon: '🌱' },
];

// 核心真实基金种子数据
const SEED_FUNDS: FundItem[] = [
  { id: '1', code: '005827', name: '易方达蓝筹精选混合', category: '混合型', sector: '消费白酒', manager: '张坤', currentNav: 2.1580, changePercent: 1.25, return1W: 2.1, return1M: 4.5, return1Y: -12.4, return3Y: -35.2, maxDrawdown: -48.5, riskLevel: '中高', minAmount: 10, holdings: [{name:'五粮液', weight:'9.8%'}], description: '张坤代表作，聚焦互联网与消费龙头。' },
  { id: '2', code: '161725', name: '招商中证白酒指数', category: '指数型', sector: '消费白酒', manager: '侯昊', currentNav: 0.9850, changePercent: 2.31, return1W: 3.5, return1M: -1.2, return1Y: -15.6, return3Y: -28.4, maxDrawdown: -52.1, riskLevel: '高', minAmount: 1, holdings: [{name:'茅台', weight:'15%'}], description: '全市场规模最大的白酒指数基金。' },
  { id: '3', code: '510300', name: '华泰柏瑞沪深300ETF联接A', category: '指数型', sector: '指数宽基', manager: '柳军', currentNav: 1.4520, changePercent: 0.45, return1W: 1.2, return1M: 3.1, return1Y: 8.5, return3Y: -5.2, maxDrawdown: -25.4, riskLevel: '中', minAmount: 1, holdings: [], description: 'A股核心资产风向标。' },
  { id: '4', code: '012365', name: '华夏中证人工智能主题ETF联接', category: '指数型', sector: '人工智能AI', manager: '李俊', currentNav: 0.8540, changePercent: 3.12, return1W: 5.4, return1M: 12.1, return1Y: 28.5, return3Y: 15.2, maxDrawdown: -35.6, riskLevel: '高', minAmount: 1, holdings: [{name:'科大讯飞', weight:'8%'}], description: '紧跟AI大模型与算力热点。' },
  { id: '5', code: '519674', name: '海富通阿尔法对冲混合', category: '混合型', sector: '红利价值', manager: '杜晓海', currentNav: 1.2540, changePercent: 0.05, return1W: 0.1, return1M: 0.5, return1Y: 4.2, return3Y: 12.5, maxDrawdown: -5.2, riskLevel: '中低', minAmount: 100, holdings: [], description: '市场中性策略，追求稳健回报。' },
  { id: '6', code: '270042', name: '广发纳斯达克100指数', category: 'QDII', sector: 'QDII海外', manager: '刘杰', currentNav: 4.8540, changePercent: 1.15, return1W: 2.1, return1M: 5.6, return1Y: 42.1, return3Y: 75.2, maxDrawdown: -18.4, riskLevel: '中高', minAmount: 10, holdings: [{name:'英伟达', weight:'12%'}], description: '纳指100，全球科技成长之巅。' },
  { id: '7', code: '000216', name: '华安黄金易ETF联接A', category: '指数型', sector: '黄金贵金属', manager: '许之彦', currentNav: 1.9540, changePercent: 0.85, return1W: 1.4, return1M: 4.2, return1Y: 25.1, return3Y: 48.2, maxDrawdown: -8.5, riskLevel: '中', minAmount: 10, holdings: [], description: '避险利器，紧扣实物金价波动。' },
  { id: '8', code: '003095', name: '中欧医疗健康混合A', category: '混合型', sector: '医疗健康', manager: '葛兰', currentNav: 1.4520, changePercent: -0.45, return1W: -1.2, return1M: -3.5, return1Y: -22.1, return3Y: -58.4, maxDrawdown: -65.2, riskLevel: '高', minAmount: 10, holdings: [], description: '医疗女神葛兰成名作，医药全产业链覆盖。' },
];

// 动态生成补充海量数据 (模拟 200+ 条记录)
const generateMassiveFunds = (): FundItem[] => {
  const massive: FundItem[] = [...SEED_FUNDS];
  const sectorList: SectorType[] = SECTORS.map(s => s.id);
  const managers = ['王伟', '张坤', '葛兰', '侯昊', '谢治宇', '朱少醒', '周蔚文', '刘彦春', '丘栋荣', '蔡嵩松', '冯柳', '李俊', '杨浩'];
  const categories: any[] = ['混合型', '股票型', '指数型', 'QDII', '债券型'];
  
  for (let i = 10; i <= 210; i++) {
    const sector = sectorList[i % sectorList.length];
    const code = (Math.random() > 0.5 ? '00' : (Math.random() > 0.3 ? '16' : '51')) + String(i).padStart(4, '0');
    const nav = 0.5 + Math.random() * 4;
    const change = (Math.random() - 0.4) * 4;
    const m1 = (Math.random() - 0.3) * 10;
    const y1 = (Math.random() - 0.2) * 30;
    
    massive.push({
      id: `m-${i}`,
      code: code,
      name: `${sector === '全部分类' ? '全市场' : sector}精选${i % 2 === 0 ? '成长' : '价值'}混合 ${String.fromCharCode(65 + (i % 3))}`,
      category: categories[i % categories.length],
      sector: sector === '全部分类' ? '指数宽基' : sector,
      manager: managers[i % managers.length],
      currentNav: parseFloat(nav.toFixed(4)),
      changePercent: parseFloat(change.toFixed(2)),
      return1W: parseFloat((change * 1.5).toFixed(2)),
      return1M: parseFloat(m1.toFixed(2)),
      return1Y: parseFloat(y1.toFixed(2)),
      return3Y: parseFloat((y1 * 2.5).toFixed(2)),
      maxDrawdown: parseFloat((-10 - Math.random() * 50).toFixed(2)),
      riskLevel: i % 5 === 0 ? '低' : (i % 4 === 0 ? '中' : '高'),
      holdings: [],
      description: `针对${sector}板块的专业深度投研产品，历史业绩优异。`,
      minAmount: i % 10 === 0 ? 1000 : 10
    });
  }
  return massive;
};

export const FUNDS: FundItem[] = generateMassiveFunds();
