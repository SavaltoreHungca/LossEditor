import { createElement } from "../utils";
import { BlockType } from "../render";
import { Utils } from "utils";
import { ScrollPage } from "scroll-page";


interface ImageType extends BlockType {

}

export function renderImage(imageBlock: ImageType, viewLines: HTMLElement) {
    const image = createElement('image');
    const img = document.createElement('img');
    viewLines.appendChild(image);
    image.appendChild(img);
    img.src = imageBlock.content;
    Utils.setStyle(image, {
        width: 100,
        height: 100
    })
    Utils.setStyle(img, {
        width: 1000,
        height: 1000,
        display: 'block',
        position: 'relative'
    })
    new ScrollPage(img, {
        bottomScrollBarHeight: 1,
        rightScrollBarWidth: 1,
        bottomScrollBarInner: false,
        rightScrollBarInner: false,
        showTopShallow: false,
        showRightShallow: false
    })
}