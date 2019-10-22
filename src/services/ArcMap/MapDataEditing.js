/**
 * Arcgis 图层编辑
 */

import * as esriLoader from "esri-loader";
import _ from "lodash";

import { ArcgisJS, ArcgisCSS } from "@common/consts/GisConst/MapConfigure";
esriLoader.loadCss(ArcgisCSS);
const LOAD_MODULES_OPTIONS = {
  url: ArcgisJS
};


class MapDataEditing {
  // 构造函数
  constructor(_map) {
    this.modules = {};
    this.Map = _map;
    this.renderLayer = ['GridLayer', 'WaterAreaLayer']
  };

  async init() {
    const [
      query,
      QueryTask,
      UniqueValueRenderer,
      map,
      on,
      dojoquery,
      ArcGISDynamicMapServiceLayer,
      draw,
      FeatureLayer,
      Graphic,
      taskquery,
      json,
      SimpleLineSymbol,
      SimpleFillSymbol,
      Color,
      Edit,
      esriConfig,
      TemplatePicker,
      arrayUtils,
      event,
      lang,
      parser,
      registry
    ] = await esriLoader.loadModules(
      [
        "esri/tasks/query",
        "esri/tasks/QueryTask",
        "esri/renderers/UniqueValueRenderer",
        "esri/map",
        "dojo/on",
        "dojo/query",
        "esri/layers/ArcGISDynamicMapServiceLayer",
        "esri/toolbars/draw",
        "esri/layers/FeatureLayer",
        "esri/graphic",
        "esri/tasks/query",
        "dojo/json",
        "esri/symbols/SimpleLineSymbol",
        "esri/symbols/SimpleFillSymbol",
        "esri/Color",
        // "dojo/domReady!",
        "esri/toolbars/edit",
        "esri/config",
        "esri/dijit/editing/TemplatePicker",
        "dojo/_base/array",
        "dojo/_base/event",
        "dojo/_base/lang",
        "dojo/parser",
        "dijit/registry",

        "dijit/layout/BorderContainer",
        "dijit/layout/ContentPane",
        "dijit/form/Button",
        "dojo/domReady!"
      ],
      LOAD_MODULES_OPTIONS
    );
    // 在这里将模块变量绑定到实例
    this.modules = {
      query,
      QueryTask,
      UniqueValueRenderer,
      map,
      on,
      dojoquery,
      ArcGISDynamicMapServiceLayer,
      draw,
      FeatureLayer,
      Graphic,
      taskquery,
      json,
      SimpleLineSymbol,
      SimpleFillSymbol,
      Color,
      Edit,
      esriConfig,
      TemplatePicker,
      arrayUtils,
      event,
      lang,
      parser,
      registry
    };
    this.editToolbar = new this.modules.Edit(this.Map);//编辑形状的方法
    this.newGraphic = {};//修改后的属性
    _.forEach(this.renderLayer, item => {
      this.setRender(this.Map.getLayer(item))
    })
    this.editToolbar.on("deactivate", evt => {
      if (this.newGraphic.editing) {
        Object.assign(evt.graphic.attributes, this.newGraphic.obj)
        evt.feature = null;
        evt.graphic.symbol = this.createSimpleFillSymbol(this.newGraphic.obj.AREA_COLOUR, this.newGraphic.obj.AREA_TRANSPARENCY, this.newGraphic.obj.BORDER_COLOUR, this.newGraphic.obj.BORDER_WIDTH)
        let graphic = new this.modules.Graphic(
          evt.graphic.geometry,
          evt.graphic.symbol,
          evt.graphic.attributes
        );
        this.newGraphic.featureLayer.applyEdits(
          null, // 添加要素信息
          [graphic], // 修改要素信息
          null, // 删除要素信息
          result => {
            let Graphicslayer = this.Map.getLayer('Graphicslayer');
            Graphicslayer.clear()
            this.newGraphic.callBack && _.isFunction(this.newGraphic.callBack) && this.newGraphic.callBack()
            console.log("正确", result);
            this.setRender(this.newGraphic.featureLayer, graphic.attributes)
            this.newGraphic.featureLayer.refresh()
          },
          err => {
            let Graphicslayer = this.Map.getLayer('Graphicslayer');
            Graphicslayer.clear()
            this.newGraphic.errorBack && _.isFunction(this.newGraphic.errorBack) && this.newGraphic.errorBack()
            console.log("错误", err);
          }
        );
      }

    });
  }

