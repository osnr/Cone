function runMobile() {
  const intrinsics = [
    [1582.8649, 0.0, 0.0],
    [0.0, 1582.8649, 0.0],
    [936.13824, 716.9852, 1.0]
  ];

  const video = document.createElement("video");
  document.body.appendChild(video);
  const qrScanner = new QrScanner(video, result => {
    document.getElementById("out").innerText = JSON.stringify(result);

    window.send(JSON.stringify(result.cornerPoints));

    // TODO: do pose estimation, given physical size of tag, report that instead

  }, { returnDetailedScanResult: true });
  qrScanner.start();

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
