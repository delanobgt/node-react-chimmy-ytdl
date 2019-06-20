import _ from "lodash";
import React, { Fragment } from "react";
import { withStyles, Paper, Typography, Grid, Hidden } from "@material-ui/core";
import $ from "jquery";
import classNames from "classnames";

import Thumbnail from "./components/Thumbnail";
import Info from "./components/Info";

const styles = theme => ({
  root: {},
  thumbnail: {
    width: "100%",
    borderRadius: "7px",
    boxShadow: "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)"
  },
  info: {
    padding: "1em"
  }
});

class VideoViewerIndex extends React.Component {
  state = {};

  render() {
    const { info, classes } = this.props;

    const thumbnailUrl = _.last(
      info.player_response.videoDetails.thumbnail.thumbnails
    ).url;

    return (
      <Fragment>
        <Hidden smDown>
          <Grid container className={classes.root} justify="center">
            <Grid
              item
              xs={11}
              sm={7}
              md={4}
              lg={3}
              style={{ position: "sticky" }}
            >
              <Thumbnail thumbnailUrl={thumbnailUrl} />
            </Grid>
            <Grid
              item
              xs={11}
              sm={7}
              md={6}
              lg={4}
              style={{ marginLeft: "1.5em" }}
            >
              <Info info={info} />
            </Grid>
          </Grid>
        </Hidden>
        <Hidden mdUp>
          <Grid container className={classes.root} justify="center">
            <Grid
              item
              xs={11}
              sm={7}
              md={4}
              lg={3}
              style={{ position: "sticky" }}
            >
              <Thumbnail thumbnailUrl={thumbnailUrl} />
            </Grid>
            <Grid
              item
              xs={11}
              sm={7}
              md={6}
              lg={4}
              style={{ marginTop: "1.5em" }}
            >
              <Info info={info} />
            </Grid>
          </Grid>
        </Hidden>
      </Fragment>
    );
  }
}

export default withStyles(styles)(VideoViewerIndex);
