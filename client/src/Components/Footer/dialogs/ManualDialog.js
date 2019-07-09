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

const styles = theme => ({
  root: {}
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const INITIAL_STATE = {};

class ManualDialog extends React.Component {
  state = INITIAL_STATE;

  onClose = () => {
    const { name, toggleDialog, reset } = this.props;
    toggleDialog(name)(false);
    this.setState(INITIAL_STATE);
  };

  render() {
    const { state, name } = this.props;

    return (
      <Dialog
        open={Boolean(state[name])}
        TransitionComponent={Transition}
        keepMounted
        onClose={this.onClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          <Typography
            variant="h5"
            style={{ color: "cornflowerblue" }}
            align="center"
          >
            <strong>Chimmy Help</strong>
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <Typography variant="subtitle1">
              1. Find a Youtube video and paste the URL link at the textbox
              located above
            </Typography>
            <br />
            <Typography variant="subtitle1">
              2. Wait for the grabbing process to finish
            </Typography>
            <br />
            <Typography variant="subtitle1">
              3. Download your selected type (Audio/Video) and format.
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.onClose} color="primary">
            Got it!
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(ManualDialog);
