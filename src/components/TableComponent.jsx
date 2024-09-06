import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import { useMemo } from "react";

const TableComponent = ({ caption, periodData }) => {
  const filteredSortedData = useMemo(() => {
    return periodData
      .filter((item) => item.queueExtension <= 1530)
      .sort((a, b) => b.calls - a.calls);
  }, [periodData]);

  const renderRows = filteredSortedData.map((item, i) => (
    <TableRow key={i}>
      <TableCell>{item.queueName}</TableCell>
      <TableCell>{item.calls}</TableCell>
      <TableCell>{item.answeredCalls || "0"}</TableCell>
      <TableCell>{item.transfers || 0}</TableCell>
      <TableCell>{item.averageCalltime || "00:00:00"}</TableCell>
      <TableCell>{item.averageHoldtime || "00:00:00"}</TableCell>
      <TableCell>{item.abandoned || "0"}</TableCell>
      <TableCell>{item.serviceLevel ? `${item.serviceLevel}%` : "0%"}</TableCell>
    </TableRow>
  ));

  return (
    <TableContainer sx={{ boxShadow: 3 }} component={Paper}>
      <Table stickyHeader>
        <caption>
          <strong>{caption}</strong>
        </caption>
        <TableHead>
          <TableRow>
            <TableCell>Kønavn</TableCell>
            <TableCell>Opkald</TableCell>
            <TableCell>Besvaret</TableCell>
            <Tooltip title={caption} followCursor>
              <TableCell>Omstillet*</TableCell>
            </Tooltip>
            <TableCell>Gns. Samtaletid</TableCell>
            <TableCell>Gns. Ventetid</TableCell>
            <TableCell>Frafald</TableCell>
            <TableCell>Servicelevel</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {renderRows}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableComponent;