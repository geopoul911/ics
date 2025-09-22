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
const ALL_PROJECTS = "https://ultima.icsgr.com/api/data_management/projects/";
const ALL_PROJECT_TASKS = "https://ultima.icsgr.com/api/data_management/project_tasks/";

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

  const { startedByCategory, completedByCategory, durationStatsByCategory, projectsByConsultantCategory, tasksByTaskCategoryForCompleted, overallDuration, startedProjectsCount, completedProjectsCount, completedTasksCount, totalTasksCount } = useMemo(() => {
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
    let startedProjectsCount = 0;
    projWithCats.forEach((p) => {
      if (inRange(p.registrationdate)) {
        startedProjectsCount += 1;
        (p._cats || []).forEach((c) => {
          const label = c && (c.title || c);
          if (label) started.push(String(label));
        });
      }
    });
    const startedByCategory = groupCount(started.map((t) => ({ k: t })), (x) => x.k);

    // 2) Completed per category (completiondate in range)
    const completed = [];
    let completedProjectsCount = 0;
    projWithCats.forEach((p) => {
      const isCompletedInRange = p.completiondate ? inRange(p.completiondate) : (!from && !to && p.status === 'Completed');
      if (isCompletedInRange) {
        completedProjectsCount += 1;
        (p._cats || []).forEach((c) => {
          const label = c && (c.title || c);
          if (label) completed.push(String(label));
        });
      }
    });
    const completedByCategory = groupCount(completed.map((t) => ({ k: t })), (x) => x.k);

    // 3) Duration stats per category (start -> completion)
    const durationPerCategory = new Map();
    const allDurations = [];
    projWithCats.forEach((p) => {
      const start = p.assignedate || p.registrationdate;
      // Prefer completion; then settlement; if no date range selected and status is Completed, fall back to "today"
      let end = p.completiondate || p.settlementdate || null;
      if (!end && !from && !to && p.status === 'Completed') {
        end = new Date();
      }
      if (!start || !end) return;
      // Apply range to end date if range selected
      if ((from || to) && !inRange(end)) return;
      const duration = daysBetween(start, end);
      if (duration == null) return;
      (p._cats || []).forEach((c) => {
        const key = c && (c.title || c);
        if (!key) return;
        const k = String(key);
        const arr = durationPerCategory.get(k) || [];
        arr.push(duration);
        durationPerCategory.set(k, arr);
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
        const cat = c && (c.title || c);
        if (!cat) return;
        const key = `${cons}|||${String(cat)}`;
        projPerConsCat.set(key, (projPerConsCat.get(key) || 0) + 1);
      });
    });
    const projectsByConsultantCategory = Array.from(projPerConsCat.entries()).map(([k, v]) => {
      const [cons, cat] = k.split('|||');
      return { consultant: cons, category: cat, count: v };
    });

    // 5) Tasks per task category for completed projects in range (completiondate)
    const completedProjectIdsInRange = new Set((projects || []).filter((p) => {
      if (p.completiondate) return inRange(p.completiondate);
      // Fallback: if no date filters are set, include projects with status Completed even if completiondate missing
      if (!from && !to && (p.status === 'Completed')) return true;
      return false;
    }).map((p) => p.project_id));
    const relevantTasks = (tasks || []).filter((t) => completedProjectIdsInRange.has(t.project?.project_id || t.project));
    const tasksGrouped = groupCount(relevantTasks, (t) => {
      const label = t.taskcate && (t.taskcate.title || t.taskcate);
      return label ? String(label) : 'Uncategorized';
    });
    const totalTasksCount = relevantTasks.length;
    const completedTasksCount = relevantTasks.filter((t) => (t.status === 'Completed')).length;

    return { startedByCategory, completedByCategory, durationStatsByCategory, projectsByConsultantCategory, tasksByTaskCategoryForCompleted: tasksGrouped, overallDuration: averageMinMax(allDurations), startedProjectsCount, completedProjectsCount, completedTasksCount, totalTasksCount };
  }, [projects, tasks, filters]);

  // KPI tiles
  const totalStarted = useMemo(() => startedProjectsCount || 0, [startedProjectsCount]);
  const totalCompleted = useMemo(() => completedProjectsCount || 0, [completedProjectsCount]);
  const tasksCompletedDenom = useMemo(() => ({ done: completedTasksCount || 0, total: totalTasksCount || 0 }), [completedTasksCount, totalTasksCount]);

  // Helpers to build table columns with embedded bars
  const makeCountColumns = (data, color) => {
    const max = Math.max(1, ...data.map((d) => Number(d.count || 0)));
    return [
      { dataField: 'key', text: 'Category', sort: true },
      { dataField: 'count', text: 'Count', sort: true, formatter: (c) => {
          const pct = Math.round((Number(c || 0) / max) * 100);
          return (
            <div className="cellwrap"><div className="cellbar"><div className="cellfill" style={{ width: pct + '%', background: color }} /></div><span className="cellval">{c}</span></div>
          );
        }
      },
    ];
  };

  const makeDurationColumns = (rows) => {
    const max = Math.max(1, ...rows.flatMap((r) => [r.min || 0, r.avg || 0, r.max || 0]));
    const fmt = (v, col) => (
      <div className="cellwrap"><div className="cellbar"><div className="cellfill" style={{ width: Math.round((Number(v || 0) / max) * 100) + '%', background: col }} /></div><span className="cellval">{Number(v || 0)}</span></div>
    );
    return [
      { dataField: 'key', text: 'Category', sort: true },
      { dataField: 'min', text: 'Min days', sort: true, formatter: (c) => fmt(c, '#6c757d') },
      { dataField: 'avg', text: 'Avg days', sort: true, formatter: (c) => fmt(c, '#93ab3c') },
      { dataField: 'max', text: 'Max days', sort: true, formatter: (c) => fmt(c, '#0d6efd') },
    ];
  };

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
                    <div style={{ fontSize: 28, fontWeight: 700 }}>{`${tasksCompletedDenom.done} / ${tasksCompletedDenom.total}`}</div>
                  </div>
                </div>

                {/* Tabbed details */}
                <div style={{ background: '#fff', padding: 12, borderRadius: 10, border: '1px solid #eee' }}>
                  <style>{`
                    .stats-tabs.nav-tabs { border-bottom: none; }
                    .stats-tabs .nav-link { background: #fff; color: #000 !important; border: 1px solid #93ab3c; margin-right: 8px; border-radius: 8px 8px 0 0; border-bottom: none; }
                    .stats-tabs .nav-link:hover { background: #f7f7f7; color: #000 !important; border-color: #93ab3c; }
                    .stats-tabs .nav-link.active { background: #93ab3c; color: #fff !important; border-color: #93ab3c; border-bottom: none; }
                    .cellwrap { display:flex; align-items:center; gap:8px; }
                    .cellbar { flex:1; height:12px; background:#f0f2f5; border-radius:6px; overflow:hidden; }
                    .cellfill { height:100%; border-radius:6px; }
                    .cellval { min-width:36px; text-align:right; font-weight:600; }
                  `}</style>
                  <Tabs defaultActiveKey="projects" id="stats-tabs" className="stats-tabs">
                    <Tab eventKey="projects" title="Projects">
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16, paddingTop: 12 }}>
                        <div>
                          <h6>Started by category</h6>
                          <ToolkitProvider bootstrap4 keyField="key" data={startedByCategory} columns={makeCountColumns(startedByCategory, '#0d6efd')} search>
                            {(props) => (
                              <BootstrapTable {...props.baseProps} pagination={paginationFactory(paginationOptions)} bordered={false} hover striped />
                            )}
                          </ToolkitProvider>
                        </div>
                        <div>
                          <h6>Completed by category</h6>
                          <ToolkitProvider bootstrap4 keyField="key" data={completedByCategory} columns={makeCountColumns(completedByCategory, '#93ab3c')} search>
                            {(props) => (
                              <BootstrapTable {...props.baseProps} pagination={paginationFactory(paginationOptions)} bordered={false} hover striped />
                            )}
                          </ToolkitProvider>
                        </div>
                      </div>
                    </Tab>
                    <Tab eventKey="durations" title="Durations">
                      <div style={{ paddingTop: 12 }}>
                        <ToolkitProvider bootstrap4 keyField="key" data={durationStatsByCategory} columns={makeDurationColumns(durationStatsByCategory)} search>
                          {(props) => (
                            <BootstrapTable {...props.baseProps} pagination={paginationFactory(paginationOptions)} bordered={false} hover striped />
                          )}
                        </ToolkitProvider>
                      </div>
                    </Tab>
                    <Tab eventKey="consultants" title="Consultants">
                      <div style={{ paddingTop: 12 }}>
                        <ToolkitProvider bootstrap4 keyField={(row) => `${row.consultant}-${row.category}`} data={projectsByConsultantCategory} columns={[{dataField:'consultant',text:'Consultant',sort:true},{dataField:'category',text:'Category',sort:true},{dataField:'count',text:'Projects',sort:true,formatter:(c)=>{const max=Math.max(1,...projectsByConsultantCategory.map(r=>r.count||0));const pct=Math.round((Number(c||0)/max)*100);return(<div className="cellwrap"><div className="cellbar"><div className="cellfill" style={{width:pct+'%',background:'#6f42c1'}}/></div><span className="cellval">{c}</span></div>);}}]} search>
                          {(props) => (
                            <BootstrapTable {...props.baseProps} pagination={paginationFactory(paginationOptions)} bordered={false} hover striped />
                          )}
                        </ToolkitProvider>
                      </div>
                    </Tab>
                    <Tab eventKey="tasks" title="Tasks">
                      <div style={{ paddingTop: 12 }}>
                        <ToolkitProvider bootstrap4 keyField="key" data={tasksByTaskCategoryForCompleted} columns={makeCountColumns(tasksByTaskCategoryForCompleted, '#fd7e14')} search>
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


