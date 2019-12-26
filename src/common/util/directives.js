import Vue from '@vue';

// v-dialogDrag: 弹窗拖拽
Vue.directive('dialogDrag', {
    bind(el, binding, vnode, oldVnode) {
        const dialogHeaderEl = el.querySelector('.el-dialog__header');
        const dragDom = el.querySelector('.el-dialog');
        dialogHeaderEl.style.cursor = 'move';

        // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
        const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null);

        dialogHeaderEl.onmousedown = (e) => {
            // 鼠标按下，计算当前元素距离可视区的距离
            const disX = e.clientX - dialogHeaderEl.offsetLeft;
            const disY = e.clientY - dialogHeaderEl.offsetTop;

            // 获取到的值带px 正则匹配替换
            let styL, styT;

            // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
            if (sty.left.includes('%')) {
                styL = +document.body.clientWidth * (+sty.left.replace(/\%/g, '') / 100);
                styT = +document.body.clientHeight * (+sty.top.replace(/\%/g, '') / 100);
            } else {
                if (sty.left == 'auto') {
                    styL = +sty.x.replace(/\px/g, '');
                    styT = +sty.y.replace(/\px/g, '');
                } else {
                    styL = +sty.left.replace(/\px/g, '');
                    styT = +sty.top.replace(/\px/g, '');
                }
            };
            document.onmousemove = function (e) {
                // 通过事件委托，计算移动的距离 
                const l = e.clientX - disX;
                const t = e.clientY - disY;

                // 移动当前元素  
                dragDom.style.left = `${l + styL}px`;
                dragDom.style.top = `${t + styT}px`;

                //将此时的位置传出去
                //binding.value({x:e.pageX,y:e.pageY})
            };

            document.onmouseup = function (e) {
                document.onmousemove = null;
                document.onmouseup = null;
            };
        }
    }
})

// v-dialogDragWidth: 弹窗宽度拖大 拖小
Vue.directive('dialogDragWidth', {
    bind(el, binding, vnode, oldVnode) {
        const dragDom = binding.value.$el.querySelector('.el-dialog');

        el.onmousedown = (e) => {

            // 鼠标按下，计算当前元素距离可视区的距离
            const disX = e.clientX - el.offsetLeft;

            document.onmousemove = function (e) {
                e.preventDefault(); // 移动时禁用默认事件

                // 通过事件委托，计算移动的距离 
                const l = e.clientX - disX;
                dragDom.style.width = `${l}px`;
            };

            document.onmouseup = function (e) {
                document.onmousemove = null;
                document.onmouseup = null;
            };
        }
    }
})

// 注册一个全局自定义指令 `不允许输入空格&*%等特殊字符`
Vue.directive('filterSpecialChar', {
    update: function (el, { value, modifiers }, vnode) {
        try {
            //此处可以debug看看el具体值是什么,这里演示的是原生控件input,如果是使用element中的<el-input />标签,需要通过 el.children[0] 拿到原生input.
            if (!vnode.data.model.value) {
                return false;
            }
            el.children[0].value = vnode.data.model.value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, "");
            el.children[0].dispatchEvent(new Event(modifiers.lazy ? 'change' : 'input'))
        } catch (e) {
        }
    }
})


// 注册一个全局自定义指令 `不允许输入空格`
Vue.directive('filterSpaceChar', {
    update: function (el, { value, modifiers }, vnode) {
        try {
            //此处可以debug看看el具体值是什么,这里演示的是原生控件input,如果是使用element中的<el-input />标签,需要通过 el.children[0] 拿到原生input.
            if (!vnode.data.model.value) {
                return false;
            }
            el.children[0].value = vnode.data.model.value.replace(/\s+/g, "");
            el.children[0].dispatchEvent(new Event(modifiers.lazy ? 'change' : 'input'))
        } catch (e) {
        }
    }
})



// 注册一个全局自定义指令 `下拉框可懒加载`
Vue.directive('el-select-loadmore', {
    bind(el, binding) {
        const SELECTWRAP_DOM = el.querySelector(
            '.el-select-dropdown .el-select-dropdown__wrap'
        );
        SELECTWRAP_DOM.addEventListener('scroll', function () {
            const condition =
                this.scrollHeight - this.scrollTop <= this.clientHeight;
            if (condition) {
                binding.value();
            }
        });
    }
})
