import React from "react";
import classNames from "classnames";
import {
  withStyles,
  Grid,
  Tooltip,
  Typography,
  IconButton
} from "@material-ui/core";
import { Help as HelpIcon } from "@material-ui/icons";

import ChimmyYtdlLogo from "../../res/logo.png";

const styles = theme => ({
  wrapper: {
    width: "100vw",
    paddingTop: "0.75em",
    paddingBottom: "2.5em",
    backgroundColor: "gold",
    textAlign: "center"
  },
  logo: {
    color: "white"
  },
  paper: {}
});

class HeaderIndex extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.wrapper}>
        <img
          alt=""
          src={ChimmyYtdlLogo}
          style={{ width: "90%", maxWidth: "280px" }}
        />
        <Typography
          variant="subtitle1"
          align="center"
          style={{ color: "black", fontWeight: "bold" }}
        >
          The 21<sup>st</sup> century best{" "}
          <i
            className="fab fa-youtube"
            style={{ color: "red", fontSize: "1.1em" }}
          />{" "}
          downloader
        </Typography>
      </div>
    );
  }
}

export default withStyles(styles)(HeaderIndex);
