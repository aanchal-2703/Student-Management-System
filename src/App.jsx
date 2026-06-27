import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  // LOGIN STATE
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("login") === "true"
  );

  const [login, setLogin] = useState({
    email: localStorage.getItem("email") || "",
    password: "",
  });

  const [error, setError] = useState("");

  // STUDENT STATE
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    name: "",
    math: "",
    science: "",
    english: "",
    remarks: "",
  });

  const [sortType, setSortType] = useState("");

  // LOGIN FUNCTION
  const handleLogin = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!login.email || !login.password) {
      setError("Please fill all fields");
      return;
    }

    if (!emailRegex.test(login.email)) {
      setError("Enter valid email");
      return;
    }

    setIsLoggedIn(true);
    localStorage.setItem("login", "true");
    localStorage.setItem("email", login.email);
    setError("");
  };

  // LOGOUT
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("login");
    localStorage.removeItem("email");
  };

  // INPUT HANDLERS
  const handleLoginChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // GRADE
  const getGrade = (avg) => {
    if (avg >= 90) return "A+";
    if (avg >= 80) return "A";
    if (avg >= 70) return "B";
    if (avg >= 60) return "C";
    if (avg >= 50) return "D";
    return "F";
  };

  // ADD STUDENT
  const addStudent = () => {
    if (!form.name || !form.math || !form.science || !form.english) return;

    const total =
      Number(form.math) + Number(form.science) + Number(form.english);
    const avg = total / 3;

    const newStudent = {
      ...form,
      total,
      avg: avg.toFixed(2),
      grade: getGrade(avg),
    };

    setStudents([...students, newStudent]);

    setForm({
      name: "",
      math: "",
      science: "",
      english: "",
      remarks: "",
    });
  };

  // DELETE
  const deleteStudent = (index) => {
    setStudents(students.filter((_, i) => i !== index));
  };

  // SORT
  const sortedStudents = [...students].sort((a, b) => {
    if (sortType === "nameAsc") return a.name.localeCompare(b.name);
    if (sortType === "nameDesc") return b.name.localeCompare(a.name);
    if (sortType === "marksAsc") return a.avg - b.avg;
    if (sortType === "marksDesc") return b.avg - a.avg;
    return 0;
  });

  // LOGIN SCREEN
  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h2> Teacher Login</h2>

          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={login.email}
            onChange={handleLoginChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={login.password}
            onChange={handleLoginChange}
          />

          <button onClick={handleLogin}>Login</button>

          {error && <p className="error">{error}</p>}
        </div>
      </div>
    );
  }

  // MAIN APP
  return (
    <div className="app">
      <div className="card">
        <div className="top-bar">
          <h2>Student Management System</h2>

          <div>
            <button className="logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {/* FORM */}
        <div className="form">
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
          <input name="math" type="number" placeholder="Math" value={form.math} onChange={handleChange} />
          <input name="science" type="number" placeholder="Science" value={form.science} onChange={handleChange} />
          <input name="english" type="number" placeholder="English" value={form.english} onChange={handleChange} />
        </div>

        <textarea
          name="remarks"
          placeholder="Remarks..."
          value={form.remarks}
          onChange={handleChange}
          className="remarks"
        />

        <button onClick={addStudent}>Add Student</button>

        {/* SORT */}
        <div className="sort">
          <select onChange={(e) => setSortType(e.target.value)}>
            <option value="">Sort By</option>
            <option value="nameAsc">Name ↑</option>
            <option value="nameDesc">Name ↓</option>
            <option value="marksAsc">Marks ↑</option>
            <option value="marksDesc">Marks ↓</option>
          </select>
        </div>

        {/* TABLE */}
        {sortedStudents.length === 0 ? (
          <p className="empty">No students added</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Math</th>
                <th>Science</th>
                <th>English</th>
                <th>Total</th>
                <th>Avg</th>
                <th>Grade</th>
                <th>Remarks</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedStudents.map((s, i) => (
                <tr key={i}>
                  <td>{s.name}</td>
                  <td>{s.math}</td>
                  <td>{s.science}</td>
                  <td>{s.english}</td>
                  <td>{s.total}</td>
                  <td>{s.avg}</td>
                  <td>{s.grade}</td>
                  <td>{s.remarks || "-"}</td>
                  <td>
                    <button className="delete" onClick={() => deleteStudent(i)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;