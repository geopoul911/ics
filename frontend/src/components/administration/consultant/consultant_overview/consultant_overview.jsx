// Built-ins
import React from "react";

// Icons / Images
import { BsInfoSquare } from "react-icons/bs";
import { FaHashtag, FaEnvelope, FaPhone, FaMobile, FaSort } from "react-icons/fa";
import { MdSecurity, MdCheckCircle, MdCancel, MdPerson, MdLock, MdTask, MdCheckCircleOutline } from "react-icons/md";
import { GiMoneyStack } from "react-icons/gi";
import { FaUserTag } from "react-icons/fa";

// Modules / Functions
import { Card } from "react-bootstrap";
import { Grid } from "semantic-ui-react";
 
import Swal from "sweetalert2";

// Custom Made Components
import NavigationBar from "../../../core/navigation_bar/navigation_bar";
import Footer from "../../../core/footer/footer";
import DeleteObjectModal from "../../../modals/delete_object";
import AddProjectModal from "../../../modals/create/add_project";
import AddCashModal from "../../../modals/create/add_cash";
import AddTaxationProjectModal from "../../../modals/create/add_taxation_project";
import {
  EditConsultantIdModal,
  EditConsultantFullnameModal,
  EditConsultantEmailModal,
  EditConsultantPhoneModal,
  EditConsultantMobileModal,
  EditConsultantRoleModal,
  EditConsultantUsernameModal,
  EditConsultantPasswordModal,
  EditConsultantCanAssignTaskModal,
  EditConsultantCashPassportModal,
  EditConsultantActiveModal,
  EditConsultantOrderIndexModal,
  EditConsultantPhotoModal,
} from "../../../modals/consultant_edit_modals";
import axios from "axios";

// Global Variables
import {
  headers,
  pageHeader,
  loader,
} from "../../../global_vars";

// API endpoint for consultant
const VIEW_CONSULTANT = "http://localhost:8000/api/administration/consultant/";

// Helpers to read URL like: /administration/consultant/<consultant_id>
function getConsultantIdFromPath() {
  const parts = window.location.pathname.split("/").filter(Boolean); // removes '' from // or trailing /
  const idx = parts.indexOf("consultant");
  if (idx === -1) return null;
  const id = parts[idx + 1] || null;
  return id ? decodeURIComponent(id) : null;
}

let overviewIconStyle = { color: "#93ab3c", marginRight: "0.5em" };
let labelPillStyle = { background: "#eef5ff", color: "#2c3e50", padding: "2px 10px", borderRadius: "12px", fontSize: "0.85em", marginRight: "8px", border: "1px solid #d6e4ff" };
let valueTextStyle = { fontWeight: 600, color: "#212529" };

