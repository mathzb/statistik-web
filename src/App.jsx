import { useState } from "react";
import axios, { all } from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import { FormControl } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import LoadingButton from "@mui/lab/LoadingButton";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
// import Select from "@mui/material/Select";
// import InputLabel from "@mui/material/InputLabel";
// import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import { subtract } from "mathjs";
import _ from "lodash";
import Tooltip from "@mui/material/Tooltip";

import { useBookStore } from "./bookStore.js";
import TableComponent from "./components/TableComponent.jsx";

function App() {
  const {
    companyId,
    dateFrom,
    dateTo,
    periodData,
    agentData,
    isLoading,
    isError,
    errMsg,
    queueNumber,
  } = useBookStore((state) => ({
    companyId: state.companyId,
    dateFrom: state.dateFrom,
    dateTo: state.dateTo,
    dataStat: state.dataStat,
    isLoading: state.isLoading,
    isError: state.isError,
    errMsg: state.errMsg,
    queueNumber: state.queueNumber,
    periodData: state.periodData,
    agentData: state.agentData,
  }));

  const {
    updateCompanyId: setCompanyId,
    updateDateFrom: setDateFrom,
    updateDateTo: setDateTo,
    updateDataStat: setData,
    updateIsLoading: setIsLoading,
    updateIsError: setIsError,
    updateErrMsg: setErrMsg,
    updateQueueNumber: setQueueNumber,
    updatePeriodData: setPeriodData,
    updateAgentData: setAgentData,
  } = useBookStore((state) => ({
    updateCompanyId: state.updateCompanyId,
    updateDateFrom: state.updateDateFrom,
    updateDateTo: state.updateDateTo,
    updateDataStat: state.updateDataStat,
    updateIsLoading: state.updateIsLoading,
    updateIsError: state.updateIsError,
    updateErrMsg: state.updateErrMsg,
    updateQueueNumber: state.updateQueueNumber,
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
          `https://api.ipnordic.dk/statistics/v1/QueueReports/${companyId}/Period?dateFrom=${dateFrom}&dateTo=${formattedDate}`
        );

        const fetchAgent = await axios.get(
          `https://api.ipnordic.dk/statistics/v1/QueueReports/${companyId}/AgentByDay?dateFrom=${dateFrom}&dateTo=${formattedDate}`
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

  const result = Object.values(
    agentData.reduce((acc, obj) => {
      const { name, calls, averageCalltime, dnd, pause, transfers } = obj;

      if (acc[name]) {
        acc[name].calls += calls;
        acc[name].transfers += transfers;
      } else {
        acc[name] = { name, calls, averageCalltime, dnd, pause, transfers };
      }
      return acc;
    }, {})
  );

  return (
    <Box sx={{ width: "100%" }}>
      <Container maxWidth="xxl" sx={{ marginBottom: 2 }}>
        <Box display={"flex"} justifyContent={"center"} marginBottom={0}>
          <Box mt={2}>
            <form onSubmit={handleSubmit}>
              <TextField
                onChange={(e) => setCompanyId(e.target.value)}
                id="companyid"
                type="number"
                variant="filled"
                size="small"
                label="Kundenummer"
                color="success"
                value={companyId}
                sx={{ marginRight: 1 }}
              />

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
              <TextField
                onChange={(e) => setQueueNumber(e.target.value)}
                id="queueNumber"
                type="number"
                variant="filled"
                size="small"
                label="Kønummer"
                color="success"
                value={queueNumber}
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
                disabled={
                  dateTo < dateFrom
                    ? true
                    : false || dateFrom === ""
                    ? true
                    : false
                }
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
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              <Grid item md={6}>
                <Box margin={2}>Kø Statistik</Box>
                <TableComponent
                  periodData={periodData}
                  caption={"Gælder kun ledsaget omstilling!"}
                />
              </Grid>
              <Grid item md={6}>
                <Box margin={2}>Agent Statistik</Box>
                <TableContainer sx={{ boxShadow: 3 }} component={Paper}>
                  <Table stickyHeader>
                    <caption>
                      <strong>* Gælder kun for ledsaget omstilling!</strong>
                    </caption>
                    <TableHead>
                      <TableRow>
                        <TableCell>Navn</TableCell>
                        <TableCell>Besvaret</TableCell>
                        {/* <TableCell>Gns. Samtaletid</TableCell> */}
                        <Tooltip
                          title="Gælder kun for ledsaget omstilling!"
                          followCursor
                        >
                          <TableCell>Omstillet*</TableCell>
                        </Tooltip>
                        <TableCell>Behandlet</TableCell>
                        <TableCell>DND</TableCell>
                        <TableCell>Pause</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {result

                        .sort((a, b) => b.calls - a.calls)
                        .filter((item) => item.calls !== 0)
                        .map((item, i) => (
                          <TableRow key={i}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.calls}</TableCell>
                            {/* <TableCell>{item.averageCalltime}</TableCell> */}
                            <TableCell>{item.transfers}</TableCell>
                            <TableCell>{item.calls - item.transfers}</TableCell>
                            <TableCell>{item.dnd}</TableCell>
                            <TableCell>{item.pause}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default App;
