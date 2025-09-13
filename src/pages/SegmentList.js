import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import {
  Container, Typography, Button, Paper, Table, TableHead, TableRow,
  TableCell, TableBody, Stack, TextField, TablePagination
} from "@mui/material";

export default function SegmentList() {
  const [segments, setSegments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  const fetchSegments = async () => {
    const res = await api.get("/segments", {
      params: { page: page + 1, limit: rowsPerPage, search },
    });
    setSegments(res.data?.segments || []);
    setTotal(res.data?.total || 0);
  };

  const viewCustomers = async (id) => {
    setSelected(id);
    const res = await api.get(`/segments/${id}/customers`);
    setCustomers(res.data.customers || []);
  };

  const deleteSegment = async (id) => {
    if (!window.confirm("Delete this segment?")) return;
    await api.delete(`/segments/${id}`);
    fetchSegments();
  };

  const duplicateSegment = (seg) => {
    localStorage.setItem("segmentDraft", JSON.stringify(seg));
    navigate("/segments");
  };

  useEffect(() => { fetchSegments(); }, [page, rowsPerPage]);

  const handleSearch = () => {
    setPage(0);
    fetchSegments();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" mb={3}>Saved Segments</Typography>

      <Stack direction="row" spacing={2} mb={2}>
        <TextField
          placeholder="Search by name"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="outlined" onClick={handleSearch}>Search</Button>
      </Stack>

      <Paper sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Matches</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {segments.map(s => (
              <TableRow key={s._id}>
                <TableCell>{s.name}</TableCell>
                <TableCell>{s.match_count}</TableCell>
                <TableCell>{new Date(s.created_at).toLocaleString()}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button onClick={() => viewCustomers(s._id)}>View</Button>
                    <Button onClick={() => duplicateSegment(s)}>Duplicate</Button>
                    <Button color="error" onClick={() => deleteSegment(s._id)}>Delete</Button>
                  </Stack>
                </TableCell>
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

      {selected && (
        <>
          <Typography variant="h6">Customers in Segment</Typography>
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell><TableCell>Email</TableCell>
                  <TableCell>Spend</TableCell><TableCell>Visits</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {customers.map(c => (
                  <TableRow key={c._id}>
                    <TableCell>{c.name}</TableCell>
                    <TableCell>{c.email}</TableCell>
                    <TableCell>₹{c.total_spend}</TableCell>
                    <TableCell>{c.visits}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </>
      )}
    </Container>
  );
}
