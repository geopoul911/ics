// Built-ins
import React from "react";

// Modules / Functions
import { Menu, Grid } from "semantic-ui-react";

// Icons / Images
import LockedTableHeaders from "../../../images/dox/locked_table_headers.png";
import LoginLogoutTableHeaders from "../../../images/dox/login_logout_table_headers.png";
import ConflictNotifications from "../../../images/dox/conflict_notifications.png";
import ValidateConflictBtn from "../../../images/dox/validate_conflict_btn.png";
import LogsDataTableSample from "../../../images/dox/logs_datatable_sample.png";
import IncompleteDataButtons from "../../../images/dox/incomplete_data_buttons.png";
import IncompleteAgentExample from "../../../images/dox/incomplete_agent_example.png";
import FourOOneError from "../../../images/dox/401_error.png";
import PermissionSample from "../../../images/dox/permission_sample.png";
import SAUsersTableHeaders from "../../../images/dox/sa_users_table_headers.png";

const AccessHistory = () => {
  return (
    <>
      <h3 className="dox_h3">Locked</h3>
      <hr />
      <span>
        <p>
          Locked data table shows the users who have been locked by the anti
          brutal force script mechanism.
        </p>
        <p>
          Group Plan super users have the permissions to unblock a user to be
          able to log in again
        </p>
        <p>
          To unlock a user, click the Unlock User button at the top right cell.
        </p>
        <img src={LockedTableHeaders} alt="" className="dox_responsive_img" />
      </span>
      <hr />
      <h3 className="dox_h3">Login / Logout</h3>
      <hr />
      <span>
        <p>
          Login Logout table shows who logged in , or failed to log in at Group
          Plan
        </p>
        <img
          src={LoginLogoutTableHeaders}
          alt=""
          className="dox_responsive_img"
        />
        <p></p>
      </span>
      <hr />
    </>
  );
};

const Conflicts = () => {
  return (
    <>
      <h3 className="dox_h3">Conflicts</h3>
      <br />
      <span>
        <p>
          By changing values in the group schedule table, a conflict might
          occur.
        </p>
        <p>
          Conflicts occur when a driver or a coach are in more than one
          traveldays with the same date.
        </p>
        <p>
          Group Plan will automatically fill this page's table with conflicts,
          and display them on the navigation bar as notifications.
        </p>
        <p>Example: </p>
        <img
          src={ConflictNotifications}
          alt=""
          className="dox_responsive_img"
        />
        <br />
        <p>
          If a conflict is valid, The user needs to validate it , in order to
          stop showing at this table and the navigation bar.
        </p>
        <p>
          To validate a conflict, click on the Validate button at the top right
          cell
        </p>
        <img src={ValidateConflictBtn} alt="" className="dox_responsive_img" />
      </span>
      <hr />
    </>
  );
};

const IncompleteData = () => {
  return (
    <>
      <h3 className="dox_h3">General</h3>
      <br />
      <span>
        <p>
          Any object having empty values on required fields will be shown on the
          Incomplete data page.
        </p>
        <p>
          Null values from required fields occured after the system's upgrade.
        </p>
        <p>
          Each Datatable has different headers, depending on the selected
          object.
        </p>
        <p>To select an object, click on the buttons on the top of the page:</p>
        <img
          src={IncompleteDataButtons}
          alt=""
          className="dox_responsive_img"
        />
      </span>
      <hr />
      <h3 className="dox_h3">Example</h3>
      <br />
      <span>
        <p>In this example, we will see Agents with incomplete values: </p>
        <img
          src={IncompleteAgentExample}
          alt=""
          className="dox_responsive_img"
        />
        <p>Agents are incomplete because they have no abbreviation code.</p>
      </span>
      <hr />
    </>
  );
};

const Logs = () => {
  return (
    <>
      <h3 className="dox_h3">Logs</h3>
      <br />
      <span>
        <p>
          Any action taken by any user in Group Plan is tracked and Added to the
          logs.
        </p>
        <p>Logs page, shows a data table with all these entries.</p>
        <p>Row colors: </p>
        <ul style={{ listStyle: "disk", marginLeft: 40 }}>
          <li style={{ color: "blue" }}>Blue: View</li>
          <li style={{ color: "orange" }}>Yellow: Update</li>
          <li style={{ color: "green" }}>Green: Create</li>
          <li style={{ color: "red" }}>Red: Delete</li>
        </ul>
      </span>
      <hr />
      <h3 className="dox_h3">Data table</h3>
      <br />
      <span>
        <p>Example:</p>
        <img src={LogsDataTableSample} alt="" className="dox_responsive_img" />
      </span>
      <hr />
    </>
  );
};

