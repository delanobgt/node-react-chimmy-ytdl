import React, { Component } from "react";
import { Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

import MP4Logo from "../../res/mp4.svg";
import MP3Logo from "../../res/mp3.svg";
import OGGLogo from "../../res/ogg.png";
import FLACLogo from "../../res/flac.svg";
import WAVLogo from "../../res/wav.png";

const styles = theme => ({
  button: {
    fontFamily: "Nexa",
    fontWeight: "bold",
    fontSize: "1rem",
    textTransform: "none"
  },
  logo: { marginRight: "0.5em", height: "28px" }
});

const audioLogos = {
  mp3: MP3Logo,
  ogg: OGGLogo,
  flac: FLACLogo,
  wav: WAVLogo
};

class ChimButton extends Component {
  render() {
    const { classes, type, label, href, style, onClick, format } = this.props;

    return (
      <Button
        onClick={onClick}
        color="primary"
        variant="contained"
        href={href}
        style={style}
        className={classes.button}
        download="download"
      >
        <img
          src={type == "audio" ? audioLogos[format] : MP4Logo}
          alt=""
          className={classes.logo}
        />{" "}
        {label}
      </Button>
    );
  }
}

export default withStyles(styles)(ChimButton);
