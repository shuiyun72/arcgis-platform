export default {

    getCurrentDate(dateString) {
        let date = new Date();
        if(dateString){
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
                if(date.getDay() == 0){
                    pre = date.getDay() - 6;
                    next = date.getDay();
                }else{
                    pre = 1 - date.getDay();
                    next = 7 - date.getDay();   
                }
                break;
            case 'lastWeek':
                if(date.getDay() == 0){
                    pre = -13 - date.getDay();
                    next = -7 - date.getDay();
                }else{
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
    getMonth() {
        let date = this.getCurrentDate();
        let monthStart = {};
        let monthEnd = {};
        let begin;
        let over;
        // getMonth 方法返回 0-11，代表1-12月
        let endOfMonth = new Date(date.year, date.month, 0).getDate(); // 获取本月最后一天
        monthEnd = { year: date.year, month: date.month, day: endOfMonth };
        monthStart = { year: date.year, month: date.month, day: 1 };
        begin = this.myformatStr(monthStart)
        over = this.myformatStr(monthEnd)
        return { begin, over }
    },
}
