import instance from  './index'
export default {
     // 事件类型分析表格
     EventTypeExcel(startTime, endTime) {
        return instance.get('/InspectionStatistics/GetEventTypeTable', {
            params: {
                startTime: startTime,
                endTime: endTime
            }
        })
    },
    // 事件类型分析图标
    EventTypeChart(startTime, endTime) {
        return instance.get('/InspectionStatistics/GetEventTypePieChart', {
            params: {
                startTime: startTime,
                endTime: endTime
            }
        })
    },
    reportAnalysis(startTime, endTime) {
        return instance.get('/InspectionStatistics/GetUserReportTable', {
            params: {
                startTime: startTime,
                endTime: endTime
            }
        })
    },
    EventTrendExcel(year,startMonth, endMonth) {
        return instance.get('/InspectionStatistics/GetEventTypeTrendTable', {
            params: {
                year:year,
                startMonth: startMonth,
                endMonth: endMonth
            }
        })
    },
    EventTrendChart(year,startMonth, endMonth) {
        return instance.get('/InspectionStatistics/GetEventTypeTrendLineChart', {
            params: {
                year:year,
                startMonth: startMonth,
                endMonth: endMonth
            }
        })
    },
   
}