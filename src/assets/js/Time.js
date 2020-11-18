  //  获取两个时间之间的所有小时
  export function getHoursBetween(start, end) {
    let startStamp = new Date(start).getTime();
    let endStamp = new Date(end).getTime();

    let result = [`${start.substring(0, 13)}时`];

    while (startStamp + 3600 * 1000 < endStamp) {
      startStamp += 3600 * 1000;

      let time = GMTToTimeStr(startStamp).substring(0, 13);
      result.push(`${time}时`);
    }

    result.push(`${end.substring(0, 13)}时`);

    return result;
  }

  // 获取两个日期间的所有日期
  export function getDiffDate(startTime, endTime) {
    // 初始化日期列表，数组
    let diffdate = new Array();
    let i = 0;

    // 开始日期小于等于结束日期,并循环
    while (startTime <= endTime) {
      let year = startTime.slice(0, 4);
      let month = startTime.slice(5, 7);
      let day = startTime.slice(8, 10);

      let current_month = parseInt(month) < 10 ? `0${parseInt(month)}` : parseInt(month);
      let current_day = parseInt(day) < 10 ? `0${parseInt(day)}` : parseInt(day);

      diffdate[i] = `${year}-${current_month}-${current_day}`;

      // 获取开始日期时间戳
      let stime_ts = new Date(startTime).getTime();

      // 增加一天时间戳后的日期
      let next_date = stime_ts + 24 * 60 * 60 * 1000;

      // 拼接年月日，这里的月份会返回（0-11），所以要+1
      let next_dates_y = new Date(next_date).getFullYear() + "-";
      let next_dates_m =
        new Date(next_date).getMonth() + 1 < 10 ?
        "0" + (new Date(next_date).getMonth() + 1) + "-" :
        new Date(next_date).getMonth() + 1 + "-";
      let next_dates_d =
        new Date(next_date).getDate() < 10 ?
        "0" + new Date(next_date).getDate() :
        new Date(next_date).getDate();

      startTime = next_dates_y + next_dates_m + next_dates_d;
      // 增加数组key
      i++;
    }

    return diffdate;
  }

  // 获取两个日期中所有的月份
  export function getMonthBetween(start, end) {
    let result = [];
    let s = start.split("-");
    let e = end.split("-");
    let min = new Date();
    let max = new Date();

    min.setFullYear(s[0], s[1]);
    max.setFullYear(e[0], e[1]);

    let curr = min;
    while (curr <= max) {
      let month = curr.getMonth();

      let current_month = month < 10 ? `0${month}` : month;

      let str = curr.getFullYear() + "-" + current_month;
      let s = curr.getFullYear() + "-00";

      if (str == s) {
        str = curr.getFullYear() - 1 + "-12";
      }


      result.push(str);
      curr.setMonth(month + 1);
    }
    return result;
  }

  // 将时间戳转化为时间字符串
  export function timeStampToTimeString(timeStamp) {
    const Y = timeStamp.getFullYear()
    const M = (timeStamp.getMonth() + 1).toString().padStart(2, '0')
    const D = timeStamp.getDate().toString().padStart(2, '0')
    const h = timeStamp.getHours().toString().padStart(2, '0')
    const m = timeStamp.getMinutes().toString().padStart(2, '0')
    const s = timeStamp.getSeconds().toString().padStart(2, '0')
    return `${Y}-${M}-${D} ${h}:${m}:${s}`
  }

  export function GMTToTimeStr(time) {
    let date = new Date(time)
    const Y = date.getFullYear();
    const M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
    const D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    const h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    const m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    const s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();

    return `${Y}-${M}-${D} ${h}:${m}:${s}`
  }

  // 将秒转化成“10：20：30”形式
  export function secondsToHMS_string(seconds) {
    let h = Math.floor(seconds / 3600);
    let m = Math.floor(seconds % 3600 / 60);
    let s = Math.floor(seconds % 60);

    h = h > 9 ? h : ('0' + h);
    m = m > 9 ? m : ('0' + m);
    s = s > 9 ? s : ('0' + s);

    return `${h}:${m}:${s}`
  }
