import { Utils } from "utils";

function getContentType(content: any) {
    if (typeof content === 'string') {
        return 'text';
    }
    if (Utils.isArray(content)) {
        if (content.length > 0) {
            if (typeof content[0] === 'string') {
                return 'paragraph'
            } else if (Utils.isArray(content[0])) {
                return 'table'
            } else {
                throw new Error();
            }
        }
    }
}

function splitToSuitLength(container: HTMLElement, str: string) {
    const containerInfo = Utils.getElementInfo(container);
    if (str.length === 0 || Utils.getStrPx(str, container).width <= containerInfo.innerWidth) {
        return [str, ""];
    }
    let critical = str.length / 2;
    while (true) {
        const { width } = Utils.getStrPx(str.substring(0, critical), container);
        const accuracy = containerInfo.innerWidth - width;
        if (accuracy >= 0 && accuracy < 10) {
            return [str.substring(0, critical), str.substring(critical)]
        }
        if (width > containerInfo.innerWidth) {
            critical -= critical/2;
        } else if (width < containerInfo.innerWidth) {
            critical += critical/2;
        }
    }
}

function renderText(text: string, container: HTMLElement) {
    let [str, less] = splitToSuitLength(container, text);
    while (str.length !== 0) {
        const div = document.createElement('div');
        div.innerText = str;
        container.append(div);
        [str, less] = splitToSuitLength(container, less);
    }
}

export function render(docStructure: Array<any>, container: HTMLElement) {
    const containerInfo = Utils.getElementInfo(container);
    for (let i = 0; i < docStructure.length; i++) {
        const content = docStructure[i];
        switch (getContentType(content)) {
            case "text":
                renderText(content, container);
                break;
        }
    }

}