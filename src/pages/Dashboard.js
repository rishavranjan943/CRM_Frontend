import React from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardContent
} from "@mui/material";

const sections = [
  { title: "Customers", path: "/customers" },
  { title: "Orders", path: "/orders" },
  { title: "Segments", path: "/segments" },
  { title: "Saved Segments", path: "/segments/list" },
  { title: "Campaigns", path: "/campaigns" },
  { title: "Campaign History", path: "/campaign-history" },
];

export default function Dashboard() {
  return (
    <Container sx={{ mt: 6 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to Xeno CRM
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Choose a module to get started:
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {sections.map((sec) => (
          <Grid item xs={12} sm={6} md={4} key={sec.title}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 3,
                "&:hover": { boxShadow: 6, transform: "translateY(-3px)" },
                transition: "0.2s",
              }}
            >
              <CardActionArea component={Link} to={sec.path}>
                <CardContent sx={{ textAlign: "center", py: 4 }}>
                  <Typography variant="h6" fontWeight="bold">
                    {sec.title}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
