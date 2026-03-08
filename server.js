const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/process", (req, res) => {
  const { videoUrl, clips } = req.body;

  exec(`yt-dlp -f mp4 -o video.mp4 ${videoUrl}`, (err) => {
    if (err) return res.status(500).send("Download failed");

    const results = [];

    clips.forEach((clip, i) => {
      const output = `clip_${i}.mp4`;

      exec(
        `ffmpeg -ss ${clip.start} -to ${clip.end} -i video.mp4 -c copy ${output}`,
        () => {}
      );

      results.push({
        url: `/clips/${output}`,
      });
    });

    res.json({ clips: results });
  });
});

app.use("/clips", express.static("."));

app.listen(3000, () => console.log("Clip worker running"));
