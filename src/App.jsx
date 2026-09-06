import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import UserSettings from './pages/UserSettings';
import MyLearning from './pages/MyLearning';
import CareerCompass from './pages/CareerCompass';
import VerifyCertificate from './pages/VerifyCertificate';


import AdminLogin from './pages/AdminLogin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetails />} />
        <Route path="/my-learning" element={<MyLearning />} />
        <Route path="/enrolled" element={<MyLearning />} />
        <Route path="/career-compass" element={<CareerCompass />} />
        <Route path="/roadmap" element={<CareerCompass />} />
        <Route path="/verify" element={<VerifyCertificate />} />
        <Route path="/verify/:id" element={<VerifyCertificate />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/settings" element={<UserSettings />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        {/* Placeholder for admin sub-routes like /admin/courses */}
        <Route path="/admin/*" element={<AdminDashboard />} />
      </Routes>

    </Router>
  );
}

export default App;
