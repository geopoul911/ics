// Built-ins
import React from "react";

// Custom Made Components
import UploadGroupDocumentModal from "./modals/upload_group_document";
import DeleteGroupDocumentModal from "./modals/delete_group_document";

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
import { pageHeader, loader } from "../../../global_vars";

// Variables
window.Swal = Swal;

// These headers are different than the ones at global_vars.jsx
const headers = {
  "User-Token": localStorage.userToken,
  "Content-Type": "multipart/form-data",
};

const jsonHeaders = {
  "User-Token": localStorage.userToken,
  "Content-Type": "application/json",
};

const DOWNLOAD_DOCUMENT = "http://localhost:8000/api/groups/download_group_document/";
const DOWNLOAD_ROOMING_LIST = "http://localhost:8000/api/groups/download_rooming_list/";
const DOWNLOAD_CABIN_LIST = "http://localhost:8000/api/groups/download_cabin_list/";
const ADD_DOCUMENTS = "http://localhost:8000/api/groups/drag_drop_group_document/";

const DOWNLOAD_ITINERARY = "http://localhost:8000/api/groups/download_itinerary_pdf/";
const DOWNLOAD_ITINERARY_UK = "http://localhost:8000/api/groups/download_itinerary_uk/";

const RESET_ITINERARY_DOWNLOAD_STATUS = "http://localhost:8000/api/groups/reset_itinerary_download/";

