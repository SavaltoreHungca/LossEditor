import { BlockType, render } from "../render";
import { renderParagraph } from './renderParagraph';

export function renderCommand(viewLines: HTMLElement) {
    render({
        type: 'command',
        indentation: 0,
        style: {
            1: ['', 2],
            2: ['', 3],
        },
        content: 'none',
    }, viewLines);
}