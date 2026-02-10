
export type FundType = '全部' | '股票型' | '指数型' | '混合型' | '债券型' | 'QDII' | '货币型' | 'FOF';
export type SectorType = 
  | '全部分类' 
  | '消费白酒' 
  | '医疗健康' 
  | '科技半导体' 
  | '人工智能AI'
  | '新能源' 
  | '红利价值' 
  | '指数宽基' 
  | 'QDII海外' 
  | '债券固收' 
  | '黄金贵金属' 
  | '国防军工' 
  | '银行金融' 
  | '地产基建'
  | 'ESG绿色';

export interface Holding {
  name: string;
  weight: string;
}

export interface FundItem {
  id: string;
  code: string;
  name: string;
  category: FundType;
  sector: SectorType;
  manager: string;
  currentNav: number;
  changePercent: number;
  return1W: number;
  return1M: number;
  return1Y: number;
  return3Y: number;
  maxDrawdown: number;
  riskLevel: '低' | '中低' | '中' | '中高' | '高';
  holdings: Holding[];
  description: string;
  minAmount: number;
}

export interface Category {
  id: SectorType;
  name: string;
  icon: string;
}