function getRefcode() {
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
    });

    axios({
      method: "POST",
      url: ADD_DOCUMENTS + getRefcode(window.location.pathname),
      data: formData,
      headers: headers,
    })
      .then((res) => {
        props.update_state(res.data.model);
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Group document has been successfully uploaded",
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

class GroupDocuments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  downloadItinerary = () => {


    // Show confirmation modal for first-time download
    if (!this.props.group.itinerary_downloaded) {
    Swal.fire({
      icon: "warning",
      title: "First Time Download!",
      text: "Once the itinerary is downloaded, you will not be able to edit schedule's hotels. Are you sure you want to proceed?",
      showCancelButton: true,
      confirmButtonColor: "#F3702D",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, download it!",
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .get(DOWNLOAD_ITINERARY + getRefcode() + "?user_id=" + localStorage.user_id, {
            headers: headers,
          })
          .then((res) => {
            window.open(DOWNLOAD_ITINERARY + getRefcode() + "?user_id=" + localStorage.user_id);
          })
          .catch((e) => {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: e.response.data.errormsg,
            });
          });
      }
    });
  } else {
    axios
           .get(DOWNLOAD_ITINERARY + getRefcode() + "?user_id=" + localStorage.user_id, {
             headers: headers,
           })
           .then((res) => {
             window.open(DOWNLOAD_ITINERARY + getRefcode() + "?user_id=" + localStorage.user_id);
           })
           .catch((e) => {
             Swal.fire({
               icon: "error",
               title: "Error",
               text: e.response.data.errormsg,
             });
           });
       };
}

  
  downloadItineraryUK = () => {
    axios
      .get(DOWNLOAD_ITINERARY_UK + getRefcode(), {
        headers: headers,
      })
      .then((res) => {
        window.open(DOWNLOAD_ITINERARY_UK + getRefcode());
      })
      .catch((e) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: e.response.data.errormsg,
        });
      });
  };

  downloadGroupDocument = (fileName) => {
    axios
      .get(DOWNLOAD_DOCUMENT + getRefcode(window.location.pathname), {
        headers: headers,
        params: {
          file: fileName,
        },
      })
      .then((res) => {
        window.open(
          DOWNLOAD_DOCUMENT +
            getRefcode(window.location.pathname) +
            "?file=" +
            fileName
        );
      });
  };

  downloadRoomingList = (fileName) => {
    axios
      .get(DOWNLOAD_ROOMING_LIST + getRefcode(window.location.pathname), {
        headers: headers,
        params: {
          file: fileName,
        },
      })
      .then((res) => {
        window.open(
          DOWNLOAD_ROOMING_LIST +
            getRefcode(window.location.pathname) +
            "?file=" +
            fileName
        );
      });
  };

  downloadCabinList = (fileName) => {
    axios
      .get(DOWNLOAD_CABIN_LIST + getRefcode(window.location.pathname), {
        headers: headers,
        params: {
          file: fileName,
        },
      })
      .then((res) => {
        window.open(
          DOWNLOAD_CABIN_LIST +
            getRefcode(window.location.pathname) +
            "?file=" +
            fileName
        );
      });
  };

  resetItineraryDownloadStatus = () => {
      axios
        .post(RESET_ITINERARY_DOWNLOAD_STATUS + getRefcode(), {}, {
          headers: jsonHeaders,
        })
        .then((res) => {
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Itinerary download status has been reset. You can now edit schedule's hotels.",
          });
          // Update the group state to reflect the change
          this.props.update_state();
        })
        .catch((e) => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: e.response?.data?.errormsg || "Failed to reset itinerary download status",
          });
        });
  };

  render() {
    return (
      <>
        <div className="rootContainer">
          {pageHeader("group_documents", this.props.group.refcode)}
          {this.props.isLoaded ? (
            <>
              <label style={{ marginLeft: 20, color: "#F3702D", fontSize: 16 }}>
                Documents
              </label>
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
                  {getRefcode().startsWith("COA") ? (
                    <tr>
                      <td>1</td>
                      <td>{getRefcode() + "_itinerary.pdf"}</td>
                      <td>Itinerary</td>
                      <td>Group Plan</td>
                      <td>-</td>
                      <td>-</td>
                      <td>
                        <BsCloudDownload
                          id="download_group_doc_icon"
                          onClick={this.downloadItinerary}
                          style={{
                            color: "#F3702D",
                            fontSize: "1.5em",
                            marginRight: "0.5em",
                          }}
                        />
                      </td>
                      <td>-</td>
                    </tr>
                  ) : (
                    <tr>
                      <td>1</td>
                      <td>{getRefcode() + "_itinerary_uk.pdf"}</td>
                      <td>Itinerary</td>
                      <td>Group Plan</td>
                      <td>-</td>
                      <td>-</td>
                      <td>
                        <BsCloudDownload
                          id="download_group_doc_icon"
                          onClick={this.downloadItineraryUK}
                          style={{
                            color: "#F3702D",
                            fontSize: "1.5em",
                            marginRight: "0.5em",
                          }}
                        />
                      </td>
                      <td>-</td>
                    </tr>
                  )}

                  {this.props.group.documents.length > 0
                    ? this.props.group.documents.map((e, j) => (
                        <tr>
                          <td>{j + 2}</td>
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
                                this.downloadGroupDocument(e.name);
                              }}
                              style={{
                                color: "#F3702D",
                                fontSize: "1.5em",
                                marginRight: "0.5em",
                              }}
                            />
                          </td>
                          <td>
                            <DeleteGroupDocumentModal
                              id="delete_doc_modal"
                              group={this.props.group}
                              delete_note={this.delete_note}
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

              {/* Reset Itinerary Download Status Button */}


              {
                !this.state.isLoaded &&
                (localStorage.user_id === "84" || 
                localStorage.user_id === "87" || 
                localStorage.user_id === "88") ? (
                  <div style={{ marginTop: 20, marginLeft: 20, marginBottom: 20 }}>
                    <button
                      onClick={this.resetItineraryDownloadStatus}
                      style={{
                        backgroundColor: "#F3702D",
                        color: "white",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontSize: "14px"
                      }}
                      title="Clicking this button will allow super users to edit schedule's hotels."
                    >
                      Reset Itinerary Download Status
                    </button>
                  </div>
                ) : null
              }

              


              {this.props.group.rooming_lists.length > 0 ? (
                <>
                  <label style={{ marginLeft: 20, color: "#F3702D", fontSize: 16 }}>
                    Rooming Lists
                  </label>
                  <Table striped hover id="g_rlists_table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>File Name</th>
                        <th>Hotel</th>
                        <th>Nights</th>
                        <th>Note</th>
                        <th>Room Description</th>
                        <th>Meal Description</th>
                        <th>Download</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.props.group.rooming_lists.map((rooming_list, j) => (
                        <tr>
                          <td>{rooming_list.id}</td>
                          <td>
                            RoomingList_{this.props.group.refcode}_
                            {rooming_list.hotel.id}
                          </td>
                          <td>{rooming_list.hotel.name}</td>
                          <td>{rooming_list.doc_nights}</td>
                          <td>{rooming_list.note ? rooming_list.note : "N/A"}</td>
                          <td>
                            {rooming_list.room_desc
                              ? rooming_list.room_desc
                              : "N/A"}
                          </td>
                          <td>
                            {rooming_list.meal_desc
                              ? rooming_list.meal_desc
                              : "N/A"}
                          </td>
                          <td>
                            <BsCloudDownload
                              id="download_group_doc_icon"
                              onClick={() =>
                                this.downloadRoomingList(
                                  "RoomingList_" +
                                    this.props.group.refcode +
                                    "_" +
                                    rooming_list.hotel.id +
                                    ".docx"
                                )
                              }
                              style={{
                                color: "#F3702D",
                                fontSize: "1.5em",
                                marginRight: "0.5em",
                              }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </>
              ) : (
                <></>
              )}
              
              {this.props.cabin_lists.length > 0 ? (
                <>
                  <label style={{ marginLeft: 20, color: "#F3702D", fontSize: 16 }}>
                    Cabin Lists
                  </label>
                  <Table striped hover id="g_rlists_table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>File Name</th>
                        <th>Ferry Ticket Agency</th>
                        <th>Booking Reference</th>
                        <th>Date</th>
                        <th>Download</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.props.cabin_lists.map((cabin_list, j) => (
                        <tr>
                          <td>{cabin_list.id}</td>
                          <td>
                            CabinList_{this.props.group.refcode}_{cabin_list.booking_ref}.xlsx
                          </td>
                          <td>{cabin_list.ferry_ticket_agency.name}</td>
                          <td>{cabin_list.booking_reference}</td>
                          <td>{cabin_list.date}</td>
                          <td>
                            <BsCloudDownload
                              id="download_group_doc_icon"
                              onClick={() => this.downloadCabinList(`CabinList_${this.props.group.refcode}_${cabin_list.booking_ref}.xlsx`)}
                              style={{
                                color: "#F3702D",
                                fontSize: "1.5em",
                                marginRight: "0.5em",
                              }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </>
              ) : (
                <></>
              )}
              <DragDrop update_state={this.props.update_state} />
              <UploadGroupDocumentModal
                update_state={this.props.update_state}
              />
            </>
          ) : (
            loader()
          )}
        </div>
      </>
    );
  }
}

export default GroupDocuments;
