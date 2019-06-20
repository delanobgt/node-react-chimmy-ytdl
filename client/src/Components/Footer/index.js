import React from "react";
import classNames from "classnames";
import {
  withStyles,
  Grid,
  Tooltip,
  Typography,
  IconButton,
  Hidden
} from "@material-ui/core";
import { Help as HelpIcon } from "@material-ui/icons";

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
            <Grid
              item
              xs={4}
              style={{ textAlign: "right", paddingRight: "1em" }}
            >
              <Tooltip title="How to use" placement="top">
                <IconButton>
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
            <Grid
              item
              xs={4}
              style={{ textAlign: "right", paddingRight: "1em" }}
            >
              <Tooltip title="How to use" placement="top">
                <IconButton>
                  <HelpIcon style={{ color: "silver" }} />
                </IconButton>
              </Tooltip>
            </Grid>
          </Hidden>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(FooterIndex);
