function runLaptop() {
  window.phoneElements = {};
  window.phonePositions = {};

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
    // output.innerText = "LAPTOP Server: " + e.data + "\n";
    phonePositions = JSON.parse(e.data);
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
  // apriltagEl.style.imageRendering = "crisp-edges";
  apriltagEl.style.position = "absolute";
  apriltagEl.style.zIndex = 1000;
  apriltagEl.src = "vendor/tag36_11_00005_big.png";

  window.requestAnimationFrame(function frame() {
    for (const [key, position] of Object.entries(window.phonePositions)) {
      let el;
      if (key in window.phoneElements) {
        el = window.phoneElements[key];
      } else {
        el = document.createElement("div");
        el.style.position = "fixed";
        el.style.width = "100px";
        el.style.height = "100px";
        el.style.backgroundColor = "blue";
        el.style.top = 0;
        el.style.left = 0;
        document.body.appendChild(el);
        window.phoneElements[key] = el;
      }

      const x = 500 - position.t[0] * 1000;
      const y = 500 - position.t[1] * 1000;
      const scale = position.t[2] * 3;
      el.style.transform = `translate(${x}px,${y}px) scale(${scale})`;
    }

    window.requestAnimationFrame(frame);
  });
}
