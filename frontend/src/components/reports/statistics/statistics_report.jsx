// Built-ins
import React, { useEffect, useMemo, useState } from "react";

// Modules / Functions
import axios from "axios";
import { FaPrint } from "react-icons/fa";
import { Tabs, Tab } from "react-bootstrap";

import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";

// Custom
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import { headers, pageHeader, loader, paginationOptions } from "../../global_vars";

// API endpoints
const ALL_PROJECTS = "http://localhost:8000/api/data_management/projects/";
const ALL_PROJECT_TASKS = "http://localhost:8000/api/data_management/project_tasks/";

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

function groupCount(items, keyFn) {
  const map = new Map();
  items.forEach((it) => {
    const k = keyFn(it);
    if (!k) return;
    map.set(k, (map.get(k) || 0) + 1);
  });
  return Array.from(map.entries()).map(([k, v]) => ({ key: k, count: v }));
}

function averageMinMax(durations) {
  if (!durations.length) return { avg: 0, min: 0, max: 0 };
  const sum = durations.reduce((a, b) => a + b, 0);
  return { avg: sum / durations.length, min: Math.min(...durations), max: Math.max(...durations) };
}

function daysBetween(a, b) {
  if (!a || !b) return null;
  const ms = Math.abs(new Date(b) - new Date(a));
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

function StatisticsReport() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  // Time window filters
  const [filters, setFilters] = useState({ from: "", to: "" });

  useEffect(() => {
    const currentHeaders = { ...headers, Authorization: "Token " + localStorage.getItem("userToken") };
    async function load() {
      try {
        const [pRes, tRes] = await Promise.all([
          axios.get(ALL_PROJECTS, { headers: currentHeaders }),
          axios.get(ALL_PROJECT_TASKS, { headers: currentHeaders }),
        ]);
        const allP = pRes?.data?.all_projects || pRes?.data?.results || pRes?.data?.data || pRes?.data || [];
        const allT = tRes?.data?.all_project_tasks || tRes?.data?.results || tRes?.data?.data || tRes?.data || [];
        setProjects(Array.isArray(allP) ? allP : []);
        setTasks(Array.isArray(allT) ? allT : []);
        setIsLoaded(true);
      } catch (e) {
        setIsLoaded(true);
      }
    }
    load();
  }, []);

  function setF(key, val) { setFilters((prev) => ({ ...prev, [key]: val })); }

  const { startedByCategory, completedByCategory, durationStatsByCategory, projectsByConsultantCategory, tasksByTaskCategoryForCompleted, overallDuration } = useMemo(() => {
    const from = filters.from ? new Date(filters.from) : null;
    const to = filters.to ? new Date(filters.to) : null;

    function inRange(date) {
      if (!date) return false;
      const d = new Date(date);
      if (!isFinite(d)) return false;
      if (from && d < from) return false;
      if (to && d > to) return false;
      return true;
    }

    const projWithCats = (projects || []).map((p) => ({
      ...p,
      _cats: Array.isArray(p.categories) ? p.categories : [],
    }));

    // 1) Started per category (registrationdate in range)
    const started = [];
    projWithCats.forEach((p) => {
      if (inRange(p.registrationdate)) {
        (p._cats || []).forEach((c) => started.push(c?.title || c));
      }
    });
    const startedByCategory = groupCount(started.map((t) => ({ k: t })), (x) => x.k);

    // 2) Completed per category (completiondate in range)
    const completed = [];
    projWithCats.forEach((p) => {
      if (inRange(p.completiondate)) {
        (p._cats || []).forEach((c) => completed.push(c?.title || c));
      }
    });
    const completedByCategory = groupCount(completed.map((t) => ({ k: t })), (x) => x.k);

    // 3) Duration stats per category (assign -> completion)
    const durationPerCategory = new Map();
    const allDurations = [];
    projWithCats.forEach((p) => {
      if (!p.assignedate || !p.completiondate) return;
      const duration = daysBetween(p.assignedate, p.completiondate);
      if (duration == null) return;
      (p._cats || []).forEach((c) => {
        const key = c?.title || c;
        const arr = durationPerCategory.get(key) || [];
        arr.push(duration);
        durationPerCategory.set(key, arr);
      });
      allDurations.push(duration);
    });
    const durationStatsByCategory = Array.from(durationPerCategory.entries()).map(([k, arr]) => ({
      key: k,
      ...averageMinMax(arr),
    }));

    // 4) Projects per consultant per category (registrationdate in range)
    const projPerConsCat = new Map();
    projWithCats.forEach((p) => {
      if (!inRange(p.registrationdate)) return;
      const cons = p.consultant?.fullname || p.consultant?.surname || "Consultant";
      (p._cats || []).forEach((c) => {
        const cat = c?.title || c;
        const key = `${cons}|||${cat}`;
        projPerConsCat.set(key, (projPerConsCat.get(key) || 0) + 1);
      });
    });
    const projectsByConsultantCategory = Array.from(projPerConsCat.entries()).map(([k, v]) => {
      const [cons, cat] = k.split('|||');
      return { consultant: cons, category: cat, count: v };
    });

    // 5) Tasks per task category for completed projects in range (completiondate)
    const completedProjectIdsInRange = new Set((projects || []).filter((p) => inRange(p.completiondate)).map((p) => p.project_id));
    const relevantTasks = (tasks || []).filter((t) => completedProjectIdsInRange.has(t.project?.project_id || t.project));
    const tasksGrouped = groupCount(relevantTasks, (t) => t.taskcate?.title || t.taskcate);

    return { startedByCategory, completedByCategory, durationStatsByCategory, projectsByConsultantCategory, tasksByTaskCategoryForCompleted: tasksGrouped, overallDuration: averageMinMax(allDurations) };
  }, [projects, tasks, filters]);

  // KPI tiles
  const totalStarted = useMemo(() => (startedByCategory || []).reduce((s, r) => s + (r.count || 0), 0), [startedByCategory]);
  const totalCompleted = useMemo(() => (completedByCategory || []).reduce((s, r) => s + (r.count || 0), 0), [completedByCategory]);
  const totalTasksCompletedProjects = useMemo(() => (tasksByTaskCategoryForCompleted || []).reduce((s, r) => s + (r.count || 0), 0), [tasksByTaskCategoryForCompleted]);

  // Tabular definitions
  const columnsCounts = [
    { dataField: "key", text: "Category", sort: true },
    { dataField: "count", text: "Count", sort: true },
  ];
  const columnsDuration = [
    { dataField: "key", text: "Category", sort: true },
    { dataField: "min", text: "Min days", sort: true },
    { dataField: "avg", text: "Avg days", sort: true, formatter: (c) => (c ? c.toFixed(1) : "0.0") },
    { dataField: "max", text: "Max days", sort: true },
  ];
  const columnsProjectsByConsCat = [
    { dataField: "consultant", text: "Consultant", sort: true },
    { dataField: "category", text: "Category", sort: true },
    { dataField: "count", text: "Projects", sort: true },
  ];

  // Styles for KPI tiles
  const kpiStyle = {
    background: '#fff',
    padding: 16,
    borderRadius: 12,
    border: '1px solid #eee',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
  };

  return (
    <>
      <NavigationBar />
      <div className="mainContainer">
        {pageHeader("reports_statistics", "Reports — Statistics")}
        <div className="contentContainer">
          <div className="contentBody">
            {isLoaded ? (
              <>
                {/* Filters / actions */}
                <div style={{ marginBottom: 16, background: '#fff', padding: 16, borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #eee' }}>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={labelPillStyle}>From</span>
                      <input type="date" value={filters.from} onChange={(e) => setF('from', e.target.value)} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={labelPillStyle}>To</span>
                      <input type="date" value={filters.to} onChange={(e) => setF('to', e.target.value)} />
                    </div>
                    <button onClick={() => window.print()} style={{ marginLeft: 'auto', padding: '6px 10px', borderRadius: 6, border: '1px solid #444', background: '#444', color: '#fff', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <FaPrint /> Print / PDF
                    </button>
                  </div>
                </div>

                {/* KPI tiles */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 16 }}>
                  <div style={kpiStyle}>
                    <div style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>Projects started</div>
                    <div style={{ fontSize: 28, fontWeight: 700 }}>{totalStarted}</div>
                  </div>
                  <div style={kpiStyle}>
                    <div style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>Projects completed</div>
                    <div style={{ fontSize: 28, fontWeight: 700 }}>{totalCompleted}</div>
                  </div>
                  <div style={kpiStyle}>
                    <div style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>Avg duration (days)</div>
                    <div style={{ fontSize: 28, fontWeight: 700 }}>{overallDuration?.avg ? overallDuration.avg.toFixed(1) : 0}</div>
                    <div style={{ fontSize: 12, color: '#999' }}>min {overallDuration?.min || 0} • max {overallDuration?.max || 0}</div>
                  </div>
                  <div style={kpiStyle}>
                    <div style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>Tasks (completed projects)</div>
                    <div style={{ fontSize: 28, fontWeight: 700 }}>{totalTasksCompletedProjects}</div>
                  </div>
                </div>

                {/* Tabbed details */}
                <div style={{ background: '#fff', padding: 12, borderRadius: 10, border: '1px solid #eee' }}>
                  <style>{`
                    .stats-tabs.nav-tabs { border-bottom: none; }
                    .stats-tabs .nav-link { background: #fff; color: #000 !important; border: 1px solid #93ab3c; margin-right: 8px; border-radius: 8px 8px 0 0; border-bottom: none; }
                    .stats-tabs .nav-link:hover { background: #f7f7f7; color: #000 !important; border-color: #93ab3c; }
                    .stats-tabs .nav-link.active { background: #93ab3c; color: #fff !important; border-color: #93ab3c; border-bottom: none; }
                  `}</style>
                  <Tabs defaultActiveKey="projects" id="stats-tabs" className="stats-tabs">
                    <Tab eventKey="projects" title="Projects">
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16, paddingTop: 12 }}>
                        <div>
                          <h6>Started by category</h6>
                          <ToolkitProvider bootstrap4 keyField="key" data={startedByCategory} columns={columnsCounts} exportCSV={{ fileName: 'stats_projects_started.csv' }} search condensed>
                            {(props) => (
                              <BootstrapTable {...props.baseProps} pagination={paginationFactory(paginationOptions)} bordered={false} hover striped />
                            )}
                          </ToolkitProvider>
                        </div>
                        <div>
                          <h6>Completed by category</h6>
                          <ToolkitProvider bootstrap4 keyField="key" data={completedByCategory} columns={columnsCounts} exportCSV={{ fileName: 'stats_projects_completed.csv' }} search condensed>
                            {(props) => (
                              <BootstrapTable {...props.baseProps} pagination={paginationFactory(paginationOptions)} bordered={false} hover striped />
                            )}
                          </ToolkitProvider>
                        </div>
                      </div>
                    </Tab>
                    <Tab eventKey="durations" title="Durations">
                      <div style={{ paddingTop: 12 }}>
                        <ToolkitProvider bootstrap4 keyField="key" data={durationStatsByCategory} columns={columnsDuration} exportCSV={{ fileName: 'stats_project_duration.csv' }} search condensed>
                          {(props) => (
                            <BootstrapTable {...props.baseProps} pagination={paginationFactory(paginationOptions)} bordered={false} hover striped />
                          )}
                        </ToolkitProvider>
                      </div>
                    </Tab>
                    <Tab eventKey="consultants" title="Consultants">
                      <div style={{ paddingTop: 12 }}>
                        <ToolkitProvider bootstrap4 keyField={(row) => `${row.consultant}-${row.category}`} data={projectsByConsultantCategory} columns={columnsProjectsByConsCat} exportCSV={{ fileName: 'stats_projects_by_consultant_category.csv' }} search condensed>
                          {(props) => (
                            <BootstrapTable {...props.baseProps} pagination={paginationFactory(paginationOptions)} bordered={false} hover striped />
                          )}
                        </ToolkitProvider>
                      </div>
                    </Tab>
                    <Tab eventKey="tasks" title="Tasks">
                      <div style={{ paddingTop: 12 }}>
                        <ToolkitProvider bootstrap4 keyField="key" data={tasksByTaskCategoryForCompleted} columns={columnsCounts} exportCSV={{ fileName: 'stats_tasks_by_category_completed_projects.csv' }} search condensed>
                          {(props) => (
                            <BootstrapTable {...props.baseProps} pagination={paginationFactory(paginationOptions)} bordered={false} hover striped />
                          )}
                        </ToolkitProvider>
                      </div>
                    </Tab>
                  </Tabs>
                </div>
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

export default StatisticsReport;


