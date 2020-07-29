import Constants from "../Constants";
import { ScrollPage } from "../ScrollPage";
import { assembleElementsAndInitializeUi } from "./assembleElementsAndInitializeUi";
import { traceContainerSizeChange } from "./traceContainerSizeChange";
import { setShallow } from "./setShallow";
import { setScrollBar } from "./setScrollBar";
import { sliderDragingBehavior } from "./sliderDragingBehavior";
import { makeWinScrollable } from "./makeWinScrollable";
import { shallowBehaviorWhenScroll } from "./shallowBehaviorWhenScroll";

export function registryEvents(scrollPage: ScrollPage) {
    assembleElementsAndInitializeUi(scrollPage);
    traceContainerSizeChange(scrollPage);
    setScrollBar(scrollPage);
    setShallow(scrollPage);
    sliderDragingBehavior(scrollPage);
    makeWinScrollable(scrollPage);
    shallowBehaviorWhenScroll(scrollPage);
}









