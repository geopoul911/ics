// Built in
import React from "react";

// Custom made components
import NavigationBar from "../navigation_bar/navigation_bar";
import Footer from "../footer/footer";

// Functions
import { Grid, Button } from "semantic-ui-react";

// CSS
import "./home.css";

// url path = '/'
class Home extends React.Component {
  render() {
    return (
      <>
        <NavigationBar />
        <div className="homeContainer">
          <Grid columns={2} stackable>
            <Grid.Column>
              <h2>
                Welcome to <br /> Group Plan V2
              </h2>
              <label>
                <i>Powered by Cosmoplan</i>
              </label>
              <p>
                Thousands of tour operators manage their group related data in
                Group Plan.
              </p>
              <p>The best tour operating software ever made. </p>
              <Button
                color="orange"
                onClick={() => (window.location = "/about")}
              >
                About Cosmoplan
              </Button>
            </Grid.Column>
            <Grid.Column>
              {/* 3d model with globe spinning */}
              <div className="elementor-widget-container" id="home_right">
                <iframe
                  title="Globe"
                  id="globe"
                  src="//sketchfab.com/models/894ad84ceb8b444a91fbc05f20530bcd/embed?autospin=1&amp;autostart=1&amp;annotations_visible=0&amp;transparent=1&amp;ui_animations=0&amp;ui_infos=0&amp;ui_stop=0&amp;ui_inspector=0&amp;ui_watermark_link=0&amp;ui_watermark=0&amp;ui_hint=0&amp;ui_ar=0&amp;ui_help=0&amp;ui_settings=0&amp;ui_vr=0&amp;ui_fullscreen=0&amp;ui_annotations=0"
                  frameBorder="0"
                ></iframe>
              </div>
            </Grid.Column>
          </Grid>
        </div>
        <Footer />
      </>
    );
  }
}

export default Home;
