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
const ALL_PROPERTIES = "http://localhost:8000/api/data_management/all_properties/";

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

function PropertiesReport() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [properties, setProperties] = useState([]);

  // Filters per spec: Country, Province, City, Type, Status, Market
  const [filters, setFilters] = useState({
    country: "",
    province: "",
    city: "",
    type: "",
    status: "",
    market: "",
  });

  useEffect(() => {
    const currentHeaders = { ...headers, Authorization: "Token " + localStorage.getItem("userToken") };
    async function load() {
      try {
        const res = await axios.get(ALL_PROPERTIES, { headers: currentHeaders });
        const all = res?.data?.all_properties || res?.data?.results || res?.data?.data || res?.data || [];
        setProperties(Array.isArray(all) ? all : []);
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

  const countryOptions = useMemo(() => {
    const s = new Set();
    (properties || []).forEach((p) => { if (p.country?.name) s.add(p.country.name); });
    return Array.from(s);
  }, [properties]);
  const provinceOptions = useMemo(() => {
    const s = new Set();
    (properties || []).forEach((p) => { if (p.province?.name) s.add(p.province.name); });
    return Array.from(s);
  }, [properties]);
  const cityOptions = useMemo(() => {
    const s = new Set();
    (properties || []).forEach((p) => { if (p.city?.name) s.add(p.city.name); });
    return Array.from(s);
  }, [properties]);
  const typeOptions = useMemo(() => {
    const s = new Set();
    (properties || []).forEach((p) => { if (p.type) s.add(p.type); });
    return Array.from(s);
  }, [properties]);
  const statusOptions = useMemo(() => {
    const s = new Set();
    (properties || []).forEach((p) => { if (p.status) s.add(p.status); });
    return Array.from(s);
  }, [properties]);
  const marketOptions = useMemo(() => {
    const s = new Set();
    (properties || []).forEach((p) => { if (p.market) s.add(p.market); });
    return Array.from(s);
  }, [properties]);

  const filteredProperties = useMemo(() => {
    function propPasses(p) {
      if (filters.country && (p.country?.name || "") !== filters.country) return false;
      if (filters.province && (p.province?.name || "") !== filters.province) return false;
      if (filters.city && (p.city?.name || "") !== filters.city) return false;
      if (filters.type && (p.type || "") !== filters.type) return false;
      if (filters.status && (p.status || "") !== filters.status) return false;
      if (filters.market && (p.market || "") !== filters.market) return false;
      return true;
    }
    return (properties || []).filter(propPasses);
  }, [properties, filters]);

  const columns = [
    {
      dataField: "property_id",
      text: "Property ID",
      sort: true,
      formatter: (cell, row) => (
        <a href={`/data_management/property/${row.property_id}`} id="cell_link">{row.property_id}</a>
      ),
    },
    { dataField: "description", text: "Description", sort: true },
    { dataField: "project.title", text: "Project", sort: true, formatter: (c, r) => r.project?.title || "" },
    { dataField: "type", text: "Type", sort: true },
    { dataField: "country.name", text: "Country", sort: true, formatter: (c, r) => r.country?.name || "" },
    { dataField: "province.name", text: "Province", sort: true, formatter: (c, r) => r.province?.name || "" },
    { dataField: "city.name", text: "City", sort: true, formatter: (c, r) => r.city?.name || "" },
    { dataField: "status", text: "Status", sort: true },
    { dataField: "market", text: "Market", sort: true },
    { dataField: "active", text: "Active", sort: true, formatter: (c, r) => (r.active ? "Yes" : "No") },
  ];

  return (
    <>
      <NavigationBar />
      <div className="mainContainer">
        {pageHeader("reports_properties", "Reports — Properties")}
        <div className="contentContainer">
          <div className="contentBody">
            {isLoaded ? (
              <>
                <style>{`.pillLink { color: inherit; text-decoration: none; } .pillLink:hover { color: #93ab3c; text-decoration: none; }`}</style>
                <div style={{ marginBottom: 16, background: '#fff', padding: 16, borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #eee' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px 16px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
                      <span style={labelPillStyle}>Type</span>
                      <select value={filters.type} onChange={(e) => setF('type', e.target.value)}>
                        <option value="">All</option>
                        {typeOptions.map((o) => (<option key={o} value={o}>{o}</option>))}
                      </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={labelPillStyle}>Status</span>
                      <select value={filters.status} onChange={(e) => setF('status', e.target.value)}>
                        <option value="">All</option>
                        {statusOptions.map((o) => (<option key={o} value={o}>{o}</option>))}
                      </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={labelPillStyle}>Market</span>
                      <select value={filters.market} onChange={(e) => setF('market', e.target.value)}>
                        <option value="">All</option>
                        {marketOptions.map((o) => (<option key={o} value={o}>{o}</option>))}
                      </select>
                    </div>
                  </div>
                </div>

                <ToolkitProvider bootstrap4 keyField="property_id" data={filteredProperties} columns={columns} exportCSV={{ fileName: 'properties_report.csv' }} search condensed>
                  {(props) => (
                    <div>
                      <BootstrapTable
                        {...props.baseProps}
                        pagination={paginationFactory(paginationOptions)}
                        defaultSorted={[{ dataField: 'property_id', order: 'asc' }]}
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

export default PropertiesReport;


