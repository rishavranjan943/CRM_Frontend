import React from "react";
import { Link } from "react-router-dom";
import { Container, Typography, List, ListItemButton } from "@mui/material";

const Dashboard = () => (
  <Container sx={{ mt: 4 }}>
    <Typography variant="h4" gutterBottom>Welcome to Xeno CRM</Typography>
    <Typography gutterBottom>Use the links below to navigate:</Typography>
    <List>
      <ListItemButton component={Link} to="/customers">Customers</ListItemButton>
      <ListItemButton component={Link} to="/orders">Orders</ListItemButton>
      <ListItemButton component={Link} to="/segments">Segments</ListItemButton>
      <ListItemButton component={Link} to="/segments/list">Saved Segments</ListItemButton>
      <ListItemButton component={Link} to="/campaigns">Campaigns</ListItemButton>
      <ListItemButton component={Link} to="/campaign-history">Campaign History</ListItemButton>
    </List>
  </Container>
);

export default Dashboard;
