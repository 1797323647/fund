
export type FundType = '股票型' | '指数型' | '混合型' | '债券型' | 'QDII' | '货币型';

export interface FundHistory {
  date: string;
  nav: number;
}

export interface FundItem {
  id: string;
  code: string;
  name: string;
  description: string;
  category: FundType;
  manager: string;
  currentNav: number; // 当前净值
  changePercent: number; // 涨跌幅
  riskLevel: '低' | '中低' | '中' | '中高' | '高';
  history: FundHistory[];
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}
