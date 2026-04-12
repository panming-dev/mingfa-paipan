/**
 * Qimen Mingfa Constants and Static Data
 */

const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

const FIVE_ELEMENTS = {
  WOOD: '木',
  FIRE: '火',
  EARTH: '土',
  METAL: '金',
  WATER: '水',
};

// 9 Palaces in order of Luo Shu numbers (1-9)
const PALACES = [
  null,
  { id: 1, name: '坎', direction: '北', element: FIVE_ELEMENTS.WATER },
  { id: 2, name: '坤', direction: '西南', element: FIVE_ELEMENTS.EARTH },
  { id: 3, name: '震', direction: '东', element: FIVE_ELEMENTS.WOOD },
  { id: 4, name: '巽', direction: '东南', element: FIVE_ELEMENTS.WOOD },
  { id: 5, name: '中', direction: '中', element: FIVE_ELEMENTS.EARTH },
  { id: 6, name: '乾', direction: '西北', element: FIVE_ELEMENTS.METAL },
  { id: 7, name: '兑', direction: '西', element: FIVE_ELEMENTS.METAL },
  { id: 8, name: '艮', direction: '东北', element: FIVE_ELEMENTS.EARTH },
  { id: 9, name: '离', direction: '南', element: FIVE_ELEMENTS.FIRE },
];

// Mingfa Flying Disc Nine Stars sequence (Palaces 1-9)
const STARS = ['天蓬', '天芮', '天冲', '天辅', '天禽', '天心', '天柱', '天任', '天英'];

// Mingfa Flying Disc Nine Doors sequence (Palaces 1-9)
const DOORS = ['休门', '死门', '伤门', '杜门', '中门', '开门', '惊门', '生门', '景门'];

// Mingfa Nine Spirits sequence
const SPIRITS = ['值符', '螣蛇', '太阴', '六合', '太常', '朱雀', '九地', '九天', '勾陈'];

const getTenGod = (dayStem, targetStem) => {
  const relations = {
    '甲': { '甲': '比', '乙': '劫', '丙': '食', '丁': '伤', '戊': '才', '己': '财', '庚': '杀', '辛': '官', '壬': '枭', '癸': '印' },
    '乙': { '甲': '劫', '乙': '比', '丙': '伤', '丁': '食', '戊': '财', '己': '才', '庚': '官', '辛': '杀', '壬': '印', '癸': '枭' },
    '丙': { '甲': '枭', '乙': '印', '丙': '比', '丁': '劫', '戊': '食', '己': '伤', '庚': '杀', '辛': '官', '壬': '枭', '癸': '印' },
    '丁': { '甲': '印', '乙': '枭', '丙': '劫', '丁': '比', '戊': '伤', '己': '食', '庚': '财', '辛': '才', '壬': '官', '癸': '杀' },
    '戊': { '甲': '杀', '乙': '官', '丙': '枭', '丁': '印', '戊': '比', '己': '劫', '庚': '食', '辛': '伤', '壬': '才', '癸': '财' },
    '己': { '甲': '官', '乙': '杀', '丙': '印', '丁': '枭', '戊': '劫', '己': '比', '庚': '伤', '辛': '食', '壬': '财', '癸': '才' },
    '庚': { '甲': '才', '乙': '财', '丙': '杀', '丁': '官', '戊': '枭', '己': '印', '庚': '比', '辛': '劫', '壬': '食', '癸': '伤' },
    '辛': { '甲': '财', '乙': '才', '丙': '官', '丁': '杀', '戊': '印', '己': '枭', '庚': '劫', '辛': '比', '壬': '伤', '癸': '食' },
    '壬': { '甲': '食', '乙': '伤', '丙': '才', '丁': '财', '戊': '杀', '己': '官', '庚': '枭', '辛': '印', '壬': '比', '癸': '劫' },
    '癸': { '甲': '伤', '乙': '食', '丙': '财', '丁': '才', '戊': '官', '己': '杀', '庚': '印', '辛': '枭', '壬': '劫', '癸': '比' },
  };
  return relations[dayStem]?.[targetStem] || '';
};

// Canonical Mingfa Flying Disc Ju sequences
const JU_CONFIG = {
  '冬至': { type: '阳', ju: [1, 7, 4] },
  '小寒': { type: '阳', ju: [2, 8, 5] },
  '大寒': { type: '阳', ju: [3, 9, 6] },
  '立春': { type: '阳', ju: [8, 5, 2] },
  '雨水': { type: '阳', ju: [9, 6, 3] },
  '惊蛰': { type: '阳', ju: [1, 7, 4] },
  '春分': { type: '阳', ju: [3, 9, 6] },
  '清明': { type: '阳', ju: [4, 1, 7] },
  '谷雨': { type: '阳', ju: [5, 2, 8] },
  '立夏': { type: '阳', ju: [4, 1, 7] },
  '小满': { type: '阳', ju: [5, 2, 8] },
  '芒种': { type: '阳', ju: [6, 3, 9] },
  '夏至': { type: '阴', ju: [9, 3, 6] },
  '小暑': { type: '阴', ju: [8, 2, 5] },
  '大暑': { type: '阴', ju: [7, 1, 4] },
  '立秋': { type: '阴', ju: [2, 5, 8] },
  '处暑': { type: '阴', ju: [1, 4, 7] },
  '白露': { type: '阴', ju: [9, 3, 6] },
  '秋分': { type: '阴', ju: [7, 1, 4] },
  '寒露': { type: '阴', ju: [6, 9, 3] },
  '霜降': { type: '阴', ju: [5, 2, 8] },
  '立冬': { type: '阴', ju: [6, 9, 3] },
  '小雪': { type: '阴', ju: [5, 8, 2] },
  '大雪': { type: '阴', ju: [4, 7, 1] }, 
};

const JIAZI = [];
for (let i = 0; i < 60; i++) {
  const stem = STEMS[i % 10];
  const branch = BRANCHES[i % 12];
  const name = stem + branch;
  let xunIndex = i - (i % 10);
  const xunShou = STEMS[xunIndex % 10] + BRANCHES[xunIndex % 12];
  let hiddenStem = '';
  switch (xunShou) {
    case '甲子': hiddenStem = '戊'; break;
    case '甲戌': hiddenStem = '己'; break;
    case '甲申': hiddenStem = '庚'; break;
    case '甲午': hiddenStem = '辛'; break;
    case '甲辰': hiddenStem = '壬'; break;
    case '甲寅': hiddenStem = '癸'; break;
  }
  JIAZI.push({ name, xunShou, hiddenStem });
}

module.exports = {
  STEMS,
  BRANCHES,
  PALACES,
  STARS,
  DOORS,
  SPIRITS,
  JU_CONFIG,
  JIAZI,
  FIVE_ELEMENTS,
  getTenGod
};
