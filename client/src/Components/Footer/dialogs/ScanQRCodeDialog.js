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
  DialogTitle,
  CircularProgress
} from "@material-ui/core";

import QRCodeReader from "react-qr-reader";

const styles = theme => ({
  root: {}
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const INITIAL_STATE = { value: null };

class ScanQRCodeDialog extends React.Component {
  state = INITIAL_STATE;

  handleError = e => {
    console.log({ e });
  };

  handleScan = value => {
    console.log({ value });
    if (value) {
      this.setState({ value });
      window.location.href = value;
    }
  };

  onClose = () => {
    const { name, toggleDialog, reset } = this.props;
    toggleDialog(name)(false);
    this.setState(INITIAL_STATE);
  };

  render() {
    const { state, name } = this.props;
    const payload = state[name];
    const { value } = this.state;

    if (!payload) return null;

    return (
      <Dialog
        open={Boolean(state[name])}
        TransitionComponent={Transition}
        keepMounted
        onClose={this.onClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        fullWidth
        maxWidth="xs"
        onClose={this.onClose}
      >
        <DialogTitle id="alert-dialog-slide-title">
          <Typography
            variant="h5"
            style={{ color: "cornflowerblue" }}
            align="center"
          >
            <strong>Chimmy QR Scanner</strong>
          </Typography>
        </DialogTitle>
        <DialogContent>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "3em 0"
            }}
          >
            {value ? (
              <div style={{ textAlign: "center" }}>
                <CircularProgress size={36} />
                <Typography variant="subtitle1" align="center">
                  Redirecting..
                </Typography>
              </div>
            ) : (
              <QRCodeReader
                delay={300}
                onError={this.handleError}
                onScan={this.handleScan}
                style={{ width: "90%" }}
              />
            )}
          </div>
          <br />
          <Typography
            variant="caption"
            align="center"
            style={{ textAlign: "center !important" }}
          >
            Use this to scan{" "}
            <span style={{ color: "cornflowerblue" }}>Chimmy QR Code</span>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.onClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(ScanQRCodeDialog);
