const API_ENDPOINT = "https://are-na-screenshotter.vercel.app/api/upload";

document.addEventListener("DOMContentLoaded", function () {
  const captureButton = document.getElementById("capture");
  const screenshotContainer = document.getElementById("screenshotContainer");

  captureButton.addEventListener("click", function () {
    chrome.tabs.captureVisibleTab(function (screenshotDataUrl) {
      const screenshotImage = new Image();

      screenshotImage.src = screenshotDataUrl;

      const imgTag = screenshotContainer.appendChild(screenshotImage);

      fetch(API_ENDPOINT, {
        method: "POST",
        body: JSON.stringify({ foo: "barrrr" }),
      }).then((response) => {
        console.log(res);
      });

      imgTag.style.display = "block";
      imgTag.style.width = "100%";
    });
  });
});
