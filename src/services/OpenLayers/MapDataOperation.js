import mapRequest from "@services/OpenLayers/mapRequest";
import EsriJSON from 'ol/format/EsriJSON';
import MapConfigure from "@common/consts/OpenLayersConfig/MapConfigure";
class MapDataOperation {
    constructor(mapObj) {
        this.Map = mapObj;
    }

    GetMapData() {
        let _GData = {
            "rings": [
                [
                    [524553.1905414565, 3958482.028005024],
                    [524667.4907700568, 3958806.9369881754],
                    [525190.3084823589, 3958719.095145825],
                    [525098.2332982086, 3958134.8939774227],
                    [524553.1905414565, 3958482.028005024]
                ]
            ],
            "_ring": 0,
            "spatialReference": {
                "wkid": 4547,
                "latestWkid": 4547
            },
            "cache": {
                "_extent": {
                    "xmin": 524553.1905414565,
                    "ymin": 3958134.8939774227,
                    "xmax": 525190.3084823589,
                    "ymax": 3958806.9369881754,
                    "spatialReference": {
                        "wkid": 4547,
                        "latestWkid": 4547
                    }
                },
                "_partwise": null
            }
        };
        let url = MapConfigure.url.urlPipeLine + '/9/query/?f=json&returnGeometry=true&' +
            'spatialRel=esriSpatialRelIntersects&geometry=' + JSON.stringify(_GData) +
            '&geometryType=esriGeometryPolygon&inSR=4547&outFields=*' +
            '&outSR=4547';
        let esrijsonFormat = new EsriJSON();

        debugger;

        mapRequest.GetGisReset(url).then(resultValue => {
            let sourceData = JSON.parse(resultValue.data);
            var features = esrijsonFormat.readFeatures(sourceData, {
                featureProjection: this.Map._Projection
            });

            console.log(features)
            debugger;
        }).catch(err => {
            console.log(err);
        });

    }



}

export default MapDataOperation;