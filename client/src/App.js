import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MySide from './pages/MySide';

function App() {
  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      <style>
        {`
          html, body {
            margin: 0;
            padding: 0;
            height: 100%;
            overflow-x: hidden;
          }
          body {
            -webkit-overflow-scrolling: touch;
            background-color: black;
          }
        `}
      </style>
      <Router>
        <div className="flex flex-col min-h-screen bg-black text-white">
          <Navbar />
          <div className="flex-grow flex items-center justify-center">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/my-side" element={<MySide />} />
            </Routes>
          </div>
        </div>
      </Router>
    </>
  );
}

export default App;
