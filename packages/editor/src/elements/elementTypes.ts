import { ElementInfo } from 'utils'

export type UiNodeTypesMap = {
    'region-container': RegionContainer
    'cursor': Cursor
    'container': Container
    'indentation': Indentation
    'image': Image
    'table': Table
    'row': Row
    'cell': Cell
    'view-lines': ViewLines
    'back-layer': BackLayer
    'paragraph': Paragraph
    'paragraph-line': ParagraphLine
    'text': Text
    'unit-block': UnitBlock
    'content-container': ContentContainer
}
export type UiNodeTypes = keyof UiNodeTypesMap;

export type Style = {
    [index: string]: string | number
}

export interface UiElement extends HTMLElement {
    getStyle(): Style | undefined
    setStyle(style: Style | undefined): void
    getInfo(): ElementInfo
}

export interface Cursor extends UiElement {
    setPosition(left: number, top: number, height?: number): void
}

export interface Container extends UiElement { }
export interface ViewLines extends UiElement { }
export interface BackLayer extends UiElement { }
export interface RegionContainer extends UiElement { }
export interface Indentation extends UiElement { }
export interface ContentContainer extends UiElement { }
export interface Image extends UiElement { }
export interface Table extends UiElement { }
export interface Row extends UiElement { }
export interface Cell extends UiElement { }
export interface Paragraph extends UiElement { }
export interface ParagraphContext extends UiElement {
    setElementStart(start: number): void
    getElementStart(): number
}
export interface Inlineblock extends ParagraphContext {
    setEleUniId(id?: string): void
    getEleUniId(): string
}
export interface ParagraphLine extends ParagraphContext {
    fitContent(): void
    autoWidth(): void
    getParagraph(): Paragraph
}
export interface Text extends Inlineblock { }
export interface UnitBlock extends Inlineblock {
    setUnitBlockType(type: string, value: string): void
    getUnitblockOffset(): number
    getUnitBlockType(): { type: string, value: string }
}

