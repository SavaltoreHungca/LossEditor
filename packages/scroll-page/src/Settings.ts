
export class Settings implements SettingReceiver {
    containerHeight = ''
    containerWidth = ''
    bottomScrollBarInner = true
    bottomScrollBarHeight = 14
    rightScrollBarInner = true
    rightScrollBarWidth = 14
    showTopShallow = true
    showRightShallow = true
    bottomScrollBarAutoFadeTime = 500
    rightScrollBarAutoFadeTime = 500
    autoUpdateContainerSize = true
    autoUpdatePageSize = true
    contentFollowContainerWidth = false
    contentFollowContainerHeight = false
    hiddenRightScrollBar = false
    hiddenBottomScrollBar = false
    debug = false
}

export interface SettingReceiver {
    containerHeight?: string
    containerWidth?: string
    bottomScrollBarInner?: boolean
    bottomScrollBarHeight?: number
    rightScrollBarInner?: boolean
    rightScrollBarWidth?: number
    showTopShallow?: boolean
    showRightShallow?: boolean
    bottomScrollBarAutoFadeTime?: number
    rightScrollBarAutoFadeTime?: number
    autoUpdateContainerSize?: boolean
    autoUpdatePageSize?: boolean
    contentFollowContainerWidth?: boolean
    contentFollowContainerHeight?: boolean
    hiddenRightScrollBar?: boolean
    hiddenBottomScrollBar?: boolean
    debug?: boolean
}