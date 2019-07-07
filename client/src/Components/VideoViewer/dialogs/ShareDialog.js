import _ from "lodash";
import React, { Fragment } from "react";
import {
  withStyles,
  Button,
  Dialog,
  Slide,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Paper,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  TextField,
  CircularProgress
} from "@material-ui/core";
import {
  FilterNone as FilterNoneIcon,
  Send as SendIcon
} from "@material-ui/icons";
import { CopyToClipboard } from "react-copy-to-clipboard";

import * as youtubeApi from "../../../apis/youtube";

const styles = theme => ({
  root: {}
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const EMAIL_IDLE = "EMAIL_IDLE",
  EMAIL_LOADING = "EMAIL_LOADING",
  EMAIL_DONE = "EMAIL_DONE",
  EMAIL_ERROR = "EMAIL_ERROR";

const INITIAL_STATE = {
  tabIndex: 0,
  copied: false,
  emailStatus: EMAIL_IDLE,
  email: ""
};

class ShareDialog extends React.Component {
  state = INITIAL_STATE;
  resetTimeout = null;

  onClose = () => {
    const { name, toggleDialog } = this.props;
    toggleDialog(name)(false);
    this.setState(INITIAL_STATE);
  };

  sendEmail = async e => {
    e.preventDefault();
    const { state, name } = this.props;
    const payload = state[name];
    const { email } = this.state;

    if (!email) return;

    try {
      this.setState({ emailStatus: EMAIL_LOADING });
      await youtubeApi.sendShareLinkEmail({
        videoUrl: payload.url,
        videoName: payload.videoName,
        email
      });
      this.setState({ emailStatus: EMAIL_DONE });
    } catch (error) {
      console.log({ error });
      this.setState({ emailStatus: EMAIL_ERROR });
    }
  };

  handleTabChange = (event, tabIndex) => {
    this.setState({ tabIndex });
  };

  handleCopy = () => {
    this.setState({ copied: true });

    // if (this.resetTimeout) clearTimeout(this.resetTimeout);
    // this.resetTimeout = setTimeout(() => {
    //   this.setState({ copied: false });
    // }, 1500);
  };

  async componentDidMount() {}

  render() {
    const { state, name } = this.props;
    const payload = state[name];
    const { tabIndex, copied, email, emailStatus } = this.state;

    return (
      <Dialog
        open={Boolean(state[name])}
        TransitionComponent={Transition}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        fullWidth
        maxWidth="xs"
        onClose={emailStatus === EMAIL_LOADING ? null : this.onClose}
      >
        <DialogTitle id="alert-dialog-slide-title">
          <Typography
            variant="h5"
            style={{ color: "cornflowerblue" }}
            align="center"
          >
            <strong>Share Chimmy Video</strong>
          </Typography>
        </DialogTitle>
        <DialogContent>
          <div style={{ width: "100%" }}>
            <Paper elevation={0} style={{ width: "100%" }}>
              <Tabs
                centered={true}
                value={tabIndex}
                onChange={this.handleTabChange}
                indicatorColor="secondary"
                textColor="secondary"
                variant="fullWidth"
              >
                <Tab label={"Email"} />
                <Tab label={"Link"} />
              </Tabs>
            </Paper>
            <div style={{ margin: "1em 0" }}>
              {tabIndex === 0 && (
                <div>
                  <div>
                    <form
                      onSubmit={this.sendEmail}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "row"
                      }}
                    >
                      <div style={{ flex: 1, marginRight: "0.5em" }}>
                        <TextField
                          label="Email"
                          value={email}
                          onChange={e =>
                            this.setState({ email: e.target.value.trim() })
                          }
                          type="email"
                          fullWidth
                        />
                      </div>
                      <div>
                        <Tooltip title={"Copy to Clipboard"} placement="top">
                          <Button
                            disabled={emailStatus === EMAIL_LOADING}
                            onCLick={this.sendEmail}
                            variant="contained"
                            color="primary"
                            type="submit"
                          >
                            {emailStatus === EMAIL_LOADING ? (
                              <CircularProgress size={24} />
                            ) : (
                              <SendIcon />
                            )}
                          </Button>
                        </Tooltip>
                      </div>
                    </form>
                    <Typography
                      variant="subtitle1"
                      style={{
                        marginTop: "0.5em"
                      }}
                    >
                      {emailStatus === EMAIL_IDLE
                        ? "Type in the email to share the Chimmy Love"
                        : emailStatus === EMAIL_LOADING
                        ? "Sending.."
                        : emailStatus === EMAIL_ERROR
                        ? "Please try again"
                        : emailStatus === EMAIL_DONE
                        ? "Email sent!"
                        : ""}
                    </Typography>
                  </div>
                </div>
              )}
              {tabIndex === 1 && (
                <div>
                  <div>
                    <CopyToClipboard
                      text={payload.url}
                      onCopy={this.handleCopy}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          flexDirection: "row"
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <TextField
                            label="Shareable Link"
                            value={payload.url}
                            variant="outlined"
                            readonly
                            fullWidth
                          />
                        </div>
                        <div>
                          <Tooltip title={"Copy to Clipboard"} placement="top">
                            <IconButton
                              style={{ color: copied ? "cornflowerblue" : "" }}
                            >
                              <FilterNoneIcon />
                            </IconButton>
                          </Tooltip>
                        </div>
                      </div>
                    </CopyToClipboard>
                  </div>
                  <Typography
                    variant="subtitle1"
                    style={{
                      marginTop: "0.5em",
                      color: copied ? "cornflowerblue" : ""
                    }}
                  >
                    {copied ? "Copied!" : "Copy the link above"}
                  </Typography>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={this.onClose}
            color="secondary"
            disabled={emailStatus === EMAIL_LOADING}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(ShareDialog);
