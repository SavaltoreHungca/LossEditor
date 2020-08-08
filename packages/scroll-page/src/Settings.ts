
export class Settings implements SettingReceiver {
    containerWidth = 300
    containerHeight = 300
    bottomScrollBarInner = true
    bottomScrollBarHeight = 14
    rightScrollBarInner = true
    rightScrollBarWidth = 14
    showTopShallow = true
    showRightShallow = true
    hiddenRightScrollBar = false
    hiddenBottomScrollBar = false
}

export interface SettingReceiver {
    container?: HTMLElement
    containerHeight?: number | string
    containerWidth?: number | string
    bottomScrollBarInner?: boolean
    bottomScrollBarHeight?: number
    rightScrollBarInner?: boolean
    rightScrollBarWidth?: number
    showTopShallow?: boolean
    showRightShallow?: boolean
    hiddenRightScrollBar?: boolean
    hiddenBottomScrollBar?: boolean
}