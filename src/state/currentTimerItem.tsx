import TimerListItem from "@/types/timerListItem";
import { atom } from "recoil";

const defaultTimerState: TimerListItem = new TimerListItem({
    label: 'Not initialised :(',
    startTime: -1,
}, -1);
  
export const currentTimerItem = atom({
    key: 'currentState',
    default: defaultTimerState
});