  //多边形标记
  createSimpleFillSymbol(AREA_COLOUR, AREA_TRANSPARENCY, BORDER_COLOUR, BORDER_WIDTH) {
    let areaColor = null
    let line = null

    if (!BORDER_COLOUR && !AREA_COLOUR) {
      return null
    }
    if (AREA_COLOUR) {
      let rgbRegex = /^rgb\((.*)\)$/
      if (AREA_COLOUR.match(rgbRegex) && AREA_COLOUR.match(rgbRegex).length) {
        AREA_COLOUR = AREA_COLOUR.match(rgbRegex)[1]
        areaColor = new this.modules.Color((AREA_COLOUR + ',' + AREA_TRANSPARENCY).split(','))
      } else {
        rgbRegex = /^rgba\((.*)\)$/
        AREA_COLOUR = AREA_COLOUR.match(rgbRegex)[1]
        areaColor = new this.modules.Color((AREA_COLOUR).split(','))
      }
      if (BORDER_COLOUR) {
        if (BORDER_WIDTH) {
          line = new this.modules.SimpleLineSymbol(this.modules.SimpleLineSymbol.STYLE_SOLID, new this.modules.Color(BORDER_COLOUR), BORDER_WIDTH)
        } else {
          line = new this.modules.SimpleLineSymbol(this.modules.SimpleLineSymbol.STYLE_SOLID, new this.modules.Color(BORDER_COLOUR.split(',')), 1)
        }
      }
      let symbol = new this.modules.SimpleFillSymbol(this.modules.SimpleFillSymbol.STYLE_SOLID,
        line,
        areaColor);
      return symbol;
    }

  }
  /**
   * 将空间数据添加至对应图层
   * @param {添加数据图层} featureLayer
   * @param {结果集} result
   */
  featurAdd(featureLayerName, geometry, AtrObj = {}, callBack, errorBack) {

    let featureLayer = this.Map.getLayer(featureLayerName);
    let symbol = this.createSimpleFillSymbol(AtrObj.AREA_COLOUR, AtrObj.AREA_TRANSPARENCY, AtrObj.BORDER_COLOUR, AtrObj.BORDER_WIDTH)
    let addFeature = new this.modules.Graphic(
      geometry,
      symbol,
      null
    );

    featureLayer.applyEdits([addFeature], null, null, result => {
      AtrObj.OBJECTID = result[0].objectId
      addFeature.attributes = AtrObj
      // let Feature = new this.modules.Graphic(
      //   geometry,
      //   symbol,
      //   AtrObj
      // );
      featureLayer.applyEdits(
        null, // 添加要素信息
        [addFeature], // 修改要素信息
        null, // 删除要素信息
        result => {
          debugger
          callBack && _.isFunction(callBack) && callBack()
          this.setRender(featureLayer, AtrObj)
        },
        err => {
          errorBack && _.isFunction(errorBack) && errorBack()
          console.log("错误", err);
        }
      )
    }, err => {
      errorBack && _.isFunction(errorBack) && errorBack()
      console.log("错误", err);
    })
  }


  /**
     *查询和统计功能中筛选出相应的数据集合，查询出来的内容主要作为查询条件用 
     例如： 管径：80，90，100
           材质：PE，球墨铸铁
           道路：梧桐街，碧桃路
     * @param {*} _GroupField 聚合对应的数据列
     * @param {*} _layerUrl   对应的图层名称
     * @param {*} allDoneCallback 回调函数
     */
  searchOrCountCondition(_GroupField, _layerUrl, allDoneCallback) {
    //图层不能为空
    if (_.isNull(_layerUrl) || _layerUrl === "") {
      console.log("图层字段为空", _layerUrl);
      return;
    }
    //构造查询条件
    let query = new this.modules.query();
    query.outFields = _GroupField;
    query.returnGeometry = false;
    query.where = "1=1";
    query.returnDistinctValues = true;
    let queryTask = new this.modules.QueryTask(_layerUrl);

    queryTask.execute(query, handleQueryResult => {
      allDoneCallback(handleQueryResult);
    }, errorHandler => {
      console.log(errorHandler);
    });
  }


