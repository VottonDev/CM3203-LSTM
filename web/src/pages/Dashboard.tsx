import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TablePagination,
  Grid,
  Typography,
  Box,
} from '@mui/material';
import Footer from '../components/footer/Footer';
import Header from '../components/header/Header';

type currentPrice = {
  latestPrice: number;
  latestTime: string;
  high: number;
  low: number;
  volume: number;
  avgTotalVolume: number;
};

type predictionData = {
  value: number;
};

export default function Dashboard() {
  const [stockName, setStockName] = useState('AAPL');
  const [currentPrice, setCurrentPrice] = useState({} as currentPrice);
  const [historicalPrices, setHistoricalPrices] = useState([]);
  const [stockOptions, setStockOptions] = useState([]);
  const [predictionData, setPredictionData] = useState({} as predictionData);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleStockChange = (event: any) => {
    setStockName(event.target.value);
  };

  useEffect(() => {
    async function fetchStockOptions() {
      const response = await fetch('http://localhost:3000/data/stocks', { credentials: 'include' });
      const data = await response.json();
      setStockOptions(data.map((stock: any) => stock.name));
    }
    fetchStockOptions();
  }, []);

  useEffect(() => {
    async function fetchHistoricalPrices() {
      const response = await fetch(`http://localhost:3000/data/historical?stock=${stockName}`, { credentials: 'include' });
      const data = await response.json();
      setHistoricalPrices(
        data.map((price: any) => {
          return {
            ...price,
            priceDate: new Date(price.priceDate),
          };
        })
      );
    }
    fetchHistoricalPrices();
  }, [stockName]);

  useEffect(() => {
    async function fetchLatestPrice() {
      const response = await fetch(`http://localhost:3000/data/latest?stock=${stockName}`, { credentials: 'include' });
      const data = await response.json();
      setCurrentPrice(data);
    }
    fetchLatestPrice();
  }, [stockName]);

  useEffect(() => {
    async function fetchPredictions() {
      const response = await fetch(`http://localhost:3000/data/prediction?stock=${stockName}`, { credentials: 'include' });
      const data = await response.json();
      setPredictionData(data[0]);
    }
    fetchPredictions();
  }, [stockName]);  

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleLogout = async () => {
    try {
      // Send a request to the logout API
      await fetch('http://localhost:3000/auth/logout', { credentials: 'include' });

      // Clear "sid-cm3203" cookie
      document.cookie = 'sid-cm3203=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';

      // Redirect to the login page
      window.location.href = '/login';
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, historicalPrices.length - page * rowsPerPage);

  return (
    <div>
      <Header onLogout={handleLogout} />
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="stock-select-label">Stock</InputLabel>
        <Select labelId="stock-select-label" id="stock-select" value={stockName} label="Stock" onChange={handleStockChange}>
          {stockOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
            <Typography variant="h6" gutterBottom component="div">
              Latest stock update ({new Date(currentPrice?.latestTime).toLocaleDateString()})
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
            <Typography variant="h6" gutterBottom component="div">
              Current Price ({currentPrice?.latestPrice})
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
            <Typography variant="h6" gutterBottom component="div">
              Today's High ({currentPrice?.high})
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
            <Typography variant="h6" gutterBottom component="div">
              Today's Low ({currentPrice?.low})
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
            <Typography variant="h6" gutterBottom component="div">
              Current Volume ({currentPrice?.volume})
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
            <Typography variant="h6" gutterBottom component="div">
              Average Volume ({currentPrice?.avgTotalVolume})
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
            <Typography variant="h6" gutterBottom component="div">
              ML Prediction ({predictionData?.value})
            </Typography>
          </Box>
          </Grid>
      </Grid>
      <TableContainer component={Paper}>
        <Table aria-label="historical prices table">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell align="right">Open</TableCell>
              <TableCell align="right">High</TableCell>
              <TableCell align="right">Low</TableCell>
              <TableCell align="right">Close</TableCell>
              <TableCell align="right">Volume</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0 ? historicalPrices.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : historicalPrices).map((price: any) => (
              <TableRow key={price.id}>
                <TableCell component="th" scope="row">
                  {price.priceDate.toLocaleDateString()}
                </TableCell>
                <TableCell align="right">{price.open}</TableCell>
                <TableCell align="right">{price.high}</TableCell>
                <TableCell align="right">{price.low}</TableCell>
                <TableCell align="right">{price.close}</TableCell>
                <TableCell align="right">{price.volume}</TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5]}
        component="div"
        count={historicalPrices.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Footer />
    </div>
  );
}
