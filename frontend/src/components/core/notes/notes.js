// Built-ins
import React from "react";

// Modules / Functions
import { Card } from "react-bootstrap";
import Swal from "sweetalert2";

// Custom Made Components
import ChangeNoteText from "../../modals/change_note_text";
import DeleteNote from "../../modals/delete_note";
import AddNote from "../../modals/add_note";

// Icons / Images
import { BiNote } from "react-icons/bi";

// Variables
window.Swal = Swal;

function Notes(props) {
  return (
    <Card id="overview_notes_card">
      <Card.Header>
        <BiNote
          style={{
            color: "#93ab3c",
            fontSize: "1.5em",
            marginRight: "0.5em",
          }}
        />
        Notes
      </Card.Header>
      <Card.Body>
        <ul id="note_ul">
          {props.notes.length > 0 ? (
            props.notes.map((e) => (
              <li>
                <h6 id="note_bottom_h6">
                  <DeleteNote
                    update_notes={props.update_notes}
                    object_id={props.object_id}
                    object_type={props.object_type}
                    note_id={e.id}
                  />
                  <ChangeNoteText
                    update_notes={props.update_notes}
                    object_id={props.object_id}
                    text={e.text}
                    object_type={props.object_type}
                    note_id={e.id}
                  />
                </h6>
                <h2 className="note_header">
                  By: {e.user.username} at {e.date}
                </h2>
                <p className="note_content">{e.text}</p>
              </li>
            ))
          ) : (
            <strong
              style={{
                textAlign: "center",
                margin: 20,
                padding: 20,
              }}
            >
              This {props.object_type} does not contain any notes yet.
            </strong>
          )}
        </ul>
      </Card.Body>
      <Card.Footer>
        <AddNote
          update_notes={props.update_notes}
          object_id={props.object_id}
          object_name={props.object_name}
          object_type={props.object_type}
          update_state={props.update_state}
        />
      </Card.Footer>
    </Card>
  );
}

export default Notes;
