import React from 'react';
import { Box, Typography } from '@mui/material';

export default function Footer() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 1, bgcolor: 'background.paper' }}>
      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} Otto Hooper (1949120)
      </Typography>
    </Box>
  );
}
