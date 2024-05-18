import React from "react";
import "./Staff.css";
import { useNavigate } from "react-router-dom";

import burgerIcon from "../../Assets/burger-icon.svg";
import timesheetIcon from "../../Assets/timesheet-icon.svg";
import projectIcon from "../../Assets/project-icon.svg";


import Card from "../../Components/Card/Card";
import Header from "../../Components/Header/Header";

function Staff(){
    //Variables
    const navigate = useNavigate();
     // redirect to Project Page
     const viewProductPage = () => {
        navigate("/StaffProjectPage");
    }
    const viewBookMealsPage = () => {
        navigate("/StaffBookMeals");
    }

    return(
        <>
          <Header>
                <h1> Workwise </h1>
                <button className="logout-button">Log Out</button>
            </Header>
        <main className="homepage">
            <Card title="Timesheets" imgSrc={timesheetIcon}/>
            <Card title="Projects" imgSrc={projectIcon} onClick={viewProductPage}/>
            <Card title="Book Meals" imgSrc={burgerIcon} onClick={viewBookMealsPage}/>

        </main>
        </>
    );
}

export default Staff;