const { mingfaPaipan } = require('../src/index');

function getRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function formatResult(result) {
  const { metadata } = result;
  return {
    time: `${metadata.ganzhi.year} ${metadata.ganzhi.month} ${metadata.ganzhi.day} ${metadata.ganzhi.hour}`,
    ju: `${metadata.ju.term} ${metadata.ju.type}${metadata.ju.ju}局`,
    xunShou: metadata.xunShou,
    zhiFu: metadata.zhiFuStar,
    zhiShi: metadata.zhiShiDoor
  };
}

function renderBoard(result) {
  const p = result.palaces;
  const layout = [
    [4, 9, 2],
    [3, 5, 7],
    [8, 1, 6]
  ];

  const cellWidth = 14;
  const separator = '  ' + '┌' + '─'.repeat(cellWidth) + '┬' + '─'.repeat(cellWidth) + '┬' + '─'.repeat(cellWidth) + '┐';
  const midSeparator = '  ' + '├' + '─'.repeat(cellWidth) + '┼' + '─'.repeat(cellWidth) + '┼' + '─'.repeat(cellWidth) + '┤';
  const bottomSeparator = '  ' + '└' + '─'.repeat(cellWidth) + '┴' + '─'.repeat(cellWidth) + '┴' + '─'.repeat(cellWidth) + '┘';

  console.log(separator);
  for (let r = 0; r < 3; r++) {
    const row = layout[r];
    let line1 = '  ';
    let line2 = '  ';
    let line3 = '  ';

    for (const pid of row) {
      const palace = p[pid];
      const v = palace.visible;
      const m = palace.meta;
      
      const spirit = v.spirit.padEnd(5);
      const name = `${m.name}${m.id}`.padStart(3);
      line1 += `│ ${spirit}   ${name} `;
      
      const star = v.heavenStar.padEnd(5);
      line2 += `│ ${star}    ${v.heavenStem}  `;
      
      const door = v.humanDoor.padEnd(5);
      line3 += `│ ${door}    ${v.geoStem}  `;
    }
    console.log(line1 + '│');
    console.log(line2 + '│');
    console.log(line3 + '│');
    if (r < 2) console.log(midSeparator);
  }
  console.log(bottomSeparator);
}

const startDate = new Date(2020, 0, 1);
const endDate = new Date(2030, 11, 31);
const testCases = [];

console.log(`${'#'.repeat(80)}`);
console.log(`生成 20 个随机排盘测试用例 (完整盘面)`);
console.log(`${'#'.repeat(80)}\n`);

for (let i = 1; i <= 20; i++) {
  const randomDate = getRandomDate(startDate, endDate);
  const params = {
    year: randomDate.getFullYear(),
    month: randomDate.getMonth() + 1,
    day: randomDate.getDate(),
    hour: randomDate.getHours(),
    minute: randomDate.getMinutes(),
    longitude: 120.0
  };

  try {
    const result = mingfaPaipan(params);
    const summary = formatResult(result);
    console.log(`Case ${String(i).padStart(2, '0')}: ${randomDate.toISOString().replace('T', ' ').substring(0, 16)}`);
    console.log(`  干支: ${summary.time}`);
    console.log(`  局数: ${summary.ju} | 旬首: ${summary.xunShou}`);
    console.log(`  值符: ${summary.zhiFu} | 值使: ${summary.zhiShi}`);
    renderBoard(result);
    console.log(`\n--------------------------------------------------------------------------------\n`);
    testCases.push({ input: params, output: summary });
  } catch (err) {
    console.error(`Case ${i} failed: ${err.message}`);
  }
}

console.log(`\n生成完毕。`);
