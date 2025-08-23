// Built-ins
import React, { useState, useEffect } from "react";

// CSS
import "./multiRangeSlider.css";

// Modules / Functions
import Swal from "sweetalert2";
import { Grid } from "semantic-ui-react";
import { ListGroup } from "react-bootstrap";
import axios from "axios";

// Global Vars
import { headers } from "../../global_vars";

// Variables
window.Swal = Swal;

const GET_COACH_OPERATOR_CATEGORIES = "http://localhost:8000/api/view/get_all_coach_operator_categories/";

// Variables
const CoachOperatorFilters = (props) => {
  const {
    selectedCategories,
    setSelectedCategories,
  } = props;
  const [allCoachOperatorCategories, setAllCoachOperatorCategories] = useState([]);

  const handleCategoryChange = (e) => {
    const categoryName = e.target.value;
    const updatedSelectedCategories = e.target.checked
      ? [...selectedCategories, categoryName]
      : selectedCategories.filter((category) => category !== categoryName);
    setSelectedCategories(updatedSelectedCategories);
  };

  useEffect(() => {
    axios
      .get(GET_COACH_OPERATOR_CATEGORIES, {
        headers: headers,
      })
      .then((res) => {
        setAllCoachOperatorCategories(res.data.all_coach_operator_categories);

        const categoryCheckboxes = document.querySelectorAll(
          ".category-form-check-input"
        );

        categoryCheckboxes.forEach((checkbox) => {
          checkbox.checked = selectedCategories.includes(checkbox.value);
        });
      });
  }, [selectedCategories]);

  return (
    <>
      <ListGroup.Item>
        <Grid columns={2}>
          <Grid.Column>
            <label> Categories : </label>
            <div>
              {allCoachOperatorCategories.map((coach_operator_category) => (
                <div key={coach_operator_category.id} className="form-check">
                  <input
                    type="checkbox"
                    id={coach_operator_category.id}
                    value={coach_operator_category.name}
                    className="form-check-input category-form-check-input"
                    onChange={handleCategoryChange}
                  />
                  <label
                    htmlFor={coach_operator_category.id}
                    className="form-check-label"
                  >
                    {coach_operator_category.name}
                  </label>
                </div>
              ))}
            </div>
          </Grid.Column>
        </Grid>
      </ListGroup.Item>
    </>
  );
};

export default CoachOperatorFilters;
