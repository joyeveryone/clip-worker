const express = require("express");
const { exec } = require("child_process");
const path = require("path");

const app = express();
app.use(express.json());

/* Serve generated clips */
app.use("/clips", express.static(__dirname));

/* HEALTH CHECK (Railway needs this) */
app.get("/", (req, res) => {
  res.send("Clip worker running");
});

/* Clip creation API */
app.post("/api/clip", (req, res) => {
  const { videoUrl, startTime, endTime, clipId } = req.body;

  if (!videoUrl) {
    return res.status(400).send("Missing videoUrl");
  }

  const videoFile = "video.mp4";
  const output = `clip_${clipId}.mp4`;

  console.log("Downloading video...");

  exec(`yt-dlp -f mp4 -o ${videoFile} ${videoUrl}`, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Download failed");
    }

    console.log("Creating clip...");

    exec(
      `ffmpeg -ss ${startTime} -to ${endTime} -i ${videoFile} -c copy ${output}`,
      (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Clip creation failed");
        }

        res.json({
          status: "ready",
          fileUrl: `/clips/${output}`,
        });
      }
    );
  });
});

/* Railway dynamic port */
const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
