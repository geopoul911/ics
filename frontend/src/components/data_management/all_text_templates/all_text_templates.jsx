// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import AddTextTemplateModal from "../../modals/create/add_text_template_modal";

// Modules / Functions
import { Card, ListGroup } from "react-bootstrap";
import { Button, Grid, Input } from "semantic-ui-react";
import ReactPaginate from "react-paginate";
import axios from "axios";
import filterFactory, {
  textFilter,
  selectFilter,
} from "react-bootstrap-table2-filter";
import moment from "moment";
import ReactCountryFlag from "react-country-flag";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import Swal from "sweetalert2";

// CSS
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

// Icons / Images
import NoDataToShowImage from "../../../images/generic/no_results_found.png";
import { BsTable, BsTablet, BsInfoSquare } from "react-icons/bs";
// import { AiOutlineUnorderedList } from "react-icons/ai";

// Global Variables
import {
  paginationOptions,
  headers,
  loader,
  pageHeader,
  forbidden,
  restrictedUsers,
} from "../../global_vars";

// Variables
window.Swal = Swal;

// let flagStyle = { width: "2.5em", height: "2.5em" }

const GET_TEXT_TEMPLATES =
  "http://localhost:8000/api/data_management/all_text_templates/";

const typeFilterOptions = {
  Included: "Included",
  "Not Included": "Not Included",
  Notes: "Notes",
  "Entry Price": "Entry Price",
};

// const languageFilterOptions = {
//   GB: "Great Britain",
//   GR: "Greece",
// };

const columns = [
  {
    dataField: "id",
    text: "ID",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "text",
    text: "Text",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <>
        <a
          href={"/data_management/text_template/" + row.id}
          basic
          id="cell_link"
        >
          {row.text}
        </a>
      </>
    ),
  },
  {
    dataField: "type",
    text: "Type",
    sort: true,
    filter: selectFilter({
      options: typeFilterOptions,
    }),
  },
  // {
  //   dataField: "countries",
  //   text: "Countries",
  //   sort: true,
  //   filter: selectFilter({
  //     options: languageFilterOptions,
  //   }),
  //   formatter: (cell, row) => (
  //     <>
  //       {row.countries.forEach((country) => {
  //         if (country === 'GN') {
  //           return (
  //                 <AiOutlineUnorderedList style={flagStyle} />
  //           );
  //         } else {
  //           return (
  //                 <ReactCountryFlag countryCode={country.name} value={country.name} style={flagStyle} svg />
  //           );
  //         }
  //       })}
  //     </>
  //   ),
  // },
  {
    dataField: "date_created",
    text: "Date Created",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <>
        {row.date_created
          ? moment(row.date_created).format("DD-MM-YYYY HH:mm:ss")
          : "N/A"}
      </>
    ),
  },
];

const defaultSorted = [
  {
    dataField: "id",
    order: "desc",
  },
];

const NoDataToShow = () => {
  return <img src={NoDataToShowImage} alt={""} className="fill" />;
};

