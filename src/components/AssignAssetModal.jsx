import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Chip,
} from "@mui/material";

const users = [
  { id: "EMP001", name: "Rahul Sharma", assignedAsset: null },
  { id: "EMP002", name: "Neha Singh", assignedAsset: "AST-L-004" },
  { id: "EMP003", name: "Amit Verma", assignedAsset: null },
  { id: "EMP004", name: "Pooja Mehta", assignedAsset: null },
];

export default function AssignAssetModal({
  open,
  onClose,
  asset,
  onAssign,
  onUnassign,
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Assign / Unassign Asset</DialogTitle>

      <DialogContent>
        <List>
          {users.map((user) => {
            const disabled =
              user.assignedAsset && user.assignedAsset !== asset.id;

            return (
              <ListItem
                key={user.id}
                secondaryAction={
                  asset.status === "Assigned" &&
                  user.assignedAsset === asset.id ? (
                    <Button color="error" onClick={() => onUnassign(asset.id)}>
                      Unassign
                    </Button>
                  ) : (
                    <Button
                      disabled={disabled}
                      variant="contained"
                      onClick={() => onAssign(user)}
                    >
                      Assign
                    </Button>
                  )
                }
              >
                <ListItemText primary={user.name} secondary={user.id} />
                {user.assignedAsset && (
                  <Chip label="Has Laptop" color="warning" size="small" />
                )}
              </ListItem>
            );
          })}
        </List>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
