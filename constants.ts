
import { FundItem, Category, SectorType } from './types';

export const SECTORS: Category[] = [
  { id: '全部分类', name: '全部分类', icon: '📊' },
  { id: '人工智能AI', name: '人工智能AI', icon: '🤖' },
  { id: '科技半导体', name: '科技半导体', icon: '💻' },
  { id: '消费白酒', name: '消费白酒', icon: '🍶' },
  { id: '医疗健康', name: '医疗健康', icon: '💊' },
  { id: '新能源', name: '新能源', icon: '⚡' },
  { id: '红利价值', name: '红利价值', icon: '💰' },
  { id: '黄金贵金属', name: '黄金贵金属', icon: '🪙' },
  { id: '国防军工', name: '国防军工', icon: '🚀' },
  { id: '指数宽基', name: '指数宽基', icon: '📈' },
  { id: 'QDII海外', name: 'QDII海外', icon: '🌍' },
  { id: '银行金融', name: '银行金融', icon: '🏦' },
  { id: '地产基建', name: '地产基建', icon: '🏗️' },
  { id: '债券固定收益', name: '债券固收', icon: '🛡️' } as any,
  { id: 'ESG绿色', name: 'ESG绿色', icon: '🌱' },
];

export const FUNDS: FundItem[] = [
  // AI & Tech
  { id: 'ai-1', code: '012365', name: '华夏中证人工智能主题ETF联接A', category: '指数型', sector: '人工智能AI', manager: '李俊', currentNav: 1.1245, changePercent: 2.15, return1W: 3.2, return1M: 8.5, return1Y: 25.4, return3Y: 12.1, maxDrawdown: -32.5, riskLevel: '中高', minAmount: 1, holdings: [{name:'科大讯飞', weight:'8%'}, {name:'金山办公', weight:'7.5%'}], description: '聚焦AIGC与通用人工智能算力核心。' },
  { id: 'ai-2', code: '018332', name: '广发全球精选股票(QDII)', category: 'QDII', sector: '人工智能AI', manager: '李耀柱', currentNav: 2.4580, changePercent: 1.85, return1W: 2.4, return1M: 6.2, return1Y: 42.1, return3Y: 55.4, maxDrawdown: -18.2, riskLevel: '高', minAmount: 10, holdings: [{name:'英伟达', weight:'10%'}, {name:'微软', weight:'9%'}], description: '全球视野下的AI革命。' },
  { id: 'tech-1', code: '001631', name: '天弘中证电子指数A', category: '指数型', sector: '科技半导体', manager: '杨超', currentNav: 1.1540, changePercent: -2.15, return1W: -3.4, return1M: 5.2, return1Y: 18.5, return3Y: 10.2, maxDrawdown: -28.4, riskLevel: '中高', minAmount: 1, holdings: [{name:'立讯精密', weight:'8%'}], description: '覆盖消费电子全产业链。' },
  { id: 'tech-2', code: '001887', name: '中欧数据挖掘混合A', category: '混合型', sector: '科技半导体', manager: '曲径', currentNav: 2.0520, changePercent: 1.12, return1W: 2.4, return1M: 6.5, return1Y: 12.1, return3Y: 25.4, maxDrawdown: -15.2, riskLevel: '中', minAmount: 10, holdings: [], description: '量化模型驱动科技投资。' },

  // Liquor & Consumption
  { id: 'liq-1', code: '005827', name: '易方达蓝筹精选混合', category: '混合型', sector: '消费白酒', manager: '张坤', currentNav: 2.1582, changePercent: 1.45, return1W: 2.1, return1M: 4.5, return1Y: -12.45, return3Y: -35.2, maxDrawdown: -48.5, riskLevel: '中高', minAmount: 10, holdings: [{name:'五粮液', weight:'9.8%'}, {name:'腾讯', weight:'9.5%'}], description: '精选蓝筹龙头，长期价值发现。' },
  { id: 'liq-2', code: '161725', name: '招商中证白酒指数', category: '指数型', sector: '消费白酒', manager: '侯昊', currentNav: 0.9854, changePercent: 2.31, return1W: 3.5, return1M: -1.2, return1Y: -15.6, return3Y: -28.4, maxDrawdown: -52.1, riskLevel: '高', minAmount: 1, holdings: [{name:'茅台', weight:'15%'}], description: '行业最纯白酒指数工具。' },
  { id: 'liq-3', code: '160632', name: '鹏华中证酒指数A', category: '指数型', sector: '消费白酒', manager: '张羽翔', currentNav: 0.8542, changePercent: 1.22, return1W: 2.1, return1M: 0.8, return1Y: -10.5, return3Y: -22.1, maxDrawdown: -45.2, riskLevel: '高', minAmount: 1, holdings: [], description: '酒类板块全覆盖。' },

  // Medical
  { id: 'med-1', code: '003095', name: '中欧医疗健康混合A', category: '混合型', sector: '医疗健康', manager: '葛兰', currentNav: 1.4230, changePercent: -0.45, return1W: -1.1, return1M: -3.2, return1Y: -25.4, return3Y: -55.2, maxDrawdown: -62.4, riskLevel: '高', minAmount: 10, holdings: [{name:'爱尔眼科', weight:'9%'}], description: '深度医疗全产业链布局。' },
  { id: 'med-2', code: '001102', name: '前海开源中国稀缺资产', category: '混合型', sector: '医疗健康', manager: '曲扬', currentNav: 1.8540, changePercent: 0.15, return1W: 0.8, return1M: 2.1, return1Y: -5.4, return3Y: -20.5, maxDrawdown: -42.1, riskLevel: '中高', minAmount: 10, holdings: [], description: '稀缺核心资产配置。' },
  
  // New Energy
  { id: 'ne-1', code: '004243', name: '华夏能源革新股票A', category: '股票型', sector: '新能源', manager: '郑泽鸿', currentNav: 2.4510, changePercent: -1.20, return1W: -2.5, return1M: 1.2, return1Y: -8.4, return3Y: -22.1, maxDrawdown: -45.6, riskLevel: '高', minAmount: 10, holdings: [{name:'宁德时代', weight:'9.5%'}], description: '新能源汽车及产业链龙头。' },
  { id: 'ne-2', code: '011102', name: '天弘中证光伏产业指数', category: '指数型', sector: '新能源', manager: '刘笑明', currentNav: 0.8540, changePercent: -0.85, return1W: -1.5, return1M: -2.4, return1Y: -15.2, return3Y: -40.1, maxDrawdown: -50.2, riskLevel: '高', minAmount: 1, holdings: [], description: '追踪光伏全产业链。' },

  // Gold & Defense
  { id: 'gold-1', code: '000216', name: '华安黄金易ETF联接A', category: 'QDII', sector: '黄金贵金属', manager: '许之彦', currentNav: 1.8540, changePercent: 0.88, return1W: 1.5, return1M: 5.6, return1Y: 22.4, return3Y: 45.1, maxDrawdown: -10.2, riskLevel: '中', minAmount: 10, holdings: [{name:'AU9999', weight:'98%'}], description: '避险增值，紧跟金价。' },
  { id: 'def-1', code: '160630', name: '鹏华中证国防指数', category: '指数型', sector: '国防军工', manager: '陈龙', currentNav: 0.7540, changePercent: -0.15, return1W: 0.2, return1M: 4.5, return1Y: 12.1, return3Y: -5.2, maxDrawdown: -38.4, riskLevel: '高', minAmount: 1, holdings: [{name:'航发动力', weight:'9%'}], description: '大国重器，军工核心。' },

  // Finance & Banking
  { id: 'bank-1', code: '160631', name: '鹏华中证银行指数A', category: '指数型', sector: '银行金融', manager: '张羽翔', currentNav: 1.2540, changePercent: 0.12, return1W: 0.3, return1M: 2.1, return1Y: 18.5, return3Y: 22.4, maxDrawdown: -12.4, riskLevel: '中', minAmount: 1, holdings: [{name:'招商银行', weight:'12%'}], description: '低估值，高股息银行板块。' },
  
  // Real Estate & Infrastructure
  { id: 're-1', code: '161721', name: '招商沪深300地产等权指数', category: '指数型', sector: '地产基建', manager: '侯昊', currentNav: 0.5540, changePercent: -0.85, return1W: -1.2, return1M: -5.4, return1Y: -22.1, return3Y: -55.2, maxDrawdown: -65.4, riskLevel: '高', minAmount: 1, holdings: [], description: '地产板块周期追踪。' },

  // QDII
  { id: 'qdii-1', code: '270042', name: '广发纳斯达克100指数A', category: 'QDII', sector: 'QDII海外', manager: '刘杰', currentNav: 4.1540, changePercent: 1.25, return1W: 2.1, return1M: 5.2, return1Y: 42.1, return3Y: 65.4, maxDrawdown: -18.4, riskLevel: '中高', minAmount: 10, holdings: [], description: '全球科技龙头大本营。' },
  { id: 'qdii-2', code: '006327', name: '华安德国30(DAX)ETF联接A', category: 'QDII', sector: 'QDII海外', manager: '倪斌', currentNav: 1.4580, changePercent: 0.45, return1W: 0.8, return1M: 3.2, return1Y: 15.4, return3Y: 12.1, maxDrawdown: -25.2, riskLevel: '中高', minAmount: 100, holdings: [], description: '欧洲工业核心配置。' },
  { id: 'qdii-3', code: '004877', name: '华泰柏瑞红利低波ETF联接A', category: '指数型', sector: '红利价值', manager: '柳军', currentNav: 1.3540, changePercent: 0.05, return1W: 0.2, return1M: 4.1, return1Y: 18.2, return3Y: 35.4, maxDrawdown: -10.1, riskLevel: '中', minAmount: 1, holdings: [], description: '低波动高分红策略。' },

  // Expanding with placeholder/extra data to reach 60+
  ...Array.from({ length: 45 }).map((_, i) => {
    const sectors: SectorType[] = ['人工智能AI', '科技半导体', '消费白酒', '医疗健康', '新能源', '红利价值', '指数宽基', 'QDII海外', '银行金融', '地产基建', '黄金贵金属', '国防军工', 'ESG绿色'];
    const sector = sectors[i % sectors.length];
    return {
      id: `ext-${i}`,
      code: `${100000 + i}`.padStart(6, '0'),
      name: `${sector}成长精选混合 ${String.fromCharCode(65 + (i % 3))}`,
      category: i % 2 === 0 ? '混合型' : '股票型',
      sector: sector,
      manager: ['王伟', '张三', '李四', '王五', '赵六', '孙七'][i % 6],
      currentNav: 1 + Math.random() * 2,
      changePercent: (Math.random() - 0.4) * 3,
      return1W: (Math.random() - 0.4) * 2,
      return1M: (Math.random() - 0.3) * 5,
      return1Y: (Math.random() - 0.2) * 20,
      return3Y: (Math.random() - 0.2) * 40,
      maxDrawdown: -Math.random() * 50,
      riskLevel: ['低', '中低', '中', '中高', '高'][i % 5],
      holdings: [],
      description: `针对${sector}板块的专业增强型投资产品。`,
      minAmount: i % 5 === 0 ? 1000 : 10
    } as FundItem;
  })
];
