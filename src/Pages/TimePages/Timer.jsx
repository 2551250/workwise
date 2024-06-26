import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { updateTime } from '../../backend_post_requests';
import { useEmployee } from "../../Components/EmployeeContext/EmployeeContext";

import './Timer.css';

import PopUp from "../../Components/PopUp/PopUp";
import Header from "../../Components/Header/Header";


const isValidStopwatchTime = (time) => {
    if (time <= 0) {
        return false;
    }
    return true;
}


const Timer = () => {
    //Variables
    const location = useLocation();
    const projectData = location.state;
    const navigate = useNavigate();

    const {employeeID} = useEmployee();
    
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [displayPopup, setDisplayPopup] = useState(false);
    const [error, setError] = useState("");
    
    //Incrementing time
    useEffect(() => {
        let interval;
        if (isRunning) {
            interval = setInterval(() => {
                setTime((prevTime) => prevTime + 1000);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning]);

    //If stop button was clicked 
    const handleStartStop = () => {
        setError("");
        setIsRunning(!isRunning);
    };
    //If cancel was clicked during running time
    const handleCancel = () => {
        setError("");
        setIsRunning(false);
        setTime(0);
    };
    //Checking if time has passed
    const handleStopAndSave = async () => {
        //If time has not passed do not save time
        if (!isValidStopwatchTime(time)){
            setError("Stopwatch has not been started");
            return;
        }

        //If time has passed then save the time to two decimal places
        setIsRunning(false);
        const hours = Math.round((time / (1000 * 60 * 60)) * 100) / 100; // Rounds to 2 decimal places
        console.log(hours);
        
        //Sending time to be saved on database
        const response = await updateTime(employeeID, projectData.PROJECT_ID, hours);
        if (response === "Time spent on project successfully updated"){
            setDisplayPopup(true);
        }

        setTime(0);
    };

    //navigation to homepage
    const homePageButton = () => {
        navigate("/Staff");
    }
    //logout button
    const logoutClicked = () =>{
        navigate("/");
    }

    // HTML Code
    return (
        <>
        <Header>
                <h1> Workwise </h1>
                <button className="homepage-button"  onClick={homePageButton}>Homepage</button>
                <button className="logout-button" onClick={logoutClicked}>Log Out</button>
        </Header>
        
        <main className='timer-container'>
            <section className='timer-wrapper'>
            <h2>Timer for {projectData.PROJECT_NAME}</h2>
            <section className='time-display'>
                <p className='display-time'>Time: {new Date(time).toISOString().substr(11, 8)}</p>

                {error ? <label className='errorLabel'>{error}</label> : ""}

                <article className='timer-buttons'>
                <button onClick={handleStartStop}>
                    {isRunning ? 'Pause' : 'Start'}
                </button>
                <button onClick={handleCancel}>Cancel</button>
                <button onClick={handleStopAndSave}>Stop & Save</button>
                </article>
            </section>
            </section>
        </main>

        <PopUp trigger={displayPopup} setTrigger={setDisplayPopup}>
            <h3>Time Updated Successfully</h3>
            <p>Time spent on project successfully updated</p>
        </PopUp>
        </>
    );
};

export default Timer;

