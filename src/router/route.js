import Gis from './GIS'
import InspectionGIS from './InspectionGIS'
import MaintainGIS from './MaintainGIS'
import SystemSetting from './SystemSetting'
import AppUpload from './AppUpload'

export default [{
  path: "/",
  component: (res) => require(['@features/Home'], res),
  meta: {},
  children: [
    Gis,
    InspectionGIS,
    MaintainGIS,
    SystemSetting,
    AppUpload
  ]
}]