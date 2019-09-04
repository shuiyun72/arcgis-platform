import matance from  '../Inspection'

export default {
    //事件状态列表
    GetStatusForMantain(){
        return matance.get('/EventStatus/GetStatusForMantain')
    },
}