import instance from  './index'

export default {
    //获取设备实体
    GetEquipment() {
        return instance.get('/Equipment/GetCombobox')
    },
}