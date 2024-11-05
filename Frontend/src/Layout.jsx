// Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';

const Layout = () => {
//   const { role ,isLogin } = useSelector((state) => state.auth);
    const role = localStorage.getItem('role');
    const isLogin = localStorage.getItem('isLogin') === 'true';
  console.log(`Layout: ${role} ${isLogin}`);

  // Check if the user is logged in (roles other than 'Guest' or undefined)

  return (
    <div>
      {isLogin && <Header />}
      {isLogin && <Sidebar role={role} />}
      
      {/* Main Content */}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
