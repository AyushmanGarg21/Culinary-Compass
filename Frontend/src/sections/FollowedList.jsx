import React from 'react';
import { Box, TextField, Button, Typography, Link , styled } from '@mui/material';
import userimg from '../assets/userimg.png';
import UserFollowedCard from '../components/Posts/UserFollowedCard';


const FollowedList = () => {
    const UserDummyData = [
        {
            username: "John Doe",
            image: userimg,
            foodpreference: "Vegan"
        },
        {
            username: "Jane Doe",
            image: userimg,
            foodpreference: "Veg"
        },
        {
            username: "John Smith",
            image: userimg,
            foodpreference: "Non-Veg"
        },
        {
            username: "Jane Smith",
            image: userimg,
            foodpreference: "Vegan"
        },
        {
            username: "John Doe",
            image: userimg,
            foodpreference: "Vegan"
        },
        {
            username: "Jane Doe",
            image: userimg,
            foodpreference: "Veg"
        },
        {
            username: "John Smith",
            image: userimg,
            foodpreference: "Non-Veg"
        },
        {
            username: "Jane Smith",
            image: userimg,
            foodpreference: "Vegan"
        },
        {
            username: "John Doe",
            image: userimg,
            foodpreference: "Vegan"
        },
        {
            username: "Jane Doe",
            image: userimg,
            foodpreference: "Veg"
        },
        {
            username: "John Smith",
            image: userimg,
            foodpreference: "Non-Veg"
        },
        {
            username: "Jane Smith",
            image: userimg,
            foodpreference: "Vegan"
        },
        {
            username: "John Doe",
            image: userimg,
            foodpreference: "Vegan"
        },
        {
            username: "Jane Doe",
            image: userimg,
            foodpreference: "Veg"
        },
        {
            username: "John Smith",
            image: userimg,
            foodpreference: "Non-Veg"
        },
        {
            username: "Jane Smith",
            image: userimg,
            foodpreference: "Vegan"
        }
    ];
    return (
        <div className="flex flex-col items-center w-full h-screen">
        <div>
            <Typography variant="h4" className="font-bold">Followed Users</Typography>
        </div>
        <div className="mt-8 overflow-x-auto h-[70vh] w-full max-w-[300px] custom-scrollbar">
            {UserDummyData.map((user) => (
            <UserFollowedCard user={user} key={user.id} />
            ))}
        </div>
        </div>
    );
    
};

export default FollowedList;
