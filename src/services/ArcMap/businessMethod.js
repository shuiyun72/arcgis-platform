import HedaGisMapInfo from '@api/GIS/HedaGisMapInfo'
import { GISWebData } from "@common/consts/GisConst/MapConfigure";
import * as GisTableColumn from "@common/consts/GisConst/GisTableColumn";
import _ from 'lodash';
const mapObj = {
    map: null,
    clusterLayer: null,
    toolBar: null,
    renderer: null,
}
//数据获取并添加到地图
export function GISWebDataInit(toolBar, map) {
    mapObj.toolBar = toolBar
    mapObj.map = map
    _.forEach(GISWebData, systemWeb => {
        HedaGisMapInfo[systemWeb.methoud]().then(list => {
            //获取弹出框模板并添加到业务图层
            //该图层主要针对业务图层
            let Businesslayer = new toolBar.modules.GraphicsLayer();
            Businesslayer.id = systemWeb.id;
            Businesslayer.visible = systemWeb.ShowStation;
            map.addLayer(Businesslayer);
            let templateJson = {
                title: "${HdTitle}",
                content: "${value}"
            };
            if (systemWeb.PopClumn) {
                let popupContent = [];
                _.forEach(GisTableColumn[systemWeb.PopClumn], ColumnValue => {
                    if (ColumnValue.type === "image") {
                        let src = ColumnValue.field
                        popupContent.push(ColumnValue.text + ": <a  target='blank' href='${" + src + "}'><image style='width:30px;vertical-align:middle;' src='${" + src + "}'/></a>");
                    } else {
                        popupContent.push(ColumnValue.text + ":${" + ColumnValue.field + "}");
                    }
                })
                templateJson.title = "${" + systemWeb.HdTitle + "}"
                templateJson.content = popupContent.join("<br/>")
            }
            let infoTemplate = new toolBar.modules.InfoTemplate(templateJson)
            Businesslayer.infoTemplate = infoTemplate;
            //添加点
            _.forEach(list, item => {
                if(!(item[systemWeb.HdLng] && item[systemWeb.HdLat])){
                    return
                }
                let pt = new toolBar.modules.Point(item[systemWeb.HdLng], item[systemWeb.HdLat])
                let symbol
                if (systemWeb.iconName) {
                    symbol = toolBar.createPictureMarkerSymbol(systemWeb.iconName, 24, 24)
                } else {
                    symbol = toolBar.createPictureMarkerSymbol(item.mapIcon, 24, 24)
                }
                toolBar.geometryService.project([pt], new toolBar.modules.SpatialReference(systemWeb.SpatialReference), p => {
                    let PointSymbol = new toolBar.modules.Point(p[0].x, p[0].y, toolBar.Map.spatialReference)
                    let pointObj
                    if (systemWeb.PopClumn) {
                        pointObj = item
                    } else {
                        pointObj = {
                            HdTitle: item[systemWeb.HdTitle],
                            value: item.value
                        }
                    }
                    Businesslayer.add(new toolBar.modules.Graphic(PointSymbol, symbol, pointObj));
                });
            })
        })
    })
}

//地图是否展示站点数据
export function axiosWebShowOrHidden(toolBar, item) {
    let clusters = mapObj.toolBar.getFeatureLayerByName(item.id);
    clusters.setVisibility(item.ShowStation)
}




// //聚合方法
// export function axiosWebSite(toolBar, map) {
//     mapObj.toolBar = toolBar
//     mapObj.map = map
//     // Save the last selected graphic
//     // mapObj.map.infoWindow.on("selection-change", function () {
//     //     addSelectedFeature();
//     // });
//     simpleMarker()
//     mapObj.toolBar = toolBar
//     mapObj.map = map
//     _.forEach(GISWebData, systemWeb => {
//         HedaGisMapInfo[systemWeb.methoud]().then(list => {
//             //获取弹出框模板并添加到业务图层
//             //该图层主要针对业务图层
//             // let Businesslayer = new toolBar.modules.GraphicsLayer();
//             // Businesslayer.id = systemWeb.id;
//             // Businesslayer.visible = systemWeb.ShowStation;
//             // map.addLayer(Businesslayer);
//             let templateJson = {
//                 title: "${HdTitle}",
//                 content: "${value}"
//             };
//             if (systemWeb.PopClumn) {
//                 let popupContent = [];
//                 _.forEach(GisTableColumn[systemWeb.PopClumn], ColumnValue => {
//                     if (ColumnValue.type === "image") {
//                         let src = ColumnValue.field
//                         popupContent.push(ColumnValue.text + ": <a  target='blank' href='${" + src + "}'><image style='width:30px;vertical-align:middle;' src='${" + src + "}'/></a>");
//                     } else {
//                         popupContent.push(ColumnValue.text + ":${" + ColumnValue.field + "}");
//                     }
//                 })
//                 templateJson.title = "${" + systemWeb.HdTitle + "}"
//                 templateJson.content = popupContent.join("<br/>")
//             }
//             let infoTemplate = new toolBar.modules.InfoTemplate(templateJson)
//             // Businesslayer.infoTemplate = infoTemplate;
//             //添加点
//             let photoInfoData = []
//             _.forEach(list, item => {
//                 let pt = new toolBar.modules.Point(item[systemWeb.HdLng], item[systemWeb.HdLat])
//                 // let symbol
//                 // if(systemWeb.iconName){
//                 //     symbol = toolBar.createPictureMarkerSymbol(systemWeb.iconName, 24, 24)
//                 // }else{
//                 //     symbol = toolBar.createPictureMarkerSymbol(item.mapIcon, 24, 24)
//                 // }
//                 toolBar.geometryService.project([pt], new toolBar.modules.SpatialReference(systemWeb.SpatialReference), p => {
//                     let PointSymbol = new toolBar.modules.Point(p[0].x, p[0].y, toolBar.Map.spatialReference)
//                     let pointObj
//                     if (systemWeb.PopClumn) {
//                         pointObj = item
//                     } else {
//                         pointObj = {
//                             HdTitle: item[systemWeb.HdTitle],
//                             value: item.value
//                         }
//                     }
//                     photoInfoData.push({
//                         "x": PointSymbol.x,
//                         "y": PointSymbol.y,
//                         "attributes": pointObj
//                     })
//                     // Businesslayer.add(new toolBar.modules.Graphic(PointSymbol, symbol, pointObj));
//                 });
//             })
//             addClusterLayer(photoInfoData,systemWeb);
//         })
//     })
// }


