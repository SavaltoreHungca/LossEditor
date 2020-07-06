
export class Settings {
    containerHeight: string = '300px'
    containerWidth: string = '400px'
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
    debug?: boolean
}