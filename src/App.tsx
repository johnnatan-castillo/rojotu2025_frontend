import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import Home from './pages/Home';
import Clothes from './pages/Clothes';
import MyClothes from './pages/MyClothes';
// import ThreeD from './pages/ThreeD';
import Collection from './pages/Collection';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';


import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import SizeGuide from './pages/SizeGuide';
import PublicRoute from './components/PublicRoute';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>

        {/* Publicas */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>
        {/* Publicas */}


        {/* Privadas */}
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/clothes" element={<Clothes />} />
            <Route path="/my-clothes" element={<MyClothes />} />
            {/* <Route path="/3d" element={<ThreeD />} /> */}
            <Route path="/size-guide" element={<SizeGuide />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Route>
        {/* Privadas */}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
