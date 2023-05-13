import React from 'react';
import API_URL from '../../common/environment';

// Logout API call
const logout = async () => {
  const response = await fetch(`${API_URL}/auth/logout`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  return data;
};

// Logout on page load and redirect regardless of success
const Logout = () => {
  logout().then(() => {
    window.location.href = '/';
  });
  return <div></div>;
};

export default Logout;
