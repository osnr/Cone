function runLaptop() {
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
    //      output.innerHTML += "Status: Connected\n";
  };
  socket.onmessage = function (e) {
    //      output.innerHTML += "\nServer: " + e.data + "\n";
  };

  // Connect websocket



  // Generate QR code
  const qrcodeEl = document.createElement("div");
  document.body.appendChild(qrcodeEl);
  const qrcode = new QRCode(qrcodeEl, window.location.href);
}
