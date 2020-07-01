import { Utils } from "utils";

export function isTextNode(node: HTMLElement) {
    return node.getAttribute("data-ele-type") === 'text';
}

export function createElement(type: string) {
    switch (type) {
        case 'table':
            const table = document.createElement("div");
            table.setAttribute("data-ele-type", "table");
            Utils.setStyle(table, { display: 'block', position: 'relative' });
            return table;
        case 'row':
            const row = document.createElement("div");
            row.setAttribute("data-ele-type", "row");
            Utils.setStyle(row, { display: 'block', position: 'relative' });
            return row;
        case 'cell':
            const cell = document.createElement("div");
            cell.setAttribute("data-ele-type", "cell");
            Utils.setStyle(cell, { display: 'block', position: 'absolute', 'box-sizing': 'border-box', 'border': '1px black solid', 'padding': '2px' });
            return cell;
        case 'view-lines':
            const viewLines = document.createElement("div");
            viewLines.setAttribute("data-ele-type", "view-lines");
            Utils.setStyle(viewLines, { display: 'block', position: 'absolute' });
            return viewLines;
        case 'back-layer':
            const backLayer = document.createElement("div");
            backLayer.setAttribute("data-ele-type", "back-layer");
            Utils.setStyle(backLayer, { display: 'block', position: 'absolute' });
            return backLayer;
        case 'paragraph':
            const paragraph = document.createElement("div");
            paragraph.setAttribute("data-ele-type", "paragraph");
            Utils.setStyle(paragraph, { display: 'block', position: 'relative' });
            return paragraph;
        case 'paragraph-line':
            const line = document.createElement("div");
            line.setAttribute("data-ele-type", "paragraph-line");
            Utils.setStyle(line, { display: 'block', position: 'relative', width: 'fit-content' });
            return line;
        case 'text':
            const text = document.createElement('span');
            text.setAttribute("data-ele-type", "text");
            Utils.setStyle(text, { display: 'inline-block', position: 'relative' });
            text.innerText = "";
            return text;
        case 'unit-block':
            const unitblock = document.createElement('span');
            unitblock.setAttribute("data-ele-type", "unit-block");
            Utils.setStyle(unitblock, { display: 'inline-block', position: 'relative' });
            return unitblock;
    }
    throw new Error('unknow type');
}