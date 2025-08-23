// Built-ins
import React from "react";

// Modules / Functions
import axios from "axios";
import Swal from "sweetalert2";
import { Card, ListGroup } from "react-bootstrap";

// Icons / Images
import NoImage from "../../../../images/core/404/no_image.png";
import { TiTick } from "react-icons/ti";
import { ImCross } from "react-icons/im";

// Custom Made Components
import AddCoachModal from "../../../modals/create/add_coach_modal";

// Global Variables
import {
  headers,
  loader,
  pageHeader,
  forbidden,
  restrictedUsers,
} from "../../../global_vars";

// Variables
window.Swal = Swal;

let cross_style = {
  color: "red",
  fontSize: "1em",
};

let tick_style = {
  color: "green",
  fontSize: "1.4em",
};

const VIEW_COACH_OPERATOR = "http://localhost:8000/api/data_management/coach_operator/";

function getCoachOperatorId() {
  return window.location.pathname.split("/")[3];
}

class CoachOperatorOverView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coach_operator: {},
      all_coaches: [],
      is_loaded: false,
      forbidden: false,
    };
  }

  update_state = () => {
    axios
      .get(VIEW_COACH_OPERATOR + getCoachOperatorId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          coach_operator: res.data.coach_operator,
          all_coaches: res.data.all_coaches,
          is_loaded: true,
        });
      });
  };

  componentDidMount() {
    if (restrictedUsers().includes(localStorage.getItem("user"))) {
      this.setState({
        forbidden: true,
      });
    }
    headers["Authorization"] = "Token " + localStorage.getItem("userToken");
    axios
      .get(VIEW_COACH_OPERATOR + getCoachOperatorId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          coach_operator: res.data.coach_operator,
          all_coaches: res.data.all_coaches,
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

  render() {
    return (
      <>
        <div className="mainContainer">
          {pageHeader(
            "coach_operator_coaches",
            this.state.coach_operator.name
          )}
          {this.state.forbidden ? (
            <>{forbidden("Coach Operator Coaches")}</>
          ) : this.state.is_loaded ? (
            <>
              <div className="">
                {this.state.all_coaches.length === 0 ? (
                  <Card style={{ width: "100%", minHeight: 160 }}>
                    <Card.Header></Card.Header>
                    <Card.Body>
                      <Card.Body>
                        <h3 style={{ textAlign: "center" }}>
                          This Coach Operator does not have any coaches yet.
                        </h3>
                      </Card.Body>
                    </Card.Body>
                    <Card.Footer></Card.Footer>
                  </Card>
                ) : (
                  <div className="card-container">
                    {this.state.all_coaches.map((coach) => (
                      <Card key={coach.id} style={{ width: '22rem', marginRight: '10px' }}>
                        <Card.Img variant="top" className='coach-image' src={
                          coach.photos && coach.photos.length > 0 ? coach.photos[0].photo
                          :
                          NoImage
                          } 
                        />
                        <Card.Body>
                          <Card.Title style={{textAlign: 'center', fontWeight: 'bold', fontSize: 20}}>{coach.make} </Card.Title>
                          <Card.Text> Plate Number: {coach.plate_number ? coach.plate_number : 'N/A'}</Card.Text>
                        </Card.Body>
                        <ListGroup className="list-group-flush">
                          <ListGroup.Item>Body Number: {coach.body_number ? coach.body_number : 'N/A'} </ListGroup.Item>
                          <ListGroup.Item>Number Of Seats: {coach.number_of_seats ? coach.number_of_seats : 'N/A'}</ListGroup.Item>
                          <ListGroup.Item>Emmission: {coach.emission ? coach.emission : 'N/A'}</ListGroup.Item>
                          <ListGroup.Item>Year: {coach.year ? coach.year : 'N/A'}</ListGroup.Item>
                          <ListGroup.Item>Enabled: {coach.enabled ? <TiTick style={tick_style} /> : <ImCross style={cross_style} />}</ListGroup.Item>
                        </ListGroup>
                        <Card.Body>
                          <Card.Link target="_blank" href={"/data_management/coach/" + coach.id}>Coach's Overview</Card.Link>
                        </Card.Body>
                      </Card>
                    ))}
                  </div>
                )}
                <hr/>
                <AddCoachModal redir={false} coach_operator={this.state.coach_operator} update_state={this.update_state}/>
              </div>
            </>
          ) : (
            loader()
          )}
        </div>
      </>
    );
  }
}

export default CoachOperatorOverView;
