import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress
} from "@mui/material";

const CampaignHistory = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCampaigns = async () => {
    try {
      const res = await api.get("/campaigns/history");
      setCampaigns(res.data.history);
    } catch (err) {
      console.error("Failed to fetch campaign history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  if (loading) {
    return (
      <Container sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        📊 Campaign History
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Name</b></TableCell>
              <TableCell><b>Audience</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Created</b></TableCell>
              <TableCell><b>View Logs</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {campaigns.map((c) => (
              <TableRow key={c._id} hover>
                <TableCell>{c.name}</TableCell>
                <TableCell>{c.audience_size}</TableCell>
                <TableCell>{c.status}</TableCell>
                <TableCell>
                  {new Date(c.created_at).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate(`/campaigns/${c._id}`)}
                  >
                    View Logs
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default CampaignHistory;
