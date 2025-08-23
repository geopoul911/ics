// Built-ins
import React from "react";

// Icons-images
import { BsInfoSquare } from "react-icons/bs";
import { FaHashtag } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";
import { GiConvergenceTarget } from "react-icons/gi";
import { MdTextFields } from "react-icons/md";

// Custom Made Components
import AddProduct from "../../../modals/entertainment_suppliers/add_product";
import DeleteProduct from "../../../modals/entertainment_suppliers/delete_product";
import ChangeName from "../../../modals/change_name";
import ChangeLatLng from "../../../modals/change_lat_lng";
import ChangeRegion from "../../../modals/change_region";
import ChangeDescription from "../../../modals/entertainment_suppliers/change_product_description";


// Functions / modules
import axios from "axios";
import { Card } from "react-bootstrap";
import { Grid } from "semantic-ui-react";
import Swal from "sweetalert2";

// Global Variables
import {
  headers,
  loader,
  iconStyle,
  pageHeader,
  forbidden,
} from "../../../global_vars";

// Variables
window.Swal = Swal;

const VIEW_ENTERTAINMENT_SUPPLIER = "http://localhost:8000/api/data_management/entertainment_supplier/";

let overviewIconStyle = { color: "#F3702D", marginRight: "0.5em" };

function getEntertainmentSupplierId() {
  return window.location.pathname.split("/")[3];
}

