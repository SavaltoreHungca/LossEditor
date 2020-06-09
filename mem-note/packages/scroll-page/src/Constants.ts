export default class {
    static events = {
        ELEMENTS_CREATED: "ELEMENTS_CREATED", // 页面元素创建成功
        ASSEMBLE_ELEMENTS_FINISH: "ASSEMBLE_ELEMENTS_FINISH", // 元素组装完毕
        INITIAL_ELEMENTS_SIZE_POSITION: "INITIAL_ELEMENTS_SIZE_POSITION", // 初始化元素尺寸
        SCROLLBAR_AUTO_DISAPPEAR: "SCROLLBAR_AUTO_DISAPPEAR", // 滚动条自动消失事件



        CONTAINER_WIDTH_CHANGE: "CONTAINER_WIDTH_CHANGE", // container 宽度改变
        CONTAINER_HEIGHT_CHANGE: "CONTAINER_HEIGHT_CHANGE", // container 高度改变
        BUTTOMSCROLLBAR_WIDTH_CHANGE: "BUTTOMSCROLLBAR_WIDTH_CHANGE",
        BUTTOMSCROLLBAR_HEIGHT_CHANGE: "BUTTOMSCROLLBAR_HEIGHT_CHANGE",
        PAGE_WIDTH_CHANGE: "PAGE_WIDTH_CHANGE",
        PAGE_HEIGHT_CHANGE: "PAGE_HEIGHT_CHANGE",
        RIGHTSCROLLBAR_WIDTH_CHANGE: "RIGHTSCROLLBAR_WIDTH_CHANGE",
        RIGHTSCROLLBAR_HEIGHT_CHANGE: "RIGHTSCROLLBAR_HEIGHT_CHANGE",
        WINDOW_WIDTH_CHANGE: "WINDOW_WIDTH_CHANGE",
        WINDOW_HEIGHT_CHANGE: "WINDOW_HEIGHT_CHANGE",
        TOPSHALLOW_WIDTH_CHANGE: "TOPSHALLOW_WIDTH_CHANGE",
        TOPSHALLOW_HEIGHT_CHANGE: "TOPSHALLOW_HEIGHT_CHANGE",
        RIGHTSHALLOW_WIDTH_CHANGE: "RIGHTSHALLOW_WIDTH_CHANGE",
        RIGHTSHALLOW_HEIGHT_CHANGE: "RIGHTSHALLOW_HEIGHT_CHANGE",
        PAGE_LEFT_CHANGE: "PAGE_LEFT_CHANGE",
        PAGE_TOP_CHANGE: "PAGE_TOP_CHANGE",
    }

    static objs = {
        container: "container",
        window: "window",
        page: "page",
        buttomScrollBar: "buttomScrollBar",
        rightScrollBar: "rightScrollBar",
        topshallow: "topshallow",
        rightshallow: "rightshallow"
    }

    static timeout = {
        BUTTOM_SLIDER_FADE_TIMEOUT: "BUTTOM_SLIDER_FADE_TIMEOUT",
        RIGHT_SLIDER_FADE_TIMEOUT: "RIGHT_SLIDER_FADE_TIMEOUT"
    }
}