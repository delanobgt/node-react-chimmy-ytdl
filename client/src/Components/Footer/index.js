import React from "react";
import classNames from "classnames";
import {
  withStyles,
  Grid,
  Tooltip,
  Typography,
  IconButton,
  Hidden,
  SvgIcon
} from "@material-ui/core";
import { Help as HelpIcon } from "@material-ui/icons";

import ManualDialog from "./dialogs/ManualDialog";
import QRScannerSvg from "../../res/qrcode-scan.svg";

const QRScannerIcon = props => (
  <SvgIcon {...props}>
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
      <path d="M4 4h6v6H4V4m16 0v6h-6V4h6m-6 11h2v-2h-2v-2h2v2h2v-2h2v2h-2v2h2v3h-2v2h-2v-2h-3v2h-2v-4h3v-1m2 0v3h2v-3h-2M4 20v-6h6v6H4M6 6v2h2V6H6m10 0v2h2V6h-2M6 16v2h2v-2H6m-2-5h2v2H4v-2m5 0h4v4h-2v-2H9v-2m2-5h2v4h-2V6M2 2v4H0V2a2 2 0 0 1 2-2h4v2H2m20-2a2 2 0 0 1 2 2v4h-2V2h-4V0h4M2 18v4h4v2H2a2 2 0 0 1-2-2v-4h2m20 4v-4h2v4a2 2 0 0 1-2 2h-4v-2h4z" />
    </svg>
  </SvgIcon>
);

const styles = theme => ({
  wrapper: {
    width: "100vw"
  },
  container: {
    padding: "0.2em 0",
    backgroundColor: "white"
  },
  paper: {},
  socialIcon: {
    marginLeft: "1em",
    color: "darkgray"
  }
});

class FooterIndex extends React.Component {
  state = {};

  toggleDialog = stateName => open =>
    console.log(stateName, open) ||
    this.setState(state => ({
      [stateName]: open === undefined ? !Boolean(state[stateName]) : open
    }));

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.wrapper}>
        <Grid
          container
          alignItems="center"
          justify="flex-end"
          className={classes.container}
        >
          <Hidden xsDown>
            <Grid item xs={4}>
              <i
                className={classNames(
                  "fab",
                  "fa-twitter",
                  "fa-lg",
                  classes.socialIcon
                )}
              />
              <i
                className={classNames(
                  "fab",
                  "fa-facebook",
                  "fa-lg",
                  classes.socialIcon
                )}
              />
              <i
                className={classNames(
                  "fab",
                  "fa-instagram",
                  "fa-lg",
                  classes.socialIcon
                )}
              />
            </Grid>
            <Grid item xs={4}>
              <Typography
                variant="subtitle1"
                align="center"
                style={{ color: "darkgray" }}
              >
                Made with{" "}
                <i
                  className="fas fa-heart"
                  style={{ color: "red", opacity: 0.7 }}
                />{" "}
                in Medan
              </Typography>
            </Grid>
            <Grid item xs={4} style={{ textAlign: "right" }}>
              <Tooltip title="Scan a QR Code" placement="top">
                <IconButton
                  onClick={() => this.toggleDialog("ManualDialog")(true)}
                  // style={{ marginRight: "1em" }}
                >
                  <QRScannerIcon style={{ color: "silver" }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="How to use" placement="top">
                <IconButton
                  onClick={() => this.toggleDialog("ManualDialog")(true)}
                  style={{ marginRight: "0.5em" }}
                >
                  <HelpIcon style={{ color: "silver" }} />
                </IconButton>
              </Tooltip>
            </Grid>
          </Hidden>

          <Hidden smUp>
            <Grid item xs={8}>
              <i
                className={classNames(
                  "fab",
                  "fa-twitter",
                  "fa-lg",
                  classes.socialIcon
                )}
              />
              <i
                className={classNames(
                  "fab",
                  "fa-facebook",
                  "fa-lg",
                  classes.socialIcon
                )}
              />
              <i
                className={classNames(
                  "fab",
                  "fa-instagram",
                  "fa-lg",
                  classes.socialIcon
                )}
              />
            </Grid>
            <Grid item xs={4} style={{ textAlign: "right" }}>
              <Tooltip title="Scan a QR Code" placement="top">
                <IconButton
                  onClick={() => this.toggleDialog("ManualDialog")(true)}
                  // style={{ marginRight: "1em" }}
                >
                  <QRScannerIcon style={{ color: "silver" }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="How to use" placement="top">
                <IconButton
                  onClick={() => this.toggleDialog("ManualDialog")(true)}
                  style={{ marginRight: "1em" }}
                >
                  <HelpIcon style={{ color: "silver" }} />
                </IconButton>
              </Tooltip>
            </Grid>
          </Hidden>
        </Grid>
        <ManualDialog
          name="ManualDialog"
          state={this.state}
          toggleDialog={this.toggleDialog}
        />
      </div>
    );
  }
}

export default withStyles(styles)(FooterIndex);
