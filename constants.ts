
import { FundItem, Category } from './types';

export const CATEGORIES: Category[] = [
  { id: 'all', name: '全部基金', icon: '📊' },
  { id: '股票型', name: '股票型', icon: '📈' },
  { id: '指数型', name: '指数型', icon: '🔢' },
  { id: '混合型', name: '混合型', icon: '🌀' },
  { id: '债券型', name: '债券型', icon: '🛡️' },
  { id: 'QDII', name: '全球资产', icon: '🌍' },
];

export const FUNDS: FundItem[] = [
  {
    id: '1',
    code: '110022',
    name: '易方达消费行业股票',
    description: '深耕消费赛道，重点布局白酒、家电等龙头企业，长期业绩优异。',
    category: '股票型',
    manager: '萧楠',
    currentNav: 3.842,
    changePercent: 1.25,
    riskLevel: '中高',
    tags: ['白酒龙头', '业绩长跑'],
    history: [
      { date: '2023-10-20', nav: 3.75 },
      { date: '2023-10-21', nav: 3.78 },
      { date: '2023-10-22', nav: 3.842 },
    ]
  },
  {
    id: '2',
    code: '161725',
    name: '招商中证白酒指数',
    description: '紧密跟踪中证白酒指数，是一键布局白酒板块的高效率工具。',
    category: '指数型',
    manager: '侯昊',
    currentNav: 1.124,
    changePercent: -0.84,
    riskLevel: '高',
    tags: ['行业指数', '波动率高'],
    history: [
      { date: '2023-10-20', nav: 1.15 },
      { date: '2023-10-21', nav: 1.13 },
      { date: '2023-10-22', nav: 1.124 },
    ]
  },
  {
    id: '3',
    code: '003003',
    name: '华夏沪深300ETF联接',
    description: '追求跟踪标的指数，反映 A 股核心大盘股的整体表现。',
    category: '指数型',
    manager: '赵宗庭',
    currentNav: 1.458,
    changePercent: 0.42,
    riskLevel: '中',
    tags: ['蓝筹核心', '配置工具'],
    history: []
  },
  {
    id: '4',
    code: '000689',
    name: '前海开源稀缺资产',
    description: '挖掘具有资源垄断优势的稀缺资产，在通胀背景下具有较强防御性。',
    category: '混合型',
    manager: '曲扬',
    currentNav: 2.156,
    changePercent: 2.18,
    riskLevel: '中高',
    tags: ['资源垄断', '成长股'],
    history: []
  }
];
