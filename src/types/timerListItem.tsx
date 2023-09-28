import { Item } from "linked-list";
import Time from "@/types/time"

export default class TimerListItem extends Item {
    public time: Time
    public id: Number
    
    constructor(time: Time, id: Number) {
        super()
        this.time = time;
        this.id = id;
    }
}