
export type FundType = '股票型' | '指数型' | '混合型' | '债券型' | 'QDII' | '货币型' | '货币市场' | 'etf' | 'index';

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
  currentNav: number;
  changePercent: number;
  return1Y: number; // 近一年收益
  return3Y: number; // 近三年收益
  riskLevel: '低' | '中低' | '中' | '中高' | '高';
  history: FundHistory[];
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}
