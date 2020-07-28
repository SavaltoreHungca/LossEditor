import uuid from 'uuid';

// 事件函数
export interface Event {
    (): [Boolean, number?] | void; // 是否重试 延迟执行, 单位 ms
}

// 事件管理器
export class EventManager {
    private eventMap: Map<String, Array<Event>> = new Map();
    private eventTriggleTimes: Map<String, number> = new Map();
    private eventDependencies: Map<String, Set<String>> = new Map(); // 记录事件依赖的前置事件
    private eventRelyOn: Map<String, Set<String>> = new Map(); // 记录该事件被那些事件作为前置事件

    // 如果执行的事件失败, 则会在指定的延迟时间之后再次执行
    private execEvent = (id: string, event: Event) => {
        try {
            let result = event();
            if (result) {
                let [retry, delayTime] = result;
                if (retry) {
                    if (!delayTime) delayTime = 0;
                    setTimeout(() => this.execEvent(id, event), delayTime);
                }
            }
        } catch (e) {
            // pass
            console.log(`----------事件流错误: ${id}------------------\n`, e);
        }
    }

    /**
     * 
     * 触发依赖于该事件的事件
     * @param id 被依赖的事件id
     */
    private triggleRelyEvent = (id: string) => {
        let relyons = this.eventRelyOn.get(id);
        if (relyons) {
            for (let eventId of relyons) {
                let dependencies = this.eventDependencies.get(eventId);
                if (dependencies) {
                    let exec = true;
                    for (let dependentId of dependencies) {
                        if (dependentId === id) continue;
                        if (!this.eventTriggleTimes.get(dependentId)) {
                            exec = false;
                            break;
                        }
                    }
                    if (exec) {
                        this.triggleEvent(<string>eventId);
                    }
                }
            }

        }
    }

    // 注册事件
    registryEvent(id: String, event: Event, execNow?: Boolean) {
        let eventList = this.eventMap.get(id);
        if (!eventList) {
            eventList = [];
            this.eventMap.set(id, eventList);
        }
        eventList.push(event);
        if (execNow) this.execEvent(<string>id, event);
    }

    // 注册依赖事件触发链
    // 仅当所有所有事件 dependsOn 都都至少执行一次后才会触发
    registryEventDpendsOn(dependsOn: Array<String>, event: Event, id?: String) {
        if (!id) id = uuid.v1();
        let dependencies = this.eventDependencies.get(id);
        if (!dependencies) {
            dependencies = new Set<String>();
            this.eventDependencies.set(id, dependencies);
        }
        dependsOn.forEach(item => {
            let relyons = this.eventRelyOn.get(item);
            if (!relyons) {
                relyons = new Set<String>();
                this.eventRelyOn.set(item, relyons);
            }
            if (id) relyons.add(id);
            else throw new Error("System error");

            dependencies?.add(item)
        });
        this.registryEvent(id, event);
    }

    // 触发事件
    triggleEvent(...ids: string[]) {
        for (let id of ids) {
            // console.log("触发事件: ", id);
            let eventList = this.eventMap.get(id);
            if (!eventList) {
                eventList = [];
                this.eventMap.set(id, eventList);
            }
            let times = this.eventTriggleTimes.get(id) || 0;
            times += 1;
            if (times > 1000) {
                times = 1000; // 事件的最大执行次数只记录到1000次
            }
            this.eventTriggleTimes.set(id, times);
            for (let event of eventList) {
                this.execEvent(id, event);
            }
            this.triggleRelyEvent(id);
        }
    }
}
