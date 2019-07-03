import _ from "lodash";
import React from "react";
import {
  withStyles,
  Paper,
  Typography,
  Button,
  Hidden,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Tab,
  Tabs,
  FilledInput,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Tooltip,
  IconButton,
  SvgIcon
} from "@material-ui/core";
import {
  ExpandMore as ExpandMoreIcon,
  Share as ShareIcon
} from "@material-ui/icons";
import queryString from "query-string";

import ChimButton from "../../misc/ChimButton";

const styles = theme => ({
  info: {
    padding: "1em"
  },
  formControl: {
    width: "150px"
  }
});

const videoFormats = ["mp4", "m4v", "mov", "flv", "avi", "mpg", "wmv"];
const audioFormats = ["mp3", "ogg", "flac", "wav"];

const QRCodeIcon = props => (
  <SvgIcon {...props}>
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
      <path d="M3 11h2v2H3v-2m8-6h2v4h-2V5m-2 6h4v4h-2v-2H9v-2m6 0h2v2h2v-2h2v2h-2v2h2v4h-2v2h-2v-2h-4v2h-2v-4h4v-2h2v-2h-2v-2m4 8v-4h-2v4h2M15 3h6v6h-6V3m2 2v2h2V5h-2M3 3h6v6H3V3m2 2v2h2V5H5M3 15h6v6H3v-6m2 2v2h2v-2H5z" />
    </svg>
  </SvgIcon>
);

class VideoViewerIndex extends React.Component {
  state = { tabIndex: 0, videoFormat: "mp4" };

  handleTabChange = (event, tabIndex) => {
    this.setState({ tabIndex });
  };

  handleSelectChange = e => {
    this.setState({ videoFormat: e.target.value });
  };

  toggleDialog = stateName => open =>
    console.log(stateName, open) ||
    this.setState(state => ({
      [stateName]: open === undefined ? !Boolean(state[stateName]) : open
    }));

  render() {
    const { info, classes } = this.props;
    const { tabIndex, videoFormat } = this.state;

    const videoDownloadUrl = `${process.env.REACT_APP_YOUTUBE_API_BASE_URL ||
      window.location.origin}/youtube/download/video?${queryString.stringify({
      url: info.video_url,
      format: "mp4",
      q: "medium"
    })}`;

    const audioDownloadUrl = `${process.env.REACT_APP_YOUTUBE_API_BASE_URL ||
      window.location.origin}/youtube/download/audio?${queryString.stringify({
      url: info.video_url,
      format: "mp3"
    })}`;
    return (
      <div>
        <Paper elevation={2} className={classes.info}>
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            <Typography variant="h5" style={{ flex: 1 }}>
              {info.title}
            </Typography>
            <div>
              <Tooltip title="Show QR Code" placement="top">
                <IconButton
                  onClick={() => this.toggleDialog("ManualDialog")(true)}
                  // style={{ marginRight: "1em" }}
                >
                  <QRCodeIcon style={{ color: "" }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Share to a friend" placement="top">
                <IconButton
                  onClick={() => this.toggleDialog("ManualDialog")(true)}
                >
                  <ShareIcon style={{ color: "" }} />
                </IconButton>
              </Tooltip>
            </div>
          </div>
          <Typography variant="caption">
            Uploaded by{" "}
            <span style={{ color: "cornflowerblue" }}>{info.author.name}</span>
          </Typography>
          <div style={{ marginTop: "1.25em", marginBottom: "1em" }}>
            <Typography variant="caption" style={{ marginBottom: "0.5em" }}>
              Recommended format
            </Typography>
            <br />
            <ChimButton href={videoDownloadUrl} type="video" label="360p" />
            <ChimButton
              href={audioDownloadUrl}
              style={{ marginLeft: "1em" }}
              type="audio"
              label="128kbps"
            />
          </div>
        </Paper>

        <ExpansionPanel>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography variant="h6">More formats</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
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
                  <Tab label={"Video"} />
                  <Tab label={"Audio"} />
                </Tabs>
              </Paper>
              <div style={{ margin: "1em 0" }}>
                {tabIndex === 0 && (
                  <div>
                    <FormControl
                      variant="filled"
                      className={classes.formControl}
                    >
                      <InputLabel htmlFor="filled-age-simple">
                        Video Format
                      </InputLabel>
                      <Select
                        value={videoFormat}
                        onChange={this.handleSelectChange}
                        input={
                          <FilledInput name="age" id="filled-age-simple" />
                        }
                      >
                        {_.map(videoFormats, f => (
                          <MenuItem value={f}>{f}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <div>
                      {_.chain(info.formats)
                        .filter(f => f.quality_label)
                        .map(f => {
                          const videoDownloadUrl = `${process.env
                            .REACT_APP_YOUTUBE_API_BASE_URL ||
                            window.location
                              .origin}/youtube/download/video?${queryString.stringify(
                            {
                              url: info.video_url,
                              format: videoFormat,
                              q: f.quality_label
                            }
                          )}`;
                          return (
                            <ChimButton
                              style={{ marginRight: "1em", marginTop: "1em" }}
                              key={f.quality_label}
                              href={videoDownloadUrl}
                              type="video"
                              label={f.quality_label}
                            />
                          );
                        })
                        .value()}
                    </div>
                  </div>
                )}
                {tabIndex === 1 && (
                  <div>
                    {_.chain(audioFormats)
                      .map(f => {
                        const audioDownloadUrl = `${process.env
                          .REACT_APP_YOUTUBE_API_BASE_URL ||
                          window.location
                            .origin}/youtube/download/audio?${queryString.stringify(
                          {
                            url: info.video_url,
                            format: f
                          }
                        )}`;
                        return (
                          <ChimButton
                            style={{ marginRight: "1em", marginTop: "1em" }}
                            href={audioDownloadUrl}
                            key={f}
                            type="audio"
                            label={f}
                          />
                        );
                      })
                      .value()}
                  </div>
                )}
              </div>
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  }
}

export default withStyles(styles)(VideoViewerIndex);
