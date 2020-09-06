export function mouseHover(ele: HTMLElement, callback: (status: 'hover' | 'leave') => void) {
    ele.addEventListener('mouseover', () => {
        callback('hover');
    });
    ele.addEventListener('mouseout', () => {
        callback('leave');
    })
}