// function addClusterLayer(photoInfoData,systemWeb) {
//     //弹出框模板并添加到业务图层
//     let templateJson = {
//         title: "${HdTitle}",
//         content: "${value}"
//     };
//     if (systemWeb.PopClumn) {
//         let popupContent = [];
//         _.forEach(GisTableColumn[systemWeb.PopClumn], ColumnValue => {
//             if (ColumnValue.type === "image") {
//                 let src = ColumnValue.field
//                 popupContent.push(ColumnValue.text + ": <a  target='blank' href='${" + src + "}'><image style='width:30px;vertical-align:middle;' src='${" + src + "}'/></a>");
//             } else {
//                 popupContent.push(ColumnValue.text + ":${" + ColumnValue.field + "}");
//             }
//         })
//         templateJson.title = "${" + systemWeb.HdTitle + "}"
//         templateJson.content = popupContent.join("<br/>")
//     }
//     let infoTemplate = new mapObj.toolBar.modules.InfoTemplate(templateJson)
//     let clusterLayer = new mapObj.toolBar.modules.ClusterLayer({
//         "data": photoInfoData,
//         "distance": 50,
//         "id": systemWeb.id,
//         "labelColor": "#fff",
//         "labelOffset": 10,
//         "resolution": mapObj.map.extent.getWidth() / mapObj.map.width,
//         "singleColor": "#888",
//         "singleTemplate": infoTemplate,
//         "showSingles": true,
//         "singleSymbol": singleSymbol(),
//     });
//     clusterLayer.setRenderer(mapObj.renderer);
//     mapObj.map.addLayer(clusterLayer)
//     mapObj.clusterLayer = mapObj.toolBar.getFeatureLayerByName(systemWeb.id);
//     mapObj.map.on("click", cleanUp);
//     mapObj.clusterLayer.setVisibility(true)
// }


// function cleanUp() {
//     mapObj.map.infoWindow.hide();
//     // mapObj.clusterLayer.clearSingles();
//   }


// function singleSymbol() {
//     return new mapObj.toolBar.modules.SimpleMarkerSymbol("circle", 10,
//         new mapObj.toolBar.modules.SimpleLineSymbol(mapObj.toolBar.modules.SimpleLineSymbol.STYLE_SOLID, new mapObj.toolBar.modules.Color([0, 151, 238, 0.5]), 4),
//         new mapObj.toolBar.modules.Color([255, 255, 255, 0.75])).setOffset(0, 0)
// }
// function simpleMarker() {
//     // let defaultSym = mapObj.toolBar.createPictureMarkerSymbol("observe.png", 24, 24);

//     //   let one =  mapObj.toolBar.createPictureMarkerSymbol("observe.png", 24, 24)
//     let one = singleSymbol();
//     mapObj.renderer = new mapObj.toolBar.modules.ClassBreaksRenderer(one, "clusterCount");
//     let green = new mapObj.toolBar.modules.SimpleMarkerSymbol("circle", 18,
//         new mapObj.toolBar.modules.SimpleLineSymbol(mapObj.toolBar.modules.SimpleLineSymbol.STYLE_SOLID, new mapObj.toolBar.modules.Color([110, 204, 57, 0.5]), 15),
//         new mapObj.toolBar.modules.Color([110, 204, 57, 0.75])).setOffset(0, 15);
//     let blue = new mapObj.toolBar.modules.SimpleMarkerSymbol("circle", 18,
//         new mapObj.toolBar.modules.SimpleLineSymbol(mapObj.toolBar.modules.SimpleLineSymbol.STYLE_SOLID, new mapObj.toolBar.modules.Color([0, 151, 238, 0.5]), 15),
//         new mapObj.toolBar.modules.Color([0, 151, 238, 0.75])).setOffset(0, 15);
//     let red = new mapObj.toolBar.modules.SimpleMarkerSymbol("circle", 18,
//         new mapObj.toolBar.modules.SimpleLineSymbol(mapObj.toolBar.modules.SimpleLineSymbol.STYLE_SOLID, new mapObj.toolBar.modules.Color([255, 64, 45, 0.5]), 15),
//         new mapObj.toolBar.modules.Color([255, 64, 45, 0.75])).setOffset(0, 15);
//     //  mapObj.renderer.addBreak(0, 1, one);
//     mapObj.renderer.addBreak(2, 10, blue);
//     mapObj.renderer.addBreak(10, 20, green);
//     mapObj.renderer.addBreak(20, 1001, red);
// }
