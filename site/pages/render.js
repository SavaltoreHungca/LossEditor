import { Editor } from 'editor';
import { ScrollPage } from 'scroll-page';
import { innerHtml, $$, $ } from 'utils'

export function render(container) {
    const idset = {
        showpanel: $$.randmonId(),
        buttonpanel: $$.randmonId(),
        editor: $$.randmonId(),
        sp: $$.randmonId(),
        mem: $$.randmonId(),
    }

    innerHtml(container, `
        <div id="${idset.buttonpanel}" style="display: flex; flex-direction: column">
            <button>editor</button>
            <button>sp</button>
            <button>mem</button>
        </div>
        <div id="${idset.showpanel}" style="margin-top: 10px; border: 1px dotted grey">
            <div id="${idset.editor}" style="width:150px"></div>
            <div id="${idset.sp}">
                <div style="width: 1000px; height: 1000px">
                </div>
            </div>
            <div id="${idset.mem}"></div>
        </div>
    `)

    new Editor({
        container: $(idset.editor)
    });
    new ScrollPage({
        container: $(idset.sp),
        containerHeight: 300,
        containerWidth: 300
    });
}