declare type UiNodeTypes = 'content-container' | 'indentation' | 'image' | 'table' | 'row' | 'cell' | 'view-lines' | 'back-layer' | 'paragraph' | 'paragraph-line' | 'text' | 'unit-block'
import { Style } from './render/paragraph'

export interface UiElement extends HTMLElement{
    getStyle(): Style | undefined
    setStyle(style: Style): void
}

export interface DocNode extends HTMLElement{

}

export interface Cursor extends UiElement { }
export interface Container extends UiElement { }
export interface ViewLines extends UiElement { }
export interface BackLayer extends UiElement { }
export interface RegionContainer extends UiElement { }


