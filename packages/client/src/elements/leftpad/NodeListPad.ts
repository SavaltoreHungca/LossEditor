import { MemLoss } from "../../MemLoss";
import { Element } from "../Element";
import { innerHtml, $$, $ } from "utils";
import { NodeCategory } from "../../repository/transferTypes";
import { creEle, Pad } from "../elementTypes";
import { ScrollPage } from "scroll-page";
import { repository } from "../../repository/Request";
import { Constants } from "../../Constants";
import { classes } from "../../styleClassSheet";



export interface NodeListPad extends Element, Pad {
    renderNodeList: (nodeList: NodeCategory) => void
    updateSize: () => void
}


export function nodeListPadExt(memLoss: MemLoss) {
    return (nodeListPad: Element) => {
        nodeListPad.setStyle({
            width: '100%',
            height: '100%',
            display: 'flex',
            'flex-direction': 'column',
        });

        let shown = false;
        let initialized = false;

        const idSet = {
            newPageButton: $$.randmonId(),
            nodeListPane: $$.randmonId(),
            nodeListContent: $$.randmonId(),
            spContainer: $$.randmonId(),
        }

        innerHtml(nodeListPad, `
            <div id="${idSet.nodeListPane}" style="flex-grow: 1; height: 0; overflow: hidden">
                <div id="${idSet.spContainer}">
                    <div id="${idSet.nodeListContent}"></div>
                </div>
            </div>
            <div class="${classes.backChSelectd}"
                style="height: 45px; cursor: pointer; box-shadow: rgba(55, 53, 47, 0.09) 0px -1px 0px;display: flex; align-items: center; min-height: 27px; font-size: 14px; width: 100%; color: rgba(55, 53, 47, 0.6); height: 45px;">
                <div
                    style="flex-shrink: 0; flex-grow: 0; border-radius: 3px; color: rgba(55, 53, 47, 0.6); width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; margin-right: 4px;">
                    <i class="fa fa-plus" aria-hidden="true"></i>
                </div>
                <div id="${idSet.newPageButton}"
                    style="flex: 1 1 auto; white-space: nowrap; min-width: 0px; overflow: hidden; text-overflow: ellipsis;">
                    New page
                </div>
            </div>
        `)

        const scrollPage = new ScrollPage({
            lazyInit: true,
            rightScrollBarWidth: 5,
            showRightShallow: false,
            hiddenRightScrollBar: true,
            hiddenBottomScrollBar: true,
            containerWidth: '100%',
            containerHeight: '100%',
        })

        const ext = {
            render: function () {
                shown = true;
                nodeListPad.setStyle({ display: 'flex' })
                scrollPage.init({ container: $(idSet.spContainer) });
                if (!initialized) {
                    repository.getNodeList((status, data) => {
                        switch (status) {
                            case 'processing':
                                break;
                            case 'ok':
                                this.renderNodeList(data);
                                initialized = true;
                                break;
                            case 'failed':
                                break;
                        }
                    });
                }
            },
            disappear: function () {
                shown = false;
                nodeListPad.setStyle({ display: 'none' })
            },
            renderNodeList: function (category: NodeCategory) {
                $(idSet.nodeListContent).innerHTML = '';
                for (let node of category) {
                    const item = creEle(memLoss, 'nodeItem');
                    $(idSet.nodeListContent).appendChild(item);
                    item.render(node, 1);
                }
                this.updateSize()
            },
            updateSize: () => {
                if(shown){
                    scrollPage.containerSizeFollowOuter();
                    scrollPage.contentWidthFollowContainer();
                }
            },
        }

        memLoss.eventManager.bindEventOn(Constants.events.RESIZBAR_RESIZING, () => {
            ext.updateSize();
        });

        return ext;
    }

}