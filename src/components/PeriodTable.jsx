import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";

const TableComponent = (props) => {
  console.log(props.periodData);
  return (
    <TableContainer sx={{ boxShadow: 3 }} component={Paper}>
      <Table stickyHeader>
        <caption>
          <strong>{props.caption}</strong>
        </caption>
        <TableHead>
          <TableRow>
            {props.columns.map((column) => (
              <TableCell key={column}>{column}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.periodData
            .filter(
              (item) =>
                item.queueExtension <= 1505 ||
                (/Callback/.test(item.queueName) && !/S&R/.test(item.queueName))
            )
            .sort((a, b) => b.calls - a.calls)
            .map((item, i) => (
              <TableRow key={i}>
                <TableCell>{item.queueName}</TableCell>
                <TableCell>{item.calls}</TableCell>
                <TableCell>
                  {item.answeredCalls !== null ? item.answeredCalls : "0"}
                </TableCell>
                <TableCell>
                  {item.transfers !== null ? item.transfers : 0}
                </TableCell>
                <TableCell>
                  {item.exitWithKey !== null ? item.exitWithKey : 0}
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
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableComponent;
