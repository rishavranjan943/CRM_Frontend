import React, { useEffect, useState } from "react";
import api from "../api/axios";
import {
  Container, Typography, TextField, Button, MenuItem,
  Table, TableBody, TableCell, TableHead, TableRow, Paper, Stack
} from "@mui/material";

export default function Orders() {
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ customer_id: "", amount: "" });

  const fetchOrders = async () => {
    const res = await api.get("/orders");
    setOrders(res.data.orders || []);
  };

  const fetchCustomers = async () => {
    const res = await api.get("/customers");
    setCustomers(res.data.customers || []);
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
  }, []);

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
                <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>
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
      </Paper>
    </Container>
  );
}
