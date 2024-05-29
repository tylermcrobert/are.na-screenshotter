// const API_ENDPOINT = "https://are-na-screenshotter.vercel.app/api/upload";
const API_ENDPOINT_LOCAL = "http://localhost:5173/api/upload";

document.addEventListener("DOMContentLoaded", function () {
  const captureButton = document.getElementById("capture");
  const screenshotContainer = document.getElementById("screenshotContainer");

  captureButton.addEventListener("click", function () {
    chrome.tabs.captureVisibleTab(function (screenshotDataUrl) {
      const screenshotImage = new Image();

      screenshotImage.src = screenshotDataUrl;

      const imgTag = screenshotContainer.appendChild(screenshotImage);

      fetch(API_ENDPOINT_LOCAL, {
        method: "POST",
        body: JSON.stringify({ image: screenshotDataUrl }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data.data.publicUrl);
        });

      imgTag.style.display = "block";
      imgTag.style.width = "100%";
    });
  });
});
