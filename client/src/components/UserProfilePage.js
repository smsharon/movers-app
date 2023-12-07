import React, { useState } from 'react';
import MyProfile from './MyProfile';

const UserProfilePage = ({ user }) => {
  return (
    <div>
      <h1>User Profile</h1>
      <MyProfile user={user} />
    </div>
  );
};

export default UserProfilePage;
