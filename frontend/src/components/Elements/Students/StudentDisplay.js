import React from "react";
import { useParams } from "react-router-dom";
import { StudentsData } from "../../../StudentsData";

function StudentDisplay() {
  const { id } = useParams();
  return (
    <div className="listOfStudents">
      <div className="studentDisplay">
        <h1>{StudentsData[id - 1].name}</h1>{" "}
        <p>{StudentsData[id - 1].description}</p>{" "}
      </div>
    </div>
  );
}

export default StudentDisplay;
