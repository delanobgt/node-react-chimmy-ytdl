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
  Typography
} from "@material-ui/core";
import QRCode from "qrcode";

import axios from "axios";

const styles = theme => ({
  root: {}
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const INITIAL_STATE = { dataUrl: null };

class ShowQRCodeDialog extends React.Component {
  state = INITIAL_STATE;

  onClose = () => {
    const { name, toggleDialog } = this.props;
    toggleDialog(name)(false);
    this.setState(INITIAL_STATE);
  };

  async componentDidMount() {
    const { state, name } = this.props;
    const payload = state[name];
    const dataUrl = await QRCode.toDataURL(payload.url);
    this.setState({ dataUrl });
  }

  render() {
    const { state, name } = this.props;
    const payload = state[name];
    const { dataUrl } = this.state;

    console.log(dataUrl);

    return (
      <Dialog
        open={Boolean(state[name])}
        TransitionComponent={Transition}
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
            <strong>Chimmy QR Code</strong>
          </Typography>
        </DialogTitle>
        <DialogContent>
          <div style={{ textAlign: "center" }}>
            <img style={{ width: "90%" }} src={dataUrl} alt="" />
          </div>
          <Typography
            variant="caption"
            align="center"
            style={{ textAlign: "center !important" }}
          >
            Scan above{" "}
            <span style={{ color: "cornflowerblue" }}>Chimmy QR Code</span>{" "}
            using the{" "}
            <span style={{ color: "cornflowerblue" }}>Chimmy QR Scanner</span>{" "}
            located at the bottom right of this page
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.onClose} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(ShowQRCodeDialog);
