// Built-ins
import React, { useState, useEffect } from "react";

// Custom Made Components
// import MultiRangeSlider from "./MultiRangeSlider";

// CSS
import "./multiRangeSlider.css";

// Modules / Functions
import Swal from "sweetalert2";
import { Grid } from "semantic-ui-react";
import { ListGroup } from "react-bootstrap";
import axios from "axios";

import { headers } from "../../global_vars";

window.Swal = Swal;

const GET_HOTEL_CATEGORIES =
  "http://localhost:8000/api/view/get_all_hotel_categories/";

// Variables
let rating_options = {
  "1 Star": 10,
  "2 Stars": 20,
  "3 Stars": 30,
  "4 Stars": 40,
  "4 Stars plus": 45,
  "5 Stars": 50,
  "5 Stars plus": 55,
};

const HotelFilters = (props) => {
  const {
    selectedRating,
    selectedCategories,
    setSelectedRating,
    setSelectedCategories,
  } = props;
  const [allHotelCategories, setAllHotelCategories] = useState([]);

  const handleRatingChange = (e) => {
    const value = rating_options[e.target.value];
    const updatedSelectedRating = e.target.checked
      ? [...selectedRating, value]
      : selectedRating.filter((rating) => rating !== value);
    setSelectedRating(updatedSelectedRating);
  };

  const handleCategoryChange = (e) => {
    const categoryName = e.target.value;
    const updatedSelectedCategories = e.target.checked
      ? [...selectedCategories, categoryName]
      : selectedCategories.filter((category) => category !== categoryName);
    setSelectedCategories(updatedSelectedCategories);
  };

  useEffect(() => {
    axios
      .get(GET_HOTEL_CATEGORIES, {
        headers: headers,
      })
      .then((res) => {
        setAllHotelCategories(res.data.all_hotel_categories);

        const checkboxes = document.querySelectorAll(".form-check-input");
        checkboxes.forEach((checkbox) => {
          const value = rating_options[checkbox.value];
          checkbox.checked = selectedRating.includes(value);
        });

        const categoryCheckboxes = document.querySelectorAll(
          ".category-form-check-input"
        );
        categoryCheckboxes.forEach((checkbox) => {
          checkbox.checked = selectedCategories.includes(checkbox.value);
        });
      });
  }, [selectedRating, selectedCategories]);

  return (
    <>
      <ListGroup.Item>
        <Grid columns={2}>
          <Grid.Column>
            <label> Rating : </label>
            <div>
              {Object.keys(rating_options).map((key) => (
                <div key={key} className="form-check">
                  <input
                    type="checkbox"
                    id={key}
                    value={key}
                    className="form-check-input"
                    onChange={handleRatingChange}
                  />
                  <label htmlFor={key} className="form-check-label">
                    {key}
                  </label>
                </div>
              ))}
            </div>
          </Grid.Column>
          <Grid.Column>
            <label> Markets : </label>
            <div>
              {allHotelCategories.map((hotel_category) => (
                <div key={hotel_category.id} className="form-check">
                  <input
                    type="checkbox"
                    id={hotel_category.id}
                    value={hotel_category.name}
                    className="form-check-input category-form-check-input"
                    onChange={handleCategoryChange}
                  />
                  <label
                    htmlFor={hotel_category.id}
                    className="form-check-label"
                  >
                    {hotel_category.name}
                  </label>
                </div>
              ))}
            </div>
          </Grid.Column>
        </Grid>
      </ListGroup.Item>
      {/* {props.forbidden ? 
          <>
          </>
          :
          <ListGroup.Item>
            <label> Price Range : </label>
            <Form.Group className="mb-3">
              <Form.Label> </Form.Label>
              <Form.Control
                type="number"
                disabled
                placeholder="Min"
                style={{
                  marginLeft: 20,
                  width: "25%",
                  display: "inline-block",
                  textAlign: "center",
                }}
                value={props.min_price}
                onChange={(e) => props.set_min_price(e.target.value)}
              />
              <div
                style={{
                  marginLeft: 20,
                  width: 10,
                  display: "inline",
                  textAlign: "center",
                }}
              >
                -
              </div>
              <Form.Control
                type="number"
                disabled
                placeholder="Max"
                style={{ marginLeft: 20, width: "25%", display: "inline-block" }}
                value={props.max_price}
                onChange={(e) => props.set_max_price(e.target.value)}
              />
              <hr />
              <MultiRangeSlider
                min={0}
                max={300}
                onChange={({ min, max }) => {
                  props.set_min_price(min);
                  props.set_max_price(max);
                }}
              />
            </Form.Group>
          </ListGroup.Item>
          } 
        */}
    </>
  );
};

export default HotelFilters;
