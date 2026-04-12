const CalendarEngine = require('./engine/calendar');
const LayoutEngine = require('./engine/layout');

/**
 * Mingfa Flying Disc Qimen Arrangement Engine
 * @param {Object} options
 * @param {number} options.year - Year (e.g. 2024)
 * @param {number} options.month - Month (1-12)
 * @param {number} options.day - Day (1-31)
 * @param {number} options.hour - Hour (0-23)
 * @param {number} options.minute - Minute (0-59)
 * @param {number} [options.longitude=120.0] - Longitude for True Solar Time correction
 * @returns {Object} - Complete arrangement data
 */
function mingfaPaipan({ year, month, day, hour, minute, longitude = 120.0 }) {
  const date = new Date(year, month - 1, day, hour, minute);
  
  // 1. Get Calendar info (True Solar Time, Ganzhi, Ju, Xun Shou)
  const calendarInfo = CalendarEngine.getInfo(date, longitude);
  
  // 2. Generate Layout (Visible and Dark layers)
  const layout = LayoutEngine.generate(calendarInfo);
  
  return layout;
}

module.exports = {
  mingfaPaipan,
  CalendarEngine,
  LayoutEngine
};
