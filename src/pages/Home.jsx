import { Link } from "react-router-dom";

export default function Home(){
  return (
    <div>
      <h1>My Practicals — Subjects</h1>
      <p>Select a subject to open its practicals (click a practical to expand code).</p>
      <ul className="subject-list">
        <li><Link to="/os">Operating Systems (OS)</Link></li>
        <li><Link to="/ds">Data Structures (DS)</Link></li>
        <li><Link to="/java">Java Practicals</Link></li>
      </ul>
    </div>
  );
}
