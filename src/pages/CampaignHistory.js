import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import {
  Container, Typography, TextField, Button, Table, TableBody, TableCell,
  TableHead, TableRow, Paper, Stack, TablePagination
} from "@mui/material";

export default function CampaignHistory() {
  const [campaigns, setCampaigns] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  const fetchCampaigns = async () => {
    try {
      const res = await api.get("/campaigns/history", {
        params: { page: page + 1, limit: rowsPerPage, search },
      });
      setCampaigns(res.data?.history || []);
      setTotal(res.data?.total || 0);
    } catch (err) {
      console.error("Failed to fetch campaign history:", err);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [page, rowsPerPage]);

  const handleSearch = () => {
    setPage(0);
    fetchCampaigns();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" mb={3}>📊 Campaign History</Typography>

      <Stack direction="row" spacing={2} mb={2}>
        <TextField
          placeholder="Search by campaign name"
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
              <TableCell><b>Name</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Sent</b></TableCell>
              <TableCell><b>Failed</b></TableCell>
              <TableCell><b>Pending</b></TableCell>
              <TableCell><b>Created</b></TableCell>
              <TableCell><b>Logs</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {campaigns.map((c) => (
              <TableRow key={c._id} hover>
                <TableCell>{c.name}</TableCell>
                <TableCell>{c.status}</TableCell>
                <TableCell>{c.stats?.sent || 0}</TableCell>
                <TableCell>{c.stats?.failed || 0}</TableCell>
                <TableCell>{c.stats?.pending || 0}</TableCell>
                <TableCell>{new Date(c.created_at).toLocaleString()}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate(`/campaigns/${c._id}`)}
                  >
                    View
                  </Button>
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
    </Container>
  );
}
