import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    const isLogin = localStorage.getItem('isLogin') === 'true';

    const goToHome = () => {
        if (isLogin) {
            navigate('/');
        } else {
            navigate('/login');
        }
    };

    return (
        <div 
            className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800"
        >
            <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
            <p className="text-lg mb-8">Oops! The page you're looking for doesn't exist.</p>
            <button 
                onClick={goToHome} 
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
            >
                Go Back to Home
            </button>
        </div>
    );
};

export default NotFound;
