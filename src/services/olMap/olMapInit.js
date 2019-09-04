﻿var olMap = {};
olMap.mapInstanceList = {
    map: undefined,//地图全局变量
    tempLayers: {
        polygonDrawSource: new ol.source.Vector({ wrapX: false }),
        polygonDrawLayer: undefined,
        polygonDraw: undefined,
        pointDrawSource: new ol.source.Vector({ wrapX: false }),
        pointDrawLayer: undefined,
        pointDraw: undefined
    },
    tile: {
        remoteSensingTile: undefined
    },
    layers: {
        pipeLayer: undefined,
        waterMeterLayer: undefined,//水表图层
        valveLayer: undefined,
        valveWellLayer: undefined,
        overhauWellLayer: undefined,
        exhaustWellLayer: undefined,
        waterMeterWellLayer: undefined,
        fireControlWellLayer: undefined,
        fireplugLayer: undefined,
        inspectionAreaPolygonLayer: undefined,
        inspectionRoutePolygonLayer: undefined,
    },
    sources: {
        inspectionAreaPolygonSource: new ol.source.Vector(),
        inspectionRoutePolygonSource: new ol.source.Vector(),
    },
    urls:
    {
        layerImageUrl: undefined,//遥感图层
        pipeUrl: undefined,//管网图层地址
        waterMeterUrl: undefined,//水表图层地址
        valveUrl: undefined,
        valveWellUrl: undefined,
        overhauWellUrl: undefined,
        exhaustWellUrl: undefined,
        waterMeterWellUrl: undefined,
        fireControlWellUrl: undefined,
        fireplugUrl: undefined,
    },
    esrijsonFormat: new ol.format.EsriJSON(),
}
//$(function () {
//    olMap.mapBuilder.initAllLayer();
//});

olMap.setVisibleAllLayers = function (isVisible) {

    var list = Object.keys(olMap.mapInstanceList.layers);
    list.forEach(function (layer) {
        if (olMap.mapInstanceList.layers[layer]) {
            olMap.mapInstanceList.layers[layer].setVisible(isVisible)
        }
    })
}

