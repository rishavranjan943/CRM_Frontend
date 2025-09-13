import React, { useState } from "react";
import api from "../api/axios";
import {
  Container, Typography, TextField, Button, Paper,
  Stack, Table, TableHead, TableRow, TableCell, TableBody
} from "@mui/material";
import RuleGroup from "../components/RuleGroup";

export default function Segments() {
  const [name, setName] = useState("");
  const [rules, setRules] = useState({ op: "AND", children: [] });
  const [prompt, setPrompt] = useState("");
  const [preview, setPreview] = useState([]);

  const previewSegment = async () => {
    const res = await api.post("/segments/preview", { rules });
    setPreview(res.data.customers || []);
  };

  const saveSegment = async () => {
    if (!name) {
      alert("Enter Name");
      return;
    }
    await api.post("/segments", { name, rules });
    setName("");
    setRules({ op: "AND", children: [] });
    setPreview([]);
    alert("Segment saved");
  };

  const generateRulesFromNL = async () => {
    if (!prompt) {
      alert("Enter a description");
      return;
    }
    try {
      console.log(prompt)
      const res = await api.post("/ai/segment-nl", { prompt });
      if (res.data.ok) {
        setRules(res.data.rules);
      } else {
        alert("Could not generate rules");
      }
    } catch (err) {
      alert("Error generating rules");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" mb={3}>Create Segment</Typography>

      <TextField
        label="Segment Name"
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
        sx={{ mb: 3 }}
      />

      <TextField
        label="Describe your segment in plain English"
        fullWidth
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button variant="outlined" onClick={generateRulesFromNL} sx={{ mb: 3 }}>
        Generate Rules from Description
      </Button>

      <RuleGroup node={rules} onChange={setRules} isRoot />

      <Stack direction="row" spacing={2} mb={3} mt={3}>
        <Button variant="contained" onClick={previewSegment}>Preview</Button>
        <Button variant="outlined" onClick={saveSegment}>Save</Button>
      </Stack>

      {preview.length > 0 && (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell><TableCell>Email</TableCell>
                <TableCell>Total Spend</TableCell><TableCell>Visits</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {preview.map(c => (
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
      )}
    </Container>
  );
}
