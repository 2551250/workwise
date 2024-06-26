import React, { useEffect, useState} from "react";
import { useLocation, useNavigate } from "react-router";
import { useEmployee } from "../../Components/EmployeeContext/EmployeeContext";

import Header from "../../Components/Header/Header";
import MessageReceiveCard from "../../Components/MessageCard/MessageReceiveCard";
import MessageSendCard from "../../Components/MessageCard/MessageSendCard";

import { getEmployeeName, getProjectMessages, getAllEmployees, formatTime, isValidMessage, getRoleFromID } from "../../backend";

import "./ChatPage.css";
import { insertMessage } from "../../backend_post_requests";


const ChatPage = () => {
    //Variables
    const location = useLocation();
    const projectData = location.state;
    const navigate = useNavigate();

    const { employeeID } = useEmployee();
    const senderID = parseInt(employeeID); // Employee ID of the message sender

    const [employees, setEmployees] = useState([]);
    const [projectMessages, setProjectMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    // Functions & Logic

    // Gets all project messages stored in the database
    const fetchProjectMessages = async (projectID) => {
        const projectMessagesData = await getProjectMessages(projectID);
        if (typeof(projectMessagesData) != "string"){ //request was successful
            setProjectMessages(projectMessagesData);
        }
    }

    useEffect(() => {
        // Gets all employees stored in the database
        const fetchEmployees = async () => {
            const data = await getAllEmployees();
            if (typeof(data) != "string"){ //request was successful
                setEmployees(data);
            }
        }

        fetchEmployees();
        fetchProjectMessages(projectData.PROJECT_ID);
    }, [projectData]);

    const handleSubmitButtonClick = async () => {
        //Checks if the message entered is valid
        if (!isValidMessage(newMessage)){
            return;
        }

        // Get the current time and date
        const today = new Date();
        const currentTime = today.toLocaleTimeString();
        const currentDate = today.toLocaleDateString();

        // Insert the new message into to the database
        const response = await insertMessage(senderID, newMessage, projectData.PROJECT_ID, currentTime, currentDate);
        if (response === "Message successfully created"){
            // Refresh the list of project messages
            await fetchProjectMessages(projectData.PROJECT_ID);
            // reset newMessage variable
            setNewMessage("");
        }
    }
    //navigate user to their specific homepage
    const homePageButton = () => {
        const role = getRoleFromID(senderID, employees);
        if (role === "No Employee Found"){
            return
        }
        else{
            navigate(`/${role}`);
        }
    }
    //Log out user
    const logoutClicked = () =>{
        navigate("/");
    }

    // HTML Code
    return(
        <>
            <Header>
                <h1> Workwise </h1>
                <button className="homepage-button"  onClick={homePageButton}>Homepage</button>
                <button className="logout-button" onClick={logoutClicked}>Log Out</button>
            </Header>

            <header>
            <h2 className='message-header'> {projectData.PROJECT_NAME} </h2>
            </header>

            <main className='message-display'>
                {   
                    /* 
                        Display the send message card if the message was sent from the currrent employee.
                        If not, display the received message card
                    */
                    projectMessages.map((message) => {
                        if (message.MESSAGE_SENT_BY === senderID){
                            return (
                                <MessageSendCard key={message.MESSAGE_ID}
                                employeeName={getEmployeeName(message.MESSAGE_SENT_BY, employees)} 
                                message={message.MESSAGE_TEXT} timeSent={formatTime(message.DATE, message.TIME)}/>
                            );
                        }

                        else {
                            return (
                                <MessageReceiveCard key={message.MESSAGE_ID}
                                employeeName={getEmployeeName(message.MESSAGE_SENT_BY, employees)} 
                                message={message.MESSAGE_TEXT} timeSent={formatTime(message.DATE, message.TIME)}/>
                            );
                        }
                    })
                }
            </main>
            <section className = 'send-wrapper'>
                <textarea
                value={newMessage}
                className='send-message'
                maxLength={500} // Limit the text length to 30 characters
                rows={4} // Specify the number of visible rows
                cols={40} // Specify the number of visible columns
                onChange={(event) => (setNewMessage(event.target.value))} 
                />
                <button onClick={handleSubmitButtonClick}>Send</button>
            </section>
        </>
    );
}

export default ChatPage;