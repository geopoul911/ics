// Built-ins
import { useState } from "react";

// Icons / Images

// Modules / Functions
import { Modal } from "react-bootstrap";
import { Button } from "semantic-ui-react";
import Swal from "sweetalert2";
import { FaRegCalendarAlt } from "react-icons/fa";

import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, {
  textFilter,
} from "react-bootstrap-table2-filter";
import ToolkitProvider from "react-bootstrap-table2-toolkit";

import {
  paginationOptions,
} from "../../../../global_vars";

import BootstrapTable from "react-bootstrap-table-next";

const columns = [
  {
    dataField: "group",
    text: "Refcode",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <>
        <a href={"/group_management/group/" + row.group} basic id="cell_link">
          {row.group}
        </a>
      </>
    ),
  },
  {
    dataField: "price",
    text: "Price",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "date",
    text: "Date",
    sort: true,
    filter: textFilter(),
  },
];

const defaultSorted = [
  {
    dataField: "id",
    order: "desc",
  },
];


// Variables
window.Swal = Swal;

function ShowPricings(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <FaRegCalendarAlt
        title={"edit priority"}
        onClick={() => {
          handleShow();
        }}
        className={"edit_icon"}
      />
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Showing Pricings for this Hotel: </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ToolkitProvider
            keyField="id"
            data={props.tds}
            columns={columns}
            search
            bootstrap4
            condensed
            defaultSorted={defaultSorted}
            exportCSV
          >
            {(props) => (
              <div>
                <BootstrapTable
                  {...props.baseProps}
                  pagination={paginationFactory(paginationOptions)}
                  hover
                  bordered={false}
                  id="all_airports_table"
                  striped
                  filter={filterFactory()}
                />
              </div>
            )}
          </ToolkitProvider>
        </Modal.Body>
        <Modal.Footer>
          <Button color="red" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ShowPricings;
