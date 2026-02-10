
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
    description: '深耕消费赛道，重点布局白酒、家电等龙头企业，追求消费升级下的超额收益。',
    category: '股票型',
    manager: '萧楠',
    currentNav: 3.8420,
    changePercent: 1.25,
    riskLevel: '中高',
    tags: ['白酒龙头', '业绩长跑'],
    history: [
      { date: '10-16', nav: 3.72 },
      { date: '10-17', nav: 3.75 },
      { date: '10-18', nav: 3.70 },
      { date: '10-19', nav: 3.78 },
      { date: '10-20', nav: 3.81 },
      { date: '10-21', nav: 3.842 }
    ]
  },
  {
    id: '2',
    code: '161725',
    name: '招商中证白酒指数',
    description: '紧密跟踪中证白酒指数，一键布局高端及区域白酒龙头。',
    category: '指数型',
    manager: '侯昊',
    currentNav: 1.1240,
    changePercent: -0.84,
    riskLevel: '高',
    tags: ['行业指数', '波动剧烈'],
    history: [
      { date: '10-16', nav: 1.20 },
      { date: '10-17', nav: 1.18 },
      { date: '10-18', nav: 1.15 },
      { date: '10-19', nav: 1.16 },
      { date: '10-20', nav: 1.14 },
      { date: '10-21', nav: 1.124 }
    ]
  },
  {
    id: '5',
    code: '004812',
    name: '华夏恒生科技ETF联接',
    description: '布局港股互联网巨头，包括阿里、腾讯、美团等硬核科技公司。',
    category: 'QDII',
    manager: '徐猛',
    currentNav: 0.5421,
    changePercent: 2.31,
    riskLevel: '高',
    tags: ['港股科技', '弹性十足'],
    history: [
      { date: '10-16', nav: 0.51 },
      { date: '10-17', nav: 0.52 },
      { date: '10-18', nav: 0.50 },
      { date: '10-19', nav: 0.53 },
      { date: '10-20', nav: 0.5421 }
    ]
  },
  {
    id: '6',
    code: '006327',
    name: '万家红利低波',
    description: '选取高分红且低波动的优质公司，在震荡市中表现稳健。',
    category: '混合型',
    manager: '杨坤',
    currentNav: 1.4258,
    changePercent: 0.12,
    riskLevel: '中',
    tags: ['高股息', '防守利器'],
    history: []
  },
  {
    id: '7',
    code: '270048',
    name: '广发纳斯达克100',
    description: '跟踪纳斯达克100指数，聚焦全球科技创新龙头。',
    category: 'QDII',
    manager: '刘杰',
    currentNav: 5.1245,
    changePercent: 1.45,
    riskLevel: '中高',
    tags: ['美股科技', '纳指龙'],
    history: []
  },
  {
    id: '8',
    code: '000001',
    name: '华夏成长混合',
    description: '经典老牌基金，精选各行业具有成长潜力的龙头个股。',
    category: '混合型',
    manager: '王晓李',
    currentNav: 1.2150,
    changePercent: -0.32,
    riskLevel: '中高',
    tags: ['成长价值', '老牌劲旅'],
    history: []
  }
];
