/**
 * Arcgis 图层编辑
 */
import store from '@store';
import * as esriLoader from "esri-loader";
import _ from "lodash";
import { Message, Loading } from 'element-ui';
let loading
function startLoading(option) { //使用Element loading-start 方法 
  let loadOption = Object.assign({
    lock: true,
    text: '加载中……',
    background: 'rgba(0, 0, 0, 0.7)'
  }, option)
  loading = Loading.service(loadOption)
}
function endLoading() {
  //使用Element loading-close 方法 
  loading.close()
}
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
    this.renderLayer = []
  };

  async init() {
    const [
      Point,
      SimpleMarkerSymbol,
      Extent,
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
        "esri/geometry/Point",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/geometry/Extent",
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
      Point,
      SimpleMarkerSymbol,
      Extent,
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
    this.editToolbar.on("graphic-move-stop", evt => {
      if (this.newGraphic.pointEditing) {
        this.editToolbar.moveGraphicGeometry = evt.graphic.geometry
        this.Map.infoWindow.show(evt.graphic.geometry, this.Map.getInfoWindowAnchor(evt.graphic.geometry));
      }
    })
  }

  //多边形标记
  createSimpleFillSymbol(AREA_COLOUR, AREA_TRANSPARENCY, BORDER_COLOUR, BORDER_WIDTH) {
    let areaColor = null
    let line = null

    if (BORDER_COLOUR || AREA_COLOUR) {
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
      }else{
        areaColor = new this.modules.Color([255,255,255,0])
      }
      let width = BORDER_WIDTH || 1
      if (BORDER_COLOUR) {
          line = new this.modules.SimpleLineSymbol(this.modules.SimpleLineSymbol.STYLE_SOLID, new this.modules.Color(BORDER_COLOUR), width)        
      } else {
        line = new this.modules.SimpleLineSymbol(this.modules.SimpleLineSymbol.STYLE_SOLID, new this.modules.Color([255,0,0,0]), width)
      }
      let symbol = new this.modules.SimpleFillSymbol(this.modules.SimpleFillSymbol.STYLE_SOLID,
        line,
        areaColor);
      return symbol;
    }else{
      return null;
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

  featurAddPoint(featureLayerName, geometry, AtrObj = {}, callBack, errorBack) {

    let featureLayer = this.Map.getLayer(featureLayerName);
    let addFeature = new this.modules.Graphic(
      geometry,
      null,
      null,
    );
    featureLayer.applyEdits([addFeature], null, null, result => {
      callBack && _.isFunction(callBack) && callBack(result)
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
    if (!layer.renderer) return;
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
            if (AREA_COLOUR || BORDER_COLOUR) {
              let width = BORDER_WIDTH
              if (!width) {
                width = 1
              }
              let symbol = this.createSimpleFillSymbol(AREA_COLOUR, 1, BORDER_COLOUR, width)
              let value = BORDER_WIDTH + ", " + (BORDER_COLOUR || '')+ ', ' +  (AREA_COLOUR || '');
              uniqueRender.addValue(value, symbol)
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
      this.Map.infoWindow.show(new this.modules.Point(-1, -1, this.Map.spatialReference))
      featureLayer.refresh()
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
    if (this.newGraphic.pointEditing) {
      this.newGraphic.infoWindowHide && this.newGraphic.infoWindowHide.remove()
      this.newGraphic.pointEditing = false
      this.Map.infoWindow.show(new this.modules.Point(-1, -1, this.Map.spatialReference))
    }
  }

  //初始化编辑图层
  initEditing(featureLayerName, evt, changeStation) {
    let featureLayer = this.Map.getLayer(featureLayerName);
    this.newGraphic.featureLayer = featureLayer
    let Graphicslayer = this.Map.getLayer('Graphicslayer');
    if (evt) {
      let symbol = this.createSimpleFillSymbol("rgb(47,50,57)", 0.8, "#303133", 2)
      let addFeature = null
      this.Map.enableSnapping({
        alwaysSnap: true
      }); //启动吸附功能
      let evtObj = {}
      if (!evt.geometry) {
        evtObj = {
          geometry: evt,
          attributes: null
        }
      } else {
        evtObj = evt
      }
      let editMeth = 'EDIT_VERTICES'
      if (changeStation && changeStation === 'point') {
        editMeth = 'MOVE'
        this.newGraphic.editing = false
        this.newGraphic.pointEditing = true
        this.editToolbar.moveGraphicGeometry = evtObj.geometry
        symbol = new this.modules.SimpleMarkerSymbol();
        symbol.setPath("M16,4.938c-7.732,0-14,4.701-14,10.5c0,1.981,0.741,3.833,2.016,5.414L2,25.272l5.613-1.44c2.339,1.316,5.237,2.106,8.387,2.106c7.732,0,14-4.701,14-10.5S23.732,4.938,16,4.938zM16.868,21.375h-1.969v-1.889h1.969V21.375zM16.772,18.094h-1.777l-0.176-8.083h2.113L16.772,18.094z");
        symbol.setColor(new this.modules.Color("#00FFFF"));
      } else {
        this.newGraphic.editing = true
      }
      addFeature = new this.modules.Graphic(
        evtObj.geometry,
        symbol,
        evtObj.attributes
      );
      Graphicslayer.clear()
      Graphicslayer.add(addFeature)
      this.editToolbar.activate(this.modules.Edit[editMeth], Graphicslayer.graphics[0]);
    }

  }

  //地图编辑表单弹窗
  editMapForm(layName, PointInfo, formObj, addState, allDoneCallback, errCallback) {
    let featureLayers = this.Map.getLayer(layName)
    let content = "<form id='BookMarkForm'><table>"
    _.forEach(formObj, item => {
      if (item.edit) {
        content += `<tr><td>${item.label}：</td>
            <td><input onKeypress="javascript:if(event.keyCode == 32)event.returnValue = false;"  type='text' ${item.required ? 'required' : ''} id='${'bookmarklayer' + item.value}' value='${addState ? '' : (PointInfo.attributes && PointInfo.attributes[item.value] || '')}'/></td></tr>`
      }
    })
    content += "</table><button id='saveBookMark' type='submit' >保存</button></form>"
    this.Map.infoWindow.setContent(content);
    this.Map.infoWindow.setTitle(featureLayers.name);
    this.Map.infoWindow.show(PointInfo.geometry, this.Map.getInfoWindowAnchor(PointInfo.geometry));
    addState || this.Map.centerAt(PointInfo.geometry)
    let saveBtn = document.getElementById("BookMarkForm")
    if (!saveBtn) {
      this.Map.infoWindow.on('hide', res => {
        saveBtn = document.getElementById("BookMarkForm")
        this.saveBtnFnc(saveBtn, featureLayers, PointInfo, formObj, addState, allDoneCallback, errCallback)
      })
    } else {
      this.saveBtnFnc(saveBtn, featureLayers, PointInfo, formObj, addState, allDoneCallback, errCallback)
    }


  }

  //保存按钮绑定事件
  saveBtnFnc(saveBtn, featureLayers, PointInfo, formObj, addState, allDoneCallback, errCallback) {
    saveBtn.addEventListener('submit', e => {
      _.forEach(formObj, item => {
        PointInfo.attributes || (PointInfo.attributes = {})
        if (item.edit) {
          let id = "bookmarklayer" + item.value
          let value = document.getElementById(id).value
          if (item.required && !value) {
            return false
          }
          PointInfo.attributes[item.value] = value
        } else if (item.value === 'UPDATED') {
          PointInfo.attributes.UPDATED = (new Date()).valueOf()
        } else if (item.value === 'CREATED') {
          PointInfo.attributes.CREATED = (new Date()).valueOf()
        } else if (item.value === 'CREATEBYNAME') {
          PointInfo.attributes.CREATEBYNAME = store.state.login.cAdminName
        } else if (item.value === 'CREATEBYID') {
          PointInfo.attributes.CREATEBYID = Number(store.state.login.iAdminID)
        }
      })
      startLoading()
      let Graphicslayer = this.Map.getLayer('Graphicslayer');
      Graphicslayer.clear()
      this.newGraphic.pointEditing = false
      this.editToolbar.deactivate();
      if (addState) {
        let graphic = new this.modules.Graphic(
          this.editToolbar.moveGraphicGeometry,
          null,
          PointInfo.attributes
        );
        this.editToolbar.deactivate();
        featureLayers.applyEdits(
          [graphic], // 添加要素信息
          null, // 修改要素信息
          null, // 删除要素信息
          result => {
            endLoading()
            this.Map.infoWindow.show(new this.modules.Point(-1, -1, this.Map.spatialReference))
            this.Map.setInfoWindowOnClick(true); //取消Infowinddow 选中事件
            if (allDoneCallback && allDoneCallback instanceof Function) {
              allDoneCallback(result)
            }
            featureLayers.refresh()
          },
          err => {
            console.log("错误", err);
            endLoading()
            if (errCallback && errCallback instanceof Function) {
              errCallback(err)
            }
          }
        );
        return
      }

      PointInfo.geometry = this.editToolbar.moveGraphicGeometry
      featureLayers.applyEdits(
        null, // 添加要素信息
        [PointInfo], // 修改要素信息
        null, // 删除要素信息
        result => {
          endLoading()
          this.Map.setInfoWindowOnClick(true); //取消Infowinddow 选中事件
          this.Map.infoWindow.show(new this.modules.Point(-1, -1, this.Map.spatialReference))
          if (allDoneCallback && allDoneCallback instanceof Function) {
            allDoneCallback(result)
          }
          featureLayers.refresh()
        },
        err => {
          endLoading()
          if (errCallback && errCallback instanceof Function) {
            errCallback(err)
          }
          console.log("错误", err);
        }
      );
    })
  }


  //地图双击编辑
  mapDbClickEditMapForm(layName, addState, formObj, allDoneCallback, errCallback) {
    this.newGraphic.infoWindowHide = this.Map.infoWindow.on('hide', res => {
      //是否处于编辑状态
      if (this.newGraphic.pointEditing) {
        this.newGraphic.pointEditing = false
        let Graphicslayer = this.Map.getLayer('Graphicslayer');
        Graphicslayer.clear()
        this.editToolbar.deactivate();
        if (errCallback && errCallback instanceof Function) {
          errCallback(false)
        }
      }
    })
    let featureLayers = this.Map.getLayer(layName)
    featureLayers.on('dbl-click', res => {
      this.Map.disableDoubleClickZoom();
      this.initEditing(layName, res.graphic, addState)
      this.editMapForm(layName, res.graphic, formObj, false, allDoneCallback, errCallback)
    })
  }
}

export default MapDataEditing;
