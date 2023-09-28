import TimerState from "@/types/timerState";
import { atom } from "recoil";

const defaultTimerState: TimerState = {
    time: 5,
    startTime: 5,
    paused: true,
    label: "not initialised :("
}
  
export const timerState = atom({
    key: 'timerState',
    default: defaultTimerState
});