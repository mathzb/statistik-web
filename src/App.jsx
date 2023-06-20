import { useState } from "react";
import axios from "axios";
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
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";

import { useBookStore } from "./bookStore.js";

function App() {
  const {
    companyId,
    dateFrom,
    dateTo,
    dataStat,
    isLoading,
    isError,
    errMsg,
    queueType,
  } = useBookStore((state) => ({
    companyId: state.companyId,
    dateFrom: state.dateFrom,
    dateTo: state.dateTo,
    dataStat: state.dataStat,
    isLoading: state.isLoading,
    isError: state.isError,
    errMsg: state.errMsg,
    queueType: state.queueType,
  }));

  const {
    updateCompanyId: setCompanyId,
    updateDateFrom: setDateFrom,
    updateDateTo: setDateTo,
    updateDataStat: setData,
    updateIsLoading: setIsLoading,
    updateIsError: setIsError,
    updateErrMsg: setErrMsg,
    updateQueueType,
  } = useBookStore((state) => ({
    updateCompanyId: state.updateCompanyId,
    updateDateFrom: state.updateDateFrom,
    updateDateTo: state.updateDateTo,
    updateDataStat: state.updateDataStat,
    updateIsLoading: state.updateIsLoading,
    updateIsError: state.updateIsError,
    updateErrMsg: state.updateErrMsg,
    updateQueueType: state.updateQueueType,
  }));

  const fetchData = async (dateFrom, dateTo, companyId) => {
    try {
      setIsLoading(true);
      const fetch = await axios.get(
        `https://api.ipnordic.dk/statistics/v1/QueueReports/${companyId}/${
          queueType.charAt(0).toUpperCase() + queueType.slice(1) === "Agent"
            ? `Agent`
            : `Period?dateFrom=${dateFrom}&dateTo=${dateTo}`
        }`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
          },
        }
      );
      setIsLoading(false);
      const res = fetch.data;
      setData(res.data);
      setIsError(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setIsError(true);
      setErrMsg(error.message);
    }
  };

  const handleOnClick = () => {
    fetchData(dateFrom, dateTo, companyId);
  };
  console.log(queueType);
  return (
    <Container sx={{ marginBottom: 2 }}>
      <Box display={"flex"} justifyContent={"center"}>
        <Box mt={2}>
          <FormControl sx={{ flexDirection: "row", margin: 1 }}>
            <InputLabel id="queueType">Køtype</InputLabel>
            <Select
              labelId="queueType"
              id="queueType"
              variant="filled"
              size="small"
              label="Kø"
              value={queueType}
              onChange={(e) => updateQueueType(e.target.value)}
              sx={{ marginRight: 1, width: 150 }}
            >
              <MenuItem value={"Agent"}>Agent</MenuItem>
              <MenuItem value={"Period"}>Period</MenuItem>
            </Select>
            <TextField
              onChange={(e) => setCompanyId(e.target.value)}
              id="companyid"
              type="number"
              variant="filled"
              size="small"
              label="Kundenummer"
              value={companyId}
              // InputLabelProps={{
              //   shrink: true,
              // }}
              sx={{ marginRight: 1 }}
            />

            {queueType.charAt(0).toUpperCase() + queueType.slice(1) ===
            "Agent" ? (
              ""
            ) : (
              <div>
                <TextField
                  onChange={(e) => setDateFrom(e.target.value)}
                  id="datefrom"
                  size="small"
                  variant="filled"
                  type="date"
                  label="Fra"
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
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{ marginRight: 1 }}
                />
              </div>
            )}
            <LoadingButton
              variant="contained"
              endIcon={<SendIcon />}
              loadingPosition="end"
              loading={isLoading}
              onClick={() => handleOnClick()}
            >
              Søg
            </LoadingButton>
          </FormControl>
          {isError ? (
            <Alert severity="error" sx={{ margin: 2 }}>
              {errMsg}
            </Alert>
          ) : (
            ""
          )}
        </Box>
      </Box>

      <TableContainer sx={{ boxShadow: 3 }} component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Kønavn</TableCell>
              <TableCell>Opkald</TableCell>
              <TableCell>Besvaret</TableCell>
              <TableCell>Gns. Samtaletid</TableCell>
              <TableCell>Gns. Ventetid</TableCell>
              <TableCell>Frafald</TableCell>
              <TableCell>Servicelevel</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataStat

              .sort((a, b) => b.calls - a.calls)
              .map((item, i) => (
                <TableRow key={i}>
                  <TableCell>{item.queueName}</TableCell>
                  <TableCell>{item.calls}</TableCell>
                  <TableCell>
                    {item.answeredCalls !== null ? item.answeredCalls : "0"}
                  </TableCell>
                  <TableCell>
                    {item.averageCalltime !== null ? item.averageCalltime : "0"}
                  </TableCell>
                  <TableCell>
                    {item.averageHoldtime !== null ? item.averageHoldtime : "0"}
                  </TableCell>
                  <TableCell>
                    {item.abandoned !== null ? item.abandoned : "0"}
                  </TableCell>
                  <TableCell>
                    {item.serviceLevel}
                    {item.serviceLevel === null ? "" : "%"}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default App;
