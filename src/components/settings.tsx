import { useState, useEffect, ChangeEvent, KeyboardEventHandler } from "react";
import Collapse from 'react-bootstrap/Collapse'
import { timerState } from "@/state/timerState";
import TimerState from "@/types/timerState";
import { useRecoilState } from "recoil";
import TimerList from "@/types/timerList";
import { timerList } from "@/state/timerList";
import Time from "@/types/time";
import TimerListItem from "@/types/timerListItem";
import { currentTimerItem } from "@/state/currentTimerItem";
import getSeconds from "@/functions/getSeconds";
import getMinutes from "@/functions/getMinutes";
import { Fade } from "react-bootstrap";

const SettingsInput = (props: any) => {  
    const timeItem = props.timeItem;
    const [localTimerState, setTimerState] = useRecoilState<TimerState>(timerState);
    const [localTimerList, setTimerList] = useRecoilState<TimerList>(timerList);
    const [currentItem, setCurrentItem] = useRecoilState<TimerListItem>(currentTimerItem);

    const [minutes, setMinutes] = useState(getMinutes(timeItem.time.startTime));
    const [seconds, setSeconds] = useState(getSeconds(timeItem.time.startTime));

    useEffect(() => {
        if ((minutes * 60) + seconds != timeItem.time.startTime) {
            setMinutes(getMinutes(timeItem.time.startTime));
            setSeconds(getSeconds(timeItem.time.startTime));
        }
    }, [timeItem]);
    
    var time = timeItem.time;

    if (time == null) {
        return <p> ??? </p>;
    }

    const handleTimeChange = (e : ChangeEvent<HTMLInputElement>) => {
        // logic to set the new time
        var newMinutes = getMinutes(time.startTime);
        var newSeconds = getSeconds(time.startTime);

        if (e.target.id == "minutes") {
            // update minutes
            if (e.target.value == '') {
                // default time to 0 if empty
                newMinutes = 0;
            } else if (getMinutes(time.startTime) == 0 && e.target.value.length > 1) {
                // replace 0 in the string with the typed number - removes trailing zeros
                e.target.value = e.target.value.substring(1);
                newMinutes = e.target.valueAsNumber;
    
            } else if (!Number.isNaN(e.target.valueAsNumber) && e.target.valueAsNumber > 0 && Number.isInteger(e.target.valueAsNumber)) {
                // if the new value would take the time over max allowed time
                if (e.target.valueAsNumber > 60) {
                    newMinutes = 60;    
                } else {
                    newMinutes = e.target.valueAsNumber;
                }
            }
        } else {
            // update seconds
            if (e.target.value == '' || newMinutes >= 60) {
                // default time to 0 if empty
                newSeconds = 0;
            } else if (getSeconds(time.startTime) == 0 && e.target.value.length > 1) {
                // replace 0 in the string with the typed number - removes trailing zeros
                e.target.value = e.target.value.substring(1);
                newSeconds = e.target.valueAsNumber;
    
            } else if (!Number.isNaN(e.target.valueAsNumber) && e.target.valueAsNumber > 0 && Number.isInteger(e.target.valueAsNumber)) {
                // if the new value would take the time over max allowed time
                if (e.target.valueAsNumber > 59) {
                    newSeconds = 59;    
                } else {
                    newSeconds = e.target.valueAsNumber;
                }
            }
        }
        
        var newStartTime = newSeconds + (newMinutes * 60);

        // change the time in the state
        var arr = localTimerList.getCloneArray();

        // reset current list item as the references are now gone
        var duplicate = arr.find((item) => item.id == timeItem.id) as TimerListItem;
        var currentDupe = arr.find((item) => item.id == currentItem.id) as TimerListItem;

        if (duplicate == null) {
            return;
        }
        var index = arr.indexOf(duplicate);
        if (index == -1) {
            return;
        }

        var newTime: Time = {label: time.label, startTime: newStartTime};
        var newTimerItem = new TimerListItem(newTime, timeItem.id);
        arr[index] = newTimerItem;

        arr = arr.map((item: TimerListItem) => item.detach());

        var newList = new TimerList(...arr);

        if (newList.tail !== null) {
            newList.tail.next = newList.head;
        }
        
        if (newList.head !== null) {
            newList.head.prev = newList.tail;
        } 

        setTimerList(newList);

        if (newTimerItem.id == currentDupe?.id) {
            setCurrentItem(newTimerItem);
            setTimerState({
                time: newTimerItem.time.startTime,
                startTime: newTimerItem.time.startTime,
                paused: true,
                label: newTimerItem.time.label,
            });
        } else {
            setCurrentItem(currentDupe);
        }
    };

    const handleLabelChange = (e : ChangeEvent<HTMLInputElement>) => {
        var arr = localTimerList.getCloneArray();
        var duplicate = arr.find((item) => item.id == timeItem.id) as TimerListItem;
        var currentDupe = arr.find((item) => item.id == currentItem.id) as TimerListItem;

        if (duplicate == null) {
            return;
        }
        var index = arr.indexOf(duplicate);
        if (index == -1) {
            return;
        }

        var newTime: Time = {label: e.target.value, startTime: time.startTime};
        var newTimerItem = new TimerListItem(newTime, timeItem.id);
        arr[index] = newTimerItem;

        arr = arr.map((item: TimerListItem) => item.detach());

        var newList = new TimerList(...arr);

        if (newList.tail !== null) {
            newList.tail.next = newList.head;
        }
        
        if (newList.head !== null) {
            newList.head.prev = newList.tail;
        } 

        setTimerList(newList);

        if (newTimerItem.id == currentDupe?.id) {
            setCurrentItem(newTimerItem);
            setTimerState({
                time: localTimerState.time,
                startTime: newTimerItem.time.startTime,
                paused: localTimerState.paused,
                label: newTimerItem.time.label,
            });
        } else {
            setCurrentItem(currentDupe);
        }
    };

    const changeLabel = (
            <div className='d-inline-flex col-5 px-2'>
                <input
                    className='text-center'
                    aria-label="label"
                    type="text"
                    value={time.label}
                    onChange={ handleLabelChange }
                    style={{width: '100%'}}
                />
            </div>

    );

    const changeTime = (
        <div className='d-inline-flex col-5 px-2'>
            <input 
                className='text-center'
                aria-label="minutes"
                id="minutes"
                type="number"
                value={ minutes } 
                onChange={ handleTimeChange }
                style={{width: '45%'}}
            />
            <h2 className='px-1'> : </h2>
            <input 
                className='text-center'
                aria-label="seconds"
                id="seconds"
                type="number"
                value={ seconds } 
                onChange={ handleTimeChange }
                style={{width: '45%'}}
            />
        </div>
    );

    return (
        <>
            <div className='container my-2'>
                <div className='row'>
                    { changeLabel }
                    { changeTime }
                    <BinButton item={ timeItem } />
                </div>
            </div>
        </>
    ); 
}

