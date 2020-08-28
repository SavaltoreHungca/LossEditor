import { MemLoss } from 'client';

export function renderMemLoss(container){
    const div = document.createElement('div');
    container.appendChild(div);
    new MemLoss({
        container: div
    });
}