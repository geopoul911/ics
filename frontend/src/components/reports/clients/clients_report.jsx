// Built-ins
import React, { useEffect, useMemo, useState } from "react";

// Modules / Functions
import axios from "axios";
import { FaPrint } from "react-icons/fa";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
// We use top toolbar filters, not header filters
import paginationFactory from "react-bootstrap-table2-paginator";

// Custom
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import { headers, pageHeader, loader, paginationOptions } from "../../global_vars";

// API endpoints
const ALL_CLIENTS = "http://localhost:8000/api/data_management/clients/";
const ALL_PROJECTS = "http://localhost:8000/api/data_management/projects/";
const ALL_ASSOCIATED = "http://localhost:8000/api/data_management/associated_clients/";
const ALL_CONSULTANTS = "http://localhost:8000/api/administration/all_consultants/";
const ALL_CATEGORIES = "http://localhost:8000/api/administration/all_project_categories/";

// Styling bits
const labelPillStyle = {
  display: "inline-block",
  padding: "2px 8px",
  borderRadius: "10px",
  background: "#93ab3c", // theme green
  color: "#fff",
  fontSize: 12,
  fontWeight: 600,
  marginRight: 8,
  border: "1px solid #93ab3c",
};

function ClientsReport() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [assocs, setAssocs] = useState([]);
  const [consultants, setConsultants] = useState([]);
  const [categories, setCategories] = useState([]);

  // Filters
  const [filters, setFilters] = useState({
    // clients
    country: "",
    province: "",
    city: "",
    deceased: "",
    taxmanagement: "",
    taxrepresentation: "",
    retired: "",
    active: "",
    // projects
    consultant: "",
    status: "",
    category: "",
    taxationOnly: "", // yes/no
  });

  useEffect(() => {
    const currentHeaders = { ...headers, Authorization: "Token " + localStorage.getItem("userToken") };
    async function load() {
      try {
        const [cRes, pRes, aRes, consRes, catRes] = await Promise.all([
          axios.get(ALL_CLIENTS, { headers: currentHeaders }),
          axios.get(ALL_PROJECTS, { headers: currentHeaders }),
          axios.get(ALL_ASSOCIATED, { headers: currentHeaders }),
          axios.get(ALL_CONSULTANTS, { headers: currentHeaders }),
          axios.get(ALL_CATEGORIES, { headers: currentHeaders }),
        ]);
        const allC = cRes?.data?.all_clients || cRes?.data?.results || cRes?.data?.data || cRes?.data || [];
        const allP = pRes?.data?.all_projects || pRes?.data?.results || pRes?.data?.data || pRes?.data || [];
        const allA = aRes?.data?.all_associated_clients || aRes?.data?.results || aRes?.data?.data || aRes?.data || [];
        const allCons = consRes?.data?.all_consultants || [];
        const allCats = catRes?.data?.all_project_categories || [];
        setClients(Array.isArray(allC) ? allC : []);
        setProjects(Array.isArray(allP) ? allP : []);
        setAssocs(Array.isArray(allA) ? allA : []);
        setConsultants(Array.isArray(allCons) ? allCons : []);
        setCategories(Array.isArray(allCats) ? allCats : []);
        setIsLoaded(true);
      } catch (e) {
        setIsLoaded(true);
      }
    }
    load();
  }, []);

  const projectById = useMemo(() => {
    const map = {};
    (projects || []).forEach((p) => { map[p.project_id] = p; });
    return map;
  }, [projects]);

  const projectsByClientId = useMemo(() => {
    const map = {};
    (assocs || []).forEach((ac) => {
      const clientRef = ac?.client;
      const projectRef = ac?.project;
      const clientId = clientRef?.client_id || clientRef;
      const projectId = projectRef?.project_id || projectRef;
      if (!clientId || !projectId) return;
      if (!map[clientId]) map[clientId] = [];
      map[clientId].push(projectById[projectId] || projectRef);
    });
    return map;
  }, [assocs, projectById]);

  function setF(key, val) {
    setFilters((prev) => ({ ...prev, [key]: val }));
  }

  const countryOptions = useMemo(() => {
    const s = new Set();
    (clients || []).forEach((c) => { if (c.country?.title) s.add(c.country.title); });
    return Array.from(s);
  }, [clients]);
  const provinceOptions = useMemo(() => {
    const s = new Set();
    (clients || []).forEach((c) => { if (c.province?.title) s.add(c.province.title); });
    return Array.from(s);
  }, [clients]);
  const cityOptions = useMemo(() => {
    const s = new Set();
    (clients || []).forEach((c) => { if (c.city?.title) s.add(c.city.title); });
    return Array.from(s);
  }, [clients]);

  const filteredClients = useMemo(() => {
    const categoryId = filters.category || "";
    const consultantId = filters.consultant || "";
    const status = filters.status || "";
    const taxationOnly = filters.taxationOnly === "yes";

    function clientPasses(c) {
      // client attribute filters
      if (filters.country && c.country?.title !== filters.country) return false;
      if (filters.province && c.province?.title !== filters.province) return false;
      if (filters.city && c.city?.title !== filters.city) return false;
      if (filters.deceased && String(!!c.deceased) !== (filters.deceased === "yes" ? "true" : "false")) return false;
      if (filters.taxmanagement && String(!!c.taxmanagement) !== (filters.taxmanagement === "yes" ? "true" : "false")) return false;
      if (filters.taxrepresentation && String(!!c.taxrepresentation) !== (filters.taxrepresentation === "yes" ? "true" : "false")) return false;
      if (filters.retired && String(!!c.retired) !== (filters.retired === "yes" ? "true" : "false")) return false;
      if (filters.active && String(!!c.active) !== (filters.active === "yes" ? "true" : "false")) return false;

      const plist = projectsByClientId[c.client_id] || [];
      if (!consultantId && !status && !categoryId && !taxationOnly) {
        return true; // no project-based criteria
      }
      // project-based filters: at least one project must match
      return plist.some((p) => {
        if (!p || typeof p !== 'object') return false;
        if (consultantId) {
          const pc = p.consultant;
          const pid = pc?.consultant_id || pc;
          if (String(pid) !== String(consultantId)) return false;
        }
        if (status && (p.status || "") !== status) return false;
        if (categoryId) {
          const cats = Array.isArray(p.categories) ? p.categories : [];
          const hasCat = cats.some((cat) => (cat?.projcate_id || cat) === categoryId);
          if (!hasCat) return false;
        }
        if (taxationOnly && !p.taxation) return false;
        return true;
      });
    }

    let list = (clients || []).filter(clientPasses);
    // Active filter for reports: show either active or non-active entries when chosen
    if (filters.active) {
      list = list.filter((c) => String(!!c.active) === (filters.active === 'yes' ? 'true' : 'false'));
    }
    return list;
  }, [clients, filters, projectsByClientId]);

  const columns = [
    {
      dataField: "client_id",
      text: "Client ID",
      sort: true,
      headerStyle: { width: '110px' },
      formatter: (cell, row) => (
        <a href={`/data_management/client/${row.client_id}`} id="cell_link">{row.client_id}</a>
      ),
    },
    { dataField: "_fullname", text: "Full name", sort: true, headerStyle: { width: '25%' }, sortValue: (cell, r) => `${r.surname || ''} ${r.name || ''}`.trim(), formatter: (c, r) => `${r.surname || ''} ${r.name || ''}`.trim() },
    { dataField: "_location", text: "Location", sort: true, headerStyle: { width: '20%' }, sortValue: (cell, r) => `${r.country?.title || ''} - ${r.province?.title || ''} - ${r.city?.title || ''}`.trim(), formatter: (c, r) => {
        const parts = [r.country?.title, r.province?.title, r.city?.title].filter(Boolean);
        return parts.join(' - ');
      }
    },
    { dataField: "deceased", text: "Deceased", sort: true, formatter: (c, r) => (r.deceased ? "Yes" : "No") },
    { dataField: "taxmanagement", text: "Tax mgmt", sort: true, formatter: (c, r) => (r.taxmanagement ? "Yes" : "No") },
    { dataField: "taxrepresentation", text: "Tax repr", sort: true, formatter: (c, r) => (r.taxrepresentation ? "Yes" : "No") },
    { dataField: "retired", text: "Retired", sort: true, formatter: (c, r) => (r.retired ? "Yes" : "No") },
    { dataField: "active", text: "Active", sort: true, formatter: (c, r) => (r.active ? "Yes" : "No") },
    // Derived project fields matching pills
    { dataField: "_consultants", text: "Consultant(s)", formatter: (c, r) => {
        const plist = projectsByClientId[r.client_id] || [];
        const names = plist.map((p) => {
          const pc = p?.consultant;
          if (!pc) return null;
          return pc.fullname || `${pc.surname || ''} ${pc.name || ''}`.trim();
        }).filter(Boolean);
        return Array.from(new Set(names)).join(', ');
      }
    },
    { dataField: "_statuses", text: "Status(es)", formatter: (c, r) => {
        const plist = projectsByClientId[r.client_id] || [];
        const statuses = plist.map((p) => p?.status).filter(Boolean);
        return Array.from(new Set(statuses)).join(', ');
      }
    },
    { dataField: "_categories", text: "Categories", formatter: (c, r) => {
        const plist = projectsByClientId[r.client_id] || [];
        const titles = [];
        plist.forEach((p) => {
          const cats = Array.isArray(p?.categories) ? p.categories : [];
          cats.forEach((cat) => { const t = cat?.title; if (t) titles.push(t); });
        });
        return Array.from(new Set(titles)).join(', ');
      }
    },
    { dataField: "_taxation", text: "Taxation", formatter: (c, r) => {
        const plist = projectsByClientId[r.client_id] || [];
        const anyTax = plist.some((p) => !!p?.taxation);
        return anyTax ? 'Yes' : 'No';
      }
    },
  ];

  return (
    <>
      <NavigationBar />
      <div className="mainContainer">
        {pageHeader("reports_clients", "Reports — Clients")}
        <div className="contentContainer">
          <div className="contentBody">
            {isLoaded ? (
              <>
                <style>{`.pillLink { color: inherit; text-decoration: none; } .pillLink:hover { color: #93ab3c; text-decoration: none; }`}</style>
                <div style={{ marginBottom: 16, background: '#fff', padding: 16, borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #eee' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px 16px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={labelPillStyle}>Country</span>
                      <select value={filters.country} onChange={(e) => setF('country', e.target.value)}>
                        <option value="">All</option>
                        {countryOptions.map((o) => (<option key={o} value={o}>{o}</option>))}
                      </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={labelPillStyle}>Province</span>
                      <select value={filters.province} onChange={(e) => setF('province', e.target.value)}>
                        <option value="">All</option>
                        {provinceOptions.map((o) => (<option key={o} value={o}>{o}</option>))}
                      </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={labelPillStyle}>City</span>
                      <select value={filters.city} onChange={(e) => setF('city', e.target.value)}>
                        <option value="">All</option>
                        {cityOptions.map((o) => (<option key={o} value={o}>{o}</option>))}
                      </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={labelPillStyle}>Deceased</span>
                      <select value={filters.deceased} onChange={(e) => setF('deceased', e.target.value)}>
                        <option value="">Any</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={labelPillStyle}>Tax mgmt</span>
                      <select value={filters.taxmanagement} onChange={(e) => setF('taxmanagement', e.target.value)}>
                        <option value="">Any</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={labelPillStyle}>Tax repr</span>
                      <select value={filters.taxrepresentation} onChange={(e) => setF('taxrepresentation', e.target.value)}>
                        <option value="">Any</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={labelPillStyle}>Retired</span>
                      <select value={filters.retired} onChange={(e) => setF('retired', e.target.value)}>
                        <option value="">Any</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
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
                      <span style={labelPillStyle}>Taxation only</span>
                      <select value={filters.taxationOnly} onChange={(e) => setF('taxationOnly', e.target.value)}>
                        <option value="">Any</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </div>
                  </div>
                </div>

                <ToolkitProvider bootstrap4 keyField="client_id" data={filteredClients} columns={columns} exportCSV={{ fileName: 'clients_report.csv' }} search condensed>
                  {(props) => (
                    <div>
                      <BootstrapTable
                        {...props.baseProps}
                        pagination={paginationFactory(paginationOptions)}
                        defaultSorted={[{ dataField: '_fullname', order: 'asc' }]}
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

export default ClientsReport;
