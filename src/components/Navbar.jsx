// Navbar.js
import React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "react-router-dom";

const Navbar = ({ anchorEl, open, handleClick, handleClose }) => {
  return (
    <>
      <Button
        variant="outlined"
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        Vælg Afdeling
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem component={Link} to={"/support"}>
          Support
        </MenuItem>
        <MenuItem component={Link} to={"/opstart"}>
          Opstart
        </MenuItem>
        <MenuItem component={Link} to={"/enreach"}>
          Enreach
        </MenuItem>
        <MenuItem component={Link} to={"/whitelabels"}>
          Whitelabels
        </MenuItem>
        <MenuItem component={Link} to={"/sekretærservice"}>
          Sekretærservice
        </MenuItem>
        <MenuItem component={Link} to={"/callcenter"}>
          Callcenter
        </MenuItem>
      </Menu>
    </>
  );
};

export default Navbar;
