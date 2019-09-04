import FileSaver from 'file-saver'
import XLSX from 'xlsx'


//导出excel表格
export function ExportExcel(ClassName, FileName) {
    let wb = XLSX.utils.table_to_book(document.querySelector(ClassName))
    /* get binary string as output */
    let wbout = XLSX.write(wb, {
        bookType: 'xlsx',
        bookSST: true,
        type: 'array'
    })
    try {
        FileSaver.saveAs(new Blob([wbout], {
            type: 'application/octet-stream'
        }), FileName + '.xlsx')
    } catch (e) {
        if (typeof console !== 'undefined') console.log(e, wbout)
    }
    return wbout
}
//保留三位小数

export function FixFloat(resultValue) {
    return _.map(resultValue,item => {
        for (let prop in item) {
            if (/(^-?|^\+?|^\d?)\d*\.\d{3,}$/.test(item[prop])) {
                
                item[prop] = Number(item[prop]).toFixed(3)
            }
        }
        return item
    });
}

//获取地图线路及区域中心点
export function GeoTextCenter(GeoText,callback) {
    
    let x = 0;
    let y = 0;
    _.forEach(JSON.parse(GeoText), r => {
        x += r[0]; 
        y += r[1];
    });
    let GeoTextX =  x / JSON.parse(GeoText).length
    let GeoTextY =  y / JSON.parse(GeoText).length
    callback instanceof Function && callback([GeoTextX, GeoTextY])
}