  setRender(layer, AtrObj) {
    if(!layer.renderer) return;
    let uniqueRender
    if (AtrObj) {
      uniqueRender = layer.renderer
      if (AtrObj.AREA_COLOUR && AtrObj.BORDER_COLOUR) {
        let symbol = this.createSimpleFillSymbol(AtrObj.AREA_COLOUR, 1, AtrObj.BORDER_COLOUR, AtrObj.BORDER_WIDTH)
        uniqueRender.addValue(AtrObj.BORDER_WIDTH + ", " + AtrObj.BORDER_COLOUR + ', ' + AtrObj.AREA_COLOUR, symbol)
      }
    } else {
      let defaultSymbol = layer.renderer && layer.renderer.symbol;
      if (!defaultSymbol) {
        defaultSymbol = layer.renderer && layer.renderer.defaultSymbol
      }
      uniqueRender = new this.modules.UniqueValueRenderer(defaultSymbol, 'BORDER_WIDTH', 'BORDER_COLOUR', 'AREA_COLOUR', ', ');
      this.searchOrCountCondition(['BORDER_WIDTH', 'BORDER_COLOUR', 'AREA_COLOUR'], layer.url, res => {
        if (res.features && res.features.length) {
          _.forEach(res.features, item => {
            let { AREA_COLOUR, BORDER_COLOUR, BORDER_WIDTH } = item.attributes
            if (AREA_COLOUR && BORDER_COLOUR) {
              if (!BORDER_WIDTH) {
                BORDER_WIDTH = 1
              }
              let symbol = this.createSimpleFillSymbol(AREA_COLOUR, 1, BORDER_COLOUR, BORDER_WIDTH)
              uniqueRender.addValue(BORDER_WIDTH + ", " + BORDER_COLOUR + ', ' + AREA_COLOUR, symbol)
            }
          })
        }
      })
    }
    layer.setRenderer(uniqueRender)
    layer.refresh()
  }

  featurUpdate(newGraphic, callBack, errorBack) {
    this.newGraphic.obj = newGraphic
    this.newGraphic.callBack = callBack
    this.newGraphic.errorBack = errorBack
    this.editToolbar.deactivate();
  }

  featureDelete(featureLayerName, geometry, callBack, errorBack) {
    let featureLayer = this.Map.getLayer(featureLayerName);
    featureLayer.applyEdits(null, null, [geometry], result => {
      callBack && _.isFunction(callBack) && callBack()
      console.log("正确结果", result);
    }, err => {
      errorBack && _.isFunction(errorBack) && errorBack()
      console.log("错误结果", err);
    })
  }

  initEditcancle() {
    this.newGraphic.editing = false
    let Graphicslayer = this.Map.getLayer('Graphicslayer');
    Graphicslayer.clear()
    this.editToolbar.deactivate();
  }
  //初始化编辑图层
  initEditing(featureLayerName, evt) {
    this.newGraphic.editing = true
    let featureLayer = this.Map.getLayer(featureLayerName);
    this.newGraphic.featureLayer = featureLayer
    let Graphicslayer = this.Map.getLayer('Graphicslayer');
    if (evt) {
      console.log(evt)
      let symbol = this.createSimpleFillSymbol("rgb(255, 255, 0)", 1, "#fff", 2)
      let addFeature = null
      this.Map.enableSnapping({
        alwaysSnap: true
      }); //启动吸附功能
      if (evt.geometry) {
        addFeature = new this.modules.Graphic(
          evt.geometry,
          symbol,
          evt.attributes
        )
        Graphicslayer.clear()
        Graphicslayer.add(addFeature)
        this.editToolbar.activate(this.modules.Edit.EDIT_VERTICES, Graphicslayer.graphics[0]);
      } else {
        addFeature = new this.modules.Graphic(
          evt,
          symbol,
          null
        );
        Graphicslayer.clear()
        Graphicslayer.add(addFeature)
        this.editToolbar.activate(this.modules.Edit.EDIT_VERTICES, Graphicslayer.graphics[0]);
      }
    }

  }
}

export default MapDataEditing;
