function runMobile() {
  const video = document.createElement("video");
  document.body.appendChild(video);
  const qrScanner = new QrScanner(video,
                                  result => console.log('decoded qr code:', result));
  qrScanner.start();
  // 
  // 
  //   
  //   async function getCamera() {
  //     // Prefer camera resolution nearest to 1280x720 - just as calibdb does
  //     let constraints = { audio: false, video: { width: 1280, height: 720, facingMode: "environment", resizeMode: "none" } }
  // 
  //     let mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
  //     const track = mediaStream.getVideoTracks()[0]
  //     const cfg = track.getSettings()
  // 
  //     return [track.label, [cfg.width, cfg.height]]
  //   }
  //   getCamera().then(args => {
  //     document.getElementById("out").innerText = JSON.stringify(args);
  //   });

  // Run QR code detector, localize-ish, produce cone
  

  // Get accelerometer

  // TODO: Connect websocket
  // - on phone

  // Dynamic calibration
}
