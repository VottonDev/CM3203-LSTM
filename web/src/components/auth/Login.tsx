import React, { useState } from 'react';
import { Button, FormControl, TextField, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import API_URL from '../../common/environment';

// Login API call
const login = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
      // Allow the cookie to be sent to the client
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('An error occurred during the login process. Please try again.');
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    return { error: error.message };
  }
};

// Login form
const Login = () => {
  const [loginStatus, setLoginStatus] = useState<string>('');

  return (
    <FormControl
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '10px',
      }}
    >
      <Typography variant="h4" sx={{ marginBottom: '10px' }}>
        Login
      </Typography>
      <TextField sx={{ marginBottom: '10px' }} id="email" label="Email" name="email" type="email" variant="outlined" />
      <TextField sx={{ marginBottom: '10px' }} id="password" label="Password" name="password" type="password" variant="outlined" />
      {loginStatus && (
        <Typography variant="h6" sx={{ marginBottom: '10px', color: 'error.main' }}>
          {loginStatus}
        </Typography>
      )}
      <Button
        color="primary"
        size="large"
        type="submit"
        variant="contained"
        onClick={async () => {
          const email = (document.getElementById('email') as HTMLInputElement).value;
          const password = (document.getElementById('password') as HTMLInputElement).value;
          const data = await login(email, password);
          if (data.message) {
            setLoginStatus(data.message);
          } else if (data.error) {
            setLoginStatus(data.error);
          } else {
            window.location.href = '/dashboard';
          }
        }}
      >
        Login
      </Button>
      <Button color="secondary" size="large" type="submit" variant="contained" component={Link} to="/register">
        Register
      </Button>
    </FormControl>
  );
};

export default Login;
