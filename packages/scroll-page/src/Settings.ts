
export class Settings {
    containerHeight: string = ''
    containerWidth: string = ''
    bottomScrollBarInner: boolean = true
    bottomScrollBarHeight: number = 14
    rightScrollBarInner: boolean = true
    rightScrollBarWidth: number = 14
    showTopShallow: boolean = true
    showRightShallow: boolean = true
    bottomScrollBarAutoFadeTime: number = 500
    rightScrollBarAutoFadeTime: number = 500
    autoUpdateContainerSize: boolean = true
    autoUpdatePageSize: boolean = true
    contentFollowContainerWidth: boolean = false
    contentFollowContainerHeight: boolean = false
    hiddenRightScrollBar: boolean = false
    hiddenBottomScrollBar: boolean = false
    debug: boolean = false
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