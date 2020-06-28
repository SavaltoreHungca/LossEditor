import { Utils } from "utils";
import { createElement } from './utils';

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

function renderParagraph(content: string, container: HTMLElement) {
    const paragraph = createElement('paragraph');
    container.appendChild(paragraph);

    let line;
    let unit;
    for (let i = 0; i < content.length; i++) {
        const c = content[i];
        if (c.startsWith("{[")) {

            continue;
        } else {
            if (typeof line === 'undefined') {
                line = createElement('paragraph-line');
                paragraph.appendChild(line);
            }
            if (typeof unit === 'undefined') {
                unit = createElement('text');
                line.appendChild(unit);
            }

            unit.innerText += c;
            if (line.clientWidth > container.clientWidth) {
                const innerText = unit.innerText;
                unit.innerText = innerText.substring(0, innerText.length - 1);
                i--;
                line = undefined;
                unit = undefined;
            }
        }
    }

    // let [str, less] = splitToSuitLength(container, text);
    // while (str.length !== 0) {
    //     const div = document.createElement('div');
    //     div.innerText = str;
    //     container.append(div);
    //     [str, less] = splitToSuitLength(container, less);
    // }
}

export function render(docStructure: Array<any>, container: HTMLElement) {
    const containerInfo = Utils.getElementInfo(container);
    for (let i = 0; i < docStructure.length; i++) {
        const content = docStructure[i];
        switch (getContentType(content)) {
            case "paragraph":
                renderParagraph(content, container);
                break;
        }
    }

}