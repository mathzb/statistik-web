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

const Support = () => {
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

        const periodData = await fetchApiData(`/QueueReports/2776/Period`, {
          dateFrom,
          dateTo: formattedDate,
        });

        const agentData = await fetchApiData(`/QueueReports/2776/AgentByDay`, {
          dateFrom,
          dateTo: formattedDate,
        });

        const TotalAgentData = await fetchApiDataCDR(`/2776/TotalAgentData`, {
          dateFrom,
          dateTo: formattedDate,
        });

        setIsLoading(false);
        setPeriodData(periodData.data);
        setAgentData(agentData.data);
        setTotalAgentData(TotalAgentData.data);
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
        {periodData.length > 0 && (
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
              <Box margin={1.5}>Kø Statistik - {capitalizedPath}</Box>
            </Box>
            <TableContainer sx={{ boxShadow: 3 }} component={Paper}>
              <Table stickyHeader>
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
                    .filter(
                      (item) =>
                        item.queueExtension === 1562 ||
                        item.queueExtension === 1566 ||
                        item.queueExtension === 1569 ||
                        item.queueExtension === 1573 ||
                        item.queueExtension === 1582 ||
                        item.queueExtension === 1585 ||
                        item.queueExtension === 1590
                    )
                    .sort((a, b) => b.calls - a.calls)
                    .map((item, i) => (
                      <StyledTableRow key={i}>
                        <TableCell>{item.queueName}</TableCell>
                        <TableCell>{item.calls}</TableCell>
                        <TableCell>{item.answeredCalls || "0"}</TableCell>
                        <TableCell>{item.transfers || 0}</TableCell>
                        <TableCell>{item.timeOut || "0"}</TableCell>
                        <TableCell>{item.abandoned || "0"}</TableCell>
                        <TableCell>
                          {item.averageCalltime || "00:00:00"}
                        </TableCell>
                        <TableCell>
                          {item.averageHoldtime || "00:00:00"}
                        </TableCell>
                        <TableCell>
                          {item.serviceLevel ? `${item.serviceLevel}%` : "0%"}
                        </TableCell>
                      </StyledTableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
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
                  <TableHead>
                    <TableRow>
                      <TableCell>Navn</TableCell>
                      <TableCell>Besvaret</TableCell>
                      <Tooltip title="Gælder kun ved ledsaget omstilling!">
                        <TableCell>Omstillet*</TableCell>
                      </Tooltip>
                      <TableCell>Behandlet</TableCell>
                      <TableCell>Gns. Samtaletid</TableCell>
                      <TableCell>DND Tid</TableCell>
                      <TableCell>Pause Tid</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {calculateCallsTransfersAndPause(
                      agentData,
                      "Norlys",
                      "Protel",
                      "ELCOFON",
                      "Sentia",
                      "Phone-it"
                    )
                      .sort((a, b) => b.calls - a.calls)
                      .map((item, i) => (
                        <StyledTableRow key={i}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.calls}</TableCell>
                          <TableCell>{item.transfers || 0}</TableCell>
                          <TableCell>{item.calls - item.transfers}</TableCell>
                          <TableCell>{item.averageCalltime}</TableCell>
                          <TableCell>{item.dnd}</TableCell>
                          <TableCell>{item.pause || "00:00:00"}</TableCell>
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

export default Support;
