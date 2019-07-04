import _ from "lodash";
import React, { Fragment } from "react";
import {
  withStyles,
  Button,
  Dialog,
  Slide,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress
} from "@material-ui/core";

import axios from "axios";

const styles = theme => ({
  root: {}
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const INITIAL_STATE = { downloadUrl: null };

class DownloadDialog extends React.Component {
  state = INITIAL_STATE;

  onClose = () => {
    const { name, toggleDialog, reset } = this.props;
    toggleDialog(name)(false);
    this.setState(INITIAL_STATE);
  };

  async componentDidMount() {
    const { state, name, url } = this.props;
    const payload = state[name];
    try {
      const response = await axios.get(payload.url);
      console.log(response.data.downloadUrl);
      this.setState({ downloadUrl: response.data.downloadUrl });
    } catch (error) {
      console.log({ error });
    }
  }

  render() {
    const { state, name } = this.props;
    const { downloadUrl } = this.state;

    return (
      <Dialog
        open={Boolean(state[name])}
        TransitionComponent={Transition}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          Processing your file..
        </DialogTitle>
        <DialogContent>
          {!downloadUrl ? (
            <CircularProgress size={24} />
          ) : (
            <Button variant="contained" color="primary" href={downloadUrl}>
              Download
            </Button>
          )}
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
