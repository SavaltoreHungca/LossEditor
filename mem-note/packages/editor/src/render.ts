import { Utils } from "utils";
import { createElement } from './utils';
const katex = require('katex');


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
                }
            }
            if (!Utils.isUndfined(unitStr)) {
                i = i + 1;
                /\[\[(\S+)\(([\S\s]+)\)\]\]/.test(<string>unitStr);
                unit = createElement('unit-block');
                line.appendChild(unit);
                katex.render(RegExp.$2, unit, { throwOnError: false });



                // console.log(RegExp.$1);
            } else {
                i = start;
            }
            continue;
        } else {
            if (typeof unit === 'undefined') {
                unit = createElement('text');
                line.appendChild(unit);
            }
            Utils.getElementInfoBatch((lineInfo, paragraphInfo) => {
                if (paragraphInfo.innerWidth - lineInfo.width < 10) {
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