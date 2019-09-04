import store from "@store"
import _ from "lodash";
export default {
    btnTree : (btnName , btnTreeID) =>{
        let btnTree = store.getters['login/btnTree']
        let fliterNum = _.filter(btnTree[btnTreeID], item => {
            return item.cFunUrl === btnName
        }) 
        if (fliterNum && fliterNum.length) {
            return true
        } else {
            return false
        }

    },
}