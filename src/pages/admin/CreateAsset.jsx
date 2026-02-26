import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
  Grid,
} from "@mui/material";
import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

export default function CreateAsset() {
  const [assetType, setAssetType] = useState("Laptop");
  const [image, setImage] = useState(null);

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
          <Paper sx={{ p: 4, maxWidth: 900 }}>
            <Typography variant="h5" fontWeight="bold" mb={3}>
              Create Asset
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  label="Asset Category"
                  fullWidth
                  value={assetType}
                  onChange={(e) => setAssetType(e.target.value)}
                >
                  <MenuItem value="Laptop">Laptop</MenuItem>
                  <MenuItem value="Server">Server</MenuItem>
                  <MenuItem value="Router">Router</MenuItem>
                  <MenuItem value="CCTV">CCTV</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField label="Asset Tag (AST-XXXX)" fullWidth />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField label="Brand" fullWidth />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField label="Model ID" fullWidth />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField label="Serial Number" fullWidth />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField label="Location" fullWidth />
              </Grid>

              {assetType === "Laptop" && (
                <>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Configuration (i5/16GB/512GB)"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField label="Operating System" fullWidth />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField label="CPU Core" fullWidth />
                  </Grid>
                </>
              )}

              <Grid item xs={12} md={6}>
                <TextField
                  label="Purchase Date"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField label="Purchase Cost" type="number" fullWidth />
              </Grid>

              <Grid item xs={12}>
                <Button variant="outlined" component="label">
                  Upload Asset Image
                  <input
                    hidden
                    type="file"
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                </Button>
                {image && <Typography mt={1}>{image.name}</Typography>}
              </Grid>

              <Grid item xs={12}>
                <Button variant="contained" size="large">
                  Create Asset
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
