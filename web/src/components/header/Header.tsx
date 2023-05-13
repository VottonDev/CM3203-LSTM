import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

interface HeaderProps {
  onLogout: () => void;
}

export default function Header({ onLogout }: HeaderProps) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            CM3203 Web App
          </Typography>
          <Button color="inherit" endIcon={<LogoutIcon />} onClick={onLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
