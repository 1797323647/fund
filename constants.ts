
import { FundItem, Category } from './types';

export const CATEGORIES: Category[] = [
  { id: 'all', name: '全部基金', icon: '📊' },
  { id: '混合型', name: '混合型', icon: '🌀' },
  { id: 'etf', name: 'ETF', icon: '⚡' },
  { id: 'index', name: '指数型', icon: '🔢' },
  { id: '货币市场', name: '货币型', icon: '💰' },
  { id: '债券型', name: '债券型', icon: '🛡️' },
];

export const FUNDS: FundItem[] = [
  {
    id: '1',
    code: '000001',
    name: '中银创业板混合基金',
    description: '本基金主要投资于创业板上市公司，通过精选具有高成长性的企业，追求资产的长期稳健增值。',
    category: '混合型',
    manager: '李华',
    currentNav: 3.5502,
    changePercent: 1.88,
    return1Y: 5.57,
    return3Y: 42.85,
    riskLevel: '中高',
    tags: ['成长股', '波动大'],
    history: []
  },
  {
    id: '2',
    code: '000002',
    name: '招商消费ETF基金',
    description: '紧密跟踪消费指数，涵盖白酒、家电、食品饮料等核心消费赛道龙头。',
    category: 'etf',
    manager: '张三',
    currentNav: 4.7609,
    changePercent: -0.24,
    return1Y: 3.93,
    return3Y: -2.36,
    riskLevel: '高',
    tags: ['蓝筹', '消费'],
    history: []
  },
  {
    id: '3',
    code: '000003',
    name: '易方达沪深300ETF基金',
    description: '代表A股核心资产，具有极高的市场代表性和流动性，适合定投。',
    category: 'etf',
    manager: '王五',
    currentNav: 4.9393,
    changePercent: -3.84,
    return1Y: 38.62,
    return3Y: 67.07,
    riskLevel: '中',
    tags: ['核心资产', '指数'],
    history: []
  },
  {
    id: '4',
    code: '000004',
    name: '广发创业板指数基金',
    description: '布局高科技、高成长领域，受政策利好支撑，是科技赛道的重要工具。',
    category: 'index',
    manager: '赵六',
    currentNav: 4.6083,
    changePercent: -3.30,
    return1Y: 33.52,
    return3Y: 15.96,
    riskLevel: '中高',
    tags: ['科技', '高弹性'],
    history: []
  },
  {
    id: '5',
    code: '000005',
    name: '中银稳健货币基金',
    description: '主要投资于短期货币工具，流动性好，风险极低，是闲置资金的避风港。',
    category: '货币市场',
    manager: '孙七',
    currentNav: 3.5093,
    changePercent: 0.49,
    return1Y: 31.49,
    return3Y: 76.19,
    riskLevel: '低',
    tags: ['货币', '无风险'],
    history: []
  },
  {
    id: '6',
    code: '000006',
    name: '富国科技债券基金',
    description: '在保障债券利息收益的同时，配置部分转债以增强收益。',
    category: '债券型',
    manager: '周八',
    currentNav: 5.6625,
    changePercent: 1.31,
    return1Y: 39.97,
    return3Y: 54.40,
    riskLevel: '低',
    tags: ['稳健', '债牛'],
    history: []
  }
];
