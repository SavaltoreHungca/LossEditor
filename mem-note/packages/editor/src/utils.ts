import { Utils } from "utils";

export function isTextNode(node: HTMLElement){
    return node.getAttribute("data-ele-type") === 'text';
}

export function createElement(type: string){
    switch(type){
        case 'view-lines':
            const viewLines = document.createElement("div");
            Utils.setStyle(viewLines, {
                position: 'absolute',
                width: "100%",
                height: "100%",
                left: 0,
                top: 0,
                'user-select': 'none'
            })
            return viewLines;
        case 'back-layer':
            const backLayer = document.createElement("div");
            Utils.setStyle(backLayer, {
                position: 'absolute',
                width: "100%",
                height: "100%",
                left: 0,
                top: 0,
                "z-index": '-1'
            })
            return backLayer;
        case 'paragraph':
            const paragraph = document.createElement("div");
            paragraph.setAttribute("data-ele-type", "paragraph");
            paragraph["back"] = document.createElement("div");
            Utils.setStyle(paragraph, {
                position: "absolute",
                width: "100%"
            })
            Utils.setStyle(paragraph["back"], {
                position: "absolute",
                width: "100%"
            })
            return paragraph;
        case 'paragraph-line':
            const line = document.createElement("div");
            line.setAttribute("data-ele-type", "paragraph-line");
            line["back"] = document.createElement("div");
            Utils.setStyle(line, {
                position: "absolute",
                cursor: 'text'
            })
            Utils.setStyle(line["back"], {
                position: "absolute",
                width: "100%"
            })
            return line;
        case 'text':
            const text = document.createElement('span');
            text.setAttribute("data-ele-type", "text");
            text.innerText = "";
            return text;
    }
    throw new Error('unknow type');
}