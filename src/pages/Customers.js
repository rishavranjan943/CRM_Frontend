import React, { useEffect, useState } from "react";
import api from "../api/axios";
import {
  Container, Typography, TextField, Button, Table, TableBody,
  TableCell, TableHead, TableRow, Paper, Stack, TablePagination
} from "@mui/material";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  const fetchCustomers = async () => {
    const res = await api.get("/customers", {
      params: { page: page + 1, limit: rowsPerPage, search },
    });
    setCustomers(res.data?.data || []);
    setTotal(res.data?.total || 0);
  };

  const addCustomer = async (e) => {
    e.preventDefault();
    await api.post("/customers", form);
    setForm({ name: "", email: "", phone: "" });
    fetchCustomers();
  };

  useEffect(() => {
    fetchCustomers();
  }, [page, rowsPerPage]);

  const handleSearch = () => {
    setPage(0);
    fetchCustomers();
  };

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

      <Stack direction="row" spacing={2} mb={2}>
        <TextField
          placeholder="Search by name or email"
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
