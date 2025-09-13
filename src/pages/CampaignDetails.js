import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import api from "../api/axios";
import {
  Container, Typography, Paper, Table, TableHead, TableRow,
  TableCell, TableBody, Stack
} from "@mui/material";

export default function CampaignDetails() {
  const { id } = useParams();
  const [logs, setLogs] = useState([]);
  const [campaign, setCampaign] = useState(null);
  const [stats, setStats] = useState({ total: 0, sent: 0, failed: 0, pending: 0 });
  const [summary, setSummary] = useState("");

  const fetchLogs = async () => {
    const res = await api.get(`/campaigns/${id}/logs`);
    setLogs(res.data.logs || []);
  };

  const fetchCampaign = async () => {
    const res = await api.get("/campaigns/history");
    const all = res.data.history || [];
    const camp = all.find(c => c._id === id);
    if (camp) setCampaign(camp);
  };

  const calcStats = () => {
    const sent = logs.filter(l => l.status === "SENT").length;
    const failed = logs.filter(l => l.status === "FAILED").length;
    const pending = logs.filter(l => l.status === "PENDING").length;
    const total = logs.length;
    setStats({ total, sent, failed, pending });
  };

  const getSummary = async () => {
    if (!stats.total) return;
    const res = await api.post("/ai/campaigns/summary", { stats });
    setSummary(res.data.summary);
  };

  useEffect(() => {
    fetchLogs(); fetchCampaign();
  }, [id]);

  useEffect(() => {
    if (logs.length > 0) calcStats();
  }, [logs]);

  useEffect(() => {
    if (stats.total > 0) getSummary();
  }, [stats]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" mb={3}>Campaign Details</Typography>

      {campaign && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography><b>Name:</b> {campaign.name}</Typography>
          <Typography><b>Status:</b> {campaign.status}</Typography>
          <Typography><b>Audience:</b> {campaign.audience_size}</Typography>
          <Typography><b>Created:</b> {new Date(campaign.created_at).toLocaleString()}</Typography>
        </Paper>
      )}

      <Typography variant="h6">Stats</Typography>
      <Stack direction="row" spacing={3} my={2}>
        <Typography>Total: {stats.total}</Typography>
        <Typography>Sent: {stats.sent}</Typography>
        <Typography>Failed: {stats.failed}</Typography>
        <Typography>Pending: {stats.pending}</Typography>
      </Stack>

      {summary && <Paper sx={{ p: 2, mb: 3 }}>📊 {summary}</Paper>}

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Customer ID</TableCell><TableCell>Message</TableCell>
              <TableCell>Status</TableCell><TableCell>Delivered At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map(l => (
              <TableRow key={l._id}>
                <TableCell>{l.customer_id}</TableCell>
                <TableCell>{l.message}</TableCell>
                <TableCell>{l.status}</TableCell>
                <TableCell>{l.delivered_at ? new Date(l.delivered_at).toLocaleString() : "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}
