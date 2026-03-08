app.post("/api/clip", (req, res) => {
  const { videoUrl, startTime, endTime, clipId } = req.body;

  const videoFile = "video.mp4";
  const output = `clip_${clipId}.mp4`;

  exec(`yt-dlp -f mp4 -o ${videoFile} ${videoUrl}`, (err) => {
    if (err) return res.status(500).send("Download failed");

    exec(
      `ffmpeg -ss ${startTime} -to ${endTime} -i ${videoFile} -c copy ${output}`,
      (err) => {
        if (err) return res.status(500).send("Clip creation failed");

        res.json({
          status: "ready",
          fileUrl: `/clips/${output}`,
        });
      }
    );
  });
});