olMap.mapBuilder = {
    initAllLayer: function () {
        olMap.LoadConfig(olMap.mapBuilder.initMap);
    },
    initMap: function () {
        olMap.mapInstanceList.map = new ol.Map({
            target: 'map',

            view: new ol.View({
                center: [114.2637712620994, 35.751838833343506],
                zoom: 14,
                projection: 'EPSG:4326'
            })
        })
        //加载遥感图层
        olMap.mapBuilder.initRemoteSensingTile()

        //添加管网等图层
        olMap.mapBuilder.initPipeLayer()
        olMap.mapBuilder.initWaterMeterLayer()
        olMap.mapBuilder.initValveLayer()
        olMap.mapBuilder.initFireplugLayer()

        //添加临时绘制图层
        olMap.mapBuilder.initTempLayers()

        //添加巡检区域/路线图层
        olMap.mapBuilder.initInspectionAreaPolygonLayer()
    },

    initInspectionAreaPolygonLayer: function () {
        olMap.mapInstanceList.layers.inspectionAreaPolygonLayer = new ol.layer.Vector({
            source: olMap.mapInstanceList.sources.inspectionAreaPolygonSource
        });
        olMap.mapInstanceList.map.addLayer(olMap.mapInstanceList.layers.inspectionAreaPolygonLayer);
    },

    initTempLayers: function () {
        olMap.mapInstanceList.tempLayers.pointDrawLayer = new ol.layer.Vector({
            source: olMap.mapInstanceList.tempLayers.pointDrawSource,
        });
        olMap.mapInstanceList.map.addLayer(olMap.mapInstanceList.tempLayers.pointDrawLayer);

        olMap.mapInstanceList.tempLayers.polygonDrawLayer = new ol.layer.Vector({
            source: olMap.mapInstanceList.tempLayers.polygonDrawSource,
        });
        olMap.mapInstanceList.map.addLayer(olMap.mapInstanceList.tempLayers.polygonDrawLayer);
    },

    //遥感图层
    initRemoteSensingTile: function () {
        olMap.mapInstanceList.tile.remoteSensingTile = new ol.layer.Tile({
            source: new ol.source.TileArcGISRest({
                url: olMap.mapInstanceList.urls.layerImageUrl,
                projection: "EPSG:4547",
                crossOrigin: 'anonymous'
            })
        });

        olMap.mapInstanceList.map.addLayer(olMap.mapInstanceList.tile.remoteSensingTile);
    },

    initPipeLayer: function () {
        //管网source
        var pipeSource = new ol.source.Vector({
            loader: function (extent, resolution, projection) {
                var url = olMap.mapInstanceList.urls.pipeUrl + '/query/?f=json&' +
                    'returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=' +
                    encodeURIComponent('{"xmin":' + extent[0] + ',"ymin":' +
                        extent[1] + ',"xmax":' + extent[2] + ',"ymax":' + extent[3] +
                        ',"spatialReference":{"wkid":4326}}') +
                    '&geometryType=esriGeometryEnvelope&inSR=4326&outFields=*' +
                    '&outSR=4326';
                $.ajax({
                    url: url, dataType: 'jsonp', success: function (response) {
                        if (response.error) {
                            //alert(response.error.message + '\n' +
                            //    response.error.details.join('\n'));
                        } else {
                            // dataProjection will be read from document
                            var features = olMap.mapInstanceList.esrijsonFormat.readFeatures(response, {
                                featureProjection: projection
                            });
                            if (features.length > 0) {
                                pipeSource.addFeatures(features);
                            }
                        }
                    }
                });
            },
            strategy: new ol.loadingstrategy.tile(new ol.tilegrid.createXYZ({
                tileSize: 512
            }))
        });
        //管网Layer
        olMap.mapInstanceList.layers.pipeLayer = new ol.layer.Vector({
            source: pipeSource,
            style: new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'rgba(0, 112, 255, 255)',
                    width: 1
                })
            }),
        });
        olMap.mapInstanceList.map.addLayer(olMap.mapInstanceList.layers.pipeLayer);
    },

    initWaterMeterLayer: function () {
        //水表source
        var waterMeterSource = new ol.source.Vector({
            loader: function (extent, resolution, projection) {
                var url = olMap.mapInstanceList.urls.waterMeterUrl + '/query/?f=json&' +
                    'returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=' +
                    encodeURIComponent('{"xmin":' + extent[0] + ',"ymin":' +
                        extent[1] + ',"xmax":' + extent[2] + ',"ymax":' + extent[3] +
                        ',"spatialReference":{"wkid":4326}}') +
                    '&geometryType=esriGeometryEnvelope&inSR=4326&outFields=*' +
                    '&outSR=4326&where=equipment_type%3D%27水表%27';
                $.ajax({
                    url: url, dataType: 'jsonp', success: function (response) {
                        if (response.error) {
                        } else {
                            // dataProjection will be read from document
                            var features = olMap.mapInstanceList.esrijsonFormat.readFeatures(response, {
                                featureProjection: projection
                            });
                            if (features.length > 0) {
                                waterMeterSource.addFeatures(features);
                            }
                        }
                    }
                });
            },
            strategy: new ol.loadingstrategy.tile(new ol.tilegrid.createXYZ({
                tileSize: 512
            }))
        });

        //水表layer
        olMap.mapInstanceList.layers.waterMeterLayer = new ol.layer.Vector({
            source: waterMeterSource,
            style: new ol.style.Style({
                image: new ol.style.Icon({
                    scale: 1,
                    src: '/Images/zhanshi/水表.png'
                })
            })
        });
        olMap.mapInstanceList.map.addLayer(olMap.mapInstanceList.layers.waterMeterLayer);
    },

    initValveLayer: function () {
        //阀门source
        var valveSource = new ol.source.Vector({
            loader: function (extent, resolution, projection) {
                var url = olMap.mapInstanceList.urls.waterMeterUrl + '/query/?f=json&' +
                    'returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=' +
                    encodeURIComponent('{"xmin":' + extent[0] + ',"ymin":' +
                        extent[1] + ',"xmax":' + extent[2] + ',"ymax":' + extent[3] +
                        ',"spatialReference":{"wkid":4326}}') +
                    '&geometryType=esriGeometryEnvelope&inSR=4326&outFields=*' +
                    '&outSR=4326&where=equipment_type%3D%27阀门%27';
                $.ajax({
                    url: url, dataType: 'jsonp', success: function (response) {
                        if (response.error) {
                        } else {
                            // dataProjection will be read from document
                            var features = olMap.mapInstanceList.esrijsonFormat.readFeatures(response, {
                                featureProjection: projection
                            });
                            if (features.length > 0) {
                                valveSource.addFeatures(features);
                            }
                        }
                    }
                });
            },
            strategy: new ol.loadingstrategy.tile(new ol.tilegrid.createXYZ({
                tileSize: 512
            }))
        });

        //阀门layer
        olMap.mapInstanceList.layers.valveWellLayer = new ol.layer.Vector({
            source: valveSource,
            style: new ol.style.Style({
                image: new ol.style.Icon({
                    scale: 1,
                    src: '/Images/zhanshi/阀门.png'

                })
            })
        });
        olMap.mapInstanceList.map.addLayer(olMap.mapInstanceList.layers.valveWellLayer);
    },

    initFireplugLayer: function () {
        //阀门source
        var fireplugSource = new ol.source.Vector({
            loader: function (extent, resolution, projection) {
                var url = olMap.mapInstanceList.urls.waterMeterUrl + '/query/?f=json&' +
                    'returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=' +
                    encodeURIComponent('{"xmin":' + extent[0] + ',"ymin":' +
                        extent[1] + ',"xmax":' + extent[2] + ',"ymax":' + extent[3] +
                        ',"spatialReference":{"wkid":4326}}') +
                    '&geometryType=esriGeometryEnvelope&inSR=4326&outFields=*' +
                    '&outSR=4326&where=equipment_type%3D%27消防栓%27';
                $.ajax({
                    url: url, dataType: 'jsonp', success: function (response) {
                        if (response.error) {
                        } else {
                            // dataProjection will be read from document
                            var features = olMap.mapInstanceList.esrijsonFormat.readFeatures(response, {
                                featureProjection: projection
                            });
                            if (features.length > 0) {
                                fireplugSource.addFeatures(features);
                            }
                        }
                    }
                });
            },
            strategy: new ol.loadingstrategy.tile(new ol.tilegrid.createXYZ({
                tileSize: 512
            }))
        });

        //阀门layer
        olMap.mapInstanceList.layers.fireplugLayer = new ol.layer.Vector({
            source: fireplugSource,
            style: new ol.style.Style({
                image: new ol.style.Icon({
                    scale: 1,
                    src: '/Images/zhanshi/消防栓.png'

                })
            })
        });
        olMap.mapInstanceList.map.addLayer(olMap.mapInstanceList.layers.fireplugLayer);
    },
}

