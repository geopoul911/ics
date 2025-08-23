// Built-ins
import React from "react";

// Icons-images
import { BsInfoSquare } from "react-icons/bs";
import { AiFillStar } from "react-icons/ai";
import { BsStarHalf } from "react-icons/bs";
import { AiOutlineStar } from "react-icons/ai";

// Functions / modules
import { Card, ListGroup } from "react-bootstrap";
import ReactCountryFlag from "react-country-flag";

// Variables
let starStyle = {
  color: "orange",
  fontSize: "1.5em",
  display: "inline-block",
};

const calculateHotelStars = (rating) => {
  if (rating !== "" && rating !== null) {
    let results = [];
    let string_rating = rating.toString();
    let fullStars = string_rating[0];
    let halfStars = string_rating[1];
    let emptyStars = 5 - parseInt(rating / 10);
    // full stars loop
    for (var i = 0; i < Number(fullStars); i++) {
      results.push(<AiFillStar style={starStyle} />);
    }
    // half star
    if (halfStars !== "0") {
      results.push(
        <BsStarHalf
          style={{
            color: "orange",
            fontSize: "1.3em",
            display: "inline-block",
          }}
        />
      );
    }
    // empty star
    for (var l = 0; l < Number(emptyStars); l++) {
      if (fullStars === "4" && halfStars !== "0") {
      } else {
        results.push(<AiOutlineStar style={starStyle} />);
      }
    }
    return results;
  }
};

