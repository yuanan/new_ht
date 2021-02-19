/* eslint-disable */
var G_Undefined = undefined;
import moment from "moment"
export default {
  /**
   * 日期时间方法
   * nowDateTime 获取当前时间;参数:datetime:YYYY-MM-DD HH:MM:SS;date:YYYY-MM-DD;time:HH:MM:SS
   * getDateBetween 获取快速搜索按钮所需日期
   * getWeekStartAndEnd 获取周对应日期,0为本周,-1为上周,以此类推
   * getSettleDate 获取结算日期，现按三个月计算
   * getInitDate 获取初始化日期
   */
  nowDateTime(str, formatDate) {
    var date = new Date(),
      year = null,
      month = null,
      day = null,
      hour = null,
      minute = null,
      second = null,
      res = null;
    if (formatDate !== G_Undefined) date = new Date(formatDate);
    month =
      date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1;
    year = date.getFullYear();
    day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    minute =
      date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    second =
      date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    switch (str) {
      case "datetime":
        res =
          year +
          "-" +
          month +
          "-" +
          day +
          " " +
          hour +
          ":" +
          minute +
          ":" +
          second;
        break;
      case "date":
        res = year + "-" + month + "-" + day;
        break;
      case "time":
        res = hour + ":" + minute + ":" + second;
        break;
      default:
        return;
    }
    return res;
  },
  
  getDateBetween(datesingle, Busi, str) {
    var sDate = new Date(),
      eDate = new Date(),
      dayArr = [],
      BusiTime = null,
      BusiSec = null,
      NowDate = null,
      NowSec = null,
      RealDate = null,
      RealSec = null;
    BusiTime = Busi.split(":");
    BusiSec = BusiTime[0] * 3600000 + BusiTime[1] * 60000 + BusiTime[2] * 1000;
    NowDate = new Date();
    NowSec = NowDate.getTime();
    RealSec = NowSec - BusiSec;
    RealDate = new Date(RealSec);
    switch (Number(datesingle)) {
      case 1: //昨日
        // if (this.ShowTime(str)) {
          eDate.setDate(RealDate.getDate());
          sDate.setDate(RealDate.getDate() - 1);
          // sDate = this.nowDateTime("date", sDate);
          // eDate = this.nowDateTime("date", eDate);
        // } else {
          // eDate.setDate(RealDate.getDate() - 1);
          // eDate = sDate = this.nowDateTime("date", eDate);
        // }
        dayArr = [sDate, eDate];
        break;
      case 2: //本周
        dayArr = this.getWeekStartAndEnd(0, RealDate);
        //统计报表多日查询不含今日判断
        if (!this.ShowTime(str) && dayArr[0] !== dayArr[1]) {
          eDate = new Date(dayArr[1]);
          eDate.setDate(eDate.getDate() - 1);
          eDate = this.nowDateTime("date", eDate);
          dayArr[1] = eDate;
        }
        break;
      case 3: //上周
        dayArr = this.getWeekStartAndEnd(-1, RealDate);
        break;
      case 4: //本月
        eDate = this.nowDateTime("date", RealDate);
        sDate =
          RealDate.getFullYear().toString() +
          "-" +
          (RealDate.getMonth() + 1).toString() +
          "-1";
        sDate = this.nowDateTime("date", sDate);
        dayArr = [sDate, eDate];
        //统计报表多日查询不含今日判断
        if (!this.ShowTime(str) && dayArr[0] !== dayArr[1]) {
          eDate = new Date(dayArr[1]);
          eDate.setDate(eDate.getDate() - 1);
          eDate = this.nowDateTime("date", eDate);
          dayArr[1] = eDate;
        }
        break;
      case 5: //上月
        eDate = new Date(RealDate.getFullYear(), RealDate.getMonth(), 1);
        eDate.setDate(eDate.getDate() - 1);
        eDate = this.nowDateTime("date", eDate);
        sDate = new Date(eDate);
        sDate =
          sDate.getFullYear().toString() +
          "-" +
          (sDate.getMonth() + 1).toString() +
          "-1";
        sDate = this.nowDateTime("date", sDate);
        dayArr = [sDate, eDate];
        break;
      case 0: //今日
        sDate = moment(Date.now()).format("YYYY-MM-DD")
        eDate = moment(Date.now()).format("YYYY-MM-DD")
        dayArr = [sDate, eDate];
        break;
      default:
        if (this.ShowTime(str)) {
          eDate.setDate(RealDate.getDate());
          sDate.setDate(RealDate.getDate());
          sDate = this.nowDateTime("date", sDate);
          eDate = this.nowDateTime("date", eDate);
          } else {
          eDate.setDate(RealDate.getDate() + 1);
          eDate = sDate = this.nowDateTime("date", eDate);
        }
          // sDate = moment(Date.now()).format("YYYY-MM-DD")
          // eDate = moment(Date.now()).format("YYYY-MM-DD")
          // console.log("sdAte, ", sDate, 'eDate ', eDate)
        dayArr = [sDate, eDate];
        break;
    }
    return dayArr;
  },
  getWeekStartAndEnd(AddWeekCount, RealDate) {
    var startStop = new Array(), //起止日期数组
      millisecond = 1000 * 60 * 60 * 24, //一天的毫秒数
      currentDate = RealDate, //获取当前时间
      week = null,
      minusDay = null,
      currentWeekFirstDay = null,
      currentWeekLastDay = null;
    currentDate = new Date(
      currentDate.getTime() + millisecond * 7 * AddWeekCount
    ); //相对于当前日期AddWeekCount个周的日期
    week = currentDate.getDay(); //返回date是一周中的某一天
    minusDay = week != 0 ? week - 1 : 6; //减去的天数
    currentWeekFirstDay = new Date(
      currentDate.getTime() - millisecond * minusDay
    ); //获得当前周的第一天
    if (AddWeekCount !== 0) {
      //获得当前周的最后一天
      currentWeekLastDay = new Date(
        currentWeekFirstDay.getTime() + millisecond * 6
      );
    } else {
      currentWeekLastDay = new Date(currentDate.getTime());
    }
    //添加至数组
    startStop.push(this.nowDateTime("date", currentWeekFirstDay));
    startStop.push(this.nowDateTime("date", currentWeekLastDay));
    return startStop;
  },
  getSettleDate() {
    var begin = new Date(),
      end = new Date();
    begin.setDate(begin.getDate() - 90);
    begin = this.nowDateTime("date", begin);
    end.setDate(end.getDate() - 1);
    end = this.nowDateTime("date", end);
    return [begin, end];
  },
  getInitDate(Busi) {
    var nowTime = null,
      star = null,
      end = null,
      millisecond = 1000 * 60 * 60 * 24,
      NodeTime = null,
      CurTime = null;
    NodeTime = this.nowDateTime("date") + " " + Busi;
    NodeTime = new Date(NodeTime).getTime();
    CurTime = new Date().getTime();
    if (CurTime <= NodeTime) {
      nowTime = NodeTime - millisecond;
      star = this.nowDateTime("date", nowTime);
      end = this.nowDateTime("date", NodeTime);
    } else {
      nowTime = NodeTime + millisecond;
      star = this.nowDateTime("date", NodeTime);
      end = this.nowDateTime("date", nowTime);
    }
    return [star, end];
  },
  /**
   * 非json数据处理,返回数字
   * StrToPercent 将小数字符串转换成百分数
   * ToNumber 抹掉数字小数点,并添加千分位
   * toThousands 给超过3位的数字添加千分位
   * ToNum 表单提交时处理数据转化为Number数据类型，最多保留两位小数
   * NumProcessing 表单提交时处理百分数数据，最多保留两位小数，返回百分号前的数字
   */

  ShowTime(str) {
    if (
      str === "交易流水" ||
      str === "上下分统计" ||
      str === "上下分明细" ||
      str === "目标上下分" ||
      str === "源上下分" ||
      str === "全部充值统计" ||
      str === "充值统计" ||
      str === "全部代理充值统计" ||
      str === "全部会员充值统计" ||
      str === "直属代理充值统计" ||
      str === "直属会员充值统计" ||
      str === "充值明细" ||
      str === "全部提现统计" ||
      str === "提现统计" ||
      str === "全部代理提现统计" ||
      str === "全部会员提现统计" ||
      str === "直属代理提现统计" ||
      str === "直属会员提现统计" ||
      str === "提现明细" ||
      str === "日志查询" ||
      str === "结算明细"
    )
      return true;
    return false;
  },
  StrToPercent(str) {
    var num = null;
    if (!str) return "0%";
    num = Number(str);
    num = num > 0 ? num : 0;
    num = parseFloat(num) * 100;
    if (num === 0) return "0%"; // 0
    if (num % 1 === 0) return num + "%"; //整数直接返回
    num = num.toFixed(2); //保留两位小数
    if (num.substr(num.length - 1) == 0)
      return num.substring(0, num.length - 1) + "%"; //小数末尾为0
    return num + "%";
  },
  ToNumber(value) {
    var num = null,
      fix = null;
    if (!value) return "0.00";
    if (isNaN(value)) return "0.00";
    value = Number(value);
    value = value.toFixed(2);
    num = this.toThousands(Math.abs(value));
    fix = value.substring(value.indexOf(".") + 1);
    num = num + "." + fix;
    return value < 0 ? "-" + num : num;
  },
  toThousands(num) {
    var _num = Math.floor(num),
      result = "";
    _num = _num.toString();
    while (_num.length > 3) {
      result = "," + _num.slice(-3) + result;
      _num = _num.slice(0, _num.length - 3);
    }
    if (_num) result = _num + result;
    return result;
  },
  ToNum(val) {
    var num;
    if (isNaN(val)) return 0;
    num = parseFloat(val);
    return num;
  },
  NumProcessing(val) {
    var num;
    if (isNaN(val)) return 0;
    num = Math.floor(parseFloat(val) * 10000) / 100;
    return num;
  },

  toChinese(money) {
    var cnNums = new Array(
        "零",
        "壹",
        "贰",
        "叁",
        "肆",
        "伍",
        "陆",
        "柒",
        "捌",
        "玖"
      ), //汉字的数字
      cnIntRadice = new Array("", "拾", "佰", "仟"), //基本单位
      cnIntUnits = new Array("", "万", "亿", "兆"), //对应整数部分扩展单位
      cnDecUnits = new Array("角", "分", "毫", "厘"), //对应小数部分单位
      cnInteger = "整", //整数金额时后面跟的字符
      cnIntLast = "元", //整型完以后的单位
      maxNum = 999999999999999.9999, //最大处理的数字
      integerNum = null, //金额整数部分
      decimalNum = null, //金额小数部分
      chineseStr = "", //输出的中文金额字符串
      parts = null; //分离金额后用的数组，预定义
    if (money == "") return "";
    money = parseFloat(money);
    if (money >= maxNum) return ""; //超出最大处理数字
    if (money == 0) {
      chineseStr = cnNums[0] + cnIntLast + cnInteger;
      return chineseStr;
    }
    //转换为字符串
    money = money.toString();
    if (money.indexOf(".") == -1) {
      integerNum = money;
      decimalNum = "";
    } else {
      parts = money.split(".");
      integerNum = parts[0];
      decimalNum = parts[1].substr(0, 4);
    }
    //获取整型部分转换
    if (parseInt(integerNum, 10) > 0) {
      var zeroCount = 0;
      var IntLen = integerNum.length;
      for (var i = 0; i < IntLen; i++) {
        var n = integerNum.substr(i, 1);
        var p = IntLen - i - 1;
        var q = p / 4;
        var m = p % 4;
        if (n == "0") {
          zeroCount++;
        } else {
          if (zeroCount > 0) chineseStr += cnNums[0];
          //归零
          zeroCount = 0;
          chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
        }
        if (m == 0 && zeroCount < 4) chineseStr += cnIntUnits[q];
      }
      chineseStr += cnIntLast;
    }
    //小数部分
    if (decimalNum != "") {
      var decLen = decimalNum.length;
      for (var i = 0; i < decLen; i++) {
        var n = decimalNum.substr(i, 1);
        if (n != "0") chineseStr += cnNums[Number(n)] + cnDecUnits[i];
      }
    }
    if (chineseStr == "") {
      chineseStr += cnNums[0] + cnIntLast + cnInteger;
    } else if (decimalNum == "") {
      chineseStr += cnInteger;
    }
    return chineseStr;
  },
};
