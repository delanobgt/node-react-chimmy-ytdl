import _ from "lodash";
import React from "react";
import { withStyles, Paper, Typography, Grid, Hidden } from "@material-ui/core";
import $ from "jquery";
import classNames from "classnames";

const styles = theme => ({
  thumbnail: {
    width: "100%",
    borderRadius: "7px",
    boxShadow: "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)"
  }
});

class VideoViewerIndex extends React.Component {
  state = {};

  render() {
    const { thumbnailUrl, classes } = this.props;

    return <img className={classes.thumbnail} src={thumbnailUrl} />;
  }
}

export default withStyles(styles)(VideoViewerIndex);
