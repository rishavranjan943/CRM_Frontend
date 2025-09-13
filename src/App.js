import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useContext } from "react";
import { AuthProvider, AuthContext } from "./context/AuthContext";

import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";


import SegmentList from "./pages/SegmentList";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Orders from "./pages/Orders";
import Segments from "./pages/Segments";
import Campaigns from "./pages/Campaigns";
import CampaignDetails from "./pages/CampaignDetails";
import CampaignHistory from "./pages/CampaignHistory";


function TokenHandler() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      login(token);
      const url = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, url);
      navigate("/");
    }
  }, [login, navigate]);

  return null;
}

export default function App() {
  const theme = createTheme({
    palette: {
      mode: "light",
      primary: { main: "#118d11ff" },
      secondary: { main: "#872541ff" },
    },
    shape: { borderRadius: 12 },
    components: {
      MuiButton: { styleOverrides: { root: { textTransform: "none" } } },
    },
  });

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Navbar />
          <TokenHandler />
          <Routes>
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customers"
              element={
                <ProtectedRoute>
                  <Customers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/segments"
              element={
                <ProtectedRoute>
                  <Segments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/segments/list"
              element={
                <ProtectedRoute>
                  <SegmentList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/campaigns"
              element={
                <ProtectedRoute>
                  <Campaigns />
                </ProtectedRoute>
              }
            />
            <Route
              path="/campaign-history"
              element={
                <ProtectedRoute>
                  <CampaignHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/campaigns/:id"
              element={
                <ProtectedRoute>
                  <CampaignDetails />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}
