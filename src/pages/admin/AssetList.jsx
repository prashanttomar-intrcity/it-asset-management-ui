import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import AssignModal from "../../components/AssignModal";

const laptops = [
  {
    id: "AST-001",
    brand: "Dell",
    model: "Latitude 5420",
    serial: "ABC123",
    status: "Not Assigned",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
  },
  {
    id: "AST-002",
    brand: "HP",
    model: "EliteBook",
    serial: "XYZ789",
    status: "Assigned",
    image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04",
  },
];

export default function AssetList() {
  const navigate = useNavigate();
  const [assignOpen, setAssignOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);

  const handleAssignOpen = (asset) => {
    setSelectedAsset(asset);
    setAssignOpen(true);
  };

  const handleAssignClose = () => {
    setAssignOpen(false);
    setSelectedAsset(null);
  };

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
          <Typography variant="h4" fontWeight="bold" mb={3}>
            Laptop Assets
          </Typography>

          <Grid container spacing={4}>
            {laptops.map((laptop) => (
              <Grid item xs={12} md={4} key={laptop.id}>
                <Card
                  sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    transition: "0.3s",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: 8,
                    },
                  }}
                >
                  {/* IMAGE AREA */}
                  <Box
                    sx={{
                      height: 160,
                      backgroundImage: `url(${laptop.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />

                  <CardContent>
                    <Typography variant="h6" fontWeight="bold">
                      {laptop.brand} {laptop.model}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      Serial: {laptop.serial}
                    </Typography>

                    <Box sx={{ mt: 1 }}>
                      <Chip
                        label={laptop.status}
                        color={
                          laptop.status === "Assigned" ? "success" : "warning"
                        }
                        size="small"
                      />
                    </Box>

                    <Box sx={{ mt: 3, display: "flex", gap: 1 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => navigate(`/admin/assets/${laptop.id}`)}
                      >
                        Details
                      </Button>

                      {laptop.status === "Not Assigned" && (
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => handleAssignOpen(laptop)}
                        >
                          Assign To
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      {/* ASSIGN MODAL */}
      {selectedAsset && (
        <AssignModal
          open={assignOpen}
          onClose={handleAssignClose}
          asset={selectedAsset}
        />
      )}
    </Box>
  );
}
