import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";

const PeriodTable = (props) => {
  const result = Object.values(
    props.agentData.reduce((acc, obj) => {
      const { name, calls, averageCalltime, dnd, pause, transfers, queueName } =
        obj;

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
  return (
    <TableContainer sx={{ boxShadow: 3 }} component={Paper}>
      <Table stickyHeader>
        <caption>
          <strong>* Gælder kun for ledsaget omstilling!</strong>
        </caption>
        <TableHead>
          <TableRow>
            {props.columns.map((column) => (
              <TableCell key={column}>{column}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {result

            .sort((a, b) => b.calls - a.calls)
            .filter((item) => item.calls !== 0 && /Skade/.test(item.queueName))
            .map((item, i) => (
              <TableRow key={i}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.calls}</TableCell>
                {/* <TableCell>{item.averageCalltime}</TableCell> */}
                <TableCell>
                  {item.transfers !== null ? item.transfers : 0}
                </TableCell>
                <TableCell>{item.calls - item.transfers}</TableCell>
                <TableCell>{item.dnd}</TableCell>
                <TableCell>{item.pause}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PeriodTable;
