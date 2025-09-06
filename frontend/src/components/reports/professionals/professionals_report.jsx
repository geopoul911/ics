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
const ALL_PROFESSIONALS = "http://localhost:8000/api/data_management/all_professionals/";
const ALL_PROFESSIONS = "http://localhost:8000/api/administration/all_professions/";

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

function ProfessionalsReport() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [professionals, setProfessionals] = useState([]);
  const [professions, setProfessions] = useState([]);

  // Filters per spec: City, Profession
  const [filters, setFilters] = useState({
    city: "",
    profession: "",
  });

  useEffect(() => {
    const currentHeaders = { ...headers, Authorization: "Token " + localStorage.getItem("userToken") };
    async function load() {
      try {
        const [pRes, profRes] = await Promise.all([
          axios.get(ALL_PROFESSIONALS, { headers: currentHeaders }),
          axios.get(ALL_PROFESSIONS, { headers: currentHeaders }),
        ]);
        const allP = pRes?.data?.all_professionals || pRes?.data?.results || pRes?.data?.data || pRes?.data || [];
        const allProfs = profRes?.data?.all_professions || profRes?.data || [];
        setProfessionals(Array.isArray(allP) ? allP : []);
        setProfessions(Array.isArray(allProfs) ? allProfs : []);
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

  const cityOptions = useMemo(() => {
    const s = new Set();
    (professionals || []).forEach((p) => { if (p.city?.title) s.add(p.city.title); });
    return Array.from(s);
  }, [professionals]);

  const filteredProfessionals = useMemo(() => {
    const city = filters.city || "";
    const professionId = filters.profession || "";

    function profPasses(p) {
      if (city && (p.city?.title || "") !== city) return false;
      if (professionId) {
        const id = p.profession?.prof_id || p.profession;
        if (String(id) !== String(professionId)) return false;
      }
      return true;
    }

    return (professionals || []).filter(profPasses);
  }, [professionals, filters]);

  const columns = [
    {
      dataField: "professional_id",
      text: "Professional ID",
      sort: true,
      formatter: (cell, row) => (
        <a href={`/data_management/professional/${row.professional_id}`} id="cell_link">{row.professional_id}</a>
      ),
    },
    { dataField: "fullname", text: "Full name", sort: true },
    { dataField: "profession.title", text: "Profession", sort: true, formatter: (c, r) => r.profession?.title || "" },
    { dataField: "city.title", text: "City", sort: true, formatter: (c, r) => r.city?.title || "" },
    { dataField: "reliability", text: "Reliability", sort: true },
    { dataField: "active", text: "Active", sort: true, formatter: (c, r) => (r.active ? "Yes" : "No") },
  ];

  return (
    <>
      <NavigationBar />
      <div className="mainContainer">
        {pageHeader("reports_professionals", "Reports — Professionals")}
        <div className="contentContainer">
          <div className="contentBody">
            {isLoaded ? (
              <>
                <style>{`.pillLink { color: inherit; text-decoration: none; } .pillLink:hover { color: #93ab3c; text-decoration: none; }`}</style>
                <div style={{ marginBottom: 16, background: '#fff', padding: 16, borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #eee' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px 16px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={labelPillStyle}>City</span>
                      <select value={filters.city} onChange={(e) => setF('city', e.target.value)}>
                        <option value="">All</option>
                        {cityOptions.map((o) => (<option key={o} value={o}>{o}</option>))}
                      </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={labelPillStyle}>Profession</span>
                      <select value={filters.profession} onChange={(e) => setF('profession', e.target.value)}>
                        <option value="">Any</option>
                        {professions.map((pr) => (
                          <option key={pr.prof_id} value={pr.prof_id}>{pr.title}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <ToolkitProvider bootstrap4 keyField="professional_id" data={filteredProfessionals} columns={columns} exportCSV={{ fileName: 'professionals_report.csv' }} search condensed>
                  {(props) => (
                    <div>
                      <BootstrapTable
                        {...props.baseProps}
                        pagination={paginationFactory(paginationOptions)}
                        defaultSorted={[{ dataField: 'fullname', order: 'asc' }]}
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

export default ProfessionalsReport;


