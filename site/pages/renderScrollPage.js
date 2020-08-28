import { ScrollPage } from 'scroll-page';
import { innerHtml, $$, $ } from 'utils';

export function renderScrollPage(container) {
    const idset = {
        spcontainer: $$.randmonId()
    }
    innerHtml(container, `
        <div id="${idset.spcontainer}">
            <div style="height: 200px; width: 200px"></div>
        </div>
    `)

    new ScrollPage({
        container: $(idset.spcontainer),
        hiddenRightScrollBar: true,
        showTopShallow: false,
        containerHeight: 300,
        containerWidth: 300
    });
}