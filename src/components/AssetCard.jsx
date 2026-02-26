import { Card, CardContent, Typography, Button, Box, Chip } from "@mui/material";
import { motion } from "framer-motion";

export default function AssetCard({ asset, onDetails, onAssign }) {
  const isAssigned = !!asset.assigned_to;

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
    >
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: 2,
          transition: "0.2s",
          "&:hover": { boxShadow: 6 },
        }}
      >
        <CardContent>
          <Typography variant="h6" fontWeight="bold">
            {asset.brand} {asset.model_id}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Serial: {asset.serial_number}
          </Typography>

          <Box sx={{ mt: 1 }}>
            <Chip
              size="small"
              label={isAssigned ? "Assigned" : "Not Assigned"}
              color={isAssigned ? "success" : "warning"}
            />
          </Box>

          <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
            <Button size="small" variant="outlined" onClick={onDetails}>
              Details
            </Button>

            {!isAssigned && (
              <Button size="small" variant="contained" onClick={onAssign}>
                Assign
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}