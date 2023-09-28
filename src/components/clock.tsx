'use client'

import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import useInterval from '../functions/useInterval';
import TimerState from "@/types/timerState";
import { timerState } from "@/state/timerState";
import { timerList } from "@/state/timerList";
import TimerListItem from "@/types/timerListItem";
import TimerList from "@/types/timerList";
import { currentTimerItem } from "@/state/currentTimerItem";

const audio = new Audio("notif.mp3");

function formatTime(seconds: number) {
    var minutes : number = (seconds - (seconds % 60)) / 60;
    var seconds : number = seconds - (minutes * 60);

    var minString : String = ((minutes as unknown) as String).toString();
    var secString : String = ((seconds as unknown) as String).toString();

    return `${minString.padStart(2, '0')}:${secString.padStart(2, '0')}`;
}

export default function Clock() {
    const [localTimerState, setTimerState] = useRecoilState<TimerState>(timerState);
    const [localTimerList, setTimerList] = useRecoilState<TimerList>(timerList);
    const [currentState, setCurrentState] = useRecoilState<TimerListItem>(currentTimerItem);

    const [initialised, setInitialised] = useState(false);

    // load the first state
    useEffect(() => {
        if (!initialised) {
            if (localTimerList.head == null) {
                setInitialised(true);
                return;
            }
    
            if (!(localTimerList.head instanceof TimerListItem)) {
                setInitialised(true);
                return;
            }
            
            setCurrentState(localTimerList.head as TimerListItem);
            console.log(`initialising as ${localTimerList.head.time.label}`);
            setTimerState({
                time: localTimerList.head.time.startTime,
                startTime: localTimerList.head.time.startTime,
                paused: true,
                label: localTimerList.head.time.label,
            });
            setInitialised(true);
        }
     }, [initialised]);
    
    // tick if not paused
    useInterval(() => {
        if (localTimerState.time > 0) {
            setTimerState(prevState => ({
                ...prevState,
                time: prevState.time - 1
            }));
        }
    }, localTimerState.paused ? null : 1000);

    // change state when timer runs out
    useEffect(() => {
        if (localTimerState.time == 0 && localTimerState.paused == false) { 
            audio.play();
            setPaused(true);
            nextTimerState();
        }
    }, [localTimerState]);

    useEffect(() => {
        if (!localTimerState.paused && audio.currentTime != 0) {
            audio.pause();
            audio.currentTime = 0;
        }
    }, [localTimerState]);
    
    
    function setTime(newTime: number) {
        setTimerState(prevState => ({
            ...prevState,
            time: newTime
        }));
    };

    function setPaused(newPaused: boolean) {
        setTimerState(prevState => ({
            ...prevState,
            paused: newPaused
        }));
    }

    function setStartTime(newStartTime: number) {
        setTimerState(prevState => ({
            ...prevState,
            startTime: newStartTime
        }));
    }

    function setLabel(newLabel: string) {
        setTimerState(prevState => ({
            ...prevState,
            label: newLabel
        }));
    }

    function nextTimerState() {        
        if (!(currentState.next instanceof TimerListItem)) {
            return;
        }
        
        // replace currentState if it changed
        setCurrentState(currentState.next);
        setTimerState({
            time: currentState.next.time.startTime,
            startTime: currentState.next.time.startTime,
            paused: true,
            label: currentState.next.time.label,
        });
    }

    function prevTimerState() {
        if (!(currentState.prev instanceof TimerListItem)) {
            return;
        }
        // replace currentState if it changed
        setCurrentState(currentState.prev);
        setTimerState({
            time: currentState.prev.time.startTime,
            startTime: currentState.prev.time.startTime,
            paused: true,
            label: currentState.prev.time.label,
        });
    }

    function handleSkip() {
        console.log(`skipping`);
        audio.pause();
        audio.currentTime = 0;
        setPaused(true);
        nextTimerState();
    }

    const handlePauseClicked = () => {
        setPaused(!localTimerState.paused);
    };

    const formatPauseText = () => {
        if (!localTimerState.paused) {
            return <i className='fa fa-pause'></i>;
        }

        return <i className='fa fa-play'></i>;
  
    };

    const handlePrev = () => {
        console.log(`skipping`);
        audio.pause();
        audio.currentTime = 0;
        setPaused(true);
        prevTimerState();
    };

    return <div className='position-absolute clock w-100 top-50 start-50 translate-middle'>
            <div className='container-sm'>
                <div className='row'> 
                    <div className="col-12">
                        <h1 className='text-center' style={{fontSize: '72px'}}> { formatTime(localTimerState.time) } </h1>
                        <p className='text-center' style={{fontSize: '24px'}}> { localTimerState.label == "" ? "(untitled)" : localTimerState.label } </p>
                    </div>
                </div>
                <div className='row justify-content-md-center mx-5'>
                    <div className='col col-md-auto btn btn-primary mx-2 p-1' onClick={ handlePrev }> <i className="fa fa-light fa-backward m-2"> </i> </div>
                    <div className='col-2 btn btn-primary mx-2 p-2' onClick={ handlePauseClicked }> { formatPauseText() } </div>
                    <div className='col-2 btn btn-primary mx-2 p-2' onClick={() => {
                        setTime(localTimerState.startTime);
                        setPaused(true);
                    }}> <i className='fa fa-rotate-left'></i> </div>
                    <div className='col col-md-auto btn btn-primary mx-2 p-1' onClick={ handleSkip }> <i className="fa fa-light fa-forward m-2"> </i> </div>
                </div>

            </div>
        </div>
}