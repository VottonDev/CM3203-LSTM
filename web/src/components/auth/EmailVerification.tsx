import React from 'react';
import API_URL from '../../common/environment';
import { Typography } from '@mui/material';

// Email verification API call
const verifyEmail = async (token: string) => {
  const response = await fetch(`${API_URL}/auth/verify/${token}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  return data;
};

// Trigger email verification on page load
const EmailVerification = () => {
  const [emailVerificationStatus, setEmailVerificationStatus] = React.useState<string>('');
  // Send the last part of the URL as the token
  const token = window.location.href.split('/').pop();

  verifyEmail(token!).then((data) => {
    if (data.message) {
      setEmailVerificationStatus(data.message);
    } else {
      window.location.href = '/login';
    }
  });
  return (
    <Typography variant="h6" sx={{ marginBottom: '10px' }}>
      Email verification status:
      {emailVerificationStatus}
    </Typography>
  );
};

export default EmailVerification;
