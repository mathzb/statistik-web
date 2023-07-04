import axios from "axios";
import TextField from "@mui/material/TextField";
import SendIcon from "@mui/icons-material/Send";
import LoadingButton from "@mui/lab/LoadingButton";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Grid from "@mui/material/Grid";
import { useBookStore } from "../bookStore";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

const Callcenter = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  }));

  const location = useLocation();
  const path = location.pathname.substring(1);
  const capitalizedPath = path.charAt(0).toUpperCase() + path.slice(1);

  const {
    dateFrom,
    dateTo,
    periodData,
    agentData,
    isLoading,
    isError,
    errMsg,
  } = useBookStore((state) => ({
    dateFrom: state.dateFrom,
    dateTo: state.dateTo,
    isLoading: state.isLoading,
    isError: state.isError,
    errMsg: state.errMsg,
    periodData: state.periodData,
    agentData: state.agentData,
  }));

  const {
    updateDateFrom: setDateFrom,
    updateDateTo: setDateTo,

    updateIsLoading: setIsLoading,
    updateIsError: setIsError,
    updateErrMsg: setErrMsg,

    updatePeriodData: setPeriodData,
    updateAgentData: setAgentData,
  } = useBookStore((state) => ({
    updateDateFrom: state.updateDateFrom,
    updateDateTo: state.updateDateTo,
    updateIsLoading: state.updateIsLoading,
    updateIsError: state.updateIsError,
    updateErrMsg: state.updateErrMsg,
    updateAgentData: state.updateAgentData,
    updatePeriodData: state.updatePeriodData,
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    axios.defaults.headers.common = {
      Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
    };

    if (dateTo) {
      // Add one day to the input date
      const inputDateObj = new Date(dateTo);
      inputDateObj.setDate(inputDateObj.getDate() + 1);

      // Format the date to 'yyyy-mm-dd' format
      const formattedDate = inputDateObj.toISOString().split("T")[0];

      console.log("API request with date:", formattedDate);
      try {
        setIsLoading(true);
        const fetchPeriod = await axios.get(
          `https://api.ipnordic.dk/statistics/v1/QueueReports/2776/Period?dateFrom=${dateFrom}&dateTo=${formattedDate}`
        );

        const fetchAgent = await axios.get(
          `https://api.ipnordic.dk/statistics/v1/QueueReports/2776/AgentByDay?dateFrom=${dateFrom}&dateTo=${formattedDate}`
        );

        setIsLoading(false);
        const resPeriod = fetchPeriod.data;
        const resAgent = fetchAgent.data;
        setPeriodData(resPeriod.data);
        setAgentData(resAgent.data);
        setIsError(false);
        // console.log(resAgent.data);
        // console.log(resPeriod.data);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
        setIsError(true);
        setErrMsg(error.message);
      }
    }
  };

  const handleDisableButton = () => {
    if (dateFrom === "" || dateTo === "") {
      return true;
    } else if (dateFrom > dateTo) {
      return true;
    } else {
      return false;
    }
  };
  const result = Object.values(
    agentData
      .filter((item) => item.queueName.includes("CC"))
      .reduce((acc, obj) => {
        const {
          name,
          calls,
          averageCalltime,
          dnd,
          pause,
          transfers,
          queueName,
        } = obj;

        if (acc[name]) {
          acc[name].calls += calls;
          acc[name].transfers += transfers;
        } else {
          acc[name] = {
            name,
            calls,
            averageCalltime,
            dnd,
            pause,
            transfers,
            queueName,
          };
        }
        return acc;
      }, {})
  );
  console.log(result);
  return (
    <Box sx={{ width: "100%" }}>
      <Container maxWidth="xxl" sx={{ marginBottom: 2 }}>
        <Box display={"flex"} justifyContent={"space-between"} marginBottom={2}>
          <Box margin={2} paddingTop={2}>
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
          </Box>
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
            <MenuItem component={Link} to={"/sekretærservice"}>
              Sekretærservice
            </MenuItem>
            <MenuItem component={Link} to={"/sekretærservice"}>
              Callcenter
            </MenuItem>
          </Menu>
          <Box mt={2}>
            <form onSubmit={handleSubmit}>
              <TextField
                onChange={(e) => setDateFrom(e.target.value)}
                id="datefrom"
                size="small"
                variant="filled"
                type="date"
                label="Fra"
                color="success"
                value={dateFrom}
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{ marginRight: 1 }}
              />
              <TextField
                onChange={(e) => setDateTo(e.target.value)}
                id="dateto"
                variant="filled"
                type="date"
                label="Til"
                size="small"
                color="success"
                value={dateTo}
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{ marginRight: 1 }}
              />
              <LoadingButton
                type="submit"
                variant="contained"
                endIcon={<SendIcon />}
                loadingPosition="end"
                loading={isLoading}
                color="success"
                size="medium"
                disabled={handleDisableButton()}
                sx={{ margin: 0.7 }}
              >
                Søg
              </LoadingButton>
            </form>
            {isError ? (
              <Alert severity="error" sx={{ margin: 2 }}>
                {errMsg}
              </Alert>
            ) : (
              ""
            )}
          </Box>
        </Box>
        {periodData.length > 0 && (
          <Box>
            {/* <Grid item md={6}> */}
            <Box
              display={"flex"}
              justifyContent={"space-evenly"}
              marginTop={2}
              marginBottom={2}
              height={50}
              component={Paper}
              elevation={3}
            >
              <Box margin={1.5}>Kø Statistik - {capitalizedPath}</Box>
            </Box>
            <TableContainer sx={{ boxShadow: 3 }} component={Paper}>
              <Table stickyHeader>
                <caption>
                  <strong>Gælder kun ledsaget omstilling!</strong>
                </caption>
                <TableHead>
                  <TableRow>
                    <TableCell>Kønavn</TableCell>
                    <TableCell>Opkald</TableCell>
                    <TableCell>Besvaret</TableCell>
                    <Tooltip title="Gælder kun ved ledsaget omstilling!">
                      <TableCell>Omstillet*</TableCell>
                    </Tooltip>
                    <TableCell>Udløb</TableCell>
                    <TableCell>Lagt på</TableCell>
                    <TableCell>Gns. Samtaletid</TableCell>
                    <TableCell>Gns. Ventetid</TableCell>
                    <TableCell>Servicelevel</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {periodData
                    .filter((item) => item.queueName.includes("CC"))
                    .sort((a, b) => b.calls - a.calls)
                    .map((item, i) => (
                      <StyledTableRow key={i}>
                        <TableCell>{item.queueName}</TableCell>
                        <TableCell>{item.calls}</TableCell>
                        <TableCell>
                          {item.answeredCalls !== null
                            ? item.answeredCalls
                            : "0"}
                        </TableCell>
                        <TableCell>
                          {item.transfers !== null ? item.transfers : 0}
                        </TableCell>

                        <TableCell>
                          {item.timeOut !== null ? item.timeOut : "0"}
                        </TableCell>
                        <TableCell>
                          {item.abandoned !== null ? item.abandoned : "0"}
                        </TableCell>
                        <TableCell>
                          {item.averageCalltime !== null
                            ? item.averageCalltime
                            : "00:00:00"}
                        </TableCell>
                        <TableCell>
                          {item.averageHoldtime !== null
                            ? item.averageHoldtime
                            : "00:00:00"}
                        </TableCell>

                        <TableCell>
                          {item.serviceLevel}
                          {item.serviceLevel === null ? "0%" : "%"}
                        </TableCell>
                      </StyledTableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            {/* </Grid> */}
            <Grid item md={6}>
              <Box
                display={"flex"}
                justifyContent={"space-evenly"}
                marginTop={2}
                marginBottom={2}
                height={50}
                component={Paper}
                elevation={3}
              >
                <Box margin={1.5}>Agent Statistik - {capitalizedPath}</Box>
              </Box>
              <TableContainer sx={{ boxShadow: 3 }} component={Paper}>
                <Table stickyHeader>
                  <caption>
                    <strong>* Gælder kun for ledsaget omstilling!</strong>
                  </caption>
                  <TableHead>
                    <TableRow>
                      <TableCell>Navn</TableCell>
                      <TableCell>Besvaret</TableCell>
                      <Tooltip title="Gælder kun ved ledsaget omstilling!">
                        <TableCell>Omstillet*</TableCell>
                      </Tooltip>
                      <TableCell>Behandlet</TableCell>
                      <TableCell>DND Tid</TableCell>
                      <TableCell>Pause Tid</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {result
                      .sort((a, b) => b.calls - a.calls)
                      .map((item, i) => (
                        <StyledTableRow key={i}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.calls}</TableCell>
                          {/* <TableCell>{item.averageCalltime}</TableCell> */}
                          <TableCell>
                            {item.transfers !== null ? item.transfers : 0}
                          </TableCell>
                          <TableCell>{item.calls - item.transfers}</TableCell>
                          <TableCell>{item.dnd}</TableCell>
                          <TableCell>{item.pause}</TableCell>
                        </StyledTableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Callcenter;
