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

  // Filters per spec: Transaction date range
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
  });

  useEffect(() => {
    const currentHeaders = { ...headers, Authorization: "Token " + localStorage.getItem("userToken") };
    async function load() {
      try {
        const res = await axios.get(ALL_CASH, { headers: currentHeaders });
        const all = res?.data?.all_cash || res?.data?.results || res?.data?.data || res?.data || [];
        const normalized = (Array.isArray(all) ? all : []).map((c) => ({ ...c, trandate: c?.trandate ? new Date(c.trandate) : null }));
        setCashEntries(normalized);
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
      if (!from && !to) return true;
      if (!c.trandate) return false;
      const d = c.trandate instanceof Date ? c.trandate : new Date(c.trandate);
      if (!isFinite(d)) return false;
      if (from && d < from) return false;
      if (to && d > to) return false;
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
    { dataField: "currency", text: "Currency", sort: true },
    { dataField: "amountexp", text: "Amount expense", sort: true },
    { dataField: "amountpay", text: "Amount payment", sort: true },
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
                <style>{`.pillLink { color: inherit; text-decoration: none; } .pillLink:hover { color: #93ab3c; text-decoration: none; }`}</style>
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

export default CashReport;


