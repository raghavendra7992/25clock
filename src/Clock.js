import { useEffect, useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.css';

import './App.css';

function Clock() {
  let asrc="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
  const [dispatch,setDispatch]=useState(25*60);
  const [bkLength,setBklength]=useState(5*60);
  const [sessions,setSessions]=useState(25*60);
  const [timer ,setTimer] = useState(false);
  const [off,setOff] = useState(false);
  let user=useRef(null);
  useEffect(()=>{
    if(dispatch<=0){
      setOff(true);
      offSound();

    }else if(!timer && dispatch===bkLength){
      setOff(false);
    }
  },[dispatch,off,timer,bkLength,sessions]);

  const offSound=()=>{
    user.currentTime=0;
    user.play();
  }
  const displayTime=(time)=>{
    let mins = Math.floor(time / 60);
    let secs = time % 60;
    return (
      (mins < 10 ? "0" + mins : mins) + ":" + (secs < 10 ? "0" + secs : secs)
    );
  }
  const fTime=(time)=>{
    return time/60
  }

  const updateTime=(ttime,type)=>{
    if(type==="break"){
      if((bkLength<=60&&ttime<0)||bkLength>=60*60){
        return;
      }
      setBklength((prev)=>prev+ttime)

    }else{
      if((sessions<=60&&ttime<0)||sessions>=60*60){
        return;
      }
      setSessions((prev)=>prev+ttime);
      if(!timer){
       setDispatch(sessions+ttime)
      }
    }
  }
  const timeControl = () => {
    let sec      = 1000;
    let date     = new Date().getTime();
    let nextDate = new Date().getTime() + sec;
    let offVariable = off;

    if (!timer) {
      let interval = setInterval(() => {
        date = new Date().getTime();
        if (date > nextDate) {
         setDispatch((prev) => {
            if (prev <= 0 && !offVariable) {
              // breakSound();
              offVariable = true;
              return bkLength;
            } else if (prev <= 0 && offVariable) {
              // breakSound();
              offVariable = false;
              setOff(false);
              return sessions;
            }
            return prev - 1;
          });
          nextDate += sec;
        }
      }, 30);
      localStorage.clear();
      localStorage.setItem("interval-id", interval);
    }
    if (timer) {
      clearInterval(localStorage.getItem("interval-id"));
    }
    setTimer(!timer);
  };

  const resetTime = () => {
    clearInterval(localStorage.getItem("interval-id"));
    setDispatch(25 * 60);
    setBklength(5 * 60);
    setSessions(25 * 60);
    user.pause();
    user.currentTime = 0;
    setTimer(false);
    setOff(false);
  };
  function ControlComponent({
    title,
    updateTime,
    type,
    time,
    formatTime
  }) {
    return (
      <div className="col-md-6">
        <h1
          className="text-center"
          id={type === "break" ? "break-label" : "session-label"}
        >
          {title}
        </h1>
        <div className="d-flex justify-content-center align-items-center">
          <div className="arrow">
            <i
              className="fas fa-arrow-circle-up fa-4x"
              id={type === "break" ? "break-increment" : "session-increment"}
              style={{}}
              onClick={() => updateTime(60, type)}
            ></i>
          </div>
          <h3
            className="m-5 display-4"
            id={type === "break" ? "break-length" : "session-length"}
          >
            {formatTime(time)}
          </h3>
          <div className="arrow">
            <i
              className="fas fa-arrow-circle-down fa-4x"
              id={type === "break" ? "break-decrement" : "session-decrement"}
              style={{cursor: "pointer"}}
              onClick={() => updateTime(-60, type)}
            ></i>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="row">
        <h1 className="title display-3 mb-5 col-md-12 text-center">
          25 + 5 Clock
        </h1>
      </div>

      <div className="row double d-flex">
        <ControlComponent
          title={"Break Length"}
          updateTime={updateTime}
          time={bkLength}
          formatTime={fTime}
          type={"break"}
          formatDisplayTime={displayTime}
        />
        <ControlComponent
          title      = {"Session Length"}
          updateTime = {updateTime}
          time       = {sessions}
          formatTime = {fTime}
          type       = {"session"}
          formatDisplayTime = {displayTime}
        />
      </div>
      <div className="row">
        <div className="clock col-md-12 d-flex justify-content-center">
          <div className={timer ? "mt-5" : "null mt-5"}>
            <span className={timer ? null : "box2"}></span>
            <h2 className="text-center display-4" id="timer-label">
              {off ? "Break" : "Session"}
            </h2>
            <h1 className="timer display-1 text-center" id="time-left">
              {displayTime(dispatch)}
            </h1>
          </div>
        </div>
        <div className="col-md-12">
          <div className="buttons d-flex justify-content-center align-content-center mt-3">
            <span id="start_stop" onClick={timeControl}>
              {timer? (
                <i className="fas fa-pause fa-4x m-3" ></i>
              ) : (
                <i
                  className="fas fa-play fa-4x m-3"
                  
                  id="start_stop"
                ></i>
              )}
            </span>
            <i
              className="fas fa-sync-alt fa-4x m-3"
              style={{cursor: "pointer"}}
              id="reset"
              onClick={resetTime}
            ></i>
          </div>
        </div>
      </div>
      <audio ref={(t) => (user = t)} src={asrc} id="beep" />
    </div>
  );
}

export default Clock;
