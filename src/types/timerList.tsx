import { List } from "linked-list";
import TimerListItem from "./timerListItem";

export default class TimerList extends List {
    constructor(...items: Array<TimerListItem>) {
        super(...items);
    }
    
    getArray(): TimerListItem[] {
        var i: TimerListItem = this.head as TimerListItem;
        var arr: TimerListItem[] = [];

        if (i == null) {
            return [];
        }

        do {
            if (i == null) {
                return arr;
            }
            arr.push(i);
            i = i?.next as TimerListItem;

        } while (i != this.head);

        return arr;
    }

    getCloneArray(): TimerListItem[] {
        var i: TimerListItem = this.head as TimerListItem;
        var arr: TimerListItem[] = [];

        if (i == null) {
            return [];
        }

        do {
            if (i == null) {
                return arr;
            }
            console.log(`(toString()) pushing time ${i.time.label}`)
            arr.push(this.duplicate(i));
            i = i?.next as TimerListItem;

        } while (i != this.head);

        return arr;
    }

    private duplicate(item: TimerListItem | null): TimerListItem | null {
        return item == null ? null : new TimerListItem({label: item.time.label, startTime: item.time.startTime}, item.id);
    }

    // find a list item after it has been duplicated
    findDuplicate(item: TimerListItem) : TimerListItem | null {
        var i: TimerListItem = this.head as TimerListItem;

        if (i == null) {
            return null;
        }

        do {
            if (i == null) {
                return null;
            } else if (i.time.startTime == item.time.startTime && i.time.label == item.time.label) {
                return i;
            }
            
            i = i?.next as TimerListItem;

        } while (i != this.head);

        return null;
    }
}