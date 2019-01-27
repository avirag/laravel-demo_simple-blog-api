import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import UserTableHead from "./UserTableHead";
import UserTableToolbar from "./UserTableToolbar";


const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3
  },
  table: {
    minWidth: 1020
  },
  tableWrapper: {
    overflowX: "auto"
  }
});

class UserTable extends React.Component {
  state = {
    order: "asc",
    orderBy: "id",
    selected: [],
    data: [],
    links: null,
    perPage: 5,
    total: 0,
    currentPage: 1,
  };

  getUserList(pageSize, page) {
    const { order, orderBy } = this.state;

    axios.get(`/api/users?page_size=${pageSize}&page=${page}&order=${order}&sort=${orderBy}`).then(response => {
      const content = response.data;

      if (!content) {
        return;
      }

      this.setState({
        data: content.data,
        total: content.meta.total,
        perPage: content.meta.per_page,
        currentPage: content.meta.current_page
      });
    });
  }

  componentDidMount() {
    this.getUserList(this.state.perPage, this.state.currentPage);
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = "asc";

    if (this.state.orderBy === property && this.state.order === "asc") {
      order = "desc";
    }

    this.setState({ order, orderBy }, () => this.getUserList(this.state.perPage, this.state.currentPage));

  };

  handleSelectAllClick = event => {
    if (event.target.checked) {
      this.setState(state => ({ selected: state.data.map(n => n.id) }));
      return;
    }
    this.setState({ selected: [] });
  };

  handleClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    this.setState({ selected: newSelected });
  };

  handleChangePage = (event, page) => {
    this.getUserList(this.state.perPage, page + 1);
  };

  handleChangeRowsPerPage = event => {
    const pageSize = parseInt(event.target.value);
    this.getUserList(pageSize, 1);
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  render() {
    console.log(this.state);

    const { classes } = this.props;
    const { data, order, orderBy, selected, perPage, total, currentPage } = this.state;
    const emptyRows =
      perPage - Math.min(perPage, total - (currentPage - 1) * perPage);

    return (
      <Paper className={classes.root}>
        <UserTableToolbar numSelected={selected.length} />
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <UserTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {data.map(user => {
                  const isSelected = this.isSelected(user.id);
                  return (
                    <TableRow
                      hover
                      onClick={event => this.handleClick(event, user.id)}
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={user.id}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox checked={isSelected} />
                      </TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        {user.name}
                      </TableCell>
                      <TableCell align="right">{user.username}</TableCell>
                      <TableCell align="right">{user.email}</TableCell>
                      <TableCell align="right">{user.phone}</TableCell>
                      <TableCell align="right">{user.website}</TableCell>
                      <TableCell align="right">{user.company.name}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={7} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={total}
          rowsPerPage={perPage}
          page={currentPage - 1}
          backIconButtonProps={{
            "aria-label": "Previous Page"
          }}
          nextIconButtonProps={{
            "aria-label": "Next Page"
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </Paper>
    );
  }
}

UserTable.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(UserTable);
