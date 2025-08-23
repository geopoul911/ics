import React, { Component } from "react";
import { Table, Button, Spinner } from "react-bootstrap";
import { FaFolder, FaFile, FaArrowUp, FaDownload, FaSync } from "react-icons/fa";
import { formatFileSize } from "../../../utils/format";
import axios from "axios";
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import { pageHeader } from "../../global_vars";

const BACKEND_URL = "http://localhost:8000";
const REFRESH_INTERVAL = 5000; // Refresh every 5 seconds

class NasFolders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      error: null,
      currentPath: "",
      items: [],
      syncing: false
    };
  }

  componentDidMount() {
    this.loadFolderContents();
    // Start periodic refresh
    this.refreshInterval = setInterval(this.loadFolderContents, REFRESH_INTERVAL);
  }

  componentWillUnmount() {
    // Clean up interval when component unmounts
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  loadFolderContents = async (path = this.state.currentPath) => {
    try {
      const headers = {
        'User-Token': localStorage.getItem('userToken')
      };
      const response = await axios.get(`${BACKEND_URL}/api/site_admin/nas_folders/?path=${path}`, { headers });
      this.setState({
        items: response.data.items || [],
        currentPath: path,
        loading: false,
      });
    } catch (error) {
      this.setState({
        error: error.response?.data?.errormsg || "Failed to load folder contents",
        loading: false,
        items: []
      });
    }
  };

  navigateToFolder = (path) => {
    this.loadFolderContents(path);
  };

  navigateUp = () => {
    const pathParts = this.state.currentPath.split("/").filter(Boolean);
    pathParts.pop();
    const newPath = pathParts.join("/");
    this.loadFolderContents(newPath);
  };

  handleDownload = (path) => {
    const token = localStorage.getItem('userToken');
    window.location.href = `${BACKEND_URL}/api/site_admin/nas_folders/download/?path=${path}&token=${token}`;
  };

  handleSync = async () => {
    this.setState({ syncing: true });
    await this.loadFolderContents();
    this.setState({ syncing: false });
  };

  render() {
    const { loading, items, currentPath, syncing } = this.state;

    if (loading) {
      return (
        <div>
          <NavigationBar />
          <div className="rootContainer">
            {pageHeader("nas_folders")}
            <div className="text-center p-5">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          </div>
          <Footer />
        </div>
      );
    }

    // Sort items: folders first, then files, both alphabetically
    const sortedItems = [...items].sort((a, b) => {
      // First sort by type (folders first)
      if (a.is_directory !== b.is_directory) {
        return b.is_directory ? 1 : -1;
      }
      // Then sort alphabetically
      return a.name.localeCompare(b.name);
    });

    return (
      <div>
        <NavigationBar />
        <div className="rootContainer">
          {pageHeader("nas_folders")}
          <div className="p-3" style={{ fontSize: '1.1rem' }}>
            <div className="d-flex align-items-center mb-3" style={{margin: 20}}>
              {currentPath && (
                <Button
                  variant="outline-secondary"
                  className="me-2"
                  style={{margin: 20, fontSize: '1.1rem'}}
                  onClick={this.navigateUp}
                >
                  <FaArrowUp className="me-1" />
                  Up
                </Button>
              )}
              <div className="text-muted" style={{ fontSize: '1.1rem' }}>
                COSMOPLAN EKDROMES {currentPath ? `/${currentPath}` : ''}
              </div>
            </div>

            <Table hover responsive style={{ fontSize: '1.4rem' }} id="nas_folders_table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Size</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedItems.map((item) => (
                  <tr key={item.path}>
                    <td>
                      <div 
                        className="d-flex align-items-center"
                        style={{ cursor: item.is_directory ? 'pointer' : 'default' }}
                        onClick={() => item.is_directory && this.navigateToFolder(item.path)}
                      >
                        {item.is_directory ? (
                          <FaFolder className="text-warning me-2" style={{ fontSize: '1.4rem', marginRight: 10 }} />
                        ) : (
                          <FaFile className="text-primary me-2" style={{ fontSize: '1.4rem', marginRight: 10 }} />
                        )}
                        <span style={{ fontSize: '1.4rem'}}>{item.name}</span>
                      </div>
                    </td>
                    <td>{item.is_directory ? "-" : formatFileSize(item.size)}</td>
                    <td>
                      {!item.is_directory && (
                        <Button
                          variant="outline-primary"
                          size="sm"
                          style={{ fontSize: '1rem' }}
                          onClick={() => this.handleDownload(item.path)}
                        >
                          <FaDownload className="me-1" />
                          Download
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <div className="d-flex justify-content-center mt-4 mb-4">
              <Button
                variant="primary"
                size="lg"
                onClick={this.handleSync}
                disabled={syncing}
                style={{
                  fontSize: '1.2rem',
                  padding: '10px 30px',
                  borderRadius: '10px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease'
                }}
              >
                <FaSync 
                  className={`me-2 ${syncing ? 'fa-spin' : ''}`} 
                  style={{ fontSize: '1.2rem', marginRight: 10 }}
                />
                {syncing ? 'Syncing...' : 'Sync Now'}
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default NasFolders; 