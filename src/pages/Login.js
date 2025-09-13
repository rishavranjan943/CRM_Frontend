import React from "react";
import { Container, Typography, Button } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";

const Login = () => (
  <Container sx={{ mt: 10, textAlign: "center" }}>
    <Typography variant="h4" gutterBottom>Login to Xeno CRM</Typography>
    <Button
      variant="contained"
      startIcon={<GoogleIcon />}
      href={`${process.env.REACT_APP_API_URL}/auth/google`}
      sx={{ mt: 3 }}
    >
      Login with Google
    </Button>
  </Container>
);

export default Login;
