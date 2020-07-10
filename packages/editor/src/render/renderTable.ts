import { BlockType, render } from "../render";
import { Utils } from "utils";
import { createElement } from "../utils";

interface TableType extends BlockType {

}

export function renderTable(tableBlock: TableType, viewLines: HTMLElement) {
    const viewLinesInfo = Utils.getElementInfo(viewLines);
    const table = createElement('table');
    viewLines.appendChild(table);
    Utils.setStyle(table, { width: viewLinesInfo.innerWidth });

    const tableInfo = Utils.getElementInfo(table);
    for (let i = 0; i < tableBlock.content.length; i++) {
        const rowdata = tableBlock.content[i];
        const row = createElement('row');
        Utils.setStyle(row, { width: tableInfo.width })
        table.appendChild(row);
        const rowInfo = Utils.getElementInfo(row);
        let maxCellHeight = 0
        const cells = [];
        let cellLeftOffset = 0;
        for (let j = 0; j < rowdata.length; j++) {
            const celldata = rowdata[j];
            const cell = createElement('cell');
            cells.push(cell);
            row.appendChild(cell);
            Utils.setStyle(cell, { width: rowInfo.innerWidth / rowdata.length, left: cellLeftOffset });
            cellLeftOffset += rowInfo.innerWidth / rowdata.length;
            render(celldata, cell);
            Utils.getElementInfo(cell, info => {
                maxCellHeight = Math.max(maxCellHeight, info.height);
            })
        }
        for (let item of cells) Utils.setStyle(item, { height: maxCellHeight });
        Utils.setStyle(row, { height: maxCellHeight });
    }
}