import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import SkillProfile from "./pages/SkillProfile";
import Search from "./pages/Search";
import Requests from "./pages/Requests";
import Chat from "./pages/Chat";




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/skills" element={<SkillProfile />} />
        <Route path="/search" element={<Search />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/chat/:otherUserId" element={<Chat />} />




       

      </Routes>
    </BrowserRouter>
  );
}

export default App;
