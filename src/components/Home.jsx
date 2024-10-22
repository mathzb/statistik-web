import Box from "@mui/material/Box";
import React from "react";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { useTheme } from '@mui/material/styles';

function Home() {
  const [open, setOpen] = React.useState(true);
  const theme = useTheme();  // Using Material UI's theme for consistency in design

  const handleClose = () => setOpen(false);

  // Moved inline styles to sx prop directly for better readability
  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 880,
    bgcolor: "background.paper",
    border: `2px solid ${theme.palette.divider}`, // Using theme colors
    boxShadow: 24,
    p: 4,
  };

  return (
    <React.Fragment>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography m={1} id="modal-modal-title" variant="h6" component="h2">
            Vælg afdeling
          </Typography>

          <ButtonGroup
            variant="contained"
            aria-label="outlined primary button group"
          >
            <Button component={Link} to="/support">
              Support
            </Button>
            <Button component={Link} to="/opstart">
              Opstart
            </Button>
            <Button component={Link} to="/enreach">
              Enreach
            </Button>
            <Button component={Link} to="/whitelabels">
              Whitelabels
            </Button>
            <Button component={Link} to="/sekretærservice">
              Sekretærservice
            </Button>
            <Button component={Link} to="/callcenter">
              Callcenter
            </Button>
            <Button component={Link} to="/totalsupport">
              Total Support
            </Button>
          </ButtonGroup>
        </Box>
      </Modal>
    </React.Fragment>
  );
}

export default Home;