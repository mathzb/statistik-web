import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";

const TableComponent = (props) => {
  return (
    <TableContainer sx={{ boxShadow: 3 }} component={Paper}>
      <Table stickyHeader>
        <caption>
          <strong>{props.caption}</strong>
        </caption>
        <TableHead>
          <TableRow>
            <TableCell>Kønavn</TableCell>
            <TableCell>Opkald</TableCell>
            <TableCell>Besvaret</TableCell>
            <Tooltip title={props.caption} followCursor>
              <TableCell>Omstillet*</TableCell>
            </Tooltip>
            <TableCell>Gns. Samtaletid</TableCell>
            <TableCell>Gns. Ventetid</TableCell>
            <TableCell>Frafald</TableCell>
            <TableCell>Servicelevel</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.periodData
            .filter((item) => item.queueExtension <= 1530)
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
                  {item.abandoned !== null ? item.abandoned : "0"}
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
