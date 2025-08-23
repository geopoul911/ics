// Built in
import React, { Component } from "react";

// CSS
import "./footer.css";

// Footer has no url , it is included in all pages
class Footer extends Component {
  render() {
    return (
      <footer>
        <p>
          All Rights reserved &copy; Cosmoplan Ltd. {new Date().getFullYear()}
        </p>
        <p>
          Any use of this system is subject to the included
          <a href="/terms"> terms and conditions </a>
        </p>
      </footer>
    );
  }
}

export default Footer;
