import { ScrollPage } from '../ScrollPage';
import { $$, ElementInfo, extend } from 'utils';
import { ButtomScrollBar, buttomScrollBarExt } from './ButtomScrollBar';
import { Container, containerExt } from './Container';
import { Window, windowExt } from './Window';
import { Page, pageExt } from './Page';
import { RightScrollBar, rightScrollBarExt } from './RightScrollBar';
import { TopShallow, topShallowExt } from './TopShallow';
import { RightShallow, rightShallowExt } from './RightShallow';
import { ButtomSlider, buttomSliderExt } from './ButtomSlider';
import { RightSlider, rightSliderExt } from './RightSlider';
import { Content, contentExt } from './Content';
import { eleExt } from './Element';

export type ElementTypsMap = {
    'buttom-scrollbar': ButtomScrollBar
    'container': Container
    'window': Window
    'page': Page
    'right-scrollbar': RightScrollBar
    'top-shallow': TopShallow
    'right-shallow': RightShallow
    'buttom-slider': ButtomSlider
    'right-slider': RightSlider
    'content': Content
}

export function creEle<K extends keyof ElementTypsMap>(sp: ScrollPage, type: K, ele?: HTMLElement): ElementTypsMap[K] {
    switch (type) {
        case 'container':
            return extend($$.creEle('block'), [eleExt(sp, type), containerExt(sp)]);
        case 'content':
            if (!ele) throw new Error();
            return extend(ele, [eleExt(sp, type), contentExt(sp)]);
        case 'window':
            if (!ele) throw new Error();
            return extend($$.wrapEle('block', ele), [eleExt(sp, type), windowExt(sp)]);
        case 'page':
            if (!ele) throw new Error();
            return extend($$.wrapEle('absolute', ele), [eleExt(sp, type), pageExt(sp)]);
        case 'right-scrollbar':
            if (!ele) throw new Error();
            return extend($$.wrapEle('absolute', ele), [eleExt(sp, type), rightScrollBarExt(sp)]);
        case 'right-slider':
            if (!ele) throw new Error();
            return extend($$.wrapEle('absolute', ele), [eleExt(sp, type), rightSliderExt(sp)]);
        case 'buttom-scrollbar':
            if (!ele) throw new Error();
            return extend($$.wrapEle('absolute', ele), [eleExt(sp, type), buttomScrollBarExt(sp)]);
        case 'buttom-slider':
            if (!ele) throw new Error();
            return extend($$.wrapEle('absolute', ele), [eleExt(sp, type), buttomSliderExt(sp)]);
        case 'top-shallow':
            if (!ele) throw new Error();
            return extend($$.wrapEle('absolute', ele), [eleExt(sp, type), topShallowExt(sp)]);
        case 'right-shallow':
            if (!ele) throw new Error();
            return extend($$.wrapEle('absolute', ele), [eleExt(sp, type), rightShallowExt(sp)]);
    }
    throw new Error();
}