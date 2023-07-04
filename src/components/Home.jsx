import Box from "@mui/material/Box";
import React from "react";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";

function Home() {
  const [open, setOpen] = React.useState(true);

  const handleClose = () => setOpen(false);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  return (
    <>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Vælg afdeling
          </Typography>

          <ButtonGroup
            variant="contained"
            aria-label="outlined primary button group"
          >
            <Button component={Link} to="/salg">
              Salg
            </Button>
            <Button component={Link} to="/skade">
              Skade
            </Button>
            <Button component={Link} to="/omstilling">
              Omstilling
            </Button>
          </ButtonGroup>
        </Box>
      </Modal>
    </>
  );
}

export default Home;
