import React from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { withStyles, Paper, Typography } from "@material-ui/core";
import { Fade } from "react-reveal";
import $ from "jquery";
import classNames from "classnames";

import ChimButton from "./misc/ChimButton";
import ChimmyLoading from "../res/gif2.gif";
import Header from "./Header";
import SearchBar from "./SearchBar";
import VideoViewer from "./VideoViewer";
import Footer from "./Footer";

const redTheme = createMuiTheme({
  palette: { primary: { main: "#fae638" }, secondary: { main: "#d1be18" } }
});

const styles = theme => ({
  app: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    flexDirection: "column"
  },
  mainBody: {
    overflowY: "scroll",
    paddingTop: "1em",
    paddingBottom: "2em",
    "::-webkit-scrollbar": {
      display: "none"
    }
  }
});

const URL_IDLE = "URL_IDLE",
  URL_LOADING = "URL_LOADING",
  URL_LOADED = "URL_LOADED";

class App extends React.Component {
  state = {
    urlStatus: URL_IDLE,
    currentVideoInfo: null
  };

  onStartLoadingUrl = url => {
    this.setState({ urlStatus: URL_LOADING });
  };

  onFinishLoadingUrl = (url, info) => {
    this.setState({ urlStatus: URL_LOADED, currentVideoInfo: info });
  };

  render() {
    const { urlStatus, currentVideoInfo } = this.state;
    const { classes } = this.props;

    return (
      <MuiThemeProvider theme={redTheme}>
        <div className={classes.app}>
          <Header />

          <SearchBar
            onStartLoadingUrl={this.onStartLoadingUrl}
            onFinishLoadingUrl={this.onFinishLoadingUrl}
          />

          <div style={{ flex: 1 }} className={classes.mainBody}>
            {urlStatus === URL_LOADING ? (
              <Fade>
                <div style={{ textAlign: "center" }}>
                  <img alt="" src={ChimmyLoading} />
                </div>
              </Fade>
            ) : urlStatus === URL_LOADED ? (
              <Fade>
                <VideoViewer info={currentVideoInfo} />
              </Fade>
            ) : null}
          </div>

          <Footer />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(App);
