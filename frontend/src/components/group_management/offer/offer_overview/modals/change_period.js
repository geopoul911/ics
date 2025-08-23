// Built-ins
import { useState } from "react";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";

// Modules / Functions
import axios from "axios";
import Swal from "sweetalert2";
import { Modal } from "react-bootstrap";
import { Button } from "semantic-ui-react";

// Custom Made Components
import MonthPicker from "../../../all_group_offers/modals/monthPicker";

// Global Variables
import { headers } from "../../../../global_vars";

// Variables
window.Swal = Swal;

const CHANGE_OFFER_RECIPIENT =
  "http://localhost:8000/api/groups/change_offer_period/";

// This function replaces the abbreviation included in refcode
// Therefore, when agent changes => refcode changes => url needs redirect
function ChangeOffersPeriod(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);
  const [selectedMonthsRange, setSelectedMonthsRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });

  const handleMonthRangeChange = (range) => {
    setSelectedMonthsRange(range);
  };

  const updateOffersPeriod = () => {
    axios({
      method: "post",
      url: CHANGE_OFFER_RECIPIENT + props.offer_id,
      headers: headers,
      data: {
        start_date: `${selectedMonthsRange.startDate.toLocaleString("default", {
          month: "long",
        })} ${selectedMonthsRange.startDate.getFullYear()}`,
        end_date: `${selectedMonthsRange.endDate.toLocaleString("default", {
          month: "long",
        })} ${selectedMonthsRange.endDate.getFullYear()}`,
      },
    })
      .then((res) => {
        props.update_state(res.data.offer);
      })
      .catch((e) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: e.response.data.errormsg,
        });
      });
  };

  return (
    <>
      <FiEdit2
        title={"edit agent"}
        id={"edit_agent"}
        className={"edit_icon"}
        onClick={() => {
          handleShow();
        }}
      />
      <Modal
        show={show}
        size="lg"
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Change Period For {props.name} </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <MonthPicker onMonthRangeChange={handleMonthRangeChange} />
        </Modal.Body>
        <Modal.Footer>
          <Button color="red" onClick={handleClose}>
            Close
          </Button>
          <Button
            color="green"
            onClick={() => {
              handleClose();
              updateOffersPeriod();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeOffersPeriod;
