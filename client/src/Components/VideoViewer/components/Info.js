import _ from "lodash";
import React from "react";
import {
  withStyles,
  Paper,
  Typography,
  Button,
  Hidden,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from "@material-ui/core";
import {
  ArrowDownward as ArrowDownwardIcon,
  ExpandMore as ExpandMoreIcon
} from "@material-ui/icons";

import queryString from "query-string";

import classNames from "classnames";

const styles = theme => ({
  info: {
    padding: "1em"
  }
});

class VideoViewerIndex extends React.Component {
  state = {};

  render() {
    const { info, classes } = this.props;

    const videoDownloadUrl = `${process.env.REACT_APP_YOUTUBE_API_BASE_URL ||
      window.location.origin}/youtube/download?${queryString.stringify({
      url: info.video_url
    })}`;
    return (
      <div>
        <Paper elevation={3} className={classes.info}>
          <Typography variant="h5">{info.title}</Typography>
          <Typography variant="caption">
            Uploaded by{" "}
            <span style={{ color: "cornflowerblue" }}>{info.author.name}</span>
          </Typography>
          <br />
          <Button
            variant="contained"
            color="primary"
            size="small"
            style={{ marginTop: "1em" }}
            href={videoDownloadUrl}
          >
            <ArrowDownwardIcon /> Download MP4
          </Button>
        </Paper>

        <br />
        <ExpansionPanel>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography variant="h6">More formats</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
              eget.
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>

        <ExpansionPanel>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography variant="h6">Settings</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
              eget.
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  }
}

export default withStyles(styles)(VideoViewerIndex);
