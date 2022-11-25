import React from 'react';
import './Layout.scss';
import About from '../About/About';
import Lessons from '../Elements/Lessons/Lessons';
import Students from '../Elements/Students/Students';
import Teachers from '../Elements/Teachers/Teachers';
import Subjects from '../Elements/Subjects/Subjects';

const Layout = () => {

		return (
      <>
        <input type="checkbox" id="menu" />
        <label htmlFor="menu" className="menu">
          <span></span>
          <span></span>
          <span></span>
        </label>

        <nav className="nav">
				  <ul>
            <li className="nav-item">
              <a className="nav-link active" data-bs-toggle="tab" href="#About">About</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" data-bs-toggle="tab" href="#Lessons">Lessons</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" data-bs-toggle="tab" href="#Subjects">Subjects</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" data-bs-toggle="tab" href="#Teachers">Teachers</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" data-bs-toggle="tab" href="#Students">Students</a>
            </li>
          </ul>
        </nav>

        <main>
        { /* <!-- navtabs content display--> */ }
         <div className="tab-content">
         		<div className="tab-pane container active" id="About">
              <About />
            </div>
            <div className="tab-pane container fade" id="Lessons">
              <Lessons />
            </div>
            <div className="tab-pane container fade" id="Subjects">
              <Subjects />
            </div>
            <div className="tab-pane container fade" id="Teachers">
              <Teachers />
            </div>
            <div className="tab-pane container fade" id="Students">
              <Students />
            </div>
          </div>
        </main>
      </>
		);
}

export default Layout;