// Built-ins
import React, { useEffect, useMemo, useState } from "react";

// Modules / Functions
import axios from "axios";
import { FaPrint } from "react-icons/fa";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";

// Custom
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import { headers, pageHeader, loader, paginationOptions } from "../../global_vars";

// API endpoints
const ALL_DOCUMENTS = "http://localhost:8000/api/data_management/all_documents/";
const ALL_PROJECTS = "http://localhost:8000/api/data_management/projects/";

// Styling bits
const labelPillStyle = {
  display: "inline-block",
  padding: "2px 8px",
  borderRadius: "10px",
  background: "#93ab3c",
  color: "#fff",
  fontSize: 12,
  fontWeight: 600,
  marginRight: 8,
  border: "1px solid #93ab3c",
};

function DocumentsReport() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [projects, setProjects] = useState([]);

  // Filters per spec: doc Status, Valid until, projects Status (In Progress), Project, Client (fullname contains), Original, Trafficable
  const [filters, setFilters] = useState({
    status: "",
    validUntilFrom: "",
    validUntilTo: "",
    projectStatus: "", // hint default empty; user may pick Inprogress
    project: "",
    client: "",
    original: "",
    trafficable: "",
  });

  useEffect(() => {
    const currentHeaders = { ...headers, Authorization: "Token " + localStorage.getItem("userToken") };
    async function load() {
      try {
        const [dRes, pRes] = await Promise.all([
          axios.get(ALL_DOCUMENTS, { headers: currentHeaders }),
          axios.get(ALL_PROJECTS, { headers: currentHeaders }),
        ]);
        const allD = dRes?.data?.all_documents || dRes?.data?.results || dRes?.data?.data || dRes?.data || [];
        const allP = pRes?.data?.all_projects || pRes?.data?.results || pRes?.data?.data || pRes?.data || [];
        setDocuments(Array.isArray(allD) ? allD : []);
        setProjects(Array.isArray(allP) ? allP : []);
        setIsLoaded(true);
      } catch (e) {
        setIsLoaded(true);
      }
    }
    load();
  }, []);

  function setF(key, val) {
    setFilters((prev) => ({ ...prev, [key]: val }));
  }

  const projectById = useMemo(() => {
    const map = {};
    (projects || []).forEach((p) => { map[p.project_id] = p; });
    return map;
  }, [projects]);

  const filteredDocuments = useMemo(() => {
    const status = filters.status || "";
    const from = filters.validUntilFrom ? new Date(filters.validUntilFrom) : null;
    const to = filters.validUntilTo ? new Date(filters.validUntilTo) : null;
    const projectStatus = filters.projectStatus || "";
    const projectId = filters.project || "";
    const client = (filters.client || "").toLowerCase();

    function docPasses(d) {
      if (status && (d.status || "") !== status) return false;
      if (from || to) {
        if (!d.validuntil) return false;
        const vu = new Date(d.validuntil);
        if (!isFinite(vu)) return false;
        if (from && vu < from) return false;
        if (to && vu > to) return false;
      }
      if (projectStatus) {
        const projectRef = d.project;
        const pid = projectRef?.project_id || projectRef;
        const p = projectById[pid];
        if (!p || (p.status || "") !== projectStatus) return false;
      }
      if (projectId) {
        const pid = (d.project?.project_id || d.project || "");
        if (String(pid) !== String(projectId)) return false;
      }
      if (client) {
        const full = `${d.client?.surname || ""} ${d.client?.name || ""}`.trim().toLowerCase();
        if (!full.includes(client)) return false;
      }
      if (filters.original) {
        const want = filters.original === 'yes';
        if (!!d.original !== want) return false;
      }
      if (filters.trafficable) {
        const want = filters.trafficable === 'yes';
        if (!!d.trafficable !== want) return false;
      }
      return true;
    }

    return (documents || []).filter(docPasses);
  }, [documents, filters, projectById]);

  const columns = [
    {
      dataField: "document_id",
      text: "Document ID",
      sort: true,
      formatter: (cell, row) => (
        <a href={`/data_management/document/${row.document_id}`} id="cell_link">{row.document_id}</a>
      ),
    },
    { dataField: "title", text: "Title", sort: true },
    { dataField: "project.title", text: "Project", sort: true, formatter: (c, r) => r.project?.title || "" },
    { dataField: "_client", text: "Client", sort: true, sortValue: (c, r) => `${r.client?.surname || ''} ${r.client?.name || ''}`.trim(), formatter: (c, r) => `${r.client?.surname || ''} ${r.client?.name || ''}`.trim() },
    { dataField: "created", text: "Created", sort: true, formatter: (c, r) => (r.created ? new Date(r.created).toLocaleDateString() : "") },
    { dataField: "validuntil", text: "Valid until", sort: true, formatter: (c, r) => (r.validuntil ? new Date(r.validuntil).toLocaleDateString() : "") },
    { dataField: "status", text: "Status", sort: true },
    { dataField: "original", text: "Original", sort: true, formatter: (c, r) => (r.original ? "Yes" : "No") },
    { dataField: "trafficable", text: "Trafficable", sort: true, formatter: (c, r) => (r.trafficable ? "Yes" : "No") },
  ];

  return (
    <>
      <NavigationBar />
      <div className="mainContainer">
        {pageHeader("reports_documents", "Reports — Documents")}
        <div className="contentContainer">
          <div className="contentBody">
            {isLoaded ? (
              <>
                <style>{`.pillLink { color: inherit; text-decoration: none; } .pillLink:hover { color: #93ab3c; text-decoration: none; }`}</style>
                <div style={{ marginBottom: 16, background: '#fff', padding: 16, borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #eee' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px 16px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={labelPillStyle}>Status</span>
                      <select value={filters.status} onChange={(e) => setF('status', e.target.value)}>
                        <option value="">Any</option>
                        <option value="Pending">Pending</option>
                        <option value="Sent">Sent</option>
                        <option value="Received">Received</option>
                        <option value="Archived">Archived</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={labelPillStyle}>Valid until from</span>
                      <input type="date" value={filters.validUntilFrom} onChange={(e) => setF('validUntilFrom', e.target.value)} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={labelPillStyle}>Valid until to</span>
                      <input type="date" value={filters.validUntilTo} onChange={(e) => setF('validUntilTo', e.target.value)} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={labelPillStyle}>Project status</span>
                      <select value={filters.projectStatus} onChange={(e) => setF('projectStatus', e.target.value)}>
                        <option value="">Any</option>
                        <option value="Created">Created</option>
                        <option value="Assigned">Assigned</option>
                        <option value="Inprogress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Settled">Settled</option>
                        <option value="Abandoned">Abandoned</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={labelPillStyle}>Project</span>
                      <select value={filters.project} onChange={(e) => setF('project', e.target.value)}>
                        <option value="">Any</option>
                        {projects.map((p) => (
                          <option key={p.project_id} value={p.project_id}>{p.title}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={labelPillStyle}>Client (fullname)</span>
                      <input type="text" value={filters.client} onChange={(e) => setF('client', e.target.value)} placeholder="contains..." />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={labelPillStyle}>Original</span>
                      <select value={filters.original} onChange={(e) => setF('original', e.target.value)}>
                        <option value="">Any</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={labelPillStyle}>Trafficable</span>
                      <select value={filters.trafficable} onChange={(e) => setF('trafficable', e.target.value)}>
                        <option value="">Any</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </div>
                  </div>
                </div>

                <ToolkitProvider bootstrap4 keyField="document_id" data={filteredDocuments} columns={columns} exportCSV={{ fileName: 'documents_report.csv' }} search condensed>
                  {(props) => (
                    <div>
                      <BootstrapTable
                        {...props.baseProps}
                        pagination={paginationFactory(paginationOptions)}
                        defaultSorted={[{ dataField: 'validuntil', order: 'asc' }]}
                        hover
                        bordered={false}
                        striped
                      />
                      <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                        <button onClick={() => window.print()} style={{ marginLeft: 20, padding: '6px 10px', borderRadius: 6, border: '1px solid #444', background: '#444', color: '#fff', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <FaPrint /> Print / PDF
                        </button>
                      </div>
                    </div>
                  )}
                </ToolkitProvider>
              </>
            ) : (
              <div>{loader()}</div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default DocumentsReport;


