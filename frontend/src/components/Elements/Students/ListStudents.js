import React from "react";
import { StudentsData } from "../../../StudentsData";
import { useNavigate } from "react-router-bootstrap";

function ListStudents() {
  const navigate = useNavigate();
  return (
    <div className="listOfStudents">
      <div className="studentsList">
        {StudentsData.map((student) => {
          return (
            <div
              className="studentDisplay"
              onClick={() => {
                navigate(`/students/${student.id}`);
              }}
            >
              <h1>{student.name}</h1> <p>{student.description}</p>{" "}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ListStudents;