// url path = '/all_text_templates'
class AllTextTemplates extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      all_text_templates: [],
      is_loaded: false,
      selectedView: "table",
      selectedName: null,
      currentPage: 1,
      text_templatesPerPage: 10,
      searchValue: "",
      totalFilteredTextTemplates: 0,
      lastClickTime: 0,
      forbidden: false,
    };
    this.remount = this.remount.bind(this);
  }

  remount() {
    axios
      .get(GET_TEXT_TEMPLATES, {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          all_text_templates: res.data.all_text_templates,
          is_loaded: true,
        });
      })
      .catch((e) => {
        Swal.fire({
          icon: "error",
          title: "Error status 401",
          text: e.response.data.errormsg,
        });
      });
  }

  fetchTextTemplates() {
    if (restrictedUsers().includes(localStorage.getItem("user"))) {
      this.setState({
        forbidden: true,
      });
    }
    axios
      .get(GET_TEXT_TEMPLATES, {
        headers: headers,
      })
      .then((res) => {
        const allTextTemplates = res.data.all_text_templates;
        const filteredTextTemplates = allTextTemplates.filter((text_template) =>
          text_template.text
            .toLowerCase()
            .includes(this.state.searchValue.toLowerCase())
        );
        this.setState({
          all_text_templates: allTextTemplates,
          totalFilteredTextTemplates: filteredTextTemplates.length,
          is_loaded: true,
        });
      })
      .catch((e) => {
        if (e.response.status === 401) {
          this.setState({
            forbidden: true,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "An unknown error has occured.",
          });
        }
      });
  }

  componentDidMount() {
    this.fetchTextTemplates();
    if (window.innerWidth < 992) {
      this.setState({
        selectedView: "tablet",
      });
    } else {
      this.setState({
        selectedView: "table",
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.searchValue !== this.state.searchValue) {
      this.fetchTextTemplates();
    }
  }

  setView = (view) => {
    this.setState({
      selectedView: view,
    });
  };

  handlePageChange = (selectedPage) => {
    this.setState({
      currentPage: selectedPage.selected + 1,
    });
  };

  setSelectedName = (name) => {
    this.setState({
      selectedName: name,
    });
  };

  handleDoubleTap = (text_template_id) => {
    const { lastClickTime } = this.state;
    const currentTime = new Date().getTime();
    const tapTimeDifference = currentTime - lastClickTime;

    if (tapTimeDifference < 300) {
      window.location.href =
        "/data_management/text_template/" + text_template_id;
    }

    this.setState({ lastClickTime: currentTime });
  };

  render() {
    const {
      all_text_templates,
      currentPage,
      searchValue,
      totalFilteredTextTemplates,
    } = this.state;

    // Filter the all_text_templates array based on the search term
    const filteredTextTemplates = all_text_templates.filter((text_template) =>
      text_template.text.toLowerCase().includes(searchValue.toLowerCase())
    );

    // Calculate the index range of text_templates for the current page from the filtered array
    const indexOfLastTextTemplate =
      currentPage * this.state.text_templatesPerPage;
    const indexOfFirstTextTemplate =
      indexOfLastTextTemplate - this.state.text_templatesPerPage;
    const currentTextTemplates = filteredTextTemplates.slice(
      indexOfFirstTextTemplate,
      indexOfLastTextTemplate
    );

    return (
      <>
        <NavigationBar />
        <div className="rootContainer">
          {pageHeader("all_text_templates")}
          <div style={{ marginLeft: 20, width: 80, borderRadius: 10 }}>
            <Button
              id="table_icon"
              style={{
                padding: 6,
                margin: 2,
                backgroundColor:
                  this.state.selectedView === "table" ? "#e3e3e3" : "",
              }}
              onClick={() => this.setView("table")}
            >
              <BsTable
                style={{
                  color: "#F3702D",
                  fontSize: "1.5em",
                }}
              />
            </Button>
            <Button
              id="tablet_icon"
              style={{
                padding: 6,
                margin: 2,
                backgroundColor:
                  this.state.selectedView === "tablet" ? "#e3e3e3" : "",
              }}
              onClick={() => this.setView("tablet")}
            >
              <BsTablet
                style={{
                  color: "#F3702D",
                  fontSize: "1.5em",
                }}
              />
            </Button>
          </div>
          {this.state.forbidden ? (
            <>{forbidden("All Text Templates")}</>
          ) : this.state.is_loaded ? (
            this.state.selectedView === "table" ? (
              <>
                <ToolkitProvider
                  keyField="id"
                  data={this.state.all_text_templates}
                  columns={columns}
                  search
                  noDataIndication={<NoDataToShow />}
                  bootstrap4
                  condensed
                  defaultSorted={defaultSorted}
                  exportCSV
                >
                  {(props) => (
                    <div>
                      <BootstrapTable
                        {...props.baseProps}
                        pagination={paginationFactory(paginationOptions)}
                        hover
                        bordered={false}
                        striped
                        filter={filterFactory()}
                      />
                    </div>
                  )}
                </ToolkitProvider>
                <AddTextTemplateModal redir={true} remount={this.remount} />
              </>
            ) : (
              <>
                <div style={{ marginLeft: 20 }}>
                  <Input
                    icon="search"
                    placeholder="Search Name..."
                    style={{ margin: 0 }}
                    onChange={(e) =>
                      this.setState({ searchValue: e.target.value })
                    }
                    value={this.state.searchValue}
                  />
                </div>
                <Grid columns={2} stackable style={{ marginLeft: 20 }}>
                  <Grid.Row>
                    <Grid.Column width={6}>
                      {currentTextTemplates.map((text_template) => (
                        <>
                          <Button
                            color={
                              this.state.selectedName === text_template.text
                                ? "blue"
                                : "vk"
                            }
                            onClick={(e) => {
                              this.setSelectedName(e.target.innerText);
                              this.handleDoubleTap(text_template.id);
                            }}
                            style={{ width: 300, margin: 10 }}
                          >
                            {text_template.text}
                          </Button>
                          <br />
                        </>
                      ))}
                    </Grid.Column>
                    <Grid.Column width={6}>
                      {this.state.all_text_templates
                        .filter(
                          (text_template) =>
                            text_template.text === this.state.selectedName
                        )
                        .map((text_template) => (
                          <>
                            <Card width={4}>
                              <Card.Header>
                                <BsInfoSquare
                                  style={{
                                    color: "#F3702D",
                                    fontSize: "1.5em",
                                    marginRight: "0.5em",
                                  }}
                                />
                                Text Template Information
                              </Card.Header>
                              <Card.Body>
                                <ListGroup>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>ID</div>
                                    <div className={"info_span"}>
                                      {text_template.id}
                                    </div>
                                  </ListGroup.Item>

                                  <ListGroup.Item>
                                    <div className={"info_descr"}>Text</div>
                                    <div className={"info_span"}>
                                      {text_template.text}
                                    </div>
                                  </ListGroup.Item>

                                  <ListGroup.Item>
                                    <div className={"info_descr"}>Type</div>
                                    <div className={"info_span"}>
                                      {text_template.type}
                                    </div>
                                  </ListGroup.Item>

                                  <ListGroup.Item>
                                    <div className={"info_descr"}>Language</div>
                                    <div className={"info_span"}>
                                      <ReactCountryFlag
                                        countryCode={text_template.language}
                                        svg
                                        style={{
                                          width: "2em",
                                          height: "2em",
                                          marginRight: 10,
                                        }}
                                        title={text_template.language}
                                      />
                                    </div>
                                  </ListGroup.Item>
                                </ListGroup>
                              </Card.Body>
                              <Card.Footer></Card.Footer>
                            </Card>
                          </>
                        ))}
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
                <ReactPaginate
                  previousLabel={"<-"}
                  className="react-pagination"
                  nextLabel={"->"}
                  breakLabel={"..."}
                  breakClassName={"break-me"}
                  pageCount={Math.ceil(
                    totalFilteredTextTemplates /
                      this.state.text_templatesPerPage
                  )}
                  marginPagesDisplayed={0}
                  pageRangeDisplayed={5}
                  onPageChange={this.handlePageChange}
                  containerClassName={"pagination"}
                  subContainerClassName={"pages react-pagination"}
                  activeClassName={"active"}
                />
                <AddTextTemplateModal redir={true} />
              </>
            )
          ) : (
            loader()
          )}
        </div>
        <Footer />
      </>
    );
  }
}

export default AllTextTemplates;
