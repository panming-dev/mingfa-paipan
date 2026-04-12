const { Solar, Lunar } = require('lunar-javascript');
const { JIAZI, JU_CONFIG, STEMS, BRANCHES } = require('../data/constants');

class CalendarEngine {
  /**
   * Correct for True Solar Time (真太阳时)
   */
  static getTrueSolarTime(date, longitude = 120.0) {
    const solar = Solar.fromDate(date);
    const longitudeDiffMinutes = (longitude - 120.0) * 4;
    const eot = this.calculateEquationOfTime(date);
    const totalCorrectionSeconds = (longitudeDiffMinutes + eot) * 60;
    return new Date(date.getTime() + totalCorrectionSeconds * 1000);
  }

  static calculateEquationOfTime(date) {
    const startOfYear = new Date(date.getFullYear(), 0, 0);
    const diff = date - startOfYear;
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    const b = (2 * Math.PI * (dayOfYear - 81)) / 365;
    const eot = 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b);
    return eot;
  }

  /**
   * Determine the current Ju (局) using the "Fixed-Term Anchor" Rule.
   * Logic: The Ju number is determined at the moment of solar term transition (交节)
   * and remains FIXED for the entire 15-day duration of that term.
   */
  static determineJu(date) {
    const solar = Solar.fromDate(date);
    const targetTime = date.getTime();
    
    // 1. Precise Solar Term Junction Detection
    const getTerms = (s) => {
      const table = s.getLunar().getJieQiTable();
      return Object.keys(table).map(k => {
        const jq = table[k];
        return { 
          name: jq.getLunar().getJieQi(), 
          time: new Date(jq.getYear(), jq.getMonth()-1, jq.getDay(), jq.getHour(), jq.getMinute(), jq.getSecond()).getTime() 
        };
      });
    };
    
    const allTerms = [
      ...getTerms(solar.next(-400)),
      ...getTerms(solar),
      ...getTerms(solar.next(400))
    ].sort((a, b) => b.time - a.time);
    
    const currentTermObj = allTerms.find(t => t.time <= targetTime);
    if (!currentTermObj) throw new Error('Term detection failed.');

    // 2. Mingfa Fixed-Term Anchor
    // Find the Day Branch at the exact moment the term starts.
    const junctionTime = new Date(currentTermObj.time);
    const junctionSolar = Solar.fromDate(junctionTime);
    const junctionDayZhi = junctionSolar.getLunar().getDayZhi();

    // 3. Junction Tier Determination
    // 子午卯酉 -> 0 (Upper), 寅申巳亥 -> 1 (Middle), 辰戌丑未 -> 2 (Lower)
    const YuanMap = {
      '子': 0, '午': 0, '卯': 0, '酉': 0,
      '寅': 1, '申': 1, '巳': 1, '亥': 1,
      '辰': 2, '戌': 2, '丑': 2, '未': 2
    };
    
    const yuanTypeIndex = YuanMap[junctionDayZhi];
    const config = JU_CONFIG[currentTermObj.name];
    if (!config) throw new Error(`Missing config for term: ${currentTermObj.name}`);
    const ju = config.ju[yuanTypeIndex];

    const currentLunar = solar.getLunar();
    const hourBranch = currentLunar.getTimeZhi();
    const hourGanZhi = this.getHourStem(currentLunar.getDayGan(), hourBranch) + hourBranch;

    return {
      term: currentTermObj.name,
      type: config.type,
      yuan: ['上', '中', '下'][yuanTypeIndex],
      ju,
      fuTou: junctionSolar.getLunar().getDayInGanZhi(), // junction anchor
      dayGanZhi: currentLunar.getDayInGanZhi(),
      hourGanZhi
    };
  }

  static getHourStem(dayStem, hourBranch) {
    const dayStemIndex = STEMS.indexOf(dayStem);
    const hourBranchIndex = BRANCHES.indexOf(hourBranch);
    const hourStemIndex = ((dayStemIndex % 5) * 2 + hourBranchIndex) % 10;
    return STEMS[hourStemIndex];
  }

  static getInfo(date, longitude = 120.0) {
    const trueTime = this.getTrueSolarTime(date, longitude);
    const solar = Solar.fromDate(trueTime);
    const lunar = solar.getLunar();
    const dayGanzhi = lunar.getDayInGanZhi();
    const hourBranch = lunar.getTimeZhi();
    const hourStem = this.getHourStem(dayGanzhi[0], hourBranch);
    const hourGanzhi = hourStem + hourBranch;
    const juInfo = this.determineJu(trueTime);
    const hourJiaziIndex = JIAZI.findIndex(j => j.name === hourGanzhi);
    
    return {
      time: trueTime,
      ganzhi: {
        year: lunar.getYearInGanZhi(),
        month: lunar.getMonthInGanZhi(),
        day: dayGanzhi,
        hour: hourGanzhi,
      },
      ju: juInfo,
      xunShou: JIAZI[hourJiaziIndex].xunShou,
      hiddenStem: JIAZI[hourJiaziIndex].hiddenStem
    };
  }
}

module.exports = CalendarEngine;