class EntertainmentSupplierOverView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      entertainment_supplier: {},
      notes: {},
      is_loaded: false,
      forbidden: false,
    };
  }

  componentDidMount() {
    headers["Authorization"] = "Token " + localStorage.getItem("userToken");
    axios
      .get(VIEW_ENTERTAINMENT_SUPPLIER + getEntertainmentSupplierId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          entertainment_supplier: res.data.entertainment_supplier,
          notes: res.data.entertainment_supplier.notes,
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
    this.setState({ entertainment_supplier: update_state });
  };

  render() {
    const { entertainment_supplier } = this.state;
    const products = entertainment_supplier.entertainment_supplier_product || [];

    // Split the products into two columns
    const column1 = products.filter((_, index) => index % 2 === 0);
    const column2 = products.filter((_, index) => index % 2 === 1);

    return (
      <>
        <div className="mainContainer">
          {pageHeader(
            "entertainment_supplier_products",
            entertainment_supplier.name
          )}
          {this.state.forbidden ? (
            <>{forbidden("Entertainment Supplier Overview")}</>
          ) : this.state.is_loaded ? (
            <>
              <Grid divided='vertically' stackable columns={1}>
            <Grid.Column>
              <Card>
                <Card.Header>
                  <BsInfoSquare style={iconStyle} /> Products
                </Card.Header>
                <Card.Body>
                  {products.length === 0 ? (
                    <p> This Shows & Entertainment Supplier has no products added yet.</p>
                  ) : (
                    <Grid columns={2}>
                      <Grid.Column>
                        {column1.map((product) => (
                          <Card key={product.id}>
                            <Card.Header> # {product.id} ) {product.name} </Card.Header>
                            <Card.Body>
                            <div className={"info_descr"}>
                              <FaHashtag style={overviewIconStyle} />  Name
                            </div>
                            <div className={"info_span"}>
                              {product.name ? product.name : "N/A"}
                            </div>
                            <ChangeName
                              object_id={product.id}
                              object_name={product.name}
                              object_type={"Entertainment Product"}
                              update_state={this.update_state}
                            />
                            <div className={"info_descr"}>
                              <FaMapMarkerAlt style={overviewIconStyle} />
                              Lat / Lng
                            </div>
                            <ChangeLatLng
                              object_id={product.id}
                              object_name={product.name}
                              object_type={"Entertainment Product"}
                              update_state={this.update_state}
                              lat={product.lat}
                              lng={product.lng}
                            />
                            <div className={"lat_lng_span"}>
                              {product.lat ? product.lat : "N/A"}
                            </div>
                            <div className={"lat_lng_span"} style={{marginLeft: 20}}>
                              {product.lng ? product.lng : "N/A"}
                            </div>
                            <div className={"info_descr"}>
                              <GiConvergenceTarget style={overviewIconStyle} />
                              Region
                            </div>
                            <div className={"info_span"}>
                              {product.region ? product.region : 'N/A'}
                            </div>
                            <ChangeRegion
                              object_id={product.id}
                              object_name={product.name}
                              object_type={"Entertainment Product"}
                              update_state={this.update_state}
                              region_id={product.region_id}
                              region_type={product.region_type}
                            />
                            <div className={"info_descr"}>
                              <MdTextFields style={overviewIconStyle} /> Description
                            </div>
                            <div className={"info_span"}>
                              {product.description ? product.description : "N/A"}
                            </div>
                            <ChangeDescription
                              object_id={product.id}
                              object_name={product.name}
                              object_type={"Entertainment Product"}
                              update_state={this.update_state}
                            />
                            </Card.Body>
                            <Card.Footer>
                              <label style={{float: 'right'}}>Delete Product</label>
                              <DeleteProduct
                                product_id={product.id}
                                update_state={this.update_state}
                              />
                            </Card.Footer>
                          </Card>
                        ))}
                      </Grid.Column>
                      <Grid.Column>
                        {column2.map((product) => (
                          <Card key={product.id}>
                            <Card.Header> # {product.id} ) {product.name} </Card.Header>
                            <Card.Body>
                            <div className={"info_descr"}>
                              <FaHashtag style={overviewIconStyle} />  Name
                            </div>
                            <div className={"info_span"}>
                              {product.name ? product.name : "N/A"}
                            </div>
                            <ChangeName
                              object_id={product.id}
                              object_name={product.name}
                              object_type={"Entertainment Product"}
                              update_state={this.update_state}
                            />
                            <div className={"info_descr"}>
                              <FaMapMarkerAlt style={overviewIconStyle} />
                              Lat / Lng
                            </div>
                            <ChangeLatLng
                              object_id={product.id}
                              object_name={product.name}
                              object_type={"Entertainment Product"}
                              update_state={this.update_state}
                              lat={product.lat}
                              lng={product.lng}
                            />
                            <div className={"lat_lng_span"}>
                              {product.lat ? product.lat : "N/A"}
                            </div>
                            <div className={"lat_lng_span"} style={{marginLeft: 20}}>
                              {product.lng ? product.lng : "N/A"}
                            </div>
                            <div className={"info_descr"}>
                              <GiConvergenceTarget style={overviewIconStyle} />
                              Region
                            </div>
                            <div className={"info_span"}>
                              {product.region ? product.region : 'N/A'}
                            </div>
                            <ChangeRegion
                              object_id={product.id}
                              object_name={product.name}
                              object_type={"Entertainment Product"}
                              update_state={this.update_state}
                              region_id={product.region_id}
                              region_type={product.region_type}
                            />
                            <div className={"info_descr"}>
                              <MdTextFields style={overviewIconStyle} /> Description
                            </div>
                            <div className={"info_span"}>
                              {product.description ? product.description : "N/A"}
                            </div>
                            <ChangeDescription
                              object_id={product.id}
                              object_name={product.name}
                              object_type={"Entertainment Product"}
                              update_state={this.update_state}
                            />
                            </Card.Body>
                            <Card.Footer>
                              <label style={{float: 'right'}}>Delete Product</label>
                              <DeleteProduct
                                product_id={product.id}
                                update_state={this.update_state}
                              />
                            </Card.Footer>
                          </Card>
                        ))}
                      </Grid.Column>
                    </Grid>
                      )}
                    </Card.Body>
                    <Card.Footer>
                      <AddProduct name={entertainment_supplier.name} update_state={this.update_state}/>
                    </Card.Footer>
                  </Card>
                </Grid.Column>
              </Grid>
            </>
          ) : (
            loader()
          )}
        </div>
      </>
    );
  }
}

export default EntertainmentSupplierOverView;