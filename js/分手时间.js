//需要对应的.t class

const start = new Date('2025-05-20 20:00:00');
const lastChat = '2025.11.23 01:00';

function formatDiff(){
  const now = new Date();
  let diff = now - start;
  const totalDays = Math.floor(diff / 86400000);

  const sec = Math.floor(diff / 1000);
  const min = Math.floor(sec / 60);
  const hour = Math.floor(min / 60);

  let year = now.getFullYear() - start.getFullYear();
  let month = now.getMonth() - start.getMonth();
  let day = now.getDate() - start.getDate();

  if(day < 0){month--;day += new Date(now.getFullYear(),now.getMonth(),0).getDate();}
  if(month < 0){year--;month += 12;}

  const h = hour % 24;
  const mi = min % 60;
  const se = sec % 60;

  let str = "分手时间：2025.5.20 20:00<br>";
str += `最后聊天：${lastChat}<br>时距今日：`;

const timeParts = [];
if (year > 0) timeParts.push(`${year}年`);
if (month > 0 || year > 0) timeParts.push(`${month}月`);
if (day > 0 || month > 0 || year > 0) timeParts.push(`${day}天`);
str += timeParts.join('') + `${h}时${mi}分${se}秒 &nbsp;&nbsp; ${totalDays} 天`;

  

  return str;
}

setInterval(()=>{
  document.querySelector('.t').innerHTML = formatDiff();
},1000);
