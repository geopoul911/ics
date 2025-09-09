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
const ALL_PROJECT_TASKS = "http://localhost:8000/api/data_management/project_tasks/";
const ALL_CONSULTANTS = "http://localhost:8000/api/administration/all_consultants/";
const ALL_TASK_CATEGORIES = "http://localhost:8000/api/administration/all_task_categories/";

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

function TasksReport() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [consultants, setConsultants] = useState([]);
  const [taskCategories, setTaskCategories] = useState([]);

  // Filters per spec: Category, Status, Deadline, Assigner, Assignee, Active
  const [filters, setFilters] = useState({
    taskCategory: "",
    status: "",
    deadlineUntil: "",
    assigner: "",
    assignee: "",
    active: "",
  });

  useEffect(() => {
    const currentHeaders = { ...headers, Authorization: "Token " + localStorage.getItem("userToken") };
    async function load() {
      try {
        const [tRes, consRes, catRes] = await Promise.all([
          axios.get(ALL_PROJECT_TASKS, { headers: currentHeaders }),
          axios.get(ALL_CONSULTANTS, { headers: currentHeaders }),
          axios.get(ALL_TASK_CATEGORIES, { headers: currentHeaders }),
        ]);
        const allT = tRes?.data?.all_project_tasks || tRes?.data?.results || tRes?.data?.data || tRes?.data || [];
        const allCons = consRes?.data?.all_consultants || [];
        const allCats = catRes?.data?.all_task_categories || [];
        // Normalize deadline to Date object for consistent comparison
        const normalized = (Array.isArray(allT) ? allT : []).map((t) => ({ ...t, deadline: t?.deadline ? new Date(t.deadline) : null }));
        setTasks(normalized);
        setConsultants(Array.isArray(allCons) ? allCons : []);
        setTaskCategories(Array.isArray(allCats) ? allCats : []);
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

  const filteredTasks = useMemo(() => {
    const deadlineUntilDate = filters.deadlineUntil ? new Date(filters.deadlineUntil) : null;
    const status = filters.status || "";
    const assignerId = filters.assigner || "";
    const assigneeId = filters.assignee || "";
    const taskCategoryId = filters.taskCategory || "";

    function taskPasses(t) {
      if (!t || typeof t !== 'object') return false;
      if (status && (t.status || "") !== status) return false;
      if (deadlineUntilDate) {
        const d = t.deadline instanceof Date ? t.deadline : (t.deadline ? new Date(t.deadline) : null);
        if (!d || !isFinite(d) || d > deadlineUntilDate) return false;
      }
      if (assignerId) {
        const a = t.assigner;
        const id = a?.consultant_id || a;
        if (String(id) !== String(assignerId)) return false;
      }
      if (assigneeId) {
        const a = t.assignee;
        const id = a?.consultant_id || a;
        if (String(id) !== String(assigneeId)) return false;
      }
      if (taskCategoryId) {
        const id = t.taskcate?.taskcate_id || t.taskcate;
        if (String(id) !== String(taskCategoryId)) return false;
      }
      return true;
    }

    let list = (tasks || []).filter(taskPasses);
    if (filters.active) {
      list = list.filter((t) => String(!!t.active) === (filters.active === 'yes' ? 'true' : 'false'));
    }
    return list;
  }, [tasks, filters]);

  const columns = [
    {
      dataField: "projtask_id",
      text: "Task ID",
      sort: true,
      formatter: (cell, row) => (
        <a href={`/data_management/project_task/${row.projtask_id}`} id="cell_link">{row.projtask_id}</a>
      ),
    },
    { dataField: "title", text: "Title", sort: true },
    { dataField: "project.title", text: "Project", sort: true, formatter: (c, r) => r.project?.title || "" },
    { dataField: "status", text: "Status", sort: true },
    { dataField: "deadline", text: "Deadline", sort: true, formatter: (c, r) => (r.deadline ? new Date(r.deadline).toLocaleDateString() : "") },
    { dataField: "taskcate.title", text: "Category", sort: true, formatter: (c, r) => r.taskcate?.title || "" },
    { dataField: "assigner.fullname", text: "Assigner", sort: true, formatter: (c, r) => r.assigner?.fullname || ((r.assigner && `${r.assigner.surname || ''} ${r.assigner.name || ''}`.trim()) || '') },
    { dataField: "assignee.fullname", text: "Assignee", sort: true, formatter: (c, r) => r.assignee?.fullname || ((r.assignee && `${r.assignee.surname || ''} ${r.assignee.name || ''}`.trim()) || '') },
  ];

  return (
    <>
      <NavigationBar />
      <div className="mainContainer">
        {pageHeader("reports_tasks", "Reports — Tasks")}
        <div className="contentContainer">
          <div className="contentBody">
            {isLoaded ? (
              <>
                <style>{`.pillLink { color: inherit; text-decoration: none; } .pillLink:hover { color: #93ab3c; text-decoration: none; }`}</style>
                <div style={{ marginBottom: 16, background: '#fff', padding: 16, borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #eee' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px 16px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={labelPillStyle}>Category</span>
                      <select value={filters.taskCategory} onChange={(e) => setF('taskCategory', e.target.value)}>
                        <option value="">Any</option>
                        {taskCategories.map((cat) => (
                          <option key={cat.taskcate_id} value={cat.taskcate_id}>{cat.title}</option>
                        ))}
                      </select>
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
                      <span style={labelPillStyle}>Deadline until</span>
                      <input type="date" value={filters.deadlineUntil} onChange={(e) => setF('deadlineUntil', e.target.value)} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={labelPillStyle}>Assigner</span>
                      <select value={filters.assigner} onChange={(e) => setF('assigner', e.target.value)}>
                        <option value="">Any</option>
                        {consultants.map((c) => (
                          <option key={c.consultant_id} value={c.consultant_id}>{c.fullname || `${c.surname || ''} ${c.name || ''}`.trim()}</option>
                        ))}
                      </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={labelPillStyle}>Assignee</span>
                      <select value={filters.assignee} onChange={(e) => setF('assignee', e.target.value)}>
                        <option value="">Any</option>
                        {consultants.map((c) => (
                          <option key={c.consultant_id} value={c.consultant_id}>{c.fullname || `${c.surname || ''} ${c.name || ''}`.trim()}</option>
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

                <ToolkitProvider bootstrap4 keyField="projtask_id" data={filteredTasks} columns={columns} exportCSV={{ fileName: 'tasks_report.csv' }} search condensed>
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

export default TasksReport;


