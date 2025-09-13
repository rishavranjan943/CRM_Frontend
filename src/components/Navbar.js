import React, { useContext } from "react";
import { AppBar, Toolbar, Typography, Button, Stack } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { token, logout, getUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Stack direction="row" spacing={2}>
          {token && (
            <>
              <Button color="inherit" component={Link} to="/">Dashboard</Button>
              <Button color="inherit" component={Link} to="/customers">Customers</Button>
              <Button color="inherit" component={Link} to="/orders">Orders</Button>
              <Button color="inherit" component={Link} to="/segments">Segments</Button>
              <Button color="inherit" component={Link} to="/campaigns">Campaigns</Button>
            </>
          )}
        </Stack>
        <Stack direction="row" spacing={2} alignItems="center">
          {token && (
            <>
              <Typography>{user?.email}</Typography>
              <Button color="error" variant="contained" onClick={handleLogout}>Logout</Button>
            </>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
