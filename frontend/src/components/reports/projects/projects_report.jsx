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
const ALL_PROJECTS = "https://ultima.icsgr.com/api/data_management/projects/";
const ALL_CONSULTANTS = "https://ultima.icsgr.com/api/administration/all_consultants/";
const ALL_CATEGORIES = "https://ultima.icsgr.com/api/administration/all_project_categories/";

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

function ProjectsReport() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [projects, setProjects] = useState([]);
  const [consultants, setConsultants] = useState([]);
  const [categories, setCategories] = useState([]);

  // Filters per spec: Consultant, Deadline, Status, Category, Active
  const [filters, setFilters] = useState({
    consultant: "",
    deadlineUntil: "",
    status: "",
    category: "",
    active: "",
  });

  useEffect(() => {
    const currentHeaders = { ...headers, Authorization: "Token " + localStorage.getItem("userToken") };
    async function load() {
      try {
        const [pRes, consRes, catRes] = await Promise.all([
          axios.get(ALL_PROJECTS, { headers: currentHeaders }),
          axios.get(ALL_CONSULTANTS, { headers: currentHeaders }),
          axios.get(ALL_CATEGORIES, { headers: currentHeaders }),
        ]);
        const allP = pRes?.data?.all_projects || pRes?.data?.results || pRes?.data?.data || pRes?.data || [];
        const allCons = consRes?.data?.all_consultants || [];
        const allCats = catRes?.data?.all_project_categories || [];
        setProjects(Array.isArray(allP) ? allP : []);
        setConsultants(Array.isArray(allCons) ? allCons : []);
        setCategories(Array.isArray(allCats) ? allCats : []);
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

  const filteredProjects = useMemo(() => {
    const deadlineUntilDate = filters.deadlineUntil ? new Date(filters.deadlineUntil) : null;
    const categoryId = filters.category || "";
    const consultantId = filters.consultant || "";
    const status = filters.status || "";

    function projectPasses(p) {
      if (!p || typeof p !== 'object') return false;
      if (consultantId) {
        const pc = p.consultant;
        const pid = pc?.consultant_id || pc;
        if (String(pid) !== String(consultantId)) return false;
      }
      if (deadlineUntilDate && p.deadline) {
        const d = new Date(p.deadline);
        if (isFinite(d) && d > deadlineUntilDate) return false;
      } else if (deadlineUntilDate && !p.deadline) {
        return false;
      }
      if (status && (p.status || "") !== status) return false;
      if (categoryId) {
        const cats = Array.isArray(p.categories) ? p.categories : [];
        const hasCat = cats.some((cat) => (cat?.projcate_id || cat) === categoryId);
        if (!hasCat) return false;
      }
      return true;
    }

    let list = (projects || []).filter(projectPasses);
    if (filters.active) {
      list = list.filter((p) => String(!!p.active) === (filters.active === 'yes' ? 'true' : 'false'));
    }
    return list;
  }, [projects, filters]);

  const columns = [
    {
      dataField: "project_id",
      text: "Project ID",
      sort: true,
      formatter: (cell, row) => (
        <a href={`/data_management/project/${row.project_id}`} id="cell_link">{row.project_id}</a>
      ),
    },
    { dataField: "title", text: "Title", sort: true },
    { dataField: "status", text: "Status", sort: true },
    { dataField: "deadline", text: "Deadline", sort: true, formatter: (c, r) => (r.deadline ? new Date(r.deadline).toLocaleDateString() : "") },
    { dataField: "consultant.fullname", text: "Consultant", sort: true, formatter: (c, r) => r.consultant?.fullname || ((r.consultant && `${r.consultant.surname || ''} ${r.consultant.name || ''}`.trim()) || '') },
    { dataField: "categories", text: "Categories", sort: false, formatter: (c, r) => (Array.isArray(r.categories) ? r.categories.map((x) => x?.title).filter(Boolean).join(", ") : "") },
  ];

  return (
    <>
      <NavigationBar />
      <div className="mainContainer">
        {pageHeader("reports_projects", "Reports — Projects")}
        <div className="contentContainer">
          <div className="contentBody">
            {isLoaded ? (
              <>
                <style>{`.pillLink { color: inherit; text-decoration: none; } .pillLink:hover { color: #93ab3c; text-decoration: none; }`}</style>
                <div style={{ marginBottom: 16, background: '#fff', padding: 16, borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #eee' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px 16px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={labelPillStyle}>Consultant</span>
                      <select value={filters.consultant} onChange={(e) => setF('consultant', e.target.value)}>
                        <option value="">Any</option>
                        {consultants.map((c) => (
                          <option key={c.consultant_id} value={c.consultant_id}>{c.fullname || `${c.surname || ''} ${c.name || ''}`.trim()}</option>
                        ))}
                      </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={labelPillStyle}>Deadline until</span>
                      <input type="date" value={filters.deadlineUntil} onChange={(e) => setF('deadlineUntil', e.target.value)} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={labelPillStyle}>Status</span>
                      <select value={filters.status} onChange={(e) => setF('status', e.target.value)}>
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
                      <span style={labelPillStyle}>Category</span>
                      <select value={filters.category} onChange={(e) => setF('category', e.target.value)}>
                        <option value="">Any</option>
                        {categories.map((cat) => (
                          <option key={cat.projcate_id} value={cat.projcate_id}>{cat.title}</option>
                        ))}
                      </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={labelPillStyle}>Active</span>
                      <select value={filters.active} onChange={(e) => setF('active', e.target.value)}>
                        <option value="">Any</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </div>
                  </div>
                </div>

                <ToolkitProvider bootstrap4 keyField="project_id" data={filteredProjects} columns={columns} exportCSV={{ fileName: 'projects_report.csv' }} search condensed>
                  {(props) => (
                    <div>
                      <BootstrapTable
                        {...props.baseProps}
                        pagination={paginationFactory(paginationOptions)}
                        defaultSorted={[{ dataField: 'deadline', order: 'asc' }]}
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

export default ProjectsReport;


