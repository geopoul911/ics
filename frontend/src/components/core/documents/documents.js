// Built-ins
import React from "react";

// Custom Made Components
import UploadDocumentModal from "./modals/upload_document";
import DeleteDocumentModal from "./modals/delete_document";

// Modules / Functions
import { Table } from "react-bootstrap";
import axios from "axios";
import moment from "moment";
import { FileUploader } from "react-drag-drop-files";
import Swal from "sweetalert2";

// CSS
import "react-tabs/style/react-tabs.css";

// Icons / Images

import { BsCloudDownload } from "react-icons/bs";

// Global Variables
import { pageHeader, loader } from "../../global_vars";

// Variables
window.Swal = Swal;

// These headers are different than the ones at global_vars.jsx
const headers = {
  "User-Token": localStorage.userToken,
  "Content-Type": "multipart/form-data",
};

const DOWNLOAD_DOCUMENT = "http://localhost:8000/api/data_management/download_document/";
const ADD_DOCUMENTS = "http://localhost:8000/api/data_management/drag_drop_document/";

function getObjectID() {
  return window.location.pathname.split("/")[3];
}

const fileTypes = [
  "pdf",
  "xlsx",
  "xlsm",
  "xls",
  "docx",
  "doc",
  "tif",
  "tiff",
  "bmp",
  "jpg",
  "jpeg",
  "png",
  "csv",
  "dot",
  "dotx",
  "mp3",
  "mp4",
  "pptx",
  "zip",
  "rar",
  "txt",
  "wav",
  "flv",
];

function DragDrop(props) {
  const handleChange = (files) => {
    const formData = new FormData();

    Object.values(files).forEach((file) => {
      formData.append("files_array", file);
      formData.append("object_type", props.object_type);
    });

    axios({
      method: "POST",
      url: ADD_DOCUMENTS + getObjectID(window.location.pathname),
      data: formData,
      headers: headers,
    })
      .then((res) => {
        props.update_state(res.data.model);
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Document has been successfully uploaded",
        });
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
    <div id="drag_drop_div">
      <BsCloudDownload id="drag_drop_download" />
      <FileUploader
        handleChange={handleChange}
        name="file"
        types={fileTypes}
        label="Drag & Drop files here or click to select file(s)"
        multiple={true}
        hoverTitle={"Drop Here"}
      />
    </div>
  );
}

// can achieve it with less lines
function renderSize(size) {
  if (size > 1024 * 1024) {
    return (size / 1024 / 1024).toFixed(2) + " MB";
  } else if (size > 1024) {
    return (size / 1024).toFixed(2) + " KB";
  } else {
    return size + " B";
  }
}

// const nameToURL = {
//   "Agent": "agent",
//   "Advertisement Company": "advertisement_company",
//   "Attraction": "attraction",
//   "Car Hire": "car_hire_company",
//   "Charter Airlines & Brokers": "charter_broker",
//   "Client": "client",
//   "Coach Operator": "coach_operator",
//   "Cruising Company": "cruising_company",
//   "DMC": "dmc",
//   "Shows & Entertainment Supplier": "entertainment_supplier",
//   "Ferry Ticket Agency": "ferry_ticket_agency",
//   "Hotel": "hotel",
//   "Guide": "guide",
//   "Repair Shop": "repair_shop",
//   "Restaurant": "restaurant",
//   "Sport Event Supplier": "sport_event_supplier",
//   "Teleferik Company": "teleferik_company",
//   "Theater": "theater",
//   "Train Ticket Agency": "train_ticket_agency",
// };


class Documents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  downloadDocument = (fileName) => {
    axios
      .get(DOWNLOAD_DOCUMENT + getObjectID(window.location.pathname), {
        headers: headers,
        params: {
          file: fileName,
          object_type: this.props.object_type,
        },
      })
      .then((res) => {
        // Properly concatenate query parameters
        const downloadUrl = 
          `${DOWNLOAD_DOCUMENT}${getObjectID(window.location.pathname)}?file=${encodeURIComponent(fileName)}&object_type=${encodeURIComponent(this.props.object_type)}`;
        window.open(downloadUrl);
      });
  };
  

  render() {

    return (
      <>
        <div className="rootContainer">
          {pageHeader("documents", this.props.object.name)}
          {this.props.is_loaded ? 
          <>

            <Table striped hover id="g_dox_table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>File Name</th>
                  <th>Description</th>
                  <th>Uploaded by</th>
                  <th>Uploaded at</th>
                  <th>Size</th>
                  <th>Download</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {this.props.object.documents.length > 0
                  ? this.props.object.documents.map((e, j) => (
                      <tr>
                        <td>{j + 1}</td>
                        <td>{e.name}</td>
                        <td>{e.description}</td>
                        <td>
                          <a
                            href={
                              "/site_administration/user/" + e.uploader.id
                            }
                            basic
                            id="cell_link"
                          >
                            {e.uploader.username}
                          </a>
                        </td>
                        <td>
                          {moment(e.updated_at).format(
                            "MMMM Do YYYY, h:mm:ss a"
                          )}
                        </td>
                        <td>{renderSize(e.size)}</td>
                        <td>
                          <BsCloudDownload
                            id="download_group_doc_icon"
                            onClick={() => {
                              this.downloadDocument(e.name);
                            }}
                            style={{
                              color: "#F3702D",
                              fontSize: "1.5em",
                              marginRight: "0.5em",
                            }}
                          />
                        </td>
                        <td>
                          <DeleteDocumentModal
                            id="delete_doc_modal"
                            object={this.props.object}
                            object_type={this.props.object_type}
                            document_id={e.id}
                            document_name={e.name}
                            update_state={this.props.update_state}
                          />
                        </td>
                      </tr>
                    ))
                  : ""}
              </tbody>
            </Table>
            <DragDrop update_state={this.props.update_state} object_type={this.props.object_type} />
            <UploadDocumentModal
              update_state={this.props.update_state}
              object_type={this.props.object_type}
            />
            </>
            :
            <>
              {loader()}
            </>
          }

        </div>
      </>
    );
  }
}

export default Documents;
