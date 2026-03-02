import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TableContainer,
  TablePagination,
  TextField,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
  Stack,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import AllInboxIcon from "@mui/icons-material/AllInbox";
import LaptopMacIcon from "@mui/icons-material/LaptopMac";
import StorageIcon from "@mui/icons-material/Storage";
import RouterIcon from "@mui/icons-material/Router";
import VideocamIcon from "@mui/icons-material/Videocam";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import AssignAssetModal from "../../components/AssignAssetModal";

import { getAssets, deleteAsset } from "../../api/assets.api";

export default function AllAssets() {
  const navigate = useNavigate();

  const [assets, setAssets] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(0);
  const rowsPerPage = 5;

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedAsset, setSelectedAsset] = useState(null);
  const [openAssign, setOpenAssign] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchAssets();
  }, [filter]);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      setError("");
      const params = filter === "ALL" ? {} : { category: filter };
      const res = await getAssets(params);
      setAssets(res.data?.data || []);
    } catch {
      setError("Failed to load assets");
    } finally {
      setLoading(false);
    }
  };

  const filteredAssets = assets.filter((a) =>
    `${a.asset_tag} ${a.brand} ${a.model_id} ${a.serial_number}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const paginatedAssets = filteredAssets.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleteLoading(true);
      await deleteAsset(deleteTarget.id);
      setDeleteTarget(null);
      fetchAssets();
      setPage(0);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete asset");
    } finally {
      setDeleteLoading(false);
    }
  };

  const getStatusChip = (asset) => {
    if (!asset.assigned_to) {
      return <Chip size="small" label="Available" color="default" />;
    }

    if (asset.assignment_status === "pending") {
      return <Chip size="small" label="Pending Confirmation" color="warning" />;
    }

    if (asset.assignment_status === "assigned") {
      return <Chip size="small" label="Assigned" color="success" />;
    }

    return <Chip size="small" label="Closed" color="default" />;
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f4f5f7" }}>
      <Sidebar />
      <Box sx={{ flex: 1 }}>
        <Navbar />

        <Box sx={{ p: 4, maxWidth: 1500, mx: "auto" }}>
          {/* Header */}
          <Box
            sx={{
              mb: 4,
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 3,
            }}
          >
            <Box>
              <Typography variant="h4" fontWeight={700}>
                Asset Inventory
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View, assign and manage all company assets
              </Typography>
            </Box>

            <TextField
              size="small"
              placeholder="Search by brand, model, serial..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(0);
              }}
              sx={{ width: 360 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Filters */}
          <ToggleButtonGroup
            value={filter}
            exclusive
            onChange={(e, v) => v && setFilter(v)}
            sx={{
              mb: 3,
              bgcolor: "#fff",
              borderRadius: 999,
              p: 0.5,
              boxShadow: 2,
            }}
          >
            <ToggleButton value="ALL">
              <AllInboxIcon fontSize="small" /> All
            </ToggleButton>
            <ToggleButton value="Laptop">
              <LaptopMacIcon fontSize="small" /> Laptop
            </ToggleButton>
            <ToggleButton value="Server">
              <StorageIcon fontSize="small" /> Server
            </ToggleButton>
            <ToggleButton value="Router">
              <RouterIcon fontSize="small" /> Router
            </ToggleButton>
            <ToggleButton value="CCTV">
              <VideocamIcon fontSize="small" /> CCTV
            </ToggleButton>
          </ToggleButtonGroup>

          {loading && (
            <Box sx={{ height: "40vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <CircularProgress />
            </Box>
          )}

          {error && <Alert severity="error">{error}</Alert>}

          {!loading && !error && (
            <Paper sx={{ borderRadius: 3, boxShadow: 3 }}>
              <TableContainer>
                <Table>
                  <TableHead sx={{ bgcolor: "#f1f3f5" }}>
                    <TableRow>
                      <TableCell><b>Asset Tag</b></TableCell>
                      <TableCell><b>Category</b></TableCell>
                      <TableCell><b>Brand / Model</b></TableCell>
                      <TableCell><b>Serial</b></TableCell>
                      <TableCell><b>Status</b></TableCell>
                      <TableCell><b>Assigned To</b></TableCell>
                      <TableCell align="right"><b>Actions</b></TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {paginatedAssets.map((asset) => (
                      <TableRow key={asset.id} hover>
                        <TableCell>{asset.asset_tag}</TableCell>
                        <TableCell>{asset.asset_category}</TableCell>
                        <TableCell>{asset.brand} {asset.model_id}</TableCell>
                        <TableCell>{asset.serial_number}</TableCell>

                        <TableCell>
                          {getStatusChip(asset)}
                        </TableCell>

                        <TableCell>
                          {asset.assigned_to || "—"}
                        </TableCell>

                        <TableCell align="right">
                          <Stack direction="row" spacing={1} justifyContent="flex-end">

                            <Tooltip title="View details">
                              <IconButton onClick={() => navigate(`/admin/assets/${asset.id}`)}>
                                <InfoOutlinedIcon />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Edit asset">
                              <IconButton
                                color="primary"
                                onClick={() => navigate(`/admin/assets/${asset.id}/edit`)}
                              >
                                <EditOutlinedIcon />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Assign asset">
                              <span>
                                <IconButton
                                  color="success"
                                  disabled={asset.assignment_status === "pending"}
                                  onClick={() => {
                                    setSelectedAsset(asset);
                                    setOpenAssign(true);
                                  }}
                                >
                                  <AssignmentIndIcon />
                                </IconButton>
                              </span>
                            </Tooltip>

                            <Tooltip title="Delete asset">
                              <span>
                                <IconButton
                                  color="error"
                                  disabled={!!asset.assigned_to}
                                  onClick={() => setDeleteTarget(asset)}
                                >
                                  <DeleteOutlineIcon />
                                </IconButton>
                              </span>
                            </Tooltip>

                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                component="div"
                count={filteredAssets.length}
                page={page}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[]}
                onPageChange={(e, newPage) => setPage(newPage)}
              />
            </Paper>
          )}
        </Box>
      </Box>

      {selectedAsset && (
        <AssignAssetModal
          open={openAssign}
          asset={selectedAsset}
          onClose={() => setOpenAssign(false)}
          onSuccess={fetchAssets}
        />
      )}

      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>Delete Asset</DialogTitle>
        <DialogContent>
          Are you sure you want to delete <b>{deleteTarget?.asset_tag}</b>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            disabled={deleteLoading}
            onClick={handleDelete}
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}