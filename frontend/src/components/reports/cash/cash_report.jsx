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
import { headers, pageHeader, loader, paginationOptions, formatAmountWithCurrency } from "../../global_vars";

// API endpoints
const ALL_CASH = "http://localhost:8000/api/data_management/cash/";

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

function CashReport() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [cashEntries, setCashEntries] = useState([]);
  const [projects, setProjects] = useState([]);
  const [consultants, setConsultants] = useState([]);

  // Filters per spec: Transaction date range, Project, Kind, Reason, Consultant
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    project: "",
    kind: "",
    reason: "",
    consultant: "",
  });

  useEffect(() => {
    const currentHeaders = { ...headers, Authorization: "Token " + localStorage.getItem("userToken") };
    async function load() {
      try {
        const [cashRes, projRes, consRes] = await Promise.all([
          axios.get(ALL_CASH, { headers: currentHeaders }),
          axios.get('http://localhost:8000/api/data_management/projects/', { headers: currentHeaders }),
          axios.get('http://localhost:8000/api/administration/all_consultants/', { headers: currentHeaders }),
        ]);
        const all = cashRes?.data?.all_cash || cashRes?.data?.results || cashRes?.data?.data || cashRes?.data || [];
        const normalized = (Array.isArray(all) ? all : []).map((c) => ({ ...c, trandate: c?.trandate ? new Date(c.trandate) : null }));
        setCashEntries(normalized);
        const allProjects = projRes?.data?.all_projects || projRes?.data?.results || projRes?.data?.data || projRes?.data || [];
        setProjects(Array.isArray(allProjects) ? allProjects : []);
        const allCons = consRes?.data?.all_consultants || [];
        setConsultants(Array.isArray(allCons) ? allCons : []);
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

  const filteredCash = useMemo(() => {
    const from = filters.dateFrom ? new Date(filters.dateFrom) : null;
    const to = filters.dateTo ? new Date(filters.dateTo) : null;
    function cashPasses(c) {
      // date range
      if (from || to) {
        if (!c.trandate) return false;
        const d = c.trandate instanceof Date ? c.trandate : new Date(c.trandate);
        if (!isFinite(d)) return false;
        if (from && d < from) return false;
        if (to && d > to) return false;
      }
      // project
      if (filters.project) {
        const pid = c.project?.project_id || c.project;
        if (String(pid) !== String(filters.project)) return false;
      }
      // kind
      if (filters.kind && ((filters.kind === 'E' && c.kind !== 'E') || (filters.kind === 'P' && c.kind !== 'P'))) return false;
      // reason substring
      if (filters.reason && !(c.reason || '').toLowerCase().includes(filters.reason.toLowerCase())) return false;
      // consultant
      if (filters.consultant) {
        const cid = c.consultant?.consultant_id || c.consultant;
        if (String(cid) !== String(filters.consultant)) return false;
      }
      return true;
    }
    return (cashEntries || []).filter(cashPasses);
  }, [cashEntries, filters]);

  const columns = [
    {
      dataField: "cash_id",
      text: "Cash ID",
      sort: true,
      formatter: (cell, row) => (
        <a href={`/data_management/cash/${row.cash_id}`} id="cell_link">{row.cash_id}</a>
      ),
    },
    { dataField: "project.title", text: "Project", sort: true, formatter: (c, r) => r.project?.title || "" },
    { dataField: "trandate", text: "Transaction date", sort: true, formatter: (c, r) => (r.trandate ? new Date(r.trandate).toLocaleDateString() : "") },
    { dataField: "consultant.fullname", text: "Consultant", sort: true, formatter: (c, r) => r.consultant?.fullname || "" },
    { dataField: "kind", text: "Kind", sort: true, formatter: (c, r) => (r.kind === 'E' ? 'Expense' : 'Payment') },
    { dataField: "_amount", text: "Amount", sort: true, formatter: (c, r) => {
        const val = r.kind === 'E' ? (r.amountexp || 0) : (r.amountpay || 0);
        return formatAmountWithCurrency(val, r?.country?.currency);
      }
    },
    { dataField: "reason", text: "Reason", sort: true },
  ];

  return (
    <>
      <NavigationBar />
      <div className="mainContainer">
        {pageHeader("reports_cash", "Reports — Cash")}
        <div className="contentContainer">
          <div className="contentBody">
            {isLoaded ? (
              <>
                <style>{`
                  .pillLink { color: inherit; text-decoration: none; }
                  .pillLink:hover { color: #93ab3c; text-decoration: none; }
                  .cash-row-expense { background-color: rgba(220, 53, 69, 0.12); }
                  .cash-row-payment { background-color: rgba(40, 167, 69, 0.12); }
                `}</style>
                <div style={{ marginBottom: 16, background: '#fff', padding: 16, borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #eee' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px 16px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={labelPillStyle}>Date from</span>
                      <input type="date" value={filters.dateFrom} onChange={(e) => setF('dateFrom', e.target.value)} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={labelPillStyle}>Date to</span>
                      <input type="date" value={filters.dateTo} onChange={(e) => setF('dateTo', e.target.value)} />
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
                      <span style={labelPillStyle}>Kind</span>
                      <select value={filters.kind} onChange={(e) => setF('kind', e.target.value)}>
                        <option value="">Any</option>
                        <option value="E">Expense</option>
                        <option value="P">Payment</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={labelPillStyle}>Reason</span>
                      <input type="text" value={filters.reason} onChange={(e) => setF('reason', e.target.value)} placeholder="contains..." />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={labelPillStyle}>Consultant</span>
                      <select value={filters.consultant} onChange={(e) => setF('consultant', e.target.value)}>
                        <option value="">Any</option>
                        {consultants.map((c) => (
                          <option key={c.consultant_id} value={c.consultant_id}>{c.fullname || `${c.surname || ''} ${c.name || ''}`.trim()}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <ToolkitProvider bootstrap4 keyField="cash_id" data={filteredCash} columns={columns} exportCSV={{ fileName: 'cash_report.csv' }} search condensed>
                  {(props) => (
                    <div>
                      <BootstrapTable
                        {...props.baseProps}
                        pagination={paginationFactory(paginationOptions)}
                        defaultSorted={[{ dataField: 'trandate', order: 'desc' }]}
                        hover
                        bordered={false}
                        rowClasses={(row) => (row.kind === 'E' ? 'cash-row-expense' : 'cash-row-payment')}
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

export default CashReport;


