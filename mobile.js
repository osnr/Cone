async function runMobile() {
  let apriltag;
  await new Promise(resolve => {
    apriltag = new Apriltag(() => { resolve(); });
  });
  apriltag.set_return_pose(1);
  console.log("AprilTag detector ready.");

  // Got these by printing `currentFrame.camera.intrinsics` inside an ARKit app.
  const intrinsics = [
    [1582.8649, 0.0, 0.0],
    [0.0, 1582.8649, 0.0],
    [936.13824, 716.9852, 1.0]
  ];
  const fx = intrinsics[0][0];
  const fy = intrinsics[1][1];
  const cx = intrinsics[0][2];
  const cy = intrinsics[1][2];
  apriltag.set_camera_info(fx, fy, cx, cy);

  // The object points are always the same (since the QR code is
  // always in the same place).
  const laptopAprilTagSize = 0.053975; // 2.125in (height of credit card) in meters
  apriltag.set_tag_size(5, laptopAprilTagSize);

  const video = document.createElement("video");
  document.body.appendChild(video);
  video.setAttribute('autoplay', '');
  video.setAttribute('muted', '');
  video.setAttribute('playsinline', '');
  const videoInitialized = navigator.mediaDevices.getUserMedia({
    video: { facingMode: 'environment' },
    audio: false
  }).then(function(stream) {
    video.srcObject = stream;
    // video.play();
  }).catch(function(err) {
    console.log("An error occurred! " + err);
  });
  await new Promise(resolve => {
    video.addEventListener("loadeddata", () => {
      resolve();
    });
  });

  /////////////  /////////////  /////////////  /////////////  /////////////

  // TODO: process video
  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);

  async function processFrame() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    let ctx = canvas.getContext("2d");

    let imageData;
    try {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    } catch (err) {
      console.log("Failed to get video frame. Video not started ?");
      setTimeout(processFrame, 500); // try again in 0.5 s
      return;
    }
    let imageDataPixels = imageData.data;
    let grayscalePixels = new Uint8Array(ctx.canvas.width * ctx.canvas.height); // this is the grayscale image we will pass to the detector

    for (var i = 0, j = 0; i < imageDataPixels.length; i += 4, j++) {
      let grayscale = Math.round((imageDataPixels[i] + imageDataPixels[i + 1] + imageDataPixels[i + 2]) / 3);
      grayscalePixels[j] = grayscale; // single grayscale value
      imageDataPixels[i] = grayscale;
      imageDataPixels[i + 1] = grayscale;
      imageDataPixels[i + 2] = grayscale;
    }
    ctx.putImageData(imageData, 0, 0);

    detections = await apriltag.detect(grayscalePixels, ctx.canvas.width, ctx.canvas.height);
    for (const det of detections) {
      if (det.id === 5) {
        window.send(JSON.stringify(det.pose));
      }
    }

    window.requestAnimationFrame(processFrame);
  }
  window.requestAnimationFrame(processFrame);
  
  /////////////  /////////////  /////////////  /////////////  /////////////
  
  // WebSocket
  var socket = new WebSocket("wss://" + window.location.host + "/wsMobile");
  window.send = (pose) => {};
  socket.onopen = function () {
    window.send = (pose) => { socket.send(pose); };
    //      output.innerHTML += "Status: Connected\n";
  };
  socket.onmessage = function (e) {
    //      output.innerHTML += "\nServer: " + e.data + "\n";
  };
  // TODO: Get accelerometer

  // Dynamic calibration (best fit)
}