class RelatedModel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      service: {},
      is_loaded: false,
    };
  }

  render() {
    if (
      this.props.service.service_type === "AC" ||
      this.props.service.service_type === "DA" ||
      this.props.service.service_type === "TLA"
    ) {
      return (
        <>
          <Card>
            <Card.Header>
              <BsInfoSquare
                style={{
                  color: "#F3702D",
                  fontSize: "1.5em",
                  marginRight: "0.5em",
                }}
              />
              Related Information
            </Card.Header>
            <Card.Body>
              <ListGroup>
                <ListGroup.Item>
                  <div className={"info_descr"}> Hotel </div>
                  <div className={"info_span"}>
                    {this.props.service.hotel
                      ? this.props.service.hotel.name
                      : "N/A"}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className={"info_descr"}> Hotel Address </div>
                  <div className={"info_span"}>
                    {this.props.service.hotel
                      ? this.props.service.hotel.contact.address
                      : "N/A"}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className={"info_descr"}> Rating </div>
                  <div className={"info_span"}>
                    {this.props.service.hotel
                      ? calculateHotelStars(this.props.service.hotel.rating)
                      : "N/A"}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className={"info_descr"}> Tel</div>
                  <div
                    className={
                      this.props.service.hotel.contact.tel
                        ? "info_span"
                        : "red_info_span"
                    }
                  >
                    {this.props.service.hotel.contact.tel
                      ? this.props.service.hotel.contact.tel
                      : "N/A"}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className={"info_descr"}> Tel. 2</div>
                  <div
                    className={
                      this.props.service.hotel.contact.tel2
                        ? "info_span"
                        : "red_info_span"
                    }
                  >
                    {this.props.service.hotel.contact.tel2
                      ? this.props.service.hotel.contact.tel2
                      : "N/A"}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className={"info_descr"}> Tel. 3</div>
                  <div
                    className={
                      this.props.service.hotel.contact.tel3
                        ? "info_span"
                        : "red_info_span"
                    }
                  >
                    {this.props.service.hotel.contact.tel3
                      ? this.props.service.hotel.contact.tel3
                      : "N/A"}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className={"info_descr"}> Meal Desc </div>
                  <div className={"info_span"}>
                    {this.props.service.meal_desc
                      ? this.props.service.meal_desc
                      : "N/A"}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div style={{ width: 100, display: "block", float: "left" }}>
                    Room Details
                  </div>
                  <div className={"tel_panel"}>
                    <div className={"tel_span"}>
                      SGL :
                      <p style={{ display: "inline", marginLeft: 10 }}>
                        {this.props.service.sgl}
                      </p>
                    </div>
                    <div className={"tel_span"}>
                      DBL :
                      <p style={{ display: "inline", marginLeft: 10 }}>
                        {this.props.service.dbl}
                      </p>
                    </div>
                    <div className={"tel_span"}>
                      TWIN :
                      <p style={{ display: "inline", marginLeft: 10 }}>
                        {this.props.service.twin}
                      </p>
                    </div>
                    <div className={"tel_span"}>
                      TRPL :
                      <p style={{ display: "inline", marginLeft: 10 }}>
                        {this.props.service.trpl}
                      </p>
                    </div>
                    <div className={"tel_span"}>
                      QUAD :
                      <p style={{ display: "inline", marginLeft: 10 }}>
                        {this.props.service.quad}
                      </p>
                    </div>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
            <Card.Footer>
              <small className="mr-auto">
                <BsInfoSquare
                  style={{
                    color: "#F3702D",
                    fontSize: "1.5em",
                    marginRight: "0.5em",
                  }}
                />
                To Change Hotel's data, navigate to
                <a href="/data_management/all_hotels" target="_blank">
                  Data Management / Hotels
                </a>
              </small>
            </Card.Footer>
          </Card>
        </>
      );
    } else if (
      this.props.service.service_type === "AT" ||
      this.props.service.service_type === "TLAT"
    ) {
      return (
        <>
          <Card>
            <Card.Header>
              <BsInfoSquare
                style={{
                  color: "#F3702D",
                  fontSize: "1.5em",
                  marginRight: "0.5em",
                }}
              />
              Related Information
            </Card.Header>
            <Card.Body>
              <ListGroup>
                <ListGroup.Item>
                  <div className={"info_descr"}> Airline </div>
                  <div className={"info_span"}>
                    {this.props.service.airline
                      ? this.props.service.airline.name
                      : "N/A"}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className={"info_descr"}> Abbreviation </div>
                  <div className={"info_span"}>
                    {this.props.service.airline
                      ? this.props.service.airline.abbreviation
                      : "N/A"}
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
            <Card.Footer>
              <small className="mr-auto">
                <BsInfoSquare
                  style={{
                    color: "#F3702D",
                    fontSize: "1.5em",
                    marginRight: "0.5em",
                  }}
                />
                To Change Airline's data, navigate to
                <a href="/data_management/all_airlines" target="_blank">
                  Data Management / Airline
                </a>
              </small>
            </Card.Footer>
          </Card>
        </>
      );
    } else if (this.props.service.service_type === "AP") {
      return (
        <>
          <Card>
            <Card.Header>
              <BsInfoSquare
                style={{
                  color: "#F3702D",
                  fontSize: "1.5em",
                  marginRight: "0.5em",
                }}
              />
              Related Information
            </Card.Header>
            <Card.Body>
              <ListGroup>
                <ListGroup.Item>
                  <div className={"info_descr"}> DMC </div>
                  <div className={"info_span"}>
                    {this.props.service.dmc
                      ? this.state.service.dmc.name
                      : "N/A"}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className={"info_descr"}>
                    Destination Management C. Address
                  </div>
                  <div className={"info_span"}>
                    {this.props.service.dmc
                      ? this.state.service.dmc.contact.address
                      : "N/A"}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className={"info_descr"}> Tel</div>
                  <div
                    className={
                      this.props.service.dmc.contact.tel
                        ? "info_span"
                        : "red_info_span"
                    }
                  >
                    {this.props.service.dmc.contact.tel
                      ? this.props.service.dmc.contact.tel
                      : "N/A"}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className={"info_descr"}> Tel. 2</div>
                  <div
                    className={
                      this.props.service.dmc.contact.tel2
                        ? "info_span"
                        : "red_info_span"
                    }
                  >
                    {this.props.service.dmc.contact.tel2
                      ? this.props.service.dmc.contact.tel2
                      : "N/A"}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className={"info_descr"}> Tel. 3</div>
                  <div
                    className={
                      this.props.service.dmc.contact.tel3
                        ? "info_span"
                        : "red_info_span"
                    }
                  >
                    {this.props.service.dmc.contact.tel3
                      ? this.props.service.dmc.contact.tel3
                      : "N/A"}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className={"info_descr"}>
                    Destination Management C. Email
                  </div>
                  <div className={"info_span"}>
                    {this.props.service.dmc
                      ? this.state.service.dmc.contact.email
                      : "N/A"}
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
            <Card.Footer>
              <small className="mr-auto">
                <BsInfoSquare
                  style={{
                    color: "#F3702D",
                    fontSize: "1.5em",
                    marginRight: "0.5em",
                  }}
                />
                To Change DMC's data, navigate to
                <a href="/data_management/all_dmcs" target="_blank">
                  Data Management / DMCs
                </a>
              </small>
            </Card.Footer>
          </Card>
        </>
      );
    } else if (
      this.props.service.service_type === "CFT" ||
      this.props.service.service_type === "FT"
    ) {
      return (
        <>
          <Card>
            <Card.Header>
              <BsInfoSquare
                style={{
                  color: "#F3702D",
                  fontSize: "1.5em",
                  marginRight: "0.5em",
                }}
              />
              Related Information
            </Card.Header>
            <Card.Body>
              <ListGroup>
                <ListGroup.Item>
                  <div className={"info_descr"}> Ferry Ticket Agency </div>
                  <div className={"info_span"}>
                    {this.props.service.ferry_ticket_agency
                      ? this.props.service.ferry_ticket_agency.name
                      : "N/A"}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className={"info_descr"}>
                    Ferry Ticket Agency Address
                  </div>
                  <div className={"info_span"}>
                    {this.props.service.ferry_ticket_agency
                      ? this.props.service.ferry_ticket_agency.contact.address
                      : "N/A"}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className={"info_descr"}> Tel</div>
                  <div
                    className={
                      this.props.service.ferry_ticket_agency.contact.tel
                        ? "info_span"
                        : "red_info_span"
                    }
                  >
                    {this.props.service.ferry_ticket_agency.contact.tel
                      ? this.props.service.ferry_ticket_agency.contact.tel
                      : "N/A"}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className={"info_descr"}> Tel. 2</div>
                  <div
                    className={
                      this.props.service.ferry_ticket_agency.contact.tel2
                        ? "info_span"
                        : "red_info_span"
                    }
                  >
                    {this.props.service.ferry_ticket_agency.contact.tel2
                      ? this.props.service.ferry_ticket_agency.contact.tel2
                      : "N/A"}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className={"info_descr"}> Tel. 3</div>
                  <div
                    className={
                      this.props.service.ferry_ticket_agency.contact.tel3
                        ? "info_span"
                        : "red_info_span"
                    }
                  >
                    {this.props.service.ferry_ticket_agency.contact.tel3
                      ? this.props.service.ferry_ticket_agency.contact.tel3
                      : "N/A"}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className={"info_descr"}>Ferry Ticket Agency Email</div>
                  <div className={"info_span"}>
                    {this.props.service.ferry_ticket_agency
                      ? this.props.service.ferry_ticket_agency.contact.email
                      : "N/A"}
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
            <Card.Footer>
              <small className="mr-auto">
                <BsInfoSquare
                  style={{
                    color: "#F3702D",
                    fontSize: "1.5em",
                    marginRight: "0.5em",
                  }}
                />
                To Change Ferry Ticket Agency's data, navigate to
                <a
                  href="/data_management/all_ferry_ticket_agencies"
                  target="_blank"
                >
                  Data Management / Ferry Ticket Agencies
                </a>
              </small>
            </Card.Footer>
          </Card>
        </>
      );
    } else if (this.props.service.service_type === "CR") {
      return (
        <>
          <Card>
            <Card.Header>
              <BsInfoSquare
                style={{
                  color: "#F3702D",
                  fontSize: "1.5em",
                  marginRight: "0.5em",
                }}
              />
              Related Information
            </Card.Header>
            <Card.Body>
              <ListGroup>
                <ListGroup.Item>
                  <div className={"info_descr"}> Cruising Company </div>
                  <div className={"info_span"}>
                    {this.props.service.cruising_company.name}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className={"info_descr"}> Cruising Company Address </div>
                  <div className={"info_span"}>
                    {this.props.service.cruising_company
                      ? this.props.service.cruising_company.contact.address
                      : "N/A"}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className={"info_descr"}> Tel</div>
                  <div
                    className={
                      this.props.service.cruising_company.contact.tel
                        ? "info_span"
                        : "red_info_span"
                    }
                  >
                    {this.props.service.cruising_company.contact.tel
                      ? this.props.service.cruising_company.contact.tel
                      : "N/A"}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className={"info_descr"}> Tel. 2</div>
                  <div
                    className={
                      this.props.service.cruising_company.contact.tel2
                        ? "info_span"
                        : "red_info_span"
                    }
                  >
                    {this.props.service.cruising_company.contact.tel2
                      ? this.props.service.cruising_company.contact.tel2
                      : "N/A"}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className={"info_descr"}> Tel. 3</div>
                  <div
                    className={
                      this.props.service.cruising_company.contact.tel3
                        ? "info_span"
                        : "red_info_span"
                    }
                  >
                    {this.props.service.cruising_company.contact.tel3
                      ? this.props.service.cruising_company.contact.tel3
                      : "N/A"}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className={"info_descr"}> Cruising Company Email </div>
                  <div className={"info_span"}>
                    {this.props.service.cruising_company
                      ? this.props.service.cruising_company.contact.email
                      : "N/A"}
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
            <Card.Footer>
              <small className="mr-auto">
                <BsInfoSquare
                  style={{
                    color: "#F3702D",
                    fontSize: "1.5em",
                    marginRight: "0.5em",
                  }}
                />
                To Change Cruising Company's data, navigate to
                <a
                  href="/data_management/all_cruising_companies"
                  target="_blank"
                >
                  Data Management / Cruising Companies
                </a>
              </small>
            </Card.Footer>
          </Card>
        </>
      );
    } else if (this.props.service.service_type === "HP") {
      return (
        <>
          <Card>
            <Card.Header>
              <BsInfoSquare
                style={{
                  color: "#F3702D",
                  fontSize: "1.5em",
                  marginRight: "0.5em",
                }}
              />
              Related Information
            </Card.Header>
            <Card.Body>
              <ListGroup>
                <ListGroup.Item>
                  <div className={"info_descr"}> Hotel </div>
                  <div className={"info_span"}>
                    {this.props.service.hotel
                      ? this.props.service.hotel.name
                      : "N/A"}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className={"info_descr"}> Hotel Address </div>
                  <div className={"info_span"}>
                    {this.props.service.hotel
                      ? this.props.service.hotel.address
                      : "N/A"}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className={"info_descr"}> Rating </div>
                  <div className={"info_span"}>
                    {this.props.service.hotel
                      ? calculateHotelStars(this.props.service.hotel.rating)
                      : "N/A"}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className={"info_descr"}> Tel</div>
                  <div
                    className={
                      this.props.service.hotel.contact.tel
                        ? "info_span"
                        : "red_info_span"
                    }
                  >
                    {this.props.service.hotel.contact.tel
                      ? this.props.service.hotel.contact.tel
                      : "N/A"}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className={"info_descr"}> Tel. 2</div>
                  <div
                    className={
                      this.props.service.hotel.contact.tel2
                        ? "info_span"
                        : "red_info_span"
                    }
                  >
                    {this.props.service.hotel.contact.tel2
                      ? this.props.service.hotel.contact.tel2
                      : "N/A"}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className={"info_descr"}> Tel. 3</div>
                  <div
                    className={
                      this.props.service.cruising_company.contact.tel3
                        ? "info_span"
                        : "red_info_span"
                    }
                  >
                    {this.props.service.cruising_company.contact.tel3
                      ? this.props.service.cruising_company.contact.tel3
                      : "N/A"}
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
            <Card.Footer>
              <small className="mr-auto">
                <BsInfoSquare
                  style={{
                    color: "#F3702D",
                    fontSize: "1.5em",
                    marginRight: "0.5em",
                  }}
                />
                To Change Hotel's data, navigate to
                <a href="/data_management/all_hotels" target="_blank">
                  Data Management / Hotels
                </a>
              </small>
            </Card.Footer>
          </Card>
        </>
      );
    } else if (this.props.service.service_type === "LG") {
      return (
        <>
          <Card>
            <Card.Header>
              <BsInfoSquare
                style={{
                  color: "#F3702D",
                  fontSize: "1.5em",
                  marginRight: "0.5em",
                }}
              />
              Related Information
            </Card.Header>
            <Card.Body>
              <ListGroup>
                <ListGroup.Item>
                  <div className={"info_descr"}> Guide </div>
                  <div className={"info_span"}>
                    {this.props.service.guide
                      ? this.props.service.guide.name
                      : "N/A"}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className={"info_descr"}> Guide Address </div>
                  <div className={"info_span"}>
                    {this.props.service.guide
                      ? this.props.service.guide.contact.address
                      : "N/A"}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className={"info_descr"}> Guide Email </div>
                  <div className={"info_span"}>
                    {this.props.service.guide
                      ? this.props.service.guide.contact.email
                      : "N/A"}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className={"info_descr"}> Tel</div>
                  <div
                    className={
                      this.props.service.guide.contact.tel
                        ? "info_span"
                        : "red_info_span"
                    }
                  >
                    {this.props.service.guide.contact.tel
                      ? this.props.service.guide.contact.tel
                      : "N/A"}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className={"info_descr"}> Tel. 2</div>
                  <div
                    className={
                      this.props.service.guide.contact.tel2
                        ? "info_span"
                        : "red_info_span"
                    }
                  >
                    {this.props.service.guide.contact.tel2
                      ? this.props.service.guide.contact.tel2
                      : "N/A"}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className={"info_descr"}> Tel. 3</div>
                  <div
                    className={
                      this.props.service.guide.contact.tel3
                        ? "info_span"
                        : "red_info_span"
                    }
                  >
                    {this.props.service.guide.contact.tel3
                      ? this.props.service.guide.contact.tel3
                      : "N/A"}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className={"info_descr"}> Languages </div>
                  <div className={"info_span"}>
                    {this.props.service.guide
                      ? this.props.service.guide.flags.length > 0
                        ? this.props.service.guide.flags.map((e) => (
                            <>
                              <ReactCountryFlag
                                countryCode={e.code}
                                svg
                                style={{
                                  width: "1.5em",
                                  height: "1.5em",
                                  marginRight: 10,
                                }}
                                title={e.name}
                              />
                            </>
                          ))
                        : "N/A"
                      : "N/A"}
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
            <Card.Footer>
              <small className="mr-auto">
                <BsInfoSquare
                  style={{
                    color: "#F3702D",
                    fontSize: "1.5em",
                    marginRight: "0.5em",
                  }}
                />
                To Change Guide's data, navigate to
                <a href="/data_management/all_guides" target="_blank">
                  Data Management / Guides
                </a>
              </small>
            </Card.Footer>
          </Card>
        </>
      );
    } else if (this.props.service.service_type === "RST") {
      return (
        <>
          <Card>
            <Card.Header>
              <BsInfoSquare
                style={{
                  color: "#F3702D",
                  fontSize: "1.5em",
                  marginRight: "0.5em",
                }}
              />
              Related Information
            </Card.Header>
            <Card.Body>
              <ListGroup>
                <ListGroup.Item>
                  <div className={"info_descr"}> Restaurant </div>
                  <div className={"info_span"}>
                    {this.props.service.restaurant
                      ? this.props.service.restaurant.name
                      : "N/A"}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className={"info_descr"}> Restaurant Address </div>
                  <div className={"info_span"}>
                    {this.props.service.restaurant
                      ? this.props.service.restaurant.contact.address
                      : "N/A"}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className={"info_descr"}> Rating </div>
                  <div className={"info_span"}>
                    {this.props.service.restaurant
                      ? calculateHotelStars(
                          this.props.service.restaurant.rating
                        )
                      : "N/A"}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className={"info_descr"}> Tel</div>
                  <div
                    className={
                      this.props.service.restaurant.contact.tel
                        ? "info_span"
                        : "red_info_span"
                    }
                  >
                    {this.props.service.restaurant.contact.tel
                      ? this.props.service.restaurant.contact.tel
                      : "N/A"}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className={"info_descr"}> Tel. 2</div>
                  <div
                    className={
                      this.props.service.restaurant.contact.tel2
                        ? "info_span"
                        : "red_info_span"
                    }
                  >
                    {this.props.service.restaurant.contact.tel2
                      ? this.props.service.restaurant.contact.tel2
                      : "N/A"}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className={"info_descr"}> Tel. 3</div>
                  <div
                    className={
                      this.props.service.restaurant.contact.tel3
                        ? "info_span"
                        : "red_info_span"
                    }
                  >
                    {this.props.service.restaurant.contact.tel3
                      ? this.props.service.restaurant.contact.tel3
                      : "N/A"}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className={"info_descr"}> Restaurant Email </div>
                  <div className={"info_span"}>
                    {this.props.service.restaurant
                      ? this.props.service.restaurant.contact.email
                      : "N/A"}
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
            <Card.Footer>
              <small className="mr-auto">
                <BsInfoSquare
                  style={{
                    color: "#F3702D",
                    fontSize: "1.5em",
                    marginRight: "0.5em",
                  }}
                />
                To Change Restaurant's data, navigate to
                <a href="/data_management/all_restaurants" target="_blank">
                  Data Management / Restaurants
                </a>
              </small>
            </Card.Footer>
          </Card>
        </>
      );
    } else if (this.props.service.service_type === "SE") {
      return (
        <>
          <Card>
            <Card.Header>
              <BsInfoSquare
                style={{
                  color: "#F3702D",
                  fontSize: "1.5em",
                  marginRight: "0.5em",
                }}
              />
              Related Information
            </Card.Header>
            <Card.Body>
              <ListGroup>
                <ListGroup.Item>
                  <div className={"info_descr"}> Sport Event Supplier </div>
                  <div className={"info_span"}>
                    {this.props.service.sport_event_supplier
                      ? this.props.service.sport_event_supplier.name
                      : "N/A"}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className={"info_descr"}>
                    Sport Event Supplier Address
                  </div>
                  <div className={"info_span"}>
                    {this.props.service.sport_event_supplier
                      ? this.props.service.sport_event_supplier.contact.address
                      : "N/A"}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className={"info_descr"}> Rating </div>
                  <div className={"info_span"}>
                    {this.props.service.sport_event_supplier.rating
                      ? calculateHotelStars(
                          this.props.service.sport_event_supplier.rating
                        )
                      : "N/A"}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className={"info_descr"}> Tel</div>
                  <div
                    className={
                      this.props.service.sport_event_supplier.contact.tel
                        ? "info_span"
                        : "red_info_span"
                    }
                  >
                    {this.props.service.sport_event_supplier.contact.tel
                      ? this.props.service.sport_event_supplier.contact.tel
                      : "N/A"}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className={"info_descr"}> Tel. 2</div>
                  <div
                    className={
                      this.props.service.sport_event_supplier.contact.tel2
                        ? "info_span"
                        : "red_info_span"
                    }
                  >
                    {this.props.service.sport_event_supplier.contact.tel2
                      ? this.props.service.sport_event_supplier.contact.tel2
                      : "N/A"}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className={"info_descr"}> Tel. 3</div>
                  <div
                    className={
                      this.props.service.sport_event_supplier.contact.tel3
                        ? "info_span"
                        : "red_info_span"
                    }
                  >
                    {this.props.service.sport_event_supplier.contact.tel3
                      ? this.props.service.sport_event_supplier.contact.tel3
                      : "N/A"}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className={"info_descr"}>Sport Event Supplier Email</div>
                  <div className={"info_span"}>
                    {this.props.service.sport_event_supplier
                      ? this.props.service.sport_event_supplier.contact.email
                      : "N/A"}
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
            <Card.Footer>
              <small className="mr-auto">
                <BsInfoSquare
                  style={{
                    color: "#F3702D",
                    fontSize: "1.5em",
                    marginRight: "0.5em",
                  }}
                />
                To Change Sport Event Supplier's data, navigate to
                <a
                  href="/data_management/all_sport_event_suppliers"
                  target="_blank"
                >
                  Data Management / Sport Event Suppliers
                </a>
              </small>
            </Card.Footer>
          </Card>
        </>
      );
    } else if (this.props.service.service_type === "TE") {
      return (
        <>
          <Card>
            <Card.Header>
              <BsInfoSquare
                style={{
                  color: "#F3702D",
                  fontSize: "1.5em",
                  marginRight: "0.5em",
                }}
              />
              Related Information
            </Card.Header>
            <Card.Body>
              <ListGroup>
                <ListGroup.Item>
                  <div className={"info_descr"}> Teleferik Company </div>
                  <div className={"info_span"}>
                    {this.props.service.teleferik_company
                      ? this.props.service.teleferik_company.name
                      : "N/A"}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className={"info_descr"}>Teleferik Company Address</div>
                  <div className={"info_span"}>
                    {this.props.service.teleferik_company
                      ? this.props.service.teleferik_company.contact.address
                      : "N/A"}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className={"info_descr"}> Tel</div>
                  <div
                    className={
                      this.props.service.teleferik_company.contact.tel
                        ? "info_span"
                        : "red_info_span"
                    }
                  >
                    {this.props.service.teleferik_company.contact.tel
                      ? this.props.service.teleferik_company.contact.tel
                      : "N/A"}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className={"info_descr"}> Tel. 2</div>
                  <div
                    className={
                      this.props.service.teleferik_company.contact.tel2
                        ? "info_span"
                        : "red_info_span"
                    }
                  >
                    {this.props.service.teleferik_company.contact.tel2
                      ? this.props.service.teleferik_company.contact.tel2
                      : "N/A"}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className={"info_descr"}> Teleferik Company Email </div>
                  <div className={"info_span"}>
                    {this.props.service.teleferik_company
                      ? this.props.service.teleferik_company.contact.email
                      : "N/A"}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className={"info_descr"}> Tel. 3</div>
                  <div
                    className={
                      this.props.service.teleferik_company.contact.tel3
                        ? "info_span"
                        : "red_info_span"
                    }
                  >
                    {this.props.service.teleferik_company.contact.tel3
                      ? this.props.service.teleferik_company.contact.tel3
                      : "N/A"}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className={"info_descr"}>Sport Event Supplier Email</div>
                  <div className={"info_span"}>
                    {this.props.service.teleferik_company
                      ? this.props.service.teleferik_company.contact.email
                      : "N/A"}
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
            <Card.Footer>
              <small className="mr-auto">
                <BsInfoSquare
                  style={{
                    color: "#F3702D",
                    fontSize: "1.5em",
                    marginRight: "0.5em",
                  }}
                />
                To Change Teleferik Company's data, navigate to
                <a
                  href="/data_management/all_teleferik_companies"
                  target="_blank"
                >
                  Data Management / Teleferik Companies
                </a>
              </small>
            </Card.Footer>
          </Card>
        </>
      );
    } else if (this.props.service.service_type === "TH") {
      return (
        <>
          <Card>
            <Card.Header>
              <BsInfoSquare
                style={{
                  color: "#F3702D",
                  fontSize: "1.5em",
                  marginRight: "0.5em",
                }}
              />
              Related Information
            </Card.Header>
            <Card.Body>
              <ListGroup>
                <ListGroup.Item>
                  <div className={"info_descr"}> Theater </div>
                  <div className={"info_span"}>
                    {this.props.service.theater
                      ? this.props.service.theater.name
                      : "N/A"}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className={"info_descr"}> Place </div>
                  <div className={"info_span"}>
                    {this.props.service.theater
                      ? this.props.service.theater.place
                        ? this.props.service.theater.place.country +
                          " - " +
                          this.props.service.theater.place.city
                        : "N/A"
                      : "N/A"}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className={"info_descr"}>Lat / Lng</div>
                  <div className={"lat_lng_span"}>
                    {this.props.service.theater
                      ? this.props.service.theater.lat
                      : "N/A"}
                  </div>
                  <div style={{ marginLeft: 35 }} className={"lat_lng_span"}>
                    {this.props.service.theater
                      ? this.props.service.theater.lng
                      : "N/A"}
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
            <Card.Footer>
              <small className="mr-auto">
                <BsInfoSquare
                  style={{
                    color: "#F3702D",
                    fontSize: "1.5em",
                    marginRight: "0.5em",
                  }}
                />
                To Change Theater's data, navigate to
                <a href="/data_management/all_theaters" target="_blank">
                  Data Management / Theaters
                </a>
              </small>
            </Card.Footer>
          </Card>
        </>
      );
    } else if (this.props.service.service_type === "TT") {
      return (
        <>
          <Card>
            <Card.Header>
              <BsInfoSquare
                style={{
                  color: "#F3702D",
                  fontSize: "1.5em",
                  marginRight: "0.5em",
                }}
              />
              Related Information
            </Card.Header>
            <Card.Body>
              <ListGroup>
                <ListGroup.Item>
                  <div className={"info_descr"}> Train Ticket Agency </div>
                  <div className={"info_span"}>
                    {this.props.service.train_ticket_agency
                      ? this.props.service.train_ticket_agency.name
                      : "N/A"}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className={"info_descr"}> Train Ticket Address </div>
                  <div className={"info_span"}>
                    {this.props.service.train_ticket_agency
                      ? this.props.service.train_ticket_agency.contact.address
                      : "N/A"}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className={"info_descr"}> Tel</div>
                  <div
                    className={
                      this.props.service.train_ticket_agency.contact.tel
                        ? "info_span"
                        : "red_info_span"
                    }
                  >
                    {this.props.service.train_ticket_agency.contact.tel
                      ? this.props.service.train_ticket_agency.contact.tel
                      : "N/A"}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className={"info_descr"}> Tel. 2</div>
                  <div
                    className={
                      this.props.service.train_ticket_agency.contact.tel2
                        ? "info_span"
                        : "red_info_span"
                    }
                  >
                    {this.props.service.train_ticket_agency.contact.tel2
                      ? this.props.service.train_ticket_agency.contact.tel2
                      : "N/A"}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className={"info_descr"}> Tel. 2</div>
                  <div
                    className={
                      this.props.service.train_ticket_agency.contact.tel2
                        ? "info_span"
                        : "red_info_span"
                    }
                  >
                    {this.props.service.train_ticket_agency.contact.tel2
                      ? this.props.service.train_ticket_agency.contact.tel2
                      : "N/A"}
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
            <Card.Footer>
              <small className="mr-auto">
                <BsInfoSquare
                  style={{
                    color: "#F3702D",
                    fontSize: "1.5em",
                    marginRight: "0.5em",
                  }}
                />
                To Change Train Ticket Agency's data, navigate to
                <a
                  href="/data_management/all_train_ticket_agencies"
                  target="_blank"
                >
                  Data Management / Train Ticket Agencies
                </a>
              </small>
            </Card.Footer>
          </Card>
        </>
      );
    } else {
      return <></>;
    }
  }
}

export default RelatedModel;