const Users = () => {
  return (
    <>
      <h3 className="dox_h3">Data table</h3>
      <hr />
      <span>
        <p>Data table has the following columns: </p>
        <img src={SAUsersTableHeaders} alt="" className="dox_responsive_img" />
      </span>
      <hr />
      <h3 className="dox_h3">User Information</h3>
      <hr />
      <span>
        <p> User's information card has the following entries:</p>
        <ul style={{ listStyle: "square", marginLeft: 40 }}>
          <li>Username</li>
          <br />
          <p>
            Username is a free text field and it can only be composed by
            alphabetical characters
          </p>
          <p>Name's max length cannot exceed 50 characters</p>
          <li>First Name</li>
          <br />
          <p>
            First Name is a free text field and it can only be composed by
            alphabetical characters
          </p>
          <p>Name's max length cannot exceed 50 characters</p>
          <li>Last Name</li>
          <br />
          <p>
            Last Name is a free text field and it can only be composed by
            alphabetical characters
          </p>
          <p>Name's max length cannot exceed 50 characters</p>
          <li>Email</li>
          <p>User's email can be used to send information from group plan.</p>
          <p>
            This field needs to have at least one @ and its length cannot exceed
            50 characters.
          </p>
          <li>Enabled</li>
          <p>
            This input field contains a two option dropdown list with "enabled"
            and "disabled" values
          </p>
          <p style={{ color: "red" }}>
            Disabled users will not be able to access group plan for any use.
          </p>
          <li>Staff</li>
          <p>
            This input field contains a two option dropdown list with "enabled"
            and "disabled" values
          </p>
          <p style={{ color: "red" }}>
            Users belonging to staff are the employees of Cosmoplan
          </p>
          <li>Super user</li>
          <p>
            This input field contains a two option dropdown list with "enabled"
            and "disabled" values
          </p>
          <p style={{ color: "red" }}>
            Super users are the administrators of Group Plan
          </p>
          <li>Date joined</li>
          <p>Date joined field's value cannot be changed. </p>
          <p>It is automatically entered at the time the user was created.</p>
        </ul>
      </span>
      <hr />
      <h3 className="dox_h3">User Profile</h3>
      <hr />
      <span>
        <p> User's profile card has the following entries:</p>
        <ul style={{ listStyle: "square", marginLeft: 40 }}>
          <li>Phone number</li>
          <p style={{ color: "red" }}>
            User's Phone number is used on PDFs exported by the user.
          </p>
          <li>Country</li>
          <li>Address</li>
          <li>Zip Code</li>
          <li>Signature</li>
          <p style={{ color: "red" }}>
            Signature is used on the sending email functionality of Group plan
          </p>
        </ul>
        <p style={{ color: "red" }}> None of these entries are required.</p>
      </span>
      <hr />
    </>
  );
};

const UserPermissions = () => {
  return (
    <>
      <h1 className="dox_h1">General Info</h1>
      <hr />
      <h3 className="dox_h3">Definition of Permissions</h3>
      <hr />
      <span>
        <p>
          Permissions determine what information users can view, edit, add, and
          delete within the software.
          <br />
          Flexible and customizable permissions allow you to maintain the
          appropriate balance of collaboration and control while giving
          <br />
          you peace of mind that your company's data is secure and protected.
        </p>
      </span>
      <hr />
      <h3 className="dox_h3">Object based permissions system</h3>
      <hr />
      <span>
        <p>Group Plan uses a custom made object permission system.</p>
        <p>
          This means that each database model has its own set of view, create,
          update and delete permissions
        </p>
        <p>
          A user with no permissions, will not be able to do anything in Group
          Plan.
        </p>
        <p>
          In this page, we are able to change the permissions for each object
          and user.
        </p>
      </span>
      <hr />
      <h3 className="dox_h3">Datatable</h3>
      <hr />
      <span>
        <p>User permissions datatable has the following columns: </p>
        <img src={PermissionSample} alt="" className="dox_responsive_img" />
        <p>
          In this example, we can see that "TestUser" has the permission to
          create a Group.
        </p>
        <p>
          To change any permission, you need to click the check box on the value
          cell ( and of course have the permissions to do so)
        </p>
      </span>
      <hr />
      <h3 className="dox_h3">Insufficient Permissions</h3>
      <hr />
      <span>
        <p>
          If a user does not have for example, the permission to view groups,
          when he navigates to the All Groups page, the following error will
          occur:
        </p>
        <img src={FourOOneError} alt="" className="dox_responsive_img" />
      </span>
      <hr />
    </>
  );
};

class SiteAdministration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: "Access History",
    };
    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleGroupItemClick = this.handleGroupItemClick.bind(this);
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });
  handleGroupItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    return (
      <>
        <Grid.Column width={2}>
          <Menu pointing vertical>
            <Menu.Item
              name="Access History"
              active={this.state.activeItem === "Access History"}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              name="Conflicts"
              active={this.state.activeItem === "Conflicts"}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              name="Incomplete Data"
              active={this.state.activeItem === "Incomplete Data"}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              name="Logs"
              active={this.state.activeItem === "Logs"}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              name="Users"
              active={this.state.activeItem === "Users"}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              name="User Permissions"
              active={this.state.activeItem === "User Permissions"}
              onClick={this.handleItemClick}
            />
          </Menu>
        </Grid.Column>
        <Grid.Column style={{ marginLeft: 10, width: "70%" }}>
          {this.state.activeItem === "Access History" ? <AccessHistory /> : ""}
          {this.state.activeItem === "Conflicts" ? <Conflicts /> : ""}
          {this.state.activeItem === "Incomplete Data" ? (
            <IncompleteData />
          ) : (
            ""
          )}
          {this.state.activeItem === "Logs" ? <Logs /> : ""}
          {this.state.activeItem === "Users" ? <Users /> : ""}
          {this.state.activeItem === "User Permissions" ? (
            <UserPermissions />
          ) : (
            ""
          )}
        </Grid.Column>
      </>
    );
  }
}

export default SiteAdministration;
