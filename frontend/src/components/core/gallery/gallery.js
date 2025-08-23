// Built-ins
import React from "react";

// Icons-images
import { SRLWrapper } from "simple-react-lightbox";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// Functions / modules
import axios from "axios";
import { Card, CardGroup } from "react-bootstrap";
import Swal from "sweetalert2";

// Custom Made Components
import ChangeImageCaption from "../../modals/change_image_caption";
import DeleteImage from "../../modals/delete_image";
import UploadImage from "../../modals/upload_image";

// Global Variables
import {
  headers,
  loader,
  pageHeader,
  forbidden,
  restrictedUsers,
} from "../../global_vars";

// Variables
window.Swal = Swal;

const srl_options = {
  settings: {
    autoplaySpeed: 1500,
    transitionSpeed: 900,
  },
  caption: {
    captionColor: "#a6cfa5",
    captionFontFamily: "Raleway, sans-serif",
    captionFontWeight: "300",
    captionTextTransform: "uppercase",
  },
};

const VIEW_OBJECT = "http://localhost:8000/api/data_management/";

function getObjectId() {
  return window.location.pathname.split("/")[3];
}

const nameToURL = {
  "Agent": "agent",
  "Attraction": "attraction",
  "Coach": "coach",
  "Coach Operator": "coach_operator",
  "Client": "client",
  "Driver": "driver",
  "Group Leader": "group_leader",
  "Hotel": "hotel",
  "Guide": "guide",
  "Parking Lot": "parking_lot",
  "Restaurant": "restaurant",
  "Sport Event Supplier": "sport_event_supplier",
  "Theater": "theater",
  "Entertainment Supplier": "entertainment_supplier",
};

class Gallery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      object: {},
      is_loaded: false,
      forbidden: false,
    };
    this.remount = this.remount.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  componentDidMount() {
    if (restrictedUsers().includes(localStorage.getItem("user"))) {
      this.setState({
        forbidden: true,
      });
    }
    headers["Authorization"] = "Token " + localStorage.getItem("userToken");
    axios
      .get(
        VIEW_OBJECT + nameToURL[this.props.object_type] + "/" + getObjectId(),
        {
          headers: headers,
        }
      )
      .then((res) => {
        this.setState({
          object: res.data[nameToURL[this.props.object_type]],
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

  update_state = (update_state) => {
    this.setState({ object: update_state });
  };

  remount = () => {
    headers["Authorization"] = "Token " + localStorage.getItem("userToken");
    axios
      .get(
        VIEW_OBJECT + nameToURL[this.props.object_type] + "/" + getObjectId(),
        {
          headers: headers,
        }
      )
      .then((res) => {
        this.setState({
          object: res.data[nameToURL[this.props.object_type]],
          is_loaded: true,
        });
      });
  };

  onDragEnd = (result) => {
    if (!result.destination) return;

    const photos = Array.from(this.state.object.photos);
    const [reorderedItem] = photos.splice(result.source.index, 1);
    photos.splice(result.destination.index, 0, reorderedItem);

    // Update local state
    this.setState({
      object: {
        ...this.state.object,
        photos: photos,
      },
    });

    // Prepare photo orders for API
    const photo_orders = photos.map((photo, index) => ({
      photo_id: photo.id,
      new_order: index,
    }));

    // Send update to backend
    headers["Authorization"] = "Token " + localStorage.getItem("userToken");
    axios
      .post(
        VIEW_OBJECT + "reorder_photos/",
        {
          object_type: this.props.object_type,
          object_id: this.state.object.id,
          photo_orders: photo_orders,
        },
        { headers: headers }
      )
      .catch((e) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to save photo order. Please try again.",
        });
        // Revert to original order on error
        this.remount();
      });
  };

  render() {
    return (
      <>
        <div className="mainContainer">
          {pageHeader(
            nameToURL[this.props.object_type] + "_gallery",
            this.state.object.name
          )}

          {this.state.forbidden ? (
            <>{forbidden(this.props.object_type + " Gallery")}</>
          ) : this.state.is_loaded ? (
            <>
              <div>
                <SRLWrapper options={srl_options}>
                  <DragDropContext onDragEnd={this.onDragEnd}>
                    <Droppable droppableId="photos" direction="horizontal">
                      {(provided) => (
                        <CardGroup
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          {this.state.object.photos.length > 0 ? (
                            this.state.object.photos.map((e, index) => (
                              <Draggable
                                key={e.id}
                                draggableId={e.id.toString()}
                                index={index}
                              >
                                {(provided) => (
                                  <Card
                                    className="glr_img_card"
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <Card.Header>
                                      <strong>{e.photo_comment}</strong>
                                    </Card.Header>
                                    <Card.Body>
                                      <div className="gallery_img">
                                        <a href={e.photo}>
                                          <img src={e.photo} alt="Caption" />
                                        </a>
                                      </div>
                                    </Card.Body>
                                    <Card.Footer>
                                      <ChangeImageCaption
                                        remount={this.remount}
                                        object_id={this.state.object.id}
                                        object_type={this.props.object_type}
                                        image_id={e.id}
                                        caption={e.photo_comment}
                                      />
                                      <DeleteImage
                                        remount={this.remount}
                                        object_id={this.state.object.id}
                                        object_type={this.props.object_type}
                                        image_id={e.id}
                                      />
                                    </Card.Footer>
                                  </Card>
                                )}
                              </Draggable>
                            ))
                          ) : (
                            <div className="container">
                              <Card style={{ width: "100%", minHeight: 160 }}>
                                <Card.Header></Card.Header>
                                <Card.Body>
                                  <Card.Body>
                                    <h3 style={{ textAlign: "center" }}>
                                      This {this.props.object_type} does not have
                                      any images yet.
                                    </h3>
                                  </Card.Body>
                                </Card.Body>
                                <Card.Footer></Card.Footer>
                              </Card>
                            </div>
                          )}
                          {provided.placeholder}
                        </CardGroup>
                      )}
                    </Droppable>
                  </DragDropContext>
                </SRLWrapper>
              </div>
              <div className="container">
                <UploadImage
                  remount={this.remount}
                  object_id={this.state.object.id}
                  object_type={this.props.object_type}
                />
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

export default Gallery;
