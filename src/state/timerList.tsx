
import { atom } from "recoil";
import Time from "@/types/time";
import TimerListItem from "@/types/timerListItem";
import TimerList from "@/types/timerList";

var workItem: Time = {
    startTime: 1500,
    label: "work"
}

var breakItem: Time = {
    startTime: 300,
    label: "break"
}

var defaultTimerList: TimerList = new TimerList(new TimerListItem(workItem, 1), new TimerListItem(breakItem, 2));

if (defaultTimerList.tail !== null) {
    defaultTimerList.tail.next = defaultTimerList.head;
}

if (defaultTimerList.head !== null) {
    defaultTimerList.head.prev = defaultTimerList.tail;
}  

export var timerList = atom({
    key: 'timerList',
    default: defaultTimerList
});