import { ScrollPage } from './ScrollPage';
import { $$, stepper } from 'utils';

export function scrollShow(ele: HTMLElement, sp: ScrollPage) {
    const { page } = sp.elements;
    if (!page) throw new Error();

    const { left, top } = $$.getRelativePosition(ele, page);
    scrollShowPosition(left, 80, top, 80, sp);
}

export function scrollShowPosition(x: number, xlen: number, y: number, ylen: number, sp: ScrollPage) {
    yScrollShow(y, ylen, sp);
    xScrollShow(x, xlen, sp);
}

function yScrollShow(y: number, ylen: number, sp: ScrollPage) {
    const { page, window: win, rightSlider, rightScrollBar } = sp.elements;
    if (!page || !win || !rightSlider || !rightScrollBar) throw new Error();

    const { innerHeight: winHeight } = $$.getElementInfo(win);
    const { height: pageHeight, top: pageTop } = $$.getElementInfo(page);
    const { innerHeight: rBarHeight } = $$.getElementInfo(rightScrollBar);

    const yOffset = y + pageTop;
    const yBBOffset = yOffset + ylen;

    if (
        (yOffset >= 0 && yOffset < winHeight) && (yBBOffset >= 0 && yBBOffset < winHeight)
    ) { return }

    let nPageTop = pageTop - yOffset; if (yOffset > 0) nPageTop += winHeight - ylen;
    if (nPageTop > 0) nPageTop = 0;
    if (nPageTop < -pageHeight + winHeight) nPageTop = -pageHeight + winHeight;

    stepper(pageTop, nPageTop, 10, 1, (offset) => {
        page.setTop(offset);
        rightSlider.setTop(-offset * rBarHeight / pageHeight);
    })
}

function xScrollShow(x: number, xlen: number, sp: ScrollPage) {
    const { page, window: win, buttomSlider, buttomScrollBar } = sp.elements;
    if (!page || !win || !buttomSlider || !buttomScrollBar) throw new Error();

    const { innerWidth: winWidth } = $$.getElementInfo(win);
    const { width: pageWidth, left: pageLeft } = $$.getElementInfo(page);
    const { innerWidth: bBarWidth } = $$.getElementInfo(buttomScrollBar);

    const xOffset = x + pageLeft;
    const xRBOffset = xOffset + xlen;

    if (
        (xOffset >= 0 && xOffset < winWidth) && (xRBOffset >= 0 && xRBOffset < winWidth)
    ) { return }

    let nPageLeft = pageLeft - xOffset; if (xOffset > 0) nPageLeft += winWidth - xlen;
    if (nPageLeft > 0) nPageLeft = 0;
    if (nPageLeft < -pageWidth + winWidth) nPageLeft = -pageWidth + winWidth;

    stepper(pageLeft, nPageLeft, 10, 1, (offset) => {
        page.setLeft(offset);
        buttomSlider.setLeft(-offset * bBarWidth / pageWidth);
    })
}