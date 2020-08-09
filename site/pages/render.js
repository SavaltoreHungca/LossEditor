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
        container: $(idset.editor),
        document: {
            type: 'root',
            sentinelAct: {
                placeholder: 'type something in here',
                style: {
                    color: 'grey'
                }
            },
            children: [{
                type: 'paragraph',
                content: {
                    str: '如果说你是海上的花火,我是兰花的泡沫,这一刻你照亮了我'
                }
            }]
        }
    });
    new ScrollPage({
        container: $(idset.sp),
        containerHeight: 300,
        containerWidth: 300
    });
}