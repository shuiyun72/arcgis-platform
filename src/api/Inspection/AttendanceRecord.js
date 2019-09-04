import instance from  './index'

export default {
    //考勤管理
    AttendanceRecord(startTime,endTime,num,page,deptId,sort,ordering){
        deptId = deptId || ""
        sort = sort || "deptId"
        ordering = ordering || "desc"
        num = num || 50
        page = page || 1
        return instance.get('/AttendanceRecord/Get', {
            params: {
                startTime: String(startTime),
                endTime: String(endTime),
                deptId:String(deptId),
                sort:String(sort),
                ordering:String(ordering),
                num:Number(num),
                page:Number(page)

            }
        })
    },
}