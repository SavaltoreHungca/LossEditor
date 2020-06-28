import { Utils } from "utils";
import { createElement } from './utils';
import { Editor } from "./Editor";

function getContentType(content: any) {
    if (typeof content === 'string') {
        return 'paragraph';
    }
    if (Utils.isArray(content)) {
        if (content.length > 0) {
            if (Utils.isArray(content[0])) {
                return 'table'
            } else {
                throw new Error();
            }
        } else {
            throw new Error("空的数组");
        }
    }
}

function renderParagraph(content: string, editor: Editor) {
    const {viewLines, backLayer} = editor;
    const paragraph = createElement('paragraph');
    viewLines.appendChild(paragraph);
    backLayer.appendChild(paragraph["back"])
    let line;
    let unit;
    let top = 0;
    for (let i = 0; i < content.length; i++) {
        const c = content[i];
        if (c.startsWith("{[")) {

            continue;
        } else {
            if (typeof line === 'undefined') {
                line = createElement('paragraph-line');
                Utils.setStyle(line, {top: top + 'px'});
                Utils.setStyle(line['back'], {top: top + 'px'});
                paragraph.appendChild(line);
                paragraph["back"].appendChild(line["back"]);
            }
            if (typeof unit === 'undefined') {
                unit = createElement('text');
                line.appendChild(unit);
            }

            unit.innerText += c;
            if (line.offsetWidth > paragraph.offsetWidth) {
                const innerText = unit.innerText;
                unit.innerText = innerText.substring(0, innerText.length - 1);
                i--;
                top += line.offsetHeight;
                Utils.setStyle(line['back'], {height: line.offsetHeight + 'px'});
                line = undefined;
                unit = undefined;
            }
        }
    }
    if (line){
        Utils.setStyle(paragraph, {height: top + line.offsetHeight + "px"})
        Utils.setStyle(paragraph['back'], {height: paragraph.offsetHeight + 'px'});
        Utils.setStyle(line['back'], {height: line.offsetHeight + 'px'});
    }
}

export function render(docStructure: Array<any>, editor: Editor) {
    for (let i = 0; i < docStructure.length; i++) {
        const content = docStructure[i];
        switch (getContentType(content)) {
            case "paragraph":
                renderParagraph(content, editor);
                break;
        }
    }

}