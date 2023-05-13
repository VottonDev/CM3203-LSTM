import React, { useState } from 'react';
import { Button, FormControl, TextField, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import API_URL from '../../common/environment';

// Register API call
const register = async (email: string, password: string, confirmPassword: string) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        confirmPassword: confirmPassword,
      }),
    });

    if (!response.ok) {
      throw new Error('An error occurred during the registration process. Please try again.');
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    return { error: error.message };
  }
};

// Register form
const Register = () => {
  const [registerStatus, setRegisterStatus] = useState<string>('');

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
        Register
      </Typography>
      <TextField sx={{ marginBottom: '10px' }} id="email" label="Email" name="email" type="email" variant="outlined" />
      <TextField sx={{ marginBottom: '10px' }} id="password" label="Password" name="password" type="password" variant="outlined" />
      <TextField sx={{ marginBottom: '10px' }} id="confirmPassword" label="Confirm Password" name="confirmPassword" type="password" variant="outlined" />
      {registerStatus && (
        <Typography variant="h6" sx={{ marginBottom: '10px', color: 'error.main' }}>
          {registerStatus}
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
          const confirmPassword = (document.getElementById('confirmPassword') as HTMLInputElement).value;
          const data = await register(email, password, confirmPassword);
          if (data.message) {
            setRegisterStatus(data.message);
          } else if (data.error) {
            setRegisterStatus(data.error);
          } else {
            window.location.href = '/login';
          }
        }}
      >
        Register
      </Button>
      <Button color="secondary" size="large" type="submit" variant="contained" component={Link} to="/login">
        Login
      </Button>
    </FormControl>
  );
};

export default Register;
