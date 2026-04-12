const { STEMS, BRANCHES, PALACES, STARS, DOORS, SPIRITS, JIAZI, getTenGod } = require('../data/constants');

class LayoutEngine {
  /**
   * Fly items in Luo Shu order (1-9 or 1-9-8...)
   */
  static flyItems(items, startPalace, direction = '顺') {
    const result = {};
    const palaces = direction === '顺' 
      ? [1, 2, 3, 4, 5, 6, 7, 8, 9] 
      : [1, 9, 8, 7, 6, 5, 4, 3, 2];
    
    const startIndex = palaces.indexOf(startPalace);
    for (let i = 0; i < items.length; i++) {
      const palaceId = palaces[(startIndex + i) % 9];
      result[palaceId] = items[i];
    }
    return result;
  }

  /**
   * Get Zhi Fu and Zhi Shi based on Xun Shou position
   * Ref: Audit Round 8 Logic
   */
  static getZhiFuZhiShi(calendarInfo) {
    const { ju, hiddenStem } = calendarInfo;
    const direction = ju.type === '阳' ? '顺' : '逆';
    
    const stems = ['戊', '己', '庚', '辛', '壬', '癸', '丁', '丙', '乙'];
    // 1. Earth Plate
    const geoPlate = this.flyItems(stems, ju.ju, direction);
    
    // 2. Locate Xun Shou hidden stem
    let xsp = 0;
    for (let pid = 1; pid <= 9; pid++) {
      if (geoPlate[pid] === hiddenStem) {
        xsp = pid;
        break;
      }
    }
    
    // 3. Original attribute mapping
    // Borrow rules (5 -> 2)
    let sourcePalace = xsp;
    if (xsp === 5 && hiddenStem !== '戊') {
      sourcePalace = ju.type === '阳' ? 2 : 8;
    }
    
    const zhiFuStar = STARS[sourcePalace - 1];
    const zhiShiDoor = DOORS[sourcePalace - 1];
    
    return { xunShouPalace: xsp, anchorPalace: sourcePalace, zhiFuStar, zhiShiDoor, geoPlate };
  }

  static generate(calendarInfo) {
    const { ju, ganzhi, xunShou, hiddenStem } = calendarInfo;
    const direction = ju.type === '阳' ? '顺' : '逆';
    const antiDirection = direction === '顺' ? '逆' : '顺';

    // 1. Get Value Star/Door
    const { xunShouPalace, anchorPalace, zhiFuStar, zhiShiDoor, geoPlate } = this.getZhiFuZhiShi(calendarInfo);

    // 2. Heaven Plate (Stars)
    const hourStem = ganzhi.hour[0];
    let hourStemHidden = hourStem;
    if (hourStem === '甲') {
      const hourXun = JIAZI.find(j => j.name === ganzhi.hour).xunShou;
      hourStemHidden = JIAZI.find(j => j.name === hourXun).hiddenStem;
    }
    
    let targetPalaceForZhiFu = 0;
    for (let pid = 1; pid <= 9; pid++) {
      if (geoPlate[pid] === (hourStemHidden === '甲' ? '戊' : hourStemHidden)) {
        targetPalaceForZhiFu = pid;
        break;
      }
    }

    const starList = [];
    const starStartIndex = STARS.indexOf(zhiFuStar);
    for (let i = 0; i < 9; i++) {
        starList.push(STARS[(starStartIndex + i) % 9]);
    }
    const heavenPlate = this.flyItems(starList, targetPalaceForZhiFu, direction);
    if (targetPalaceForZhiFu !== 5) {
      heavenPlate[5] = '天禽';
    }

    // 3. Human Plate (Doors)
    const xunShouBranch = xunShou[1];
    const hourBranch = ganzhi.hour[1];
    const steps = (BRANCHES.indexOf(hourBranch) - BRANCHES.indexOf(xunShouBranch) + 12) % 12;
    
    // Fly the Value Door from its starting palace
    const palaces = direction === '顺' 
      ? [1, 2, 3, 4, 5, 6, 7, 8, 9] 
      : [1, 9, 8, 7, 6, 5, 4, 3, 2];
    const startIdx = palaces.indexOf(xunShouPalace);
    const targetPalaceForZhiShi = palaces[(startIdx + steps) % 9];

    const doorList = [];
    const doorStartIndex = DOORS.indexOf(zhiShiDoor);
    for (let i = 0; i < 9; i++) {
      doorList.push(DOORS[(doorStartIndex + i) % 9]);
    }
    const humanPlate = this.flyItems(doorList, targetPalaceForZhiShi, direction);

    // 4. Spirit Plate
    const spiritPlate = this.flyItems(SPIRITS, targetPalaceForZhiFu, direction);

    // 5. Heavenly Stems Plate
    const heavenStemsPlate = {};
    for (let pid = 1; pid <= 9; pid++) {
      const star = heavenPlate[pid];
      const originalPalaceOfStar = STARS.indexOf(star) + 1;
      heavenStemsPlate[pid] = geoPlate[originalPalaceOfStar];
    }

    // 6. Gather all data
    const dayStem = ganzhi.day[0];
    const finalPalaces = {};
    for (let i = 1; i <= 9; i++) {
      finalPalaces[i] = {
        meta: PALACES[i],
        visible: {
          geoStem: geoPlate[i],
          geoTenGod: getTenGod(dayStem, geoPlate[i]),
          heavenStar: heavenPlate[i],
          heavenStem: heavenStemsPlate[i],
          heavenTenGod: getTenGod(dayStem, heavenStemsPlate[i]),
          humanDoor: humanPlate[i],
          spirit: spiritPlate[i]
        }
      };
    }

    return {
      metadata: { 
        ganzhi, ju, xunShou, dayStem, zhiFuStar, zhiShiDoor, 
        targetPalaceForZhiFu, targetPalaceForZhiShi, xunShouPalace 
      },
      palaces: finalPalaces
    };
  }
}

module.exports = LayoutEngine;
