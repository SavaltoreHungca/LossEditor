import {EventManager} from 'event-driven'
import {Utils}  from 'utils';

let eventManger = new EventManager();

eventManger.registryEvent("a", ()=>{
    console.log('shit');
    return [false]
}, false);

eventManger.registryEvent("b", ()=>{
    console.log('bullshit');
    return [true, 5000]
}, false);


eventManger.registryEventDpendsOn("c", ()=>{
    console.log('fucker');
    return [false]
}, ["a", "b"]);


eventManger.triggleEvent('b');