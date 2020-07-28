import Constants from "../Constants";
import { ScrollPage } from "../ScrollPage";
import { assembleElementsAndInitializeUi } from "./assembleElementsAndInitializeUi";
import { traceContainerSizeChange } from "./traceContainerSizeChange";
import { autoHideScrollBar } from "./autoHideScrollBar";
import { setShallow } from "./setShallow";
import { setScrollBar } from "./setScrollBar";
import { sliderDragingBehavior } from "./sliderDragingBehavior";

export function registryEvents(scrollPage: ScrollPage) {
    assembleElementsAndInitializeUi(scrollPage);
    traceContainerSizeChange(scrollPage);
    setScrollBar(scrollPage);
    autoHideScrollBar(scrollPage);
    setShallow(scrollPage);
    sliderDragingBehavior(scrollPage);
}









