import React, { useEffect, useState } from "react";
import api from "../api/axios";
import {
  Container, Typography, TextField, Button,
  Table, TableBody, TableCell, TableHead, TableRow, Paper, Stack
} from "@mui/material";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  const fetchCustomers = async () => {
    const res = await api.get("/customers");
    setCustomers(res.data?.customers || res.data || []);
  };

  const addCustomer = async (e) => {
    e.preventDefault();
    await api.post("/customers", form);
    setForm({ name: "", email: "", phone: "" });
    fetchCustomers();
  };

  useEffect(() => { fetchCustomers(); }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" mb={3}>Customers</Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <form onSubmit={addCustomer}>
          <Stack direction="row" spacing={2}>
            <TextField label="Name" fullWidth value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <TextField label="Email" type="email" fullWidth value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <TextField label="Phone" fullWidth value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
            <Button type="submit" variant="contained">Add</Button>
          </Stack>
        </form>
      </Paper>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              {["ID","Name","Email","Phone","Spend","Visits"].map(h => (
                <TableCell key={h}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map(c => (
              <TableRow key={c._id}>
                <TableCell>{c.customer_id}</TableCell>
                <TableCell>{c.name}</TableCell>
                <TableCell>{c.email}</TableCell>
                <TableCell>{c.phone}</TableCell>
                <TableCell>₹{c.total_spend||0}</TableCell>
                <TableCell>{c.visits||0}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}
