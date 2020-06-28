import { Utils } from "utils";

export function createElement(type: string){
    switch(type){
        case 'paragraph':
            const paragraph = document.createElement("div");
            paragraph.setAttribute("data-ele-type", "paragraph");
            return paragraph;
        case 'paragraph-line':
            const line = document.createElement("div");
            line.setAttribute("data-ele-type", "paragraph-line");
            Utils.setStyle(line, {
                width: "fit-content"
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