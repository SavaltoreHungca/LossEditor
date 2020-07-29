
export class Settings implements SettingReceiver {
    containerHeight = ''
    containerWidth = ''
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