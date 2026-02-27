import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Divider,
  InputAdornment,
  Stack,
} from "@mui/material";
import {
  LaptopMacOutlined,
  LocationOnOutlined,
  CalendarMonthOutlined,
  AttachMoneyOutlined,
  MemoryOutlined,
  SettingsOutlined,
  BuildCircleOutlined,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { createAsset, getAssetOptions } from "../../api/assets.api";

export default function CreateAsset() {
  const [assetType, setAssetType] = useState("Laptop");
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    asset_category: "Laptop",
    brand: "",
    model_id: "",
    serial_number: "",
    configuration: "",
    operating_system: "",
    cpu_core: "",
    location: "",
    purchase_date: "",
    purchase_cost: "",
  });

  const [loading, setLoading] = useState(false);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      const res = await getAssetOptions();
      setLocations(res.data.locations || []);
      setCategories(res.data.categories || []);
    } catch {
      setError("Failed to load asset options");
    } finally {
      setOptionsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const newType = e.target.value;
    setAssetType(newType);
    setForm((prev) => ({
      ...prev,
      asset_category: newType,
      configuration: "",
      operating_system: "",
      cpu_core: "",
    }));
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await createAsset(form);
      setSuccess("✅ Asset created successfully!");

      // Reset form (keep current category)
      setForm({
        asset_category: assetType,   // ← THIS WAS THE FIX (was 'newType' before)
        brand: "",
        model_id: "",
        serial_number: "",
        configuration: "",
        operating_system: "",
        cpu_core: "",
        location: "",
        purchase_date: "",
        purchase_cost: "",
      });
    } catch (err) {
      setError(err.response?.data?.errors?.join(", ") || "Failed to create asset");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({
      asset_category: assetType,
      brand: "",
      model_id: "",
      serial_number: "",
      configuration: "",
      operating_system: "",
      cpu_core: "",
      location: "",
      purchase_date: "",
      purchase_cost: "",
    });
    setError("");
    setSuccess("");
  };

  return (
    <Box sx={{ display: "flex", bgcolor: "background.default", minHeight: "100vh" }}>
      <Sidebar />
      <Box sx={{ flex: 1 }}>
        <Navbar />

        <Box sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
          {/* Modern Header */}
          <Stack direction="row" alignItems="center" spacing={3} mb={5}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "16px",
                bgcolor: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                boxShadow: 3,
              }}
            >
              <LaptopMacOutlined sx={{ fontSize: 36 }} />
            </Box>
            <Box>
              <Typography variant="h3" fontWeight="700" gutterBottom>
                Create New Asset
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Add a new device or equipment to your inventory
              </Typography>
            </Box>
          </Stack>

          <Paper
            sx={{
              p: { xs: 4, md: 6 },
              borderRadius: 4,
              boxShadow: "0 12px 40px rgba(0,0,0,0.06)",
              maxWidth: 1080,
              mx: "auto",
            }}
          >
            {error && (
              <Alert severity="error" sx={{ mb: 4 }} onClose={() => setError("")}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 4 }} onClose={() => setSuccess("")}>
                {success}
              </Alert>
            )}

            {optionsLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
                <CircularProgress size={70} thickness={5} />
              </Box>
            ) : (
              <Stack spacing={6}>
                {/* Basic Information Section */}
                <Box>
                  <Typography
                    variant="h5"
                    fontWeight={600}
                    gutterBottom
                    sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                  >
                    <SettingsOutlined color="primary" /> Basic Information
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        select
                        fullWidth
                        label="Asset Category"
                        name="asset_category"
                        value={form.asset_category}
                        onChange={handleCategoryChange}
                        required
                        size="medium"
                      >
                        {categories.map((cat) => (
                          <MenuItem key={cat} value={cat}>
                            {cat}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Brand"
                        name="brand"
                        value={form.brand}
                        onChange={handleInputChange}
                        required
                        placeholder="Dell, HP, Lenovo..."
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <BuildCircleOutlined fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Model ID"
                        name="model_id"
                        value={form.model_id}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g. ThinkPad X1 Carbon"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Serial Number"
                        name="serial_number"
                        value={form.serial_number}
                        onChange={handleInputChange}
                        required
                        placeholder="SN123456789"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        select
                        fullWidth
                        label="Location"
                        name="location"
                        value={form.location}
                        onChange={handleInputChange}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocationOnOutlined fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                      >
                        {locations.map((loc) => (
                          <MenuItem key={loc} value={loc}>
                            {loc}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>
                </Box>

                {/* Hardware Specifications (Laptop only) */}
                {assetType === "Laptop" && (
                  <Box>
                    <Typography
                      variant="h5"
                      fontWeight={600}
                      gutterBottom
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                      <MemoryOutlined color="primary" /> Hardware Specifications
                    </Typography>
                    <Divider sx={{ mb: 3 }} />

                    <Grid container spacing={3}>
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="Configuration"
                          name="configuration"
                          value={form.configuration}
                          onChange={handleInputChange}
                          placeholder="16GB RAM • 512GB SSD • 14″"
                          helperText="RAM, storage, screen size, etc."
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="Operating System"
                          name="operating_system"
                          value={form.operating_system}
                          onChange={handleInputChange}
                          placeholder="Windows 11 Pro / macOS Sonoma"
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="CPU"
                          name="cpu_core"
                          value={form.cpu_core}
                          onChange={handleInputChange}
                          placeholder="Intel i7-13700H / Ryzen 7 7840HS"
                        />
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {/* Purchase Details */}
                <Box>
                  <Typography
                    variant="h5"
                    fontWeight={600}
                    gutterBottom
                    sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                  >
                    <AttachMoneyOutlined color="primary" /> Purchase Details
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Purchase Date"
                        type="date"
                        name="purchase_date"
                        value={form.purchase_date}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <CalendarMonthOutlined fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Purchase Cost"
                        type="number"
                        name="purchase_cost"
                        value={form.purchase_cost}
                        onChange={handleInputChange}
                        placeholder="45000"
                        InputProps={{
                          startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                        }}
                        helperText="Amount in Indian Rupees"
                      />
                    </Grid>
                  </Grid>
                </Box>

                {/* Action Buttons */}
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="flex-end" pt={3}>
                  <Button variant="outlined" size="large" onClick={handleReset} sx={{ px: 6 }} disabled={loading}>
                    Reset Form
                  </Button>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleSubmit}
                    disabled={loading}
                    sx={{ px: 8, py: 1.5, fontSize: "1.05rem", fontWeight: 600 }}
                  >
                    {loading ? (
                      <>
                        <CircularProgress size={24} sx={{ mr: 1.5 }} color="inherit" />
                        Creating Asset...
                      </>
                    ) : (
                      "Create Asset"
                    )}
                  </Button>
                </Stack>
              </Stack>
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}