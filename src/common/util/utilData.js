export default {

    getCurrentDate(dateString) {
        let date = new Date();
        if (dateString) {
            date = new Date(dateString);
        }
        let year = date.getFullYear(); //获取年
        let month = date.getMonth() + 1; //获取月
        let day = date.getDate(); //获取日
        let weekDay = date.getDay(); // 星期
        let timesStamp = date.getTime(); //getTime() 方法可返回距 1970 年 1 月 1 日之间的毫秒数。
        return {
            year,
            month,
            day,
            weekDay,
            //没用到
            timesStamp
        }
    },
    /**
     * 
     * @param date 传入DayAndWeek（string）和getMonth(object) 
     * @param separator 可以自定义所匹配的格式 eg:// YYYY-MM-DD 2019-01-10
     */
    myformatStr(date, separator) {
        let year;
        let month;
        let day;
        if (typeof date == 'string') {
            year = date.split('/')[0];
            month = date.split('/')[1];
            day = date.split('/')[2];
        } else if (typeof date == 'object') {
            year = date.year;
            month = date.month;
            day = date.day;
        }
        let mStr = month < 10 ? '0' + month : month + '';
        let dStr = day < 10 ? '0' + day : day + '';
        if (separator) {
            return year + separator + mStr + separator + dStr;
        }
        return year + '-' + mStr + '-' + dStr;
    },
    getDayAndWeek(type) {
        let date = new Date();
        let pre = 0;
        let next = 0;
        let startTime = '';
        let endTime = '';
        let begin;
        let over;
        switch (type) {
            case 'day':
                next++;
                break;
            case 'week':
                if (date.getDay() == 0) {
                    pre = date.getDay() - 6;
                    next = date.getDay();
                } else {
                    pre = 1 - date.getDay();
                    next = 7 - date.getDay();
                }
                break;
            case 'lastWeek':
                if (date.getDay() == 0) {
                    pre = -13 - date.getDay();
                    next = -7 - date.getDay();
                } else {
                    pre = -6 - date.getDay();
                    next = 0 - date.getDay();
                }
                break;
            default:
        }
        startTime = new Date(date.getTime() + 24 * 60 * 60 * 1000 * pre).toLocaleDateString();
        endTime = new Date(date.getTime() + 24 * 60 * 60 * 1000 * next).toLocaleDateString();
        begin = this.myformatStr(startTime);
        over = this.myformatStr(endTime);
        return { begin, over };
    },
    /**
     * 获取本月日期范围
     */
    getMonth(last) {
        let date = this.getCurrentDate();
        let monthStart = {};
        let monthEnd = {};
        let begin;
        let over;
        // getMonth 方法返回 0-11，代表1-12月
        let endOfMonth
        if (last) {
            if (date.month) {
                endOfMonth = new Date(date.year, date.month - 1, 0).getDate(); // 获取本月最后一天
                monthEnd = { year: date.year, month: date.month - 1, day: endOfMonth };
                monthStart = { year: date.year, month: date.month - 1, day: 1 };
            } else {
                endOfMonth = new Date(date.year - 1, 11, 0).getDate(); // 获取本月最后一天
                monthEnd = { year: date.year - 1, month: 11, day: endOfMonth };
                monthStart = { year: date.year - 1, month: 11, day: 1 };
            }
        } else {
            endOfMonth = new Date(date.year, date.month, 0).getDate(); // 获取本月最后一天
            monthEnd = { year: date.year, month: date.month, day: endOfMonth };
            monthStart = { year: date.year, month: date.month, day: 1 };

        }
        begin = this.myformatStr(monthStart)
        over = this.myformatStr(monthEnd)
        return { begin, over }
    },

    getLastMonth() {
        return this.getMonth(true)
    },
    /**
     * 获取本年日期范围
     */
    getYear(last) {
        let date = this.getCurrentDate();
        let monthStart = {};
        let monthEnd = {};
        let begin;
        let over;
        let endOfMonth;
        // getMonth 方法返回 0-11，代表1-12月
        let year = date.year
        if (last) {
            year = date.year - 1
        }
        endOfMonth = new Date(year, 12, 0).getDate(); // 获取本月最后一天
        monthEnd = { year: year, month: 12, day: endOfMonth };
        monthStart = { year: year, month: 1, day: 1 };
        begin = this.myformatStr(monthStart)
        over = this.myformatStr(monthEnd)
        return { begin, over }
    },
    getLastYear() {
        return this.getYear(true)
    },

    /**
     * 获取本季度日期范围
     */
    getQuarter(last) {
        let date = this.getCurrentDate();
        let monthStart = {};
        let monthEnd = {};
        let begin;
        let over;
        // getMonth 方法返回 0-11，代表1-12月
        let endOfMonth
        let remainder = (date.month - 1) % 3
        if (last) {
            if (date.month -3 >= 0 ) {
                endOfMonth = new Date(date.year, 2 - remainder-3 + date.month, 0).getDate(); // 获取本月最后一天
                monthEnd = { year: date.year, month: 2 - remainder + date.month-3, day: endOfMonth };
                monthStart = { year: date.year, month: date.month - remainder-3, day: 1 };
            } else {
                endOfMonth = new Date(date.year-1, 2 - remainder-3 + 12 + date.month, 0).getDate(); // 获取本月最后一天
                monthEnd = { year: date.year-1, month: 2 - remainder-3 + 12+ date.month, day: endOfMonth };
                monthStart = { year: date.year-1, month: date.month - remainder-3+12, day: 1 };
            }
        } else {
            endOfMonth = new Date(date.year, 2 - remainder + date.month, 0).getDate(); // 获取本月最后一天
            monthEnd = { year: date.year, month: 2 - remainder + date.month, day: endOfMonth };
            monthStart = { year: date.year, month: date.month - remainder, day: 1 };
        }
        begin = this.myformatStr(monthStart)
        over = this.myformatStr(monthEnd)
        return { begin, over }
    },
    getLastQuarter() {
        return this.getQuarter(true)
    },

}
