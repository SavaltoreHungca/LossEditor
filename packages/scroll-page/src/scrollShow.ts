import { ScrollPage } from './ScrollPage';
import { $$ } from 'utils';

export function scrollShow(ele: HTMLElement, sp: ScrollPage) {
    const { page } = sp.elements;
    if (!page) throw new Error();

    const { left, top } = $$.getRelativePosition(ele, page);
    scrollShowPosition(left, 20, top, 20, sp);
}

export function scrollShowPosition(x: number, xlen: number, y: number, ylen: number, sp: ScrollPage) {
    const { page, window: win, buttomSlider, buttomScrollBar, rightSlider, rightScrollBar } = sp.elements;
    if (!page || !win || !buttomSlider || !buttomScrollBar || !rightSlider || !rightScrollBar) throw new Error();

    const { innerWidth: winWidth, innerHeight: winHeight } = $$.getElementInfo(win);
    const { width: pageWidth, height: pageHeight, left: pageLeft, top: pageTop } = $$.getElementInfo(page);
    const { innerWidth: bBarWidth } = $$.getElementInfo(buttomScrollBar);
    const { innerHeight: rBarHeight } = $$.getElementInfo(rightScrollBar);

    const xOffset = x + pageLeft;
    const yOffset = y + pageTop;
    const xRBOffset = xOffset + xlen;
    const yBBOffset = yOffset + ylen;

    if (
        ((xOffset >= 0 && xOffset < winWidth) || (xRBOffset >= 0 && xRBOffset < winWidth))
        &&
        ((yOffset >= 0 && yOffset < winHeight) || (yBBOffset >= 0 && yBBOffset < winHeight))
    ) { return }

    let nPageLeft = pageLeft - xOffset; if (xOffset > 0) nPageLeft += winWidth - xlen;
    let nPageTop = pageTop - yOffset; if (yOffset > 0) nPageTop += winHeight - ylen;

    if (nPageLeft > 0) nPageLeft = 0;
    if (nPageTop > 0) nPageTop = 0;
    if (nPageLeft < -pageWidth + winWidth) nPageLeft = -pageWidth + winWidth;
    if (nPageTop < -pageHeight + winHeight) nPageTop = -pageHeight + winHeight;

    page.setLeft(nPageLeft);
    buttomSlider.setLeft(-nPageLeft * bBarWidth / pageWidth);
    page.setTop(nPageTop);
    rightSlider.setTop(-nPageTop * rBarHeight / pageHeight);
}