import React from 'react';
import PropTypes from "prop-types";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Tooltip from "@material-ui/core/Tooltip";

const rows = [
    {
      id: "name",
      numeric: false,
      disablePadding: true,
      label: "Name"
    },
    { id: "username", numeric: true, disablePadding: false, label: "Username" },
    { id: "email", numeric: true, disablePadding: false, label: "Email" },
    { id: "phone", numeric: true, disablePadding: false, label: "Phone" },
    { id: "website", numeric: true, disablePadding: false, label: "Website" },
    {
      id: "company.name",
      numeric: true,
      disablePadding: false,
      label: "Company name"
    }
  ];

class UserTableHead extends React.Component {
    createSortHandler = property => event => {
      this.props.onRequestSort(event, property);
    };
  
    render() {
      const {
        onSelectAllClick,
        order,
        orderBy,
        numSelected,
        rowCount
      } = this.props;
  
      return (
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                indeterminate={numSelected > 0 && numSelected < rowCount}
                checked={numSelected === rowCount}
                onChange={onSelectAllClick}
              />
            </TableCell>
            {rows.map(
              row => (
                <TableCell
                  key={row.id}
                  align={row.numeric ? "right" : "left"}
                  padding={row.disablePadding ? "none" : "default"}
                  sortDirection={orderBy === row.id ? order : false}
                >
                  <Tooltip
                    title="Sort"
                    placement={row.numeric ? "bottom-end" : "bottom-start"}
                    enterDelay={300}
                  >
                    <TableSortLabel
                      active={orderBy === row.id}
                      direction={order}
                      onClick={this.createSortHandler(row.id)}
                    >
                      {row.label}
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
              ),
              this
            )}
          </TableRow>
        </TableHead>
      );
    }
  }

  UserTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired
  };

  export default UserTableHead;