// Built-ins
import React, { useState } from "react";

// Modules / Functions
import { Accordion, Icon } from "semantic-ui-react";

// Custom Made Components
import AddContactPerson from "../../modals/add_contact_person";
import DeleteContactPerson from "../../modals/delete_contact_person";

// Icons / Images
import { MdContactPhone } from "react-icons/md";

// Global Variables
import { iconStyle } from "../../global_vars";

function ContactPersons(props) {
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(null);

  const handleAccordion = (e, titleProps) => {
    const { index } = titleProps;
    const newIndex = activeAccordionIndex === index ? null : index;
    setActiveAccordionIndex(newIndex);
  };

  return (
    <>
      <div className={"info_descr"}>
        <MdContactPhone style={iconStyle} /> Contact Persons
      </div>
      <div className={"info_span"}>
        {props.contact_persons.length > 0 ? (
          props.contact_persons.map((person, j) => (
            <Accordion key={j}>
              <DeleteContactPerson
                add_contact_person={props.add_contact_person}
                object_id={props.object_id}
                object_type={props.object_type}
                contact_person_id={person.id}
              />
              <Accordion.Title
                active={activeAccordionIndex === j}
                index={j}
                onClick={(e, titleProps) => handleAccordion(e, titleProps)}
              >
                <Icon name="dropdown" />
                {person.name}
              </Accordion.Title>
              <Accordion.Content active={activeAccordionIndex === j}>
                <ul>
                  <li>
                    <div
                      style={{
                        width: 70,
                        display: "inline-block",
                        fontWeight: "bold",
                      }}
                    >
                      Tel:
                    </div>
                    {person.tel ? person.tel : "N/A"}
                  </li>
                  <li>
                    <div
                      style={{
                        width: 70,
                        display: "inline-block",
                        fontWeight: "bold",
                      }}
                    >
                      Email:
                    </div>
                    {person.email ? person.email : "N/A"}
                  </li>
                  <li style={{ marginBottom: 6 }}>
                    <div
                      style={{
                        width: 70,
                        display: "inline-block",
                        fontWeight: "bold",
                      }}
                    >
                      Position:
                    </div>
                    {person.position ? person.position : "N/A"}
                  </li>
                </ul>
              </Accordion.Content>
            </Accordion>
          ))
        ) : (
          <> This {props.object_type} Does not have any Contact Persons yet.</>
        )}
      </div>
      <AddContactPerson
        add_contact_person={props.add_contact_person}
        object_id={props.object_id}
        object_name={props.object_name}
        object_type={props.object_type}
        update_state={props.update_state}
      />
    </>
  );
}

export default ContactPersons;
