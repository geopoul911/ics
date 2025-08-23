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
import ChangeImageCaption from "./change_image_caption";
import DeleteImage from "./delete_image";
import UploadImage from "./upload_image";

// Global Variables
import {
  headers,
  loader,
  pageHeader,
  forbidden,
  restrictedUsers,
} from "../global_vars";

// Variables
window.Swal = Swal;

const nameToURL = {
  "Agent": "Agent",
  "Attraction": "Attraction",
  "Coach": "Coach",
  "Coach Operator": "CoachOperator",
  "Client": "Client",
  "Driver": "Driver",
  "Group Leader": "GroupLeader",
  "Hotel": "Hotel",
  "Guide": "Guide",
  "Parking Lot": "ParkingLot",
  "Restaurant": "Restaurant",
  "Sport Event Supplier": "SportEventSupplier",
  "Theater": "Theater",
  "Entertainment Supplier": "EntertainmentSupplier",
};

const srl_options = {
// ... existing code ...
} 