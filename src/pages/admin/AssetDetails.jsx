import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Button,
  Divider,
} from "@mui/material";
import { useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import AssetHistoryTimeline from "../../components/AssetHistoryTimeline";

export default function AssetDetails() {
  const { id } = useParams();

  const asset = {
    id: "AST-001",
    type: "Laptop",
    brand: "Dell",
    model: "Latitude 5420",
    serial: "ABC123",
    configuration: "Intel i5 | 16GB RAM | 512GB SSD",
    os: "Windows 11 Pro",
    cpu: "Intel Core i5 11th Gen",
    purchaseDate: "2023-02-15",
    purchaseCost: "₹78,000",
    location: "Gurgaon Office",
    status: "Not Assigned",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
  };

  const history = [
    {
      user: "Aman Verma (EMP003)",
      from: "2023-03-01",
      to: "2023-12-10",
    },
    {
      user: "Rahul Sharma (EMP001)",
      from: "2024-01-05",
      to: "2024-08-30",
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        bgcolor: "background.default",
        minHeight: "100vh",
      }}
    >
      <Sidebar />

      <Box sx={{ flex: 1 }}>
        <Navbar />

        <Box sx={{ p: 4 }}>
          <Paper sx={{ p: 4, mb: 4 }}>
            <Grid container spacing={4}>
              {/* IMAGE */}
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    height: 220,
                    borderRadius: 3,
                    backgroundImage: `url(${asset.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              </Grid>

              {/* DETAILS */}
              <Grid item xs={12} md={8}>
                <Typography variant="h4" fontWeight="bold">
                  {asset.brand} {asset.model}
                </Typography>

                <Chip
                  label={asset.status}
                  color={asset.status === "Assigned" ? "success" : "warning"}
                  sx={{ mt: 1 }}
                />

                <Divider sx={{ my: 3 }} />

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography>
                      <b>Asset ID:</b> {asset.id}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>
                      <b>Serial:</b> {asset.serial}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>
                      <b>Configuration:</b> {asset.configuration}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>
                      <b>Operating System:</b> {asset.os}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>
                      <b>CPU:</b> {asset.cpu}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>
                      <b>Location:</b> {asset.location}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>
                      <b>Purchase Date:</b> {asset.purchaseDate}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>
                      <b>Purchase Cost:</b> {asset.purchaseCost}
                    </Typography>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
                  <Button variant="contained">Assign / Reassign</Button>
                  <Button variant="outlined" color="error">
                    Unassign
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* HISTORY */}
          <Paper sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight="bold" mb={3}>
              Laptop Assignment History
            </Typography>

            <AssetHistoryTimeline history={history} />
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
