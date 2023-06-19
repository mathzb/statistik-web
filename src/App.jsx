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

function App() {
  const [dataStat, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [isError, setIsError] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const fetchData = async (dateFrom, dateTo) => {
    try {
      setIsLoading(true);
      const fetch = await axios.get(
        `https://api.ipnordic.dk/statistics/v1/QueueReports/2776/Period?dateFrom=${dateFrom}&dateTo=${dateTo}`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
          },
        }
      );
      setIsLoading(false);
      const res = fetch.data;
      setData(res.data);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setIsError(true);
      setErrMsg(error.message);
    }
  };

  const handleOnClick = () => {
    fetchData(dateFrom, dateTo);
  };

  return (
    <Container sx={{ marginBottom: 2 }}>
      <Box display={"flex"} justifyContent={"center"}>
        <Box mt={2}>
          <FormControl sx={{ flexDirection: "row", margin: 1 }}>
            {/* <FormLabel htmlFor="companyid" sx={{ marginRight: 1 }}>
              Kundenummer
            </FormLabel>
            <TextField
              onChange={(e) => setCompanyId(e.target.value)}
              id="companyid"
              variant="filled"
              sx={{ marginRight: 1 }}
            /> */}
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
            <LoadingButton
              variant="contained"
              endIcon={<SendIcon />}
              loadingPosition="end"
              loading={isLoading}
              onClick={() => handleOnClick()}
              disabled={
                dateFrom === dateTo
                  ? true
                  : false || dateFrom > dateTo
                  ? true
                  : false || dateTo === ""
                  ? true
                  : false || dateFrom === ""
                  ? true
                  : false
              }
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
                    {item.answeredCalls !== null
                      ? item.answeredCalls
                      : "Ingen data"}
                  </TableCell>
                  <TableCell>{item.averageCalltime}</TableCell>
                  <TableCell>{item.averageHoldtime}</TableCell>
                  <TableCell>{item.abandoned}</TableCell>
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
