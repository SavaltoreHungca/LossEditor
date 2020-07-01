import { Utils } from "utils";
import { createElement } from './utils';
const katex = require('katex');

const WIDTH_BASE_CHAR = 'a';

function getContentType(content: any) {
    if (typeof content === 'string') {
        return 'paragraph';
    }
    if (Utils.isArray(content)) {
        if (content.length > 0) {
            let isTable = true;
            for (let item of content) {
                if (!Utils.isArray(item)) {
                    isTable = false
                    break;
                }
            }
            return isTable ? 'table' : 'doc';
        } else {
            throw new Error("空的数组");
        }
    }
}

function renderAttachment(content: string, unitBlock: HTMLElement){
    unitBlock.innerHTML = '<i class="fa fa-file-archive-o fa-2x" aria-hidden="true"></i>';
    Utils.setStyle(unitBlock, {
        cursor: 'pointer'
    })
}

function renderCodeOpen(content: string, unitBlock: HTMLElement){
    unitBlock.innerHTML = '<i class="fa fa-codepen fa-2x" aria-hidden="true"></i>';
    Utils.setStyle(unitBlock, {
        cursor: 'pointer'
    })
}

function renderParagraph(content: string, viewLines: HTMLElement) {
    const paragraph = createElement('paragraph');
    viewLines.appendChild(paragraph);
    let line: HTMLElement | undefined = undefined;
    let unit: HTMLElement | undefined = undefined;
    for (let i = 0; i < content.length; i++) {
        const c = content[i];
        if (typeof line === 'undefined') {
            line = createElement('paragraph-line');
            paragraph.appendChild(line);
        }
        if (c === '[' && i + 1 < content.length && content[i + 1] === '[') {
            let unitStr = undefined;
            const start = i;
            for (; i < content.length && i + 1 < content.length; i++) {
                if (content[i] === ']' && content[i + 1] === ']') {
                    unitStr = content.substring(start, i + 2);
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
                        Utils.setStyle(unit, {cursor: 'pointer'});
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
                        Utils.getStrPx(WIDTH_BASE_CHAR, <HTMLElement>line).width) {
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
                    Utils.getStrPx(WIDTH_BASE_CHAR, <HTMLElement>unit).width) {
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

function renderTable(content: Array<Array<any>>, viewLines: HTMLElement) {
    const table = createElement('table');
    const viewLinesInfo = Utils.getElementInfo(viewLines);
    Utils.setStyle(table, { width: viewLinesInfo.innerWidth })
    viewLines.appendChild(table);

    for (let i = 0; i < content.length; i++) {
        const rowdata = content[i];
        const row = createElement('row');
        Utils.setStyle(row, { width: '100%' })
        table.appendChild(row);

        let maxCellHeight = 0
        const cells = [];
        let cellLeftOffset = 0;
        for (let j = 0; j < rowdata.length; j++) {
            const celldata = rowdata[j];
            const cell = createElement('cell');
            cells.push(cell);
            row.appendChild(cell);
            Utils.setStyle(cell, { width: table.offsetWidth / rowdata.length, left: cellLeftOffset });
            cellLeftOffset += table.offsetWidth / rowdata.length;
            render(celldata, cell);
            Utils.getElementInfo(cell, info => {
                maxCellHeight = Math.max(maxCellHeight, info.height);
            })
        }
        for (let item of cells) Utils.setStyle(item, { height: maxCellHeight });
        Utils.setStyle(row, { height: maxCellHeight });
        // top += maxCellHeight;
    }
}

export function render(docStructure: any, viewLines: HTMLElement) {
    const renderSwitch = (content: any) => {
        switch (getContentType(content)) {
            case "paragraph":
                renderParagraph(content, viewLines);
                break;
            case "table":
                renderTable(content, viewLines);
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