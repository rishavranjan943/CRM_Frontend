import React, { useEffect, useState } from "react";
import api from "../api/axios";
import {
  Container, Typography, TextField, Button, MenuItem,
  Table, TableBody, TableCell, TableHead, TableRow, Paper, Stack, TablePagination
} from "@mui/material";

export default function Orders() {
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ customer_id: "", amount: "" });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  const fetchOrders = async () => {
    const res = await api.get("/orders", {
      params: { page: page + 1, limit: rowsPerPage, search }
    });
    setOrders(res.data?.orders || []);
    setTotal(res.data?.total || 0);
  };

  const fetchCustomers = async () => {
    const res = await api.get("/customers");
    setCustomers(res.data.data || []);
  };

  const addOrder = async (e) => {
    e.preventDefault();
    await api.post("/orders", form);
    setForm({ customer_id: "", amount: "" });
    fetchOrders();
  };

  useEffect(() => {
    fetchOrders();
    fetchCustomers();
  }, [page, rowsPerPage]);

  const handleSearch = () => {
    setPage(0);
    fetchOrders();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" mb={3}>Orders</Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <form onSubmit={addOrder}>
          <Stack direction="row" spacing={2}>
            <TextField
              select label="Customer" fullWidth
              value={form.customer_id}
              onChange={(e) => setForm({ ...form, customer_id: e.target.value })}
              required
            >
              {customers.map(c => (
                <MenuItem key={c._id} value={c.customer_id}>
                  {c.name} - {c.customer_id}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Amount" type="number" fullWidth
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              required
            />
            <Button type="submit" variant="contained">Add</Button>
          </Stack>
        </form>
      </Paper>

      <Stack direction="row" spacing={2} mb={2}>
        <TextField
          placeholder="Search by customer ID"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="outlined" onClick={handleSearch}>Search</Button>
      </Stack>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              {["Customer","Amount","Date"].map(h => <TableCell key={h}>{h}</TableCell>)}
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map(o => (
              <TableRow key={o._id}>
                <TableCell>{o.customer?.name || o.customer_id}</TableCell>
                <TableCell>₹{o.amount}</TableCell>
                <TableCell>{new Date(o.created_at).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>
    </Container>
  );
}
