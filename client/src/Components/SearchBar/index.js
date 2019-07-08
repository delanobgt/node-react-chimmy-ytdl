import "./style.css";
import React, { Fragment } from "react";
import queryString from "query-string";
import classNames from "classnames";
import {
  withStyles,
  Paper,
  Grid,
  CircularProgress,
  Typography,
  Button,
  Divider,
  IconButton
} from "@material-ui/core";
import {
  ArrowForward as ArrowForwardIcon,
  Check as CheckIcon,
  Close as CloseIcon
} from "@material-ui/icons";
import * as youtubeApi from "../../apis/youtube";
import { Help as HelpIcon } from "@material-ui/icons";
import { validate } from "@babel/types";

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

  componentDidMount() {
    const parsed = queryString.parse(window.location.search);
    console.log({ parsed });
    if (parsed.videoUrl) {
      this.handleUrlChange({ target: { value: parsed.videoUrl } });
    }
  }

  handleUrlChange = e => {
    const url = String(e.target.value || "").trim();

    this.setState({ url });

    if (url) {
      if (this.timeoutMethod) clearTimeout(this.timeoutMethod);
      this.timeoutMethod = setTimeout(() => this.validateUrl(url), 500);
    }
  };

  handleFormSubmit = e => {
    e.preventDefault();
    const { url } = this.state;
    if (!url) return;
    this.validateUrl(url);
  };

  handleFormClick = () => {
    const { url } = this.state;
    if (!url) return;
    this.validateUrl(url);
  };

  validateUrl = async url => {
    const { onUrlFixed } = this.props;

    this.setState({ urlError: null, checkingStatus: CHECK_LOADING });
    try {
      const { valid } = await youtubeApi.validateUrl(url);
      if (valid) {
        this.setState({ fixedUrl: url, checkingStatus: CHECK_VALID });
        if (onUrlFixed) onUrlFixed(url);
        this.loadUrl(url);
      } else {
        this.setState({
          urlError: {
            type: "plain",
            message: "Invalid url. Make sure you copy the whole url."
          },
          checkingStatus: CHECK_ERROR
        });
      }
    } catch (error) {
      console.log({ error });
      this.setState({
        urlError: {
          type: "plain",
          message: "Network error. PLease try again."
        },
        checkingStatus: CHECK_ERROR
      });
    }
  };

  loadUrl = async url => {
    const {
      onStartLoadingUrl,
      onFinishLoadingUrl,
      onErrorLoadingUrl
    } = this.props;

    try {
      if (onStartLoadingUrl) onStartLoadingUrl(url);
      const basicInfo = await youtubeApi.getBasicInfo(url);
      if (onFinishLoadingUrl) onFinishLoadingUrl(url, basicInfo);
      this.setState({ checkingStatus: CHECK_IDLE });
    } catch (error) {
      console.log({ error });
      if (onErrorLoadingUrl) onErrorLoadingUrl(url);
      this.setState({ checkingStatus: CHECK_IDLE });
    }
  };

  onBlur = () => {};

  handleReset = () => {
    this.setState({ url: "", fixedUrl: null, urlError: null });
  };

  render() {
    const { classes } = this.props;
    const { urlError, url, checkingStatus, urlFixed } = this.state;

    return (
      <div className="main-wrapper">
        <Paper className={classNames("paper-search")} elevation={3}>
          <form onSubmit={this.handleFormSubmit} style={{ width: "100%" }}>
            <input
              type="text"
              id="paper_search"
              className={classNames("txt-search")}
              placeholder="Paste YTB url here.."
              onChange={this.handleUrlChange}
              onFocus={() => this.setState({})}
              onBlur={this.onBlur}
              value={this.state.url}
              disabled={
                checkingStatus === CHECK_LOADING ||
                checkingStatus === CHECK_VALID
              }
            />
          </form>
          <div>
            <IconButton
              onClick={this.handleReset}
              size="small"
              disabled={
                checkingStatus === CHECK_LOADING ||
                checkingStatus === CHECK_VALID
              }
            >
              <CloseIcon style={{ color: "lightgray", margin: "0" }} />
            </IconButton>
          </div>
          <Divider className={classes.divider} />
          <div>
            {checkingStatus === CHECK_IDLE ? (
              <IconButton
                onClick={this.handleFormClick}
                style={{ margin: "0 0.25em" }}
              >
                <ArrowForwardIcon style={{ color: "cornflowerblue" }} />
              </IconButton>
            ) : checkingStatus === CHECK_LOADING ? (
              <CircularProgress size={22} style={{ margin: "0 1.2em" }} />
            ) : checkingStatus === CHECK_ERROR ? (
              <CloseIcon style={{ color: "red", margin: "0 0.75em" }} />
            ) : checkingStatus === CHECK_VALID ? (
              <CheckIcon style={{ color: "limegreen", margin: "0 0.75em" }} />
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
