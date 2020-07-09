import { Utils } from "utils";

declare type EleType = 'content-container'
| 'indentation'
| 'image'
| 'table'
| 'row'
| 'cell'
| 'view-lines'
| 'back-layer'
| 'paragraph'
| 'paragraph-line'
| 'text'
| 'unit-block';

export function getType(node: HTMLElement): EleType | undefined{
    const type = node.getAttribute("data-ele-type")
    if (type) {
        return <any>type;
    } else {
        return undefined;
    }
}

export function getNodeFromChild(node: HTMLElement): HTMLElement | undefined{
    let cur = node;
    while (true) {
        const type = getType(cur);
        if(type){
            return cur;
        }
        if(cur.parentElement){
            cur = cur.parentElement;
        }else{
            return undefined;
        }
    }
}

export function getImageBlockFromChild(node: HTMLElement): HTMLElement | undefined{
    const ans = getNodeFromChild(node);
    if(ans && getType(ans) === 'image'){
        return ans;
    }
    return undefined;
}

export function getUnitBlockFromChild(node: HTMLElement): HTMLElement | undefined {
    const ans = getNodeFromChild(node);
    if(ans && getType(ans) === 'unit-block'){
        return ans;
    }
    return undefined;
}

export function createElement(type: EleType) {
    switch (type) {
        case 'content-container':
            const contentContainer = document.createElement("div");
            contentContainer.setAttribute("data-ele-type", "content-container");
            Utils.setStyle(contentContainer, { display: 'block', position: 'relative' });
            return contentContainer;
        case 'indentation':
            const indentation = document.createElement("div");
            indentation.setAttribute("data-ele-type", "indentation");
            Utils.setStyle(indentation, { display: 'block', position: 'relative' });
            return indentation;
        case 'image':
            const image = document.createElement("div");
            image.setAttribute("data-ele-type", "image");
            Utils.setStyle(image, { display: 'block', position: 'relative', cursor: 'pointer' });
            return image;
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
            Utils.setStyle(viewLines, { display: 'block', position: 'relative' });
            return viewLines;
        case 'back-layer':
            const backLayer = document.createElement("div");
            backLayer.setAttribute("data-ele-type", "back-layer");
            Utils.setStyle(backLayer, { display: 'block', position: 'absolute' });
            return backLayer;
        case 'paragraph':
            const paragraph = document.createElement("div");
            paragraph.setAttribute("data-ele-type", "paragraph");
            Utils.setStyle(paragraph, { display: 'block', position: 'relative', cursor: 'text' });
            return paragraph;
        case 'paragraph-line':
            const line = document.createElement("div");
            line.setAttribute("data-ele-type", "paragraph-line");
            Utils.setStyle(line, { display: 'block', position: 'relative', width: 'fit-content', cursor: 'text' });
            return line;
        case 'text':
            const text = document.createElement('span');
            text.setAttribute("data-ele-type", "text");
            Utils.setStyle(text, { display: 'inline-block', position: 'relative', cursor: 'text' });
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