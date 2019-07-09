import _ from "lodash";
import React, { Fragment } from "react";
import {
  withStyles,
  Button,
  Dialog,
  Slide,
  DialogActions,
  DialogContent,
  Typography,
  DialogTitle
} from "@material-ui/core";

import axios from "axios";

import ChimmyLoading from "../../../res/gif2.gif";

const styles = theme => ({
  root: {}
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const LOADING = "LOADING",
  ERROR = "ERROR",
  DONE = "DONE";

const INITIAL_STATE = { downloadUrl: null, loadingStatus: DONE };

class DownloadDialog extends React.Component {
  state = INITIAL_STATE;

  onClose = () => {
    const { name, toggleDialog, reset } = this.props;
    toggleDialog(name)(false);
    this.setState(INITIAL_STATE);
  };

  async componentDidMount() {
    await this.loadUrl();
  }

  async loadUrl() {
    const { state, name, url } = this.props;
    const payload = state[name];
    try {
      this.setState({ loadingStatus: LOADING });
      const response = await axios.get(payload.url);
      console.log(response.data.downloadUrl);
      this.setState({
        downloadUrl: response.data.downloadUrl,
        loadingStatus: DONE
      });
    } catch (error) {
      console.log({ error });
      this.setState({ loadingStatus: ERROR });
    }
  }

  render() {
    const { state, name } = this.props;
    const payload = state[name];
    const { downloadUrl, loadingStatus } = this.state;

    const fileExt = (() => {
      if (payload.type === "audio") return `(${payload.f.toUpperCase()})`;
      else return `(MP4 ${payload.f})`;
    })();

    return (
      <Dialog
        open={Boolean(state[name])}
        TransitionComponent={Transition}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          <Typography variant="h5" align="center">
            Processing your file..
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography
            variant="subtitle1"
            align="center"
            style={{ marginBottom: "1em", color: "cornflowerblue" }}
          >
            {payload.info.player_response.videoDetails.title} {fileExt}
          </Typography>
          <div style={{ textAlign: "center" }}>
            {loadingStatus === LOADING ? (
              <div>
                <div style={{ textAlign: "center", marginBottom: "1em" }}>
                  <img
                    alt=""
                    src={ChimmyLoading}
                    style={{ width: "70%", maxWidth: "180px" }}
                  />
                </div>
                {/* <CircularProgress size={36} /> */}
              </div>
            ) : loadingStatus === DONE ? (
              <Button variant="contained" color="primary" href={downloadUrl}>
                Download
              </Button>
            ) : (
              <Button
                variant="contained"
                color="secondary"
                onClick={this.loadUrl}
              >
                Retry
              </Button>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.onClose} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(DownloadDialog);
