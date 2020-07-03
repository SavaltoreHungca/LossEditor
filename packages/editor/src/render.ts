import { Utils } from "utils";
import { createElement } from './utils';
import { ScrollPage } from 'scroll-page';
import { Constants } from "./Constants";
const katex = require('katex');

interface BlockType {
    type: string,
    indentation: number,
    content: any
}

interface TextType extends BlockType {

}

interface TableType extends BlockType {

}

interface ImageType extends BlockType {

}

function getContentType(content: any) {
    if (Utils.isObject(content)) {
        return content.type;
    }
    if (Utils.isArray(content)) {
        return 'doc';
    }
}

function renderAttachment(content: string, unitBlock: HTMLElement) {
    unitBlock.innerHTML = '<i class="fa fa-file-archive-o fa-2x" aria-hidden="true"></i>';
    Utils.setStyle(unitBlock, {
        cursor: 'pointer'
    })
}

function renderCodeOpen(content: string, unitBlock: HTMLElement) {
    unitBlock.innerHTML = '<i class="fa fa-codepen fa-2x" aria-hidden="true"></i>';
    Utils.setStyle(unitBlock, {
        cursor: 'pointer'
    })
}

function renderParagraph(textBlock: TextType, viewLines: HTMLElement) {
    const paragraph = createElement('paragraph');
    viewLines.appendChild(paragraph);
    let line: HTMLElement | undefined = undefined;
    let unit: HTMLElement | undefined = undefined;
    for (let i = 0; i < textBlock.content.length; i++) {
        const c = textBlock.content[i];
        if (typeof line === 'undefined') {
            line = createElement('paragraph-line');
            paragraph.appendChild(line);
        }
        if (c === '[' && i + 1 < textBlock.content.length && textBlock.content[i + 1] === '[') {
            let unitStr = undefined;
            const start = i;
            for (; i < textBlock.content.length && i + 1 < textBlock.content.length; i++) {
                if (textBlock.content[i] === ']' && textBlock.content[i + 1] === ']') {
                    unitStr = textBlock.content.substring(start, i + 2);
                    break;
                }
            }
            if (!Utils.isUndfined(unitStr)) {
                i++;
                /\[\[(\S+)\(([\S\s]+)\)\]\]/.test(<string>unitStr);
                unit = createElement('unit-block');
                line.appendChild(unit);
                switch (RegExp.$1) {
                    case 'formula':
                        Utils.setStyle(unit, { cursor: 'pointer' });
                        katex.render(RegExp.$2, unit, { throwOnError: false });
                        break;
                    case 'attachment':
                        renderAttachment(RegExp.$2, unit);
                        break;
                    case 'code':
                        renderCodeOpen(RegExp.$2, unit);
                        break;
                }
                Utils.getElementInfoBatch((lineInfo, paragraphInfo) => {
                    if (paragraphInfo.innerWidth - lineInfo.width <
                        Utils.getStrPx(Constants.WIDTH_BASE_CHAR, <HTMLElement>line).width) {
                        if (lineInfo.width > paragraphInfo.innerWidth) {
                            line?.removeChild(<HTMLElement>unit);
                            i = start - 1;
                        }
                        line = undefined;
                    }
                }, line, paragraph);
                unit = undefined;
            } else {
                i = start - 1;
            }
        } else {
            if (typeof unit === 'undefined') {
                unit = createElement('text');
                line.appendChild(unit);
            }
            Utils.getElementInfoBatch((lineInfo, paragraphInfo) => {
                if (paragraphInfo.innerWidth - lineInfo.width <
                    Utils.getStrPx(Constants.WIDTH_BASE_CHAR, <HTMLElement>unit).width) {
                    if (lineInfo.width > paragraphInfo.innerWidth) {
                        const innerText = (<HTMLElement>unit).innerText;
                        (<HTMLElement>unit).innerText = innerText.substring(0, innerText.length - 1);
                        i--
                    }
                    i--;
                    line = undefined;
                    unit = undefined;
                } else {
                    (<HTMLElement>unit).innerText += c;
                }
            }, line, paragraph);
        }
    }
}

function renderTable(tableBlock: TableType, viewLines: HTMLElement) {
    const viewLinesInfo = Utils.getElementInfo(viewLines);
    const table = createElement('table');
    viewLines.appendChild(table);
    Utils.setStyle(table, { width: viewLinesInfo.innerWidth });

    const tableInfo = Utils.getElementInfo(table);
    for (let i = 0; i < tableBlock.content.length; i++) {
        const rowdata = tableBlock.content[i];
        const row = createElement('row');
        Utils.setStyle(row, { width: tableInfo.width })
        table.appendChild(row);
        const rowInfo = Utils.getElementInfo(row);
        let maxCellHeight = 0
        const cells = [];
        let cellLeftOffset = 0;
        for (let j = 0; j < rowdata.length; j++) {
            const celldata = rowdata[j];
            const cell = createElement('cell');
            cells.push(cell);
            row.appendChild(cell);
            Utils.setStyle(cell, { width: rowInfo.innerWidth / rowdata.length, left: cellLeftOffset });
            cellLeftOffset += rowInfo.innerWidth / rowdata.length;
            render(celldata, cell);
            Utils.getElementInfo(cell, info => {
                maxCellHeight = Math.max(maxCellHeight, info.height);
            })
        }
        for (let item of cells) Utils.setStyle(item, { height: maxCellHeight });
        Utils.setStyle(row, { height: maxCellHeight });
    }
}

function renderImage(imageBlock: ImageType, viewLines: HTMLElement) {
    const image = createElement('image');
    const img = document.createElement('img');
    viewLines.appendChild(image);
    image.appendChild(img);
    img.src = imageBlock.content;
    Utils.setStyle(image, {
        width: 'fit-content'
    })
    Utils.setStyle(img, {
        width: 1000,
        height: 1000,
        display: 'block',
        position: 'relative'
    })
    new ScrollPage(img, {
        containerHeight: '100px',
        containerWidth: '100px',
        bottomScrollBarHeight: 1,
        rightScrollBarWidth: 1,
        bottomScrollBarInner: false,
        rightScrollBarInner: false,
        showTopShallow: false,
        showRightShallow: false
    })
}

function indentationWrap(content: BlockType, viewLines: HTMLElement): HTMLElement {
    const indentation = createElement('indentation');
    const contentContainer = createElement('content-container');
    viewLines.appendChild(indentation);
    indentation.appendChild(contentContainer);

    const viewLinesInfo = Utils.getElementInfo(viewLines);
    const paddingLeft = Constants.INDENTATION_WIDTH * (content.indentation || 0);
    Utils.setStyle(indentation, {
        'padding-left': paddingLeft,
    })
    Utils.setStyle(contentContainer, {
        width: viewLinesInfo.innerWidth - paddingLeft
    })
    return contentContainer;
}

export function render(docStructure: any, viewLines: HTMLElement) {
    
    const renderSwitch = (content: any) => {
        switch (getContentType(content)) {
            case "paragraph":
                renderParagraph(content, indentationWrap(content, viewLines));
                break;
            case "table":
                renderTable(content, indentationWrap(content, viewLines));
                break;
            case "image":
                renderImage(content, indentationWrap(content, viewLines));
                break;
        }
    }
    if (getContentType(docStructure) === 'doc') {
        for (let i = 0; i < docStructure.length; i++) {
            const content = docStructure[i];
            renderSwitch(content);
        }
    } else {
        renderSwitch(docStructure);
    }
}