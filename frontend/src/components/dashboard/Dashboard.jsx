import React, { useEffect, useState } from 'react';
import NavigationBar from '../core/navigation_bar/navigation_bar';
import Footer from '../core/footer/footer';
import { pageHeader, headers } from '../global_vars';
import axios from 'axios';
import { FaProjectDiagram, FaTasks, FaBell, FaCalendarAlt, FaHistory, FaFileAlt } from 'react-icons/fa';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [showAllActions, setShowAllActions] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get('https://ultima.icsgr.com/api/dashboard/my/', { headers: { ...headers, Authorization: 'Token ' + localStorage.getItem('userToken') } });
        setData(res?.data?.data || {});
      } catch (_e) {
        setData({});
      } finally {
        setLoaded(true);
      }
    }
    load();
  }, []);

  return (
    <>
      <NavigationBar />
      <div className="mainContainer">
        <div className="contentContainer">
          <div className="contentBody">
            {pageHeader("dashboard", "Dashboard")}
            {/* Simple first-pass layout; we will iterate on visuals */}
            {!loaded ? (
              <div>Loading...</div>
            ) : (
              <div className="container">
                <div className="row">
                  <div className="col-md-6">
                    <div className="card" style={{ marginBottom: 14 }}>
                      <div className="card-header"><FaProjectDiagram style={{ color: '#93ab3c', marginRight: 8 }} />My Projects</div>
                      <div className="card-body">
                        <ul className="mb-0" style={{ listStyleType: 'circle', marginLeft: 10 }}>
                          {(data?.projects || []).map(p => (
                            <li key={p.project_id}>
                              <a href={`/data_management/project/${p.project_id}`}>{p.title}</a>
                              {p.deadline ? (<span style={{ marginLeft: 8, color: '#888' }}>deadline: {new Date(p.deadline).toLocaleDateString()}</span>) : null}
                            </li>
                          ))}
                          {(data?.projects || []).length === 0 ? (<div>No items</div>) : null}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card" style={{ marginBottom: 14 }}>
                      <div className="card-header"><FaTasks style={{ color: '#93ab3c', marginRight: 8 }} />My Tasks </div>
                      <div className="card-body">
                        <ul className="mb-0" style={{ listStyleType: 'circle', marginLeft: 10 }}>
                          {(data?.tasks || []).map(t => (
                            <li key={t.projtask_id}>
                              <a href={`/data_management/project_task/${t.projtask_id}`}>{t.title}</a>
                              {t.deadline ? (<span style={{ marginLeft: 8, color: '#888' }}>deadline: {new Date(t.deadline).toLocaleDateString()}</span>) : null}
                            </li>
                          ))}
                          {(data?.tasks || []).length === 0 ? (<div>No items</div>) : null}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="card" style={{ marginBottom: 14 }}>
                      <div className="card-header"><FaBell style={{ color: '#93ab3c', marginRight: 8 }} />My Notifications (unread)</div>
                      <div className="card-body">
                        <ul className="mb-0" style={{ listStyleType: 'circle', marginLeft: 10 }}>
                          {(data?.notifications || []).map(n => (
                            <li key={n.id}>
                              <a href={`/notifications`}>{n.type}: {n.message}</a>
                            </li>
                          ))}
                          {(data?.notifications || []).length === 0 ? (<div>No items</div>) : null}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card" style={{ marginBottom: 14 }}>
                      <div className="card-header"><FaCalendarAlt style={{ color: '#93ab3c', marginRight: 8 }} />Deadlines (next 14 days)</div>
                      <div className="card-body">
                        {(() => {
                          const list = Array.isArray(data?.deadlines) ? data.deadlines : [];
                          const proj = list.filter(d => d.type === 'project');
                          const tasks = list.filter(d => d.type === 'task');
                          const tax = list.filter(d => d.type === 'taxation_project');
                          const Section = ({ title, items }) => (
                            items.length ? (
                              <div style={{ marginBottom: 10 }}>
                                <div style={{ fontWeight: 700, marginBottom: 6 }}>{title}: {items.length}</div>
                                <ul className="mb-0" style={{ listStyleType: 'circle', marginLeft: 10 }}>
                                  {items.map(d => (
                                    <li key={`${d.type}_${d.id}`}>
                                      {d.type === 'project' && (
                                        <a href={`/data_management/project/${d.id}`}>{d.title}</a>
                                      )}
                                      {d.type === 'task' && (
                                        <a href={`/data_management/project_task/${d.id}`}>{d.title}</a>
                                      )}
                                      {d.type === 'taxation_project' && (
                                        <a href={`/data_management/taxation_project/${d.id}`}>{d.title}</a>
                                      )}
                                      <span style={{ marginLeft: 8, color: 'red' }}>{new Date(d.deadline).toLocaleDateString()}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ) : null
                          );
                          return (
                            <>
                              <Section title="Projects" items={proj} />
                              <Section title="Project Tasks" items={tasks} />
                              <Section title="Taxation Projects" items={tax} />
                              {(!proj.length && !tasks.length && !tax.length) ? (<div>No items</div>) : null}
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="card" style={{ marginBottom: 14 }}>
                      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span><FaHistory style={{ color: '#93ab3c', marginRight: 8 }} />My latest actions</span>
                        {(data?.actions || []).length > 5 ? (
                          <button className="btn btn-sm btn-outline-secondary" onClick={() => setShowAllActions(v => !v)}>
                            {showAllActions ? 'Show less' : 'Show more'}
                          </button>
                        ) : null}
                      </div>
                      <div className="card-body">
                        <ul className="mb-0" style={{ listStyleType: 'circle', marginLeft: 10 }}>
                          {((data?.actions || []).slice(0, showAllActions ? 20 : 5)).map(a => (
                            <li key={a.id}>{a.label || a.action} — {new Date(a.occurred_at).toLocaleString()}</li>
                          ))}
                          {(data?.actions || []).length === 0 ? (<div>No items</div>) : null}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card" style={{ marginBottom: 14 }}>
                      <div className="card-header"><FaFileAlt style={{ color: '#93ab3c', marginRight: 8 }} />Expiring documents (next 30 days)</div>
                      <div className="card-body">
                        <ul className="mb-0" style={{ listStyleType: 'circle', marginLeft: 10 }}>
                          {(data?.expiring_documents || []).map(doc => (
                            <li key={doc.document_id}>
                              <a href={`/data_management/document/${doc.document_id}`}>{doc.title}</a>
                              <span style={{ marginLeft: 8, color: 'red' }}>{new Date(doc.validuntil).toLocaleDateString()}</span>
                              {doc.project__project_id ? (<a style={{ marginLeft: 8 }} href={`/data_management/project/${doc.project__project_id}`}>project {doc.project__project_id}</a>) : null}
                            </li>
                          ))}
                          {(data?.expiring_documents || []).length === 0 ? (<div>No items</div>) : null}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
