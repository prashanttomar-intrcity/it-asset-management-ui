import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import AssignAssetModal from "../../components/AssignAssetModal";

/* FIXED SIZES */
const CARD_HEIGHT = 360;
const IMAGE_HEIGHT = 180;

/* ASSETS DATA */
const assetsData = [
  {
    id: "AST-L-001",
    type: "Laptop",
    name: "Dell Latitude 5420",
    serial: "ABC123",
    status: "Not Assigned",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
  },
  {
    id: "AST-L-002",
    type: "Laptop",
    name: "HP EliteBook 840",
    serial: "XYZ789",
    status: "Assigned",
    image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04",
  },
  {
    id: "AST-L-003",
    type: "Laptop",
    name: "Lenovo ThinkPad X1",
    serial: "LEN456",
    status: "Not Assigned",
    image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2",
  },
  {
    id: "AST-L-004",
    type: "Laptop",
    name: "Apple MacBook Pro",
    serial: "MAC999",
    status: "Assigned",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
  },
  {
    id: "AST-L-005",
    type: "Laptop",
    name: "ASUS ZenBook 14",
    serial: "ASU321",
    status: "Not Assigned",
    image: "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d",
  },

  {
    id: "AST-S-001",
    type: "Server",
    name: "Dell PowerEdge R740",
    serial: "SRV001",
    status: "Assigned",
    image: "https://images.unsplash.com/photo-1581092918367-7a1f7b0b6f88",
  },
  {
    id: "AST-S-002",
    type: "Server",
    name: "HP ProLiant DL380",
    serial: "SRV002",
    status: "Not Assigned",
    image: "https://images.unsplash.com/photo-1581090700227-1e37b190418e",
  },

  {
    id: "AST-R-001",
    type: "Router",
    name: "Cisco ISR 4451",
    serial: "RTR001",
    status: "Assigned",
    image: "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7",
  },
  {
    id: "AST-R-002",
    type: "Router",
    name: "Juniper MX480",
    serial: "RTR002",
    status: "Not Assigned",
    image: "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7",
  },

  {
    id: "AST-C-001",
    type: "CCTV",
    name: "Hikvision Dome Camera",
    serial: "CCTV01",
    status: "Assigned",
    image: "https://images.unsplash.com/photo-1580894908361-967195033215",
  },
  {
    id: "AST-C-002",
    type: "CCTV",
    name: "CP Plus Bullet Camera",
    serial: "CCTV02",
    status: "Not Assigned",
    image: "https://images.unsplash.com/photo-1580894908361-967195033215",
  },
];

export default function AllAssets() {
  const navigate = useNavigate();

  const [filter, setFilter] = useState("Laptop");
  const [assets, setAssets] = useState(assetsData);
  const [openAssign, setOpenAssign] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);

  const filteredAssets = assets.filter((a) => a.type === filter);

  const openAssignModal = (asset) => {
    setSelectedAsset(asset);
    setOpenAssign(true);
  };

  const handleAssign = (user) => {
    setAssets((prev) =>
      prev.map((a) =>
        a.id === selectedAsset.id ? { ...a, status: "Assigned" } : a,
      ),
    );
    setOpenAssign(false);
  };

  const handleUnassign = () => {
    setAssets((prev) =>
      prev.map((a) =>
        a.id === selectedAsset.id ? { ...a, status: "Not Assigned" } : a,
      ),
    );
    setOpenAssign(false);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f6f8" }}>
      <Sidebar />

      <Box sx={{ flex: 1 }}>
        <Navbar />

        <Box sx={{ p: 4 }}>
          <Typography variant="h4" fontWeight="bold" mb={3}>
            All Assets
          </Typography>

          <ToggleButtonGroup
            value={filter}
            exclusive
            onChange={(e, v) => v && setFilter(v)}
            sx={{ mb: 4 }}
          >
            <ToggleButton value="Laptop">Laptop</ToggleButton>
            <ToggleButton value="Server">Server</ToggleButton>
            <ToggleButton value="Router">Router</ToggleButton>
            <ToggleButton value="CCTV">CCTV</ToggleButton>
          </ToggleButtonGroup>

          <Grid container spacing={4}>
            {filteredAssets.map((asset) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={asset.id}>
                <Card
                  sx={{
                    height: CARD_HEIGHT,
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 4,
                    overflow: "hidden",
                    boxShadow: 4,
                  }}
                >
                  <Box
                    sx={{
                      height: IMAGE_HEIGHT,
                      backgroundImage: `url(${asset.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />

                  <CardContent
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <Typography fontWeight="bold">{asset.name}</Typography>
                      <Typography variant="body2">
                        Serial: {asset.serial}
                      </Typography>

                      <Chip
                        label={asset.status}
                        color={
                          asset.status === "Assigned" ? "success" : "warning"
                        }
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    </Box>

                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => navigate(`/admin/assets/${asset.id}`)}
                      >
                        Details
                      </Button>

                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => openAssignModal(asset)}
                      >
                        {asset.status === "Assigned" ? "Manage" : "Assign"}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      {selectedAsset && (
        <AssignAssetModal
          open={openAssign}
          asset={selectedAsset}
          onClose={() => setOpenAssign(false)}
          onAssign={handleAssign}
          onUnassign={handleUnassign}
        />
      )}
    </Box>
  );
}
