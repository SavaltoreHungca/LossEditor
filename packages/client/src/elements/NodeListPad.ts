import { MemLoss } from "../MemLoss";
import { Element } from "./Element";
import { innerHtml, $$, $ } from "utils";
import { NodeCategory } from "../repository/transferTypes";
import { creEle } from "./elementTypes";
import { ScrollPage } from "scroll-page";



export interface NodeListPad extends Element {
    renderNodeList: (nodeList: NodeCategory) => void
    updateSize: () => void
}


export function nodeListPadExt(memLoss: MemLoss) {
    return (nodeListPad: Element) => {
        const idSet = {
            newPageButton: $$.randmonId(),
            nodeListPane: $$.randmonId(),
            nodeListContent: $$.randmonId(),
            spContainer: $$.randmonId(),
        }

        innerHtml(nodeListPad, `
            <div id="${idSet.nodeListPane}" style="flex-grow: 1; overflow: hidden">
                <div id="${idSet.spContainer}">
                    <div id="${idSet.nodeListContent}"></div>
                </div>
            </div>
            <div class="background-change-selected"
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
            container: $(idSet.spContainer),
            rightScrollBarWidth: 5,
            showRightShallow: false,
            hiddenRightScrollBar: true,
            hiddenBottomScrollBar: true,
            containerWidth: '100%',
            containerHeight: '100%',
        })

        return {
            renderNodeList: function (category: NodeCategory){
                $(idSet.nodeListContent).innerHTML = '';
                for (let node of category) {
                    const item = creEle(memLoss, 'nodeItem');
                    item.render(node, 1);
                    $(idSet.nodeListContent).appendChild(item);
                }
                this.updateSize()
            },
            updateSize: () => {
                scrollPage.containerSizeFollowOuter();
                scrollPage.contentWidthFollowContainer();
            }
        }
    }

}