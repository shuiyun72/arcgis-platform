import store from "@store"
import _ from "lodash";
export default {
    btnTree: (btnName, btnTreeID) => {
        let btnTree = store.getters['login/btnTree']
        if (store.getters['login/Uniwatercode']) {
            return true
        }
        let fliterNum = _.filter(btnTree[btnTreeID], item => {
            return item.cFunUrl === btnName
        })
        if (fliterNum && fliterNum.length) {
            return true
        } else {
            return false
        }

    },

    isArray: (value) => {
        if (typeof Array.isArray === "function") {
            return Array.isArray(value);
        } else {
            return Object.prototype.toString.call(value) === "[object Array]";
        }
    },

}