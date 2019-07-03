import React, { Component } from "react";
import { Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

import MP4Logo from "../../res/mp4.svg";
import MP3Logo from "../../res/mp3.svg";

const styles = theme => ({
  button: {
    fontFamily: "Nexa",
    fontWeight: "bold",
    fontSize: "1rem",
    textTransform: "none"
  },
  logo: { marginRight: "0.5em", height: "28px" }
});

class ChimButton extends Component {
  render() {
    const { classes, type, label, href, style } = this.props;

    return (
      <Button
        color="primary"
        variant="contained"
        href={href}
        style={style}
        className={classes.button}
      >
        <img
          src={type == "audio" ? MP3Logo : MP4Logo}
          alt=""
          className={classes.logo}
        />{" "}
        {label}
      </Button>
    );
  }
}

export default withStyles(styles)(ChimButton);
