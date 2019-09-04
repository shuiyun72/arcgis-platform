var path = require('path')
var fs = require('fs');

function copy(src, dst) {
    let paths = fs.readdirSync(src); //同步读取当前目录
    paths.forEach(function (path) {
        var _src = src + '/' + path;
        var _dst = dst + '/' + path;
        fs.stat(_src, function (err, stats) { //stats  该对象 包含文件属性
            if (err) throw err;
            if (stats.isFile()) { //如果是个文件则拷贝 
                let readable = fs.createReadStream(_src); //创建读取流
                let writable = fs.createWriteStream(_dst); //创建写入流
                readable.pipe(writable);
            } else if (stats.isDirectory()) { //是目录则 递归 
                deleteFolderRecursive(_dst)
                checkDirectory(_src, _dst, copy);
            }
        });
    });
}
function checkDirectory(src, dst, callback) {
    fs.access(dst, fs.constants.F_OK, (err) => {
        if (err) {
            fs.mkdirSync(dst);
            callback(src, dst);
        } else {
            callback(src, dst);
        }
    });
};
// 删除非空文件夹
function deleteFolderRecursive(path) {
    if( fs.existsSync(path) ) {
        fs.readdirSync(path).forEach(function(file) {
            var curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            } else { 
                fs.unlinkSync(curPath);
            }
        });
    }
};

const SOURCES_DIRECTORY = path.resolve(__dirname, './dist'); //源目录
const TARGET_DIRECTORY = path.resolve(__dirname, './server/GisPlateformV1.0/GisPlateformV1.0'); //目标目录
checkDirectory(SOURCES_DIRECTORY, TARGET_DIRECTORY, copy);