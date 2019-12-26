import FileSaver from 'file-saver'
import XLSX from 'xlsx'


//导出excel表格
export function ExportExcel(ClassName, FileName, callback) {
    // 判断要导出的节点中是否有fixed的表格，如果有，转换excel时先将该dom移除，然后append回去，
    let fixTable = document.querySelector('.el-table__fixed') ||
        document.querySelector('.el-table__fixed-right') ||
        document.querySelector('.el-table__fixed-left');
    let wb;
    if (fixTable) {
        wb = XLSX.utils.table_to_book(document.querySelector(ClassName).removeChild(fixTable));
        document.querySelector(ClassName).appendChild(fixTable);
    } else {
        wb = XLSX.utils.table_to_book(document.querySelector(ClassName));
    }
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
        callback && callback instanceof Function && callback()
    } catch (e) {
        if (typeof console !== 'undefined') console.log(e, wbout)
    }
    return wbout
}
//保留三位小数

export function FixFloat(resultValue) {
    return _.map(resultValue, item => {
        for (let prop in item) {
            if (/(^-?|^\+?|^\d?)\d*\.\d{3,}$/.test(item[prop])) {

                item[prop] = Number(item[prop]).toFixed(3)
            }
        }
        return item
    });
}

//获取地图线路及区域中心点
export function GeoTextCenter(GeoText, callback) {

    let x = 0;
    let y = 0;
    _.forEach(JSON.parse(GeoText), r => {
        x += r[0];
        y += r[1];
    });
    let GeoTextX = x / JSON.parse(GeoText).length
    let GeoTextY = y / JSON.parse(GeoText).length
    callback instanceof Function && callback([GeoTextX, GeoTextY])
}