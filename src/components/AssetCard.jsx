import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import { motion } from "framer-motion";

export default function AssetCard({ asset, onDetails, onAssign }) {
  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card sx={{ backdropFilter: "blur(12px)" }}>
        <CardContent>
          <Typography variant="h6">
            {asset.brand} {asset.model}
          </Typography>

          <Typography variant="body2">Serial: {asset.serial}</Typography>

          <Typography
            sx={{
              mt: 1,
              color:
                asset.status === "Assigned" ? "secondary.main" : "primary.main",
            }}
          >
            {asset.status}
          </Typography>

          <Box sx={{ mt: 2 }}>
            <Button size="small" onClick={onDetails}>
              Details
            </Button>

            {asset.status === "Not Assigned" && (
              <Button
                size="small"
                variant="contained"
                sx={{ ml: 1 }}
                onClick={onAssign}
              >
                Assign
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}
