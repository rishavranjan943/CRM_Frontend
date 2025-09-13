import React, { useEffect, useState } from "react";
import api from "../api/axios";
import {
  Container, Typography, TextField, MenuItem, Button, Paper, Box, Card
} from "@mui/material";

const Campaigns = () => {
  const [segments, setSegments] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [form, setForm] = useState({ segment_id: "", message: "" });
  const [goal, setGoal] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const fetchSegments = async () => {
    const res = await api.get("/segments");
    setSegments(res.data.segments);
  };

  const fetchCampaigns = async () => {
    const res = await api.get("/campaigns/history");
    setCampaigns(res.data.history);
  };

  const createCampaign = async (e) => {
    e.preventDefault();
    const selectedSeg = segments.find(s => s._id === form.segment_id);
    const segName = selectedSeg?.name || "Campaign";
    const campaignName = `${segName} - ${new Date().toLocaleDateString()}`;
    await api.post("/campaigns", {
      name: campaignName,
      segment_id: form.segment_id,
      message_template: form.message
    });
    setForm({ segment_id: "", message: "" });
    setSuggestions([]);
    fetchCampaigns();
  };

  const getSuggestions = async () => {
    if (!goal.trim()) return;
    try {
      const res = await api.post("/ai/campaign-suggest", { goal });
      setSuggestions(res.data.suggestions || []);
    } catch (err) {
      console.error(err);
      alert("Could not get AI suggestions");
    }
  };

  useEffect(() => {
    fetchSegments();
    fetchCampaigns();
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Create Campaign</Typography>

      <Paper sx={{ p: 3, mb: 4 }} component="form" onSubmit={createCampaign}>
        <TextField
          select fullWidth required
          label="Select Segment"
          value={form.segment_id}
          onChange={(e) => setForm({ ...form, segment_id: e.target.value })}
          sx={{ mb: 2 }}
        >
          {segments.map((s) => (
            <MenuItem key={s._id} value={s._id}>
              {s.name} ({s.match_count} users)
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth multiline required rows={3}
          label="Message Template"
          placeholder="Hi {{name}}, you spent ₹{{total_spend}}"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          sx={{ mb: 2 }}
        />

        <Button variant="contained" type="submit">Send Campaign</Button>
      </Paper>

      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" gutterBottom>Need help writing a message?</Typography>
        <Box display="flex" gap={2} mb={2}>
          <TextField
            label="Goal"
            placeholder='e.g. "Bring back inactive users"'
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            fullWidth
          />
          <Button variant="outlined" onClick={getSuggestions}>Get Suggestions</Button>
        </Box>

        {suggestions.length > 0 && (
          <Box display="grid" gap={2}>
            {suggestions.map((s, i) => (
              <Card
                key={i}
                sx={{ p: 2, cursor: "pointer" }}
                onClick={() => setForm({ ...form, message: s })}
              >
                {s}
              </Card>
            ))}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Campaigns;
