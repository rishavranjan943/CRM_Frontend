import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import {
  Container, Typography, Button, Paper, Table, TableHead, TableRow,
  TableCell, TableBody, Stack
} from "@mui/material";

export default function SegmentList() {
  const [segments, setSegments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const fetchSegments = async () => {
    const res = await api.get("/segments");
    setSegments(res.data.segments || []);
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

  useEffect(() => { fetchSegments(); }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" mb={3}>Saved Segments</Typography>

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
