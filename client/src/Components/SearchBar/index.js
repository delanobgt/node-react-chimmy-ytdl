import "./style.css";
import React, { Fragment } from "react";
import $ from "jquery";
import classNames from "classnames";
import {
  withStyles,
  Paper,
  Grid,
  CircularProgress,
  Typography,
  Button,
  Divider
} from "@material-ui/core";
import {
  ArrowForward as ArrowForwardIcon,
  Check as CheckIcon,
  Close as CloseIcon
} from "@material-ui/icons";
import * as youtubeApi from "../../apis/youtube";
import { Help as HelpIcon } from "@material-ui/icons";

const styles = theme => ({
  wrapper: {
    width: "100vw",
    position: "fixed",
    bottom: 0,
    left: 0
  },
  container: {
    padding: "0.3em 0",
    backgroundColor: "white"
  },
  paper: {},
  socialIcon: {
    marginLeft: "1em",
    color: "darkgray"
  },
  divider: {
    width: 2,
    height: 30,
    marginLeft: "0.85em"
  }
});

const CHECK_IDLE = "CHECK_IDLE",
  CHECK_LOADING = "CHECK_LOADING",
  CHECK_ERROR = "CHECK_ERROR",
  CHECK_VALID = "CHECK_VALID";

class SearchBarIndex extends React.Component {
  state = {
    url: "",
    fixedUrl: null,
    checkingStatus: CHECK_IDLE,
    urlError: null
  };

  timeoutMethod = null;

  componentDidMount() {}

  handleUrlChange = e => {
    const url = String(e.target.value || "").trim();

    this.setState({ url });

    if (url.length) this.validateUrl(url);
  };

  validateUrl = url => {
    const { onUrlFixed } = this.props;

    if (this.timeoutMethod) clearTimeout(this.timeoutMethod);
    this.setState({ urlError: null, checkingStatus: CHECK_LOADING });
    this.timeoutMethod = setTimeout(async () => {
      try {
        const { valid } = await youtubeApi.validateUrl(url);
        if (valid) {
          this.setState({ fixedUrl: url, checkingStatus: CHECK_VALID });
          if (onUrlFixed) onUrlFixed(url);
          this.loadUrl(url);
        } else {
          this.setState({
            urlError: {
              type: "retry",
              message: "Invalid url! Make sure you copy the whole url."
            },
            checkingStatus: CHECK_ERROR
          });
        }
      } catch (error) {
        console.log({ error });
        this.setState({
          urlError: {
            type: "retry",
            message: "Network error."
          },
          checkingStatus: CHECK_ERROR
        });
      }
    }, 1000);
  };

  loadUrl = async url => {
    const { onStartLoadingUrl, onFinishLoadingUrl } = this.props;

    try {
      if (onStartLoadingUrl) onStartLoadingUrl(url);
      const basicInfo = await youtubeApi.getBasicInfo(url);
      if (onFinishLoadingUrl) onFinishLoadingUrl(url, basicInfo);
    } catch (error) {
      console.log({ error });
    }
  };

  onBlur = () => {};

  render() {
    const { classes } = this.props;
    const { urlError, url, checkingStatus, urlFixed } = this.state;

    return (
      <div className="main-wrapper">
        <Paper className={classNames("paper-search")} elevation={3}>
          <input
            type="text"
            id="paper_search"
            className={classNames("txt-search")}
            placeholder="Paste YTB url here.."
            onChange={this.handleUrlChange}
            onFocus={() => this.setState({})}
            onBlur={this.onBlur}
            value={this.state.url}
          />
          <Divider className={classes.divider} />
          <div style={{ margin: "0 0.85em" }}>
            {checkingStatus === CHECK_IDLE ? (
              <ArrowForwardIcon style={{ color: "cornflowerblue" }} />
            ) : checkingStatus === CHECK_LOADING ? (
              <CircularProgress size={24} />
            ) : checkingStatus === CHECK_ERROR ? (
              <CloseIcon style={{ color: "red" }} />
            ) : checkingStatus === CHECK_VALID ? (
              <CheckIcon style={{ color: "limegreen" }} />
            ) : null}
          </div>
        </Paper>
        <div
          style={{
            "-webkit-transform": "translateY(-60%)",
            transform: "translateY(-60%)"
          }}
        >
          {urlError &&
            (urlError.type === "plain" ? (
              <Typography
                variant="subtitle1"
                align="center"
                style={{ color: "red" }}
              >
                {urlError.message}
              </Typography>
            ) : urlError.type === "retry" ? (
              <Typography
                variant="subtitle1"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "red"
                }}
              >
                Network error! Please{" "}
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  style={{ marginLeft: "0.5em" }}
                  onClick={() => this.validateUrl(url)}
                >
                  Retry
                </Button>
              </Typography>
            ) : null)}
        </div>
        {/* {animIndex === 1 && (
          <Typography variant="subtitle1" align="center">
            D
          </Typography>
        )} */}
      </div>
    );
  }
}

export default withStyles(styles)(SearchBarIndex);
