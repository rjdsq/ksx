//需要对应的.t class

const start = new Date('2025-05-20 20:00:00');
const lastChat = '2025.11.23 01:00';

function formatDiff() {
  const now = new Date();
  let diff = now - start;
  const totalDays = Math.floor(diff / 86400000);

  const sec = Math.floor(diff / 1000);
  const min = Math.floor(sec / 60);
  const hour = Math.floor(min / 60);
  const day = Math.floor(hour / 24);

  const y = now.getFullYear() - start.getFullYear();
  const m = now.getMonth() - start.getMonth();
  const d = now.getDate() - start.getDate();

  let year = y, month = m, dayNum = d;
  if (dayNum < 0) { month--; dayNum += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
  if (month < 0) { year--; month += 12; }

  const h = hour % 24;
  const mi = min % 60;
  const se = sec % 60;

  let str = '我与阚双雪共计分手：' + totalDays + '天<br>';
  str += '分手距今：';
  if (year > 0) str += year + '年';
  if (month > 0 || year > 0) str += month + '月';
  if (dayNum > 0 || month > 0 || year > 0) str += dayNum + '天';
  str += h + '时' + mi + '分' + se + '秒';
  str += '<br>最后聊天时间：' + lastChat;
  
  return str;
}

setInterval(() => {
  document.querySelector('.t').innerHTML = formatDiff();
}, 1000);