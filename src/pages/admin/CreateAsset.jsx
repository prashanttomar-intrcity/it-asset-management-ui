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
import { getUsers } from "../../api/users.api";
import {
  LaptopMacOutlined,
  LocationOnOutlined,
  CalendarMonthOutlined,
  AttachMoneyOutlined,
  MemoryOutlined,
  SettingsOutlined,
  BuildCircleOutlined,
  ConfirmationNumberOutlined,
  PersonOutlineOutlined,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // ✅ ADDED
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import {
  createAsset,
  updateAsset,   // ✅ ADDED
  getAsset,      // ✅ ADDED
  getAssetOptions,
} from "../../api/assets.api";

export default function CreateAsset() {
  const { id } = useParams();            // ✅ ADDED
  const navigate = useNavigate();        // ✅ ADDED
  const isEditMode = Boolean(id);        // ✅ ADDED

  const [assetType, setAssetType] = useState("Laptop");
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);

  const initialState = {
    asset_category: "Laptop",
    asset_tag: "",
    asset_status: "Working",
    brand: "",
    model_id: "",
    serial_number: "",
    configuration: "",
    operating_system: "",
    cpu_core: "",
    location: "",
    device_type: "",
    assigned_to: "",
    assigned_date: "",
    purchase_date: "",
    purchase_cost: "",
    warranty_years: "",
    warranty_expiry_date: "",
    repairing_cost: "",
    repairing_date: "",
  };

  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchOptions();
  }, []);

  // ✅ LOAD ASSET IN EDIT MODE
  useEffect(() => {
    if (isEditMode) {
      fetchAssetById();
    }
  }, [id]);

  const fetchOptions = async () => {
    try {
      const [assetRes, userRes] = await Promise.all([
        getAssetOptions(),
        getUsers(),
      ]);

      setLocations(assetRes.data.locations || []);
      setCategories(assetRes.data.categories || []);
      setUsers(userRes.data || []);
    } catch {
      setError("Failed to load asset options");
    } finally {
      setOptionsLoading(false);
    }
  };

  // ✅ FETCH SINGLE ASSET
  const fetchAssetById = async () => {
    try {
      setLoading(true);
      const res = await getAsset(id);
      const asset = res.data?.data || res.data;

      setForm({ ...initialState, ...asset });
      setAssetType(asset.asset_category);
    } catch {
      setError("Failed to load asset details");
    } finally {
      setLoading(false);
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
    }));
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const payload = { ...form };

      if (!payload.asset_tag) delete payload.asset_tag;
      if (!payload.device_type) delete payload.device_type;
      if (!payload.warranty_years) delete payload.warranty_years;
      if (!payload.warranty_expiry_date) delete payload.warranty_expiry_date;
      if (!payload.repairing_cost) delete payload.repairing_cost;
      if (!payload.repairing_date) delete payload.repairing_date;
      if (!payload.assigned_to) delete payload.assigned_to;
      if (!payload.assigned_date) delete payload.assigned_date;

      // ✅ SWITCH BETWEEN CREATE & UPDATE
      if (isEditMode) {
        await updateAsset(id, payload);
        setSuccess("✅ Asset updated successfully!");
      } else {
        await createAsset(payload);
        setSuccess("✅ Asset created successfully!");
        setForm({ ...initialState, asset_category: assetType });
      }

      // optional redirect after edit
      if (isEditMode) {
        setTimeout(() => {
          navigate("/admin/assets");
        }, 1000);
      }

    } catch (err) {
      setError(
        err.response?.data?.errors?.join(", ") ||
          "Failed to save asset"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({ ...initialState, asset_category: assetType });
    setError("");
    setSuccess("");
  };

  return (
    <Box sx={{ display: "flex", bgcolor: "background.default", minHeight: "100vh" }}>
      <Sidebar />
      <Box sx={{ flex: 1 }}>
        <Navbar />

        <Box sx={{ p: { xs: 3, md: 5 } }}>
          <Stack direction="row" alignItems="center" spacing={3} mb={5}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: 3,
                bgcolor: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            >
              <LaptopMacOutlined sx={{ fontSize: 36 }} />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight="700">
                {isEditMode ? "Edit Asset" : "Create New Asset"}
              </Typography>
              <Typography color="text.secondary">
                {isEditMode
                  ? "Update asset details"
                  : "Add a new device or equipment to inventory"}
              </Typography>
            </Box>
          </Stack>



          <Paper sx={{ p: 5, borderRadius: 4, maxWidth: 1100, mx: "auto" }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {success}
              </Alert>
            )}

            {optionsLoading ? (
              <Box sx={{ textAlign: "center", py: 8 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Stack spacing={6}>
                {/* BASIC INFO */}
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    Basic Information
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
                        label="Asset Tag (Optional)"
                        name="asset_tag"
                        value={form.asset_tag}
                        onChange={handleInputChange}
                        placeholder="Leave blank for auto-generation"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <ConfirmationNumberOutlined />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        select
                        fullWidth
                        label="Asset Status"
                        name="asset_status"
                        value={form.asset_status}
                        onChange={handleInputChange}
                      >
                        <MenuItem value="Working">Working</MenuItem>
                        <MenuItem value="Under Repair">Under Repair</MenuItem>
                        <MenuItem value="Damaged">Damaged</MenuItem>
                      </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6}>
  <TextField
    select
    fullWidth
    label="Assign To User"
    name="assigned_to"
    value={form.assigned_to}
    onChange={handleInputChange}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <PersonOutlineOutlined />
        </InputAdornment>
      ),
    }}
  >
    <MenuItem value="">
      <em>Not Assigned</em>
    </MenuItem>

    {users.map((u) => (
      <MenuItem key={u.emp_id} value={u.emp_id}>
        {u.name} ({u.emp_id})
      </MenuItem>
    ))}
  </TextField>
</Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        type="date"
                        fullWidth
                        label="Assigned Date"
                        name="assigned_date"
                        value={form.assigned_date}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Brand"
                        name="brand"
                        value={form.brand}
                        onChange={handleInputChange}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Model ID"
                        name="model_id"
                        value={form.model_id}
                        onChange={handleInputChange}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Serial Number"
                        name="serial_number"
                        value={form.serial_number}
                        onChange={handleInputChange}
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
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocationOnOutlined />
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

                {/* HARDWARE SPECIFICATIONS */}
                {assetType === "Laptop" && (
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      Hardware Specifications
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
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="Operating System"
                          name="operating_system"
                          value={form.operating_system}
                          onChange={handleInputChange}
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="CPU"
                          name="cpu_core"
                          value={form.cpu_core}
                          onChange={handleInputChange}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                )}
                {/* VENDOR DETAILS */}
<Box>
  <Typography variant="h6" fontWeight={600}>
    Vendor Details
  </Typography>
  <Divider sx={{ mb: 3 }} />

  <Grid container spacing={3}>
    <Grid item xs={12} sm={6}>
      <TextField
        fullWidth
        label="Vendor Name"
        name="vendor_name"
        value={form.vendor_name || ""}
        onChange={handleInputChange}
      />
    </Grid>

    <Grid item xs={12} sm={6}>
      <TextField
        fullWidth
        label="Vendor Contact Number"
        name="vendor_contact"
        value={form.vendor_contact || ""}
        onChange={handleInputChange}
      />
    </Grid>

    <Grid item xs={12} sm={6}>
      <TextField
        fullWidth
        label="Vendor Email"
        name="vendor_email"
        value={form.vendor_email || ""}
        onChange={handleInputChange}
      />
    </Grid>

    <Grid item xs={12}>
      <TextField
        fullWidth
        multiline
        rows={3}
        label="Vendor Address"
        name="vendor_address"
        value={form.vendor_address || ""}
        onChange={handleInputChange}
      />
    </Grid>
  </Grid>
</Box>

                {/* PURCHASE & WARRANTY */}
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    Purchase & Warranty
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        type="date"
                        fullWidth
                        label="Purchase Date"
                        name="purchase_date"
                        value={form.purchase_date}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        type="number"
                        fullWidth
                        label="Purchase Cost"
                        name="purchase_cost"
                        value={form.purchase_cost}
                        onChange={handleInputChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">₹</InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        type="number"
                        fullWidth
                        label="Warranty Years"
                        name="warranty_years"
                        value={form.warranty_years}
                        onChange={handleInputChange}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        type="date"
                        fullWidth
                        label="Warranty Expiry Date"
                        name="warranty_expiry_date"
                        value={form.warranty_expiry_date}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </Grid>
                </Box>

                {/* REPAIR DETAILS */}
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    Repair Details
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        type="number"
                        fullWidth
                        label="Repairing Cost"
                        name="repairing_cost"
                        value={form.repairing_cost}
                        onChange={handleInputChange}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        type="date"
                        fullWidth
                        label="Repairing Date"
                        name="repairing_date"
                        value={form.repairing_date}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </Grid>
                </Box>

                <Stack direction="row" justifyContent="flex-end" spacing={2}>
                  <Button variant="outlined" onClick={handleReset}>
                    Reset
                  </Button>
<Button variant="contained" onClick={handleSubmit} disabled={loading}>
  {loading
    ? isEditMode
      ? "Updating..."
      : "Creating..."
    : isEditMode
    ? "Update Asset"
    : "Create Asset"}
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