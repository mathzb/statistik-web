import { useMemo, useState } from "react";
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
      const inputDateObj = new Date(dateTo);
      inputDateObj.setDate(inputDateObj.getDate() + 1);
      const formattedDate = inputDateObj.toISOString().split("T")[0];

      try {
        setIsLoading(true);

        const [fetchPeriod, fetchAgent] = await Promise.all([
          axios.get(
            `https://api.ipnordic.dk/statistics/v1/QueueReports/${companyId}/Period?dateFrom=${dateFrom}&dateTo=${formattedDate}`
          ),
          axios.get(
            `https://api.ipnordic.dk/statistics/v1/QueueReports/${companyId}/AgentByDay?dateFrom=${dateFrom}&dateTo=${formattedDate}`
          ),
        ]);

        setIsLoading(false);
        setPeriodData(fetchPeriod.data.data);
        setAgentData(fetchAgent.data.data);
        setIsError(false);
      } catch (error) {
        setIsLoading(false);
        setIsError(true);
        setErrMsg(error.message);
      }
    }
  };

  const result = useMemo(() => {
    return Object.values(
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
  }, [agentData]);

  const handleDisableButton = () => !dateFrom || !dateTo || dateFrom > dateTo;

  const fields = [
    {
      id: "companyid",
      label: "Kundenummer",
      type: "number",
      value: companyId,
      onChange: setCompanyId,
    },
    {
      id: "datefrom",
      type: "date",
      value: dateFrom,
      onChange: setDateFrom,
    },
    {
      id: "dateto",
      type: "date",
      value: dateTo,
      onChange: setDateTo,
    },
    {
      id: "queueNumber",
      label: "Kønummer",
      type: "number",
      value: queueNumber,
      onChange: setQueueNumber,
    },
  ];

  const sortedFilteredResult = useMemo(() => 
    result
        .filter(item => item.calls !== 0)
        .sort((a, b) => b.calls - a.calls),
    [result]
);
  return (
    <Box sx={{ width: "100%" }}>
      <Container maxWidth="xxl" sx={{ marginBottom: 2 }}>
        <Box display={"flex"} justifyContent={"center"} marginBottom={0}>
          <Box mt={2}>
            <form onSubmit={handleSubmit}>
              {fields.map((field) => (
                <TextField
                  key={field.id}
                  id={field.id}
                  type={field.type}
                  label={field.label}
                  variant="filled"
                  size="small"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  sx={{ marginRight: 1 }}
                />
              ))}
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
              marginBottom={1}
              height={50}
              component={Paper}
              elevation={3}
            >
              <Box margin={1}>Kø Statistik</Box>
            </Box>
            <TableComponent
              periodData={periodData}
              caption={"Gælder kun ledsaget omstilling!"}
            />
            {/* </Grid> */}
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
                      <Tooltip
                        title="Gælder kun for ledsaget omstilling!"
                        followCursor
                      >
                        <TableCell>Omstillet*</TableCell>
                      </Tooltip>
                      <TableCell>Behandlet</TableCell>
                      <TableCell>Gns. Samtaletid</TableCell>
                      <TableCell>DND</TableCell>
                      <TableCell>Pause</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedFilteredResult
                      .map((item, i) => (
                        <TableRow key={i}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.calls}</TableCell>
                          
                          <TableCell>
                            {item.transfers !== null ? item.transfers : 0}
                          </TableCell>
                          <TableCell>{item.calls - item.transfers}</TableCell>
                          <TableCell>{item.averageCalltime}</TableCell>
                          <TableCell>{item.dnd}</TableCell>
                          <TableCell>{item.pause}</TableCell>
                        </TableRow>
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
}

export default App;
