// Built-ins
import React, { useEffect, useState } from "react";
import axios from "axios";

// Custom
import NavigationBar from "../navigation_bar/navigation_bar";
import Footer from "../footer/footer";
import { pageHeader, headers, loader } from "../../global_vars";

const API_BASE = (typeof window !== 'undefined' && window.location && window.location.port === '3000')
  ? 'https://ultima.icsgr.com'
  : '';

const LIST_URL = API_BASE + "/api/view/notifications/?all=1";
const MARK_READ_URL = API_BASE + "/api/view/notifications/mark_read/";
const MARK_ALL_URL = API_BASE + "/api/view/notifications/mark_all_read/";
const UNBLOCK_URL = API_BASE + "/api/view/notifications/unblock_user/";
const DELETE_URL = API_BASE + "/api/view/notifications/delete/";

function NotificationsPage() {
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  function formatType(t) {
    return String(t || '')
      .split('_')
      .map(s => s.charAt(0).toUpperCase() + s.slice(1))
      .join(' ');
  }

  function groupByType(list) {
    const groups = {};
    (list || []).forEach(n => {
      const key = n.type || 'other';
      if (!groups[key]) groups[key] = [];
      groups[key].push(n);
    });
    return groups;
  }

  async function load() {
    try {
      const currentHeaders = { ...headers, Authorization: "Token " + localStorage.getItem("userToken") };
      const res = await axios.get(LIST_URL, { headers: currentHeaders });
      setItems(res?.data?.notifications || []);
    } finally {
      setLoaded(true);
    }
  }

  useEffect(() => { load(); }, []);

  async function markRead(id) {
    const currentHeaders = { ...headers, Authorization: "Token " + localStorage.getItem("userToken") };
    await axios.post(MARK_READ_URL + `?id=${id}`, null, { headers: currentHeaders });
    load();
  }

  async function markAll() {
    const currentHeaders = { ...headers, Authorization: "Token " + localStorage.getItem("userToken") };
    await axios.post(MARK_ALL_URL, null, { headers: currentHeaders });
    load();
  }

  function canDelete() {
    const role = localStorage.getItem('role');
    // Allow Admin and Supervisor to delete
    return role === 'A' || role === 'S';
  }

  async function remove(id) {
    const currentHeaders = { ...headers, Authorization: "Token " + localStorage.getItem("userToken") };
    await axios.post(DELETE_URL + `?id=${id}`, null, { headers: currentHeaders });
    load();
  }

  return (
    <>
      <NavigationBar />
      <div className="mainContainer">
        {pageHeader("notifications", "Notifications")}
        <div className="contentContainer">
          <div className="contentBody">
            {!loaded ? loader() : (
              <>
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <button onClick={markAll} className="btn btn-sm btn-outline-secondary" style={{ marginLeft: 20 }}>Mark all as read</button>
                </div>
                <div className="container" style={{ marginTop: 12 }}>
                  {(() => {
                    const order = [
                      'task_assigned',
                      'task_updated',
                      'task_completed',
                      'task_deleted',
                      'deadline_approaching',
                      'security_lockout',
                      'other'
                    ];
                    const groups = groupByType(items);
                    const sections = order.filter(k => Array.isArray(groups[k]) && groups[k].length);
                    if (sections.length === 0) return (<div>No notifications</div>);
                    return sections.map(key => (
                      <div key={key} style={{ marginBottom: 18 }}>
                        <div style={{ fontWeight: 800, fontSize: 16, margin: '6px 0 10px 0' }}>{formatType(key)}</div>
                        <ul className="list-unstyled" style={{ marginBottom: 0 }}>
                          {groups[key].map((n) => (
                            <li key={n.id}>
                              <div className="card" style={{ marginBottom: 12, borderColor: '#eee', background: n.read ? '#fff' : '#f7fbff' }}>
                                <div className="card-header" style={{ fontWeight: 700, fontSize: 15 }}>
                                  {formatType(n.type)}
                                </div>
                                <div className="card-body" style={{ padding: '12px 14px' }}>
                                  <div>{n.message}</div>
                                  <div style={{ textAlign: 'right', marginTop: 8, fontSize: 12, color: '#666' }}>
                                    {new Date(n.created_at).toLocaleString()}
                                  </div>
                                </div>
                                <div className="card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 14px' }}>
                                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                                    {n.related_project ? (<a href={`/data_management/project/${n.related_project}`}>Go to project</a>) : null}
                                    {n.related_task ? (<a href={`/data_management/project_task/${n.related_task}`}>Go to task</a>) : null}
                                    {!n.read ? (<button onClick={() => markRead(n.id)} className="btn btn-sm btn-outline-primary">Mark as read</button>) : null}
                                    {n.type === 'security_lockout' ? (
                                      <button onClick={async () => {
                                        const username = (n.message.match(/User\s([^\s]+)\s/) || [])[1];
                                        if (!username) return;
                                        const currentHeaders = { ...headers, Authorization: "Token " + localStorage.getItem("userToken") };
                                        await axios.post(UNBLOCK_URL + `?username=${encodeURIComponent(username)}`, null, { headers: currentHeaders });
                                        load();
                                      }} className="btn btn-sm btn-outline-danger">Unblock user</button>
                                    ) : null}
                                  </div>
                                  <div>
                                    {canDelete() ? (<button onClick={() => remove(n.id)} className="btn btn-sm btn-outline-secondary">Delete</button>) : null}
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ));
                  })()}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default NotificationsPage;