class ConsultantOverview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      consultant: {},
      is_loaded: false,
      projects: [],
      cashItems: [],
      taxationProjects: [],
      tasksByProject: {}, // { [project_id]: { assignedToMe: [], assignedByMe: [] } }
      taskCommentsByProject: {}, // { [project_id]: { [task_id]: comments[] } }
    };
  }

  componentDidMount() {
    // Update headers with current token
    const currentHeaders = {
      ...headers,
      "Authorization": "Token " + localStorage.getItem("userToken")
    };

    const consultantId = getConsultantIdFromPath();

    axios
      .get(`${VIEW_CONSULTANT}${consultantId}/`, { headers: currentHeaders })
      .then(async (res) => {
        const consultant = res?.data || {};

        // Projects
        let projects = consultant.projects || [];
        if (!Array.isArray(projects) || projects.length === 0) {
          try {
            const projRes = await axios.get("http://localhost:8000/api/data_management/projects/", { headers: currentHeaders });
            const allProjects = projRes?.data?.all_projects || projRes?.data?.results || projRes?.data?.data || projRes?.data || [];
            const cidStr = String(consultant.consultant_id || "");
            projects = (Array.isArray(allProjects) ? allProjects : []).filter((p) => {
              const c = p?.consultant;
              if (!c) return false;
              const id = c?.consultant_id ?? c?.id ?? c;
              return String(id) === cidStr;
            });
          } catch (_e) { projects = []; }
        }

        // Cash
        let cashItems = consultant.cash || [];
        if (!Array.isArray(cashItems) || cashItems.length === 0) {
          try {
            const cashRes = await axios.get("http://localhost:8000/api/data_management/cash/", { headers: currentHeaders });
            const allCash = cashRes?.data?.all_cash || cashRes?.data?.results || cashRes?.data?.data || cashRes?.data || [];
            const cid = consultant.consultant_id;
            cashItems = (Array.isArray(allCash) ? allCash : []).filter(c => c.consultant && (c.consultant.consultant_id === cid || c.consultant === cid));
          } catch (_e) { cashItems = []; }
        }

        // Taxation projects
        let taxationProjects = consultant.taxation_projects || [];
        if (!Array.isArray(taxationProjects) || taxationProjects.length === 0) {
          try {
            const taxRes = await axios.get("http://localhost:8000/api/data_management/taxation_projects/", { headers: currentHeaders });
            const allTax = taxRes?.data?.all_taxation_projects || taxRes?.data?.results || taxRes?.data?.data || taxRes?.data || [];
            const cid = consultant.consultant_id;
            taxationProjects = (Array.isArray(allTax) ? allTax : []).filter(t => t.consultant && (t.consultant.consultant_id === cid || t.consultant === cid));
          } catch (_e) { taxationProjects = []; }
        }

        // Build tasks per project (assigned to me / assigned by me)
        let tasksByProject = {};
        let taskCommentsByProject = {};
        try {
          const detailPromises = (projects || []).map((p) =>
            axios.get(`http://localhost:8000/api/data_management/project/${p.project_id}/`, { headers: currentHeaders })
          );
          const details = await Promise.all(detailPromises.map((pr) => pr.catch((e) => ({ error: e }))));
          const myId = consultant.consultant_id;
          details.forEach((dr, idx) => {
            const proj = projects[idx];
            if (!proj) return;
            const tasks = Array.isArray(dr?.data?.tasks) ? dr.data.tasks : [];
            const assignedToMe = tasks.filter((t) => t?.assignee?.consultant_id === myId);
            const assignedByMe = tasks.filter((t) => t?.assigner?.consultant_id === myId);
            tasksByProject[proj.project_id] = { assignedToMe, assignedByMe };

            // Build comments map per task for this project
            const projComments = Array.isArray(dr?.data?.task_comments) ? dr.data.task_comments : [];
            const mapByTask = {};
            projComments.forEach((cm) => {
              const tid = cm?.projtask?.projtask_id || cm?.projtask_id;
              if (!tid) return;
              if (!mapByTask[tid]) mapByTask[tid] = [];
              mapByTask[tid].push(cm);
            });
            taskCommentsByProject[proj.project_id] = mapByTask;
          });
        } catch (_e) {
          tasksByProject = {};
          taskCommentsByProject = {};
        }

        this.setState({ consultant, projects, cashItems, taxationProjects, tasksByProject, taskCommentsByProject, is_loaded: true });
      })
      .catch((e) => {
        if (e?.response?.status === 401) {
          this.setState({ forbidden: true });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "An unknown error has occurred.",
          });
        }
      });
  }

  // When modals return a fresh object, replace state.consultant
  update_state = (updated) => {
    this.setState({ consultant: updated });
  };

  render() {
    const { consultant } = this.state;
    
    return (
      <>
        <NavigationBar />
        <style>{`
          .pillLink { color: inherit; text-decoration: none; }
          .pillLink:hover { color: #93ab3c !important; text-decoration: none; }
        `}</style>
        <div className="mainContainer">
          {pageHeader("consultant_overview", `Consultant: ${consultant.fullname || 'Loading...'}`)}
          {this.state.is_loaded ? (
            <>
              {/* New Consultant Photo and Name Section */}
              <Card style={{ marginBottom: "20px", backgroundColor: "#f8f9fa" }}>
                <Card.Body style={{ padding: "30px" }}>
                  <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "flex-start",
                    gap: "40px"
                  }}>
                    {/* Photo Section */}
                    <div style={{ position: "relative" }}>
                      {consultant.photo_url ? (
                        <img
                          src={consultant.photo_url}
                          alt="Consultant"
                          style={{
                            width: "150px",
                            height: "150px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            border: "4px solid #93ab3c",
                            boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "150px",
                            height: "150px",
                            borderRadius: "50%",
                            backgroundColor: "#e9ecef",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "4px solid #93ab3c",
                            boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
                          }}
                        >
                          <MdPerson style={{ fontSize: "75px", color: "#6c757d" }} />
                        </div>
                      )}
                      {/* Photo Edit Button */}
                      <div style={{ 
                        marginTop: "10px",
                        textAlign: "center"
                      }}>
                        <EditConsultantPhotoModal
                          consultant={consultant}
                          update_state={this.update_state}
                        />
                      </div>
                    </div>

                    {/* Name Section */}
                    <div style={{ textAlign: "left" }}>
                      <h1 style={{ 
                        margin: "0", 
                        fontSize: "2.5rem", 
                        fontWeight: "bold",
                        color: "#93ab3c"
                      }}>
                        {consultant.fullname || "N/A"}
                      </h1>
                      <p style={{ 
                        margin: "10px 0 0 0", 
                        fontSize: "1.2rem", 
                        color: "#6c757d",
                        fontWeight: "500"
                      }}>
                        Consultant ID: {consultant.consultant_id || "N/A"}
                      </p>
                      <div style={{ marginTop: "15px" }}>
                        <EditConsultantFullnameModal
                          consultant={consultant}
                          update_state={this.update_state}
                        />
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              <Grid stackable columns={2} divided>
                <Grid.Column>
                  <Card>
                    <Card.Header>
                      <BsInfoSquare
                        style={{
                          color: "#93ab3c",
                          fontSize: "1.5em",
                          marginRight: "0.5em",
                        }}
                      />
                      Basic Information
                    </Card.Header>
                    <Card.Body>
                      {/* Consultant ID */}
                      <div className={"info_descr"}>
                        <FaHashtag style={overviewIconStyle} /> Consultant ID
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {consultant.consultant_id ? consultant.consultant_id : "N/A"}
                        <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                          <EditConsultantIdModal
                            consultant={consultant}
                            update_state={this.update_state}
                          />
                        </span>
                      </div>

                      {/* E-mail */}
                      <div className={"info_descr"} style={{ marginTop: 16 }}>
                        <FaEnvelope style={overviewIconStyle} /> E-mail
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {consultant.email ? consultant.email : "N/A"}
                        <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                          <EditConsultantEmailModal
                            consultant={consultant}
                            update_state={this.update_state}
                          />
                        </span>
                      </div>

                      {/* Telephone */}
                      <div className={"info_descr"} style={{ marginTop: 16 }}>
                        <FaPhone style={overviewIconStyle} /> Telephone
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {consultant.phone ? consultant.phone : "N/A"}
                        <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                          <EditConsultantPhoneModal
                            consultant={consultant}
                            update_state={this.update_state}
                          />
                        </span>
                      </div>

                      {/* Cell phone */}
                      <div className={"info_descr"} style={{ marginTop: 16 }}>
                        <FaMobile style={overviewIconStyle} /> Cell phone
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {consultant.mobile ? consultant.mobile : "N/A"}
                        <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                          <EditConsultantMobileModal
                            consultant={consultant}
                            update_state={this.update_state}
                          />
                        </span>
                      </div>

                      {/* Order by */}
                      <div className={"info_descr"} style={{ marginTop: 16 }}>
                        <FaSort style={overviewIconStyle} /> Order by
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {(typeof consultant.orderindex === "number" ||
                          typeof consultant.orderindex === "string")
                          ? consultant.orderindex
                          : "N/A"}
                        <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                          <EditConsultantOrderIndexModal
                            consultant={consultant}
                            update_state={this.update_state}
                          />
                        </span>
                      </div>
                    </Card.Body>
                    <Card.Footer>
                      <DeleteObjectModal
                        objectId={consultant.consultant_id}
                        objectName={consultant.fullname}
                        objectType="Consultant"
                        onObjectDeleted={() => {
                          window.location.href = "/administration/all_consultants";
                        }}
                      />
                    </Card.Footer>
                  </Card>
                </Grid.Column>
                <Grid.Column>
                  <Card>
                    <Card.Header>
                      <MdSecurity
                        style={{
                          color: "#93ab3c",
                          fontSize: "1.5em",
                          marginRight: "0.5em",
                        }}
                      />
                      Account Information
                    </Card.Header>
                    <Card.Body>
                      {/* Username */}
                      <div className={"info_descr"}>
                        <MdPerson style={overviewIconStyle} /> Username
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {consultant.username ? consultant.username : "N/A"}
                        <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                          <EditConsultantUsernameModal
                            consultant={consultant}
                            update_state={this.update_state}
                          />
                        </span>
                      </div>

                      {/* Password */}
                      <div className={"info_descr"} style={{ marginTop: 16 }}>
                        <MdLock style={overviewIconStyle} /> Password
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        ********
                        <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                          <EditConsultantPasswordModal
                            consultant={consultant}
                            update_state={this.update_state}
                          />
                        </span>
                      </div>

                      {/* Role */}
                      <div className={"info_descr"} style={{ marginTop: 16 }}>
                        <FaUserTag style={overviewIconStyle} /> Role
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {consultant.role === 'A' ? 'Admin' :
                         consultant.role === 'S' ? 'Supervisor' :
                         consultant.role === 'U' ? 'Superuser' :
                         consultant.role === 'C' ? 'User' : consultant.role || "N/A"}
                        <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                          <EditConsultantRoleModal
                            consultant={consultant}
                            update_state={this.update_state}
                          />
                        </span>
                      </div>

                      {/* Can Assign Tasks */}
                      <div className={"info_descr"} style={{ marginTop: 16 }}>
                        <MdTask style={overviewIconStyle} /> Can Assign Tasks
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {consultant.canassigntask ? 
                          <MdCheckCircle style={{ color: 'green' }} /> : 
                          <MdCancel style={{ color: 'red' }} />}
                        <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                          <EditConsultantCanAssignTaskModal
                            consultant={consultant}
                            update_state={this.update_state}
                          />
                        </span>
                      </div>

                      {/* Active */}
                      <div className={"info_descr"} style={{ marginTop: 16 }}>
                        <MdCheckCircleOutline style={overviewIconStyle} /> Active
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {consultant.active ? 
                          <MdCheckCircle style={{ color: 'green' }} /> : 
                          <MdCancel style={{ color: 'red' }} />}
                        <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                          <EditConsultantActiveModal
                            consultant={consultant}
                            update_state={this.update_state}
                          />
                        </span>
                      </div>

                      {/* Cash Passport Countries */}
                      <div className={"info_descr"} style={{ marginTop: 16 }}>
                        <GiMoneyStack style={overviewIconStyle} /> Cash Passport Countries
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {consultant.cashpassport ? consultant.cashpassport : "None"}
                        <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                          <EditConsultantCashPassportModal
                            consultant={consultant}
                            update_state={this.update_state}
                          />
                        </span>
                      </div>
                    </Card.Body>
                    <Card.Footer></Card.Footer>
                  </Card>
                </Grid.Column>
              </Grid>

              <Grid stackable columns={2}>
                <Grid.Column>
                  <Card style={{ marginTop: 20 }}>
                    <Card.Header>
                      <BsInfoSquare style={{ color: "#93ab3c", fontSize: "1.5em", marginRight: "0.5em" }} />
                      Projects
                    </Card.Header>
                    <Card.Body>
                      {Array.isArray(this.state.projects) && this.state.projects.length > 0 ? (
                        <ul className="list-unstyled" style={{ margin: 0 }}>
                          {this.state.projects.map((p, idx) => (
                            <li key={p.project_id} style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
                              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
                                <span style={labelPillStyle}>#</span>
                                <span style={valueTextStyle}>{idx + 1}</span>
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>ID</span>
                                <a href={`/data_management/project/${p.project_id}`} className="pillLink" style={{ ...valueTextStyle }}>{p.project_id}</a>
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>Title</span>
                                <span style={valueTextStyle}>{p.title}</span>
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>Status</span>
                                <span style={valueTextStyle}>{p.status || 'N/A'}</span>
                              </div>
                              {/* Inline tasks under project */}
                              {(() => {
                                const tp = this.state.tasksByProject?.[p.project_id] || { assignedToMe: [], assignedByMe: [] };
                                const any = (tp.assignedToMe && tp.assignedToMe.length) || (tp.assignedByMe && tp.assignedByMe.length);
                                if (!any) return null;
                                return (
                                  <div style={{ marginTop: 10, paddingLeft: 12 }}>
                                    {Array.isArray(tp.assignedToMe) && tp.assignedToMe.length > 0 ? (
                                      <div style={{ marginBottom: 8 }}>
                                        <div style={{ marginBottom: 6, fontWeight: 700 }}>Assigned to me</div>
                                        <ul className="list-unstyled" style={{ margin: 0 }}>
                                          {tp.assignedToMe.map((t, tidx) => (
                                            <li key={t.projtask_id || tidx} style={{ padding: '6px 0' }}>
                                              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
                                                <span style={labelPillStyle}>#</span>
                                                <span style={valueTextStyle}>{tidx + 1}</span>
                                                <span style={{ width: 10 }} />
                                                <span style={labelPillStyle}>ID</span>
                                                <a href={`/data_management/project_task/${t.projtask_id}`} className="pillLink" style={{ ...valueTextStyle }}>{t.projtask_id}</a>
                                                <span style={{ width: 10 }} />
                                                <span style={labelPillStyle}>Title</span>
                                                <span style={valueTextStyle}>{t.title}</span>
                                                <span style={{ width: 10 }} />
                                                <span style={labelPillStyle}>Status</span>
                                                <span style={valueTextStyle}>{t.status || 'N/A'}</span>
                                              </div>
                                              {(() => {
                                                const comments = (this.state.taskCommentsByProject?.[p.project_id]?.[t.projtask_id]) || [];
                                                if (!comments.length) return null;
                                                return (
                                                  <div style={{ marginTop: 6, paddingLeft: 12, borderLeft: '3px solid #eef5ff' }}>
                                                    <div style={{ marginBottom: 4, fontWeight: 700, color: '#2c3e50' }}>Comments</div>
                                                    <ul className="list-unstyled" style={{ margin: 0 }}>
                                                      {comments.map((cm, cidx) => (
                                                        <li key={cm.taskcomm_id || cidx} style={{ padding: '6px 0', borderBottom: '1px dashed #eee' }}>
                                                          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
                                                            <span style={labelPillStyle}>#</span>
                                                            <span style={valueTextStyle}>{cidx + 1}</span>
                                                            {cm.commentregistration ? (<>
                                                              <span style={{ width: 10 }} />
                                                              <span style={labelPillStyle}>Time</span>
                                                              <span style={valueTextStyle}>{new Date(cm.commentregistration).toLocaleString()}</span>
                                                            </>) : null}
                                                            {cm.consultant ? (<>
                                                              <span style={{ width: 10 }} />
                                                              <span style={labelPillStyle}>By</span>
                                                              <span style={valueTextStyle}>{cm.consultant.fullname || `${cm.consultant.surname || ''} ${cm.consultant.name || ''}`.trim()}</span>
                                                            </>) : null}
                                                            {cm.comment ? (<>
                                                              <span style={{ width: 10 }} />
                                                              <span style={labelPillStyle}>Comment</span>
                                                              <span style={valueTextStyle}>{cm.comment}</span>
                                                            </>) : null}
                                                          </div>
                                                        </li>
                                                      ))}
                                                    </ul>
                                                  </div>
                                                );
                                              })()}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    ) : null}
                                    {Array.isArray(tp.assignedByMe) && tp.assignedByMe.length > 0 ? (
                                      <div>
                                        <div style={{ marginBottom: 6, fontWeight: 700 }}>Assigned by me</div>
                                        <ul className="list-unstyled" style={{ margin: 0 }}>
                                          {tp.assignedByMe.map((t, tidx) => (
                                            <li key={t.projtask_id || tidx} style={{ padding: '6px 0' }}>
                                              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
                                                <span style={labelPillStyle}>#</span>
                                                <span style={valueTextStyle}>{tidx + 1}</span>
                                                <span style={{ width: 10 }} />
                                                <span style={labelPillStyle}>ID</span>
                                                <a href={`/data_management/project_task/${t.projtask_id}`} className="pillLink" style={{ ...valueTextStyle }}>{t.projtask_id}</a>
                                                <span style={{ width: 10 }} />
                                                <span style={labelPillStyle}>Title</span>
                                                <span style={valueTextStyle}>{t.title}</span>
                                                <span style={{ width: 10 }} />
                                                <span style={labelPillStyle}>Status</span>
                                                <span style={valueTextStyle}>{t.status || 'N/A'}</span>
                                              </div>
                                              {(() => {
                                                const comments = (this.state.taskCommentsByProject?.[p.project_id]?.[t.projtask_id]) || [];
                                                if (!comments.length) return null;
                                                return (
                                                  <div style={{ marginTop: 6, paddingLeft: 12, borderLeft: '3px solid #eef5ff' }}>
                                                    <div style={{ marginBottom: 4, fontWeight: 700, color: '#2c3e50' }}>Comments</div>
                                                    <ul className="list-unstyled" style={{ margin: 0 }}>
                                                      {comments.map((cm, cidx) => (
                                                        <li key={cm.taskcomm_id || cidx} style={{ padding: '6px 0', borderBottom: '1px dashed #eee' }}>
                                                          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
                                                            <span style={labelPillStyle}>#</span>
                                                            <span style={valueTextStyle}>{cidx + 1}</span>
                                                            {cm.commentregistration ? (<>
                                                              <span style={{ width: 10 }} />
                                                              <span style={labelPillStyle}>Time</span>
                                                              <span style={valueTextStyle}>{new Date(cm.commentregistration).toLocaleString()}</span>
                                                            </>) : null}
                                                            {cm.consultant ? (<>
                                                              <span style={{ width: 10 }} />
                                                              <span style={labelPillStyle}>By</span>
                                                              <span style={valueTextStyle}>{cm.consultant.fullname || `${cm.consultant.surname || ''} ${cm.consultant.name || ''}`.trim()}</span>
                                                            </>) : null}
                                                            {cm.comment ? (<>
                                                              <span style={{ width: 10 }} />
                                                              <span style={labelPillStyle}>Comment</span>
                                                              <span style={valueTextStyle}>{cm.comment}</span>
                                                            </>) : null}
                                                          </div>
                                                        </li>
                                                      ))}
                                                    </ul>
                                                  </div>
                                                );
                                              })()}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    ) : null}
                                  </div>
                                );
                              })()}
                            </li>
                          ))}
                        </ul>
                      ) : (<div>No projects</div>)}
                    </Card.Body>
                    <Card.Footer>
                      <AddProjectModal defaultConsultantId={this.state.consultant?.consultant_id} lockConsultant={true} onProjectCreated={() => this.componentDidMount()} />
                    </Card.Footer>
                  </Card>
                </Grid.Column>
                <Grid.Column>
                  <Card style={{ marginTop: 20 }}>
                    <Card.Header>
                      <BsInfoSquare style={{ color: "#93ab3c", fontSize: "1.5em", marginRight: "0.5em" }} />
                      Cash
                    </Card.Header>
                    <Card.Body>
                      {Array.isArray(this.state.cashItems) && this.state.cashItems.length > 0 ? (
                        <ul className="list-unstyled" style={{ margin: 0 }}>
                          {this.state.cashItems.map((c, idx) => (
                            <li key={c.cash_id} style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
                              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
                                <span style={labelPillStyle}>#</span>
                                <span style={valueTextStyle}>{idx + 1}</span>
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>ID</span>
                                <a href={`/data_management/cash/${c.cash_id}`} className="pillLink" style={{ ...valueTextStyle }}>{c.cash_id}</a>
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>Date</span>
                                <span style={valueTextStyle}>{c.trandate ? new Date(c.trandate).toLocaleDateString() : ''}</span>
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>Kind</span>
                                <span style={valueTextStyle}>{c.kind === 'E' ? 'Expense' : 'Payment'}</span>
                                {c.currency ? (<>
                                  <span style={{ width: 10 }} />
                                  <span style={labelPillStyle}>Currency</span>
                                  <span style={valueTextStyle}>{c.currency}</span>
                                </>) : null}
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (<div>No cash entries</div>)}
                    </Card.Body>
                    <Card.Footer>
                      <AddCashModal defaultConsultantId={this.state.consultant?.consultant_id} lockConsultant={true} refreshData={() => this.componentDidMount()} />
                    </Card.Footer>
                  </Card>
                </Grid.Column>
                <Grid.Column width={8}>
                  <Card style={{ marginTop: 20 }}>
                    <Card.Header>
                      <BsInfoSquare style={{ color: "#93ab3c", fontSize: "1.5em", marginRight: "0.5em" }} />
                      Taxation projects
                    </Card.Header>
                    <Card.Body>
                      {Array.isArray(this.state.taxationProjects) && this.state.taxationProjects.length > 0 ? (
                        <ul className="list-unstyled" style={{ margin: 0 }}>
                          {this.state.taxationProjects.map((t, idx) => (
                            <li key={t.taxproj_id} style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
                              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
                                <span style={labelPillStyle}>#</span>
                                <span style={valueTextStyle}>{idx + 1}</span>
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>ID</span>
                                <a href={`/data_management/taxation_project/${t.taxproj_id}`} className="pillLink" style={{ ...valueTextStyle }}>{t.taxproj_id}</a>
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>Client</span>
                                <span style={valueTextStyle}>{t.client?.fullname || `${t.client?.surname || ''} ${t.client?.name || ''}`.trim()}</span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (<div>No taxation projects</div>)}
                    </Card.Body>
                    <Card.Footer>
                      <AddTaxationProjectModal refreshData={() => this.componentDidMount()} defaultConsultantId={this.state.consultant?.consultant_id} lockConsultant={true} />
                    </Card.Footer>
                  </Card>
                </Grid.Column>
              </Grid>
            </>
          ) : (
            loader()
          )}
        </div>
        <Footer />
      </>
    );
  }
}

export default ConsultantOverview;
