function runLaptop() {
  const output =   document.getElementById("out");
  document.getElementById("out").innerText = "LAPTOP";

  if (window.location.protocol !== "https:") {
    document.getElementById("out").innerText = "Error: should be on HTTPS";
    throw new Exception();
  }
  var socket = new WebSocket("wss://" + window.location.host + "/wsLaptop");
  // On laptop:
  // TODO: Generate QR code of self? Check if https
  // TODO: Allow specifying physical size of QR code
  socket.onopen = function () {
    console.log("Connected");
  };
  socket.onmessage = function (e) {
    console.log("Got message", e.data);
    output.innerHTML += "\nServer: " + e.data + "\n";
  };

  // QR code. Just to make it easy for ppl to visit rn.
  const qrcodeEl = document.createElement("div");
  document.body.appendChild(qrcodeEl);
  const qrcode = new QRCode(qrcodeEl, window.location.href);
  
  // Display AprilTag
  const apriltagEl = document.createElement("img");
  document.body.appendChild(apriltagEl);
  // 338px experimentally is 2.125in (height of credit card) on my laptop.
  apriltagEl.width = 338; apriltagEl.height = 338;
  apriltagEl.style.imageRendering = "crisp-edges";
  apriltagEl.src = "vendor/tag36_11_00005.png";
}
