import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css'
import Login from "./screens/Login/Login";
import Home from "./screens/Home/Home"; 


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}
export default App;