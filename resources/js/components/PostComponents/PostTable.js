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
import PostTableHead from "./PostTableHead";
import PostTableToolbar from "./PostTableToolbar";
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

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

class PostTable extends React.Component {
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

  componentDidMount() {
    this.getPostList(this.state.perPage, this.state.currentPage);
  }

  getPostList(pageSize, page) {
    const { order, orderBy } = this.state;

    axios.get(`/api/posts?page_size=${pageSize}&page=${page}&order=${order}&sort=${orderBy}`).then(response => {
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

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = "desc";

    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }

    this.setState({ order, orderBy }, () => this.getPostList(this.state.perPage, this.state.currentPage));
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
    this.getPostList(this.state.perPage, page + 1);
  };

  handleChangeRowsPerPage = event => {
    const pageSize = parseInt(event.target.value);
    this.getPostList(pageSize, 1);
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  handleEditClick = (event, id) => {
    console.log('edit clicked');
  }

  handleDeleteClick = (event, id) => {
    console.log('delete clicked');
  }

  render() {
    const { classes } = this.props;
    const { data, order, orderBy, selected, perPage, total, currentPage } = this.state;
    const emptyRows =
      perPage - Math.min(perPage, total - (currentPage - 1) * perPage);

    return (
      <Paper className={classes.root}>
        <PostTableToolbar numSelected={selected.length} />
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <PostTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {
                data.map(post => {
                  const isSelected = this.isSelected(post.id);
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={post.id}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox" onClick={event => this.handleClick(event, post.id)}>
                        <Checkbox checked={isSelected} />
                      </TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        {post.title}
                      </TableCell>
                      <TableCell align="right">{post.body}</TableCell>
                      <TableCell align="right">{post.user_id}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={event => this.handleEditClick(event, post.id)}>
                          <EditIcon /> Edit
                        </IconButton>
                        <IconButton onClick={event => this.handleDeleteClick(event, post.id)}>
                          <DeleteIcon /> Delete
                        </IconButton>
                      </TableCell>
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

PostTable.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(PostTable);
