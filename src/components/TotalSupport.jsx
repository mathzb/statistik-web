import TextField from "@mui/material/TextField";
import SendIcon from "@mui/icons-material/Send";
import LoadingButton from "@mui/lab/LoadingButton";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Grid from "@mui/material/Grid";
import { useBookStore } from "../bookStore";
import React from "react";
import { useLocation } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import {
  addDayToDate,
  calculateCallsTransfersAndPause,
  checkDateDifference,
  handleDisableButton,
} from "../utils";
import Navbar from "./Navbar";
import { fetchApiData, fetchApiDataCDR } from "../api";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/da"; // Use 'da' for Danish

dayjs.locale("da");
import customParseFormat from "dayjs/plugin/customParseFormat";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { Slide, Snackbar } from "@mui/material";

dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);

const TotalSupport = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  function SlideTransition(props) {
    return <Slide {...props} direction="up" />;
  }

  const [openAlert, setAlertOpen] = React.useState(false);

  const handleAlertClick = () => {
    setAlertOpen(true);
  };

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAlertOpen(false);
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
    totalAgentData,
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
    totalAgentData: state.totalAgentData,
  }));

  const {
    updateDateFrom: setDateFrom,
    updateDateTo: setDateTo,
    updateIsLoading: setIsLoading,
    updateIsError: setIsError,
    updateErrMsg: setErrMsg,
    updatePeriodData: setPeriodData,
    updateAgentData: setAgentData,
    updateTotalAgentData: setTotalAgentData,
  } = useBookStore((state) => ({
    updateDateFrom: state.updateDateFrom,
    updateDateTo: state.updateDateTo,
    updateIsLoading: state.updateIsLoading,
    updateIsError: state.updateIsError,
    updateErrMsg: state.updateErrMsg,
    updateAgentData: state.updateAgentData,
    updatePeriodData: state.updatePeriodData,
    updateTotalAgentData: state.updateTotalAgentData,
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (dateTo) {
      const formattedDate = addDayToDate(dateTo);

      try {
        setIsLoading(true);

        const TotalAgentData = await fetchApiDataCDR(`/2776/TotalAgentData`, {
          dateFrom,
          dateTo: formattedDate,
        });

        const periodData = await fetchApiData(`/QueueReports/2776/Period`, {
          dateFrom,
          dateTo: formattedDate,
        });

        const agentData = await fetchApiData(`/QueueReports/2776/AgentByDay`, {
          dateFrom,
          dateTo: formattedDate,
        });

        setIsLoading(false);
        setTotalAgentData(TotalAgentData.data);
        setPeriodData(periodData.data);
        setAgentData(agentData.data);
        setIsError(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
        setIsError(true);
        setErrMsg(error.message);
        setAlertOpen(true);
      }
    }
  };
  console.log(totalAgentData);
  return (
    <Box sx={{ width: "100%" }}>
      <Container maxWidth="xxl" sx={{ marginBottom: 2 }}>
        <Box display={"flex"} justifyContent={"space-between"} marginBottom={2}>
          <Box margin={2} paddingTop={2}>
            <Navbar
              anchorEl={anchorEl}
              open={open}
              handleClick={handleClick}
              handleClose={handleClose}
            />
          </Box>

          <Box
            mt={2}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            width="40%"
          >
            <form onSubmit={handleSubmit}>
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="da"
              >
                <DatePicker
                  label="Fra"
                  value={dateFrom ? dayjs(dateFrom) : null}
                  onChange={(newValue) =>
                    setDateFrom(newValue ? newValue.format("YYYY-MM-DD") : null)
                  }
                  inputFormat="DD-MM-YYYY"
                  sx={{ margin: 1 }}
                />
                <DatePicker
                  label="Til"
                  value={dateTo ? dayjs(dateTo) : null}
                  onChange={(newValue) =>
                    setDateTo(newValue ? newValue.format("YYYY-MM-DD") : null)
                  }
                  inputFormat="DD-MM-YYYY"
                  sx={{ margin: 1 }}
                />
              </LocalizationProvider>
              <LoadingButton
                type="submit"
                variant="contained"
                endIcon={<SendIcon />}
                loadingPosition="end"
                loading={isLoading}
                color="success"
                size="large"
                disabled={handleDisableButton(dateFrom, dateTo)}
                sx={{ margin: 1.8 }}
              >
                Søg
              </LoadingButton>
            </form>
          </Box>
        </Box>

        {/* Error handling and table rendering */}
        {checkDateDifference(dateFrom, dateTo) && (
          <Box display={"flex"} justifyContent={"center"} marginBottom={2}>
            <Alert severity="error" sx={{ margin: 2 }}>
              Det er ikke tilladt at vælge en dato på mere end 2 år.
            </Alert>
          </Box>
        )}
        {isError && (
          <Snackbar
            open={openAlert}
            autoHideDuration={6000}
            onClose={handleAlertClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            TransitionComponent={SlideTransition}
          >
            <Alert onClose={handleAlertClose} severity="error" variant="filled">
              {errMsg}
            </Alert>
          </Snackbar>
        )}
        {totalAgentData.length > 0 && (
          <Box>
            <Box
              display={"flex"}
              justifyContent={"space-evenly"}
              marginTop={2}
              marginBottom={2}
              height={50}
              component={Paper}
              elevation={3}
            >
              <Box margin={1.5}>Statistik - Support</Box>
            </Box>
            <TableContainer sx={{ boxShadow: 3 }} component={Paper}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Agent</TableCell>
                    {/* <TableCell>Opkald</TableCell> */}
                    <TableCell>Besvaret Indg.</TableCell>
                    <TableCell>Besvaret Udg.</TableCell>
                    <TableCell>Total</TableCell>
                    {/* <TableCell>Opkald Indg.</TableCell>
                    <TableCell>Opkald Udg.</TableCell> */}
                    <TableCell>DND tid</TableCell>
                    <TableCell>Pause tid</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {totalAgentData
                    .filter(
                      (item) =>
                        (item.location === "Support") |
                        (item.location === "Kundeservice")
                    )
                    // .sort((a, b) => b.calls - a.calls)
                    .map((item, i) => (
                      <StyledTableRow key={i}>
                        <TableCell>{item.name}</TableCell>
                        {/* <TableCell>{item.calls}</TableCell> */}
                        <TableCell>{item.answeredIn || 0}</TableCell>
                        <TableCell>{item.answeredOut || 0}</TableCell>
                        <TableCell>
                          {item.answeredOut + item.answeredIn || 0}
                        </TableCell>
                        {/* <TableCell>{item.callsIn}</TableCell>
                        <TableCell>{item.callsOut}</TableCell> */}
                        <TableCell>{item.dndTime || "00:00:00"}</TableCell>
                        <TableCell>{item.pauseTime || "00:00:00"}</TableCell>
                      </StyledTableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box marginTop={5}>
              <TableContainer sx={{ boxShadow: 3 }} component={Paper}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Agent</TableCell>

                      {/* <TableCell>Besvaret Indg.</TableCell>
                    <TableCell>Besvaret Udg.</TableCell> */}
                      <TableCell>Opkald Indg.</TableCell>
                      <TableCell>Opkald Udg.</TableCell>
                      <TableCell>Total ind- og udg. Opkald</TableCell>
                      {/* <TableCell>DND tid</TableCell>
                    <TableCell>Pause tid</TableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {totalAgentData
                      .filter(
                        (item) =>
                          (item.location === "Support") |
                          (item.location === "Kundeservice")
                      )
                      .sort((a, b) => b.calls - a.calls)
                      .map((item, i) => (
                        <StyledTableRow key={i}>
                          <TableCell>{item.name}</TableCell>
                          {/* <TableCell>{item.answeredIn}</TableCell>
                        <TableCell>{item.answeredOut}</TableCell> */}
                          <TableCell>{item.callsIn || 0}</TableCell>
                          <TableCell>{item.callsOut || 0}</TableCell>
                          <TableCell>{item.calls}</TableCell>
                          {/* <TableCell>{item.dndTime || "00:00:00"}</TableCell>
                        <TableCell>{item.pauseTime || "00:00:00"}</TableCell> */}
                        </StyledTableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default TotalSupport;