olMap.startDrawPoint = function (onEndDraw) {

    olMap.mapInstanceList.tempLayers.pointDraw = new ol.interaction.Draw({
        source: olMap.mapInstanceList.tempLayers.pointDrawSource,
        type: "Point",
        id: "Point"
    });
    olMap.mapInstanceList.map.addInteraction(olMap.mapInstanceList.tempLayers.pointDraw);
    olMap.mapInstanceList.tempLayers.pointDraw.on('drawend', onEndDraw);

}
olMap.endDrawPoint = function () {
    olMap.mapInstanceList.map.removeInteraction(olMap.mapInstanceList.tempLayers.pointDraw);
    olMap.mapInstanceList.tempLayers.pointDrawSource.clear();
    ol.stopDrawing();
}

olMap.startDrawPolygon = function (onEndDraw) {

    olMap.mapInstanceList.tempLayers.pointDraw = new ol.interaction.Draw({
        source: olMap.mapInstanceList.tempLayers.pointDrawSource,
        type: "Polygon",
        id: "Polygon"
    });
    olMap.mapInstanceList.map.addInteraction(olMap.mapInstanceList.tempLayers.pointDraw);
    olMap.mapInstanceList.tempLayers.pointDraw.on('drawend', onEndDraw);
}
ol.stopDrawing = function () {
    olMap.mapInstanceList.map.removeInteraction(olMap.mapInstanceList.tempLayers.pointDraw);
}
olMap.addFeaturesToSource = function (feature, source) {
    if (feature && source)
        source.addFeature(feature);

}

olMap.LoadConfig = function (successFunc) {
    $.ajax({
        url: '../../../..' + SiteUrl + 'URLconfig.xml',
        dataType: 'xml',
        type: 'GET',
        timeout: 2000,
        error: function (xml) {
            //alert("加载XML 文件出错！");
        },
        success: function (xml) {
            $(xml).find("URL").each(function (i) {
                olMap.mapInstanceList.urls.layerImageUrl = $(this).children("urlMapImage").text().trim();
                olMap.mapInstanceList.urls.waterMeterUrl = $(this).children("waterMeterMap").text().trim();
                olMap.mapInstanceList.urls.pipeUrl = $(this).children("urlMap").text().trim();
                olMap.mapInstanceList.urls.valveWellUrl = $(this).children("valveWellMap").text().trim();
                olMap.mapInstanceList.urls.valveUrl = $(this).children("valveMap").text().trim();
                olMap.mapInstanceList.urls.waterMeterWellUrl = $(this).children("waterMeterWellMap").text().trim();
                olMap.mapInstanceList.urls.overhauWellUrl = $(this).children("overhauWellMap").text().trim();
                olMap.mapInstanceList.urls.fireplugUrl = $(this).children("fireplugMap").text().trim();
                olMap.mapInstanceList.urls.fireControlWellUrl = $(this).children("fireControlWellMap").text().trim();
                olMap.mapInstanceList.urls.exhaustWellUrl = $(this).children("exhaustWellMap").text().trim();
            });

            successFunc();
        }

    });

}