function PlusButton() {
    const [localTimerList, setTimerList] = useRecoilState<TimerList>(timerList);
    const [currentItem, setCurrentItem] = useRecoilState<TimerListItem>(currentTimerItem);
    
    const handleClick = () => {
        // add new time to end of localtimer list
        var arr = localTimerList.getCloneArray();
        var currentDupe = arr.find((item) => item.id == currentItem.id) as TimerListItem;

        if (arr.length == 0) {
            return;
        }

        var newIndex = Math.max(...arr.map((a) => a.id as number)) + 1;      

        var newTime: Time = {label: `timer ${newIndex}`, startTime: 300};
        var newTimerItem = new TimerListItem(newTime, newIndex);
        arr.push(newTimerItem);

        arr = arr.map((item: TimerListItem) => item.detach());

        var newList = new TimerList(...arr);

        if (newList.tail !== null) {
            newList.tail.next = newList.head;
        }
        
        if (newList.head !== null) {
            newList.head.prev = newList.tail;
        } 

        setCurrentItem(currentDupe);

        setTimerList(newList);
    };

    return (
    <div className="d-flex p-2 mx-2">
        <button className='btn btn-primary m-2 w-100' onClick={ handleClick }>
            <i className='fa fa-plus'></i>
        </button>
    </div>
    );
}

function BinButton(props: any) {
    const [localTimerState, setTimerState] = useRecoilState<TimerState>(timerState);
    const [localTimerList, setTimerList] = useRecoilState<TimerList>(timerList);
    const [currentItem, setCurrentItem] = useRecoilState<TimerListItem>(currentTimerItem);
    var itemToRemove = props.item;
    
    const handleClick = () => {
        // add new time to end of localtimer list
        var arr = localTimerList.getCloneArray();
        var removeDupe = arr.find((item) => item.id == itemToRemove.id) as TimerListItem;
        var currentDupe = arr.find((item) => item.id == currentItem.id) as TimerListItem;

        if (arr.length <= 1) {
            console.log('too few timers to delete one!');
            return;
        }

        // change current dupe to prev if deleted item is the current one
        if (currentItem.id == removeDupe.id) {
            currentDupe = arr.find((item) => item.id == itemToRemove.prev.id) as TimerListItem;
        }
        
        arr = arr.filter((item) => item.id !== itemToRemove.id);

        arr = arr.map((item: TimerListItem) => item.detach());

        var newList = new TimerList(...arr);

        if (newList.head == null) {
            return;
        }

        if (newList.size == 1) {
            newList.head.next = newList.head;
            newList.tail = newList.head;
        }
        
        if (newList.tail !== null) {
            newList.tail.next = newList.head;
        }
        
        if (newList.head !== null) {
            newList.head.prev = newList.tail;
        } 

        setCurrentItem(currentDupe);
        
        if (currentItem.id == removeDupe.id) {
            setTimerState({
                time: currentDupe.time.startTime,
                startTime: currentDupe.time.startTime,
                paused: true,
                label: currentDupe.time.label,
            }); 
        }
       
        setTimerList(newList);
    };

    return (
        <div className='col-2 p-0 text-center'>
            <div className='btn btn-danger m-0 p-2' onClick={ handleClick } style={{width: '80%'}}>
                <i className='fa fa-trash'></i>
            </div>
        </div>
    );
}

export default function Settings() {
    const defaultClassName = "fa fa-light fa-gear fa-film m-2";
    const speen = "fa-spin"; // https://youtu.be/l4mTNQLsD0c?si=ofoEv30dzcndldXr
 
    const [hideMenu, setHideMenu] = useState(false);
    const [className, setClassName] = useState(defaultClassName);
    
    const [localTimerList, setTimerList] = useRecoilState<TimerList>(timerList);

    useEffect(() => {
        if (hideMenu) {
            setClassName(`${defaultClassName} ${speen}`);
        }
    }, [hideMenu]);

    return <>
        <i 
            className={className} 
            style={{fontSize: "30px"}} 
            onMouseOver={() => setClassName(`${defaultClassName} ${speen}`)} 
            onMouseLeave={() => setClassName(defaultClassName)}
            onClick={() => setHideMenu(!hideMenu)}
        >
        </i>

        <Collapse className='position-absolute w-100' in={hideMenu} dimension={"height"} >
            <div className='settings bg-white p-3 border-bottom overflow-auto' style={{maxHeight: "50%"}}>
                <h2 className="text-center"> settings </h2>

                <div className="container p-1">
                    <h4 className="text-center"> Pomodoros </h4>
                    <>
                        {localTimerList.getArray().map((item) => { 
                            return <SettingsInput key={item.id} timeItem={item} />
                        })}
                    </>
                    <PlusButton />
                </div>
            </div>
        </Collapse>
    </>
}