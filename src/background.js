/* global chrome */

class Background {
  init() {
    this.setupListeners();
  }

  async handleClick(tab) {
    const uri = await this.captureScreenshot();
    this.sendAction("OPEN_DIALOG", { uri });
    // TODO: DELETE ME
    const resp = await this.fetchApi(uri);
    this.sendAction("RECEIVED_DATA", resp);

    console.log(resp);
  }

  /**
   * Uploads to s3 via api
   */
  async fetchApi(dataURI) {
    return fetch("http://localhost:3000/api/image", {
      method: "POST",
      body: JSON.stringify({ image: dataURI }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .catch((err) => {
        console.log(err);
      });
  }

  /**
   * Uses chrome to capture screenshot
   */
  async captureScreenshot() {
    return new Promise((res) => {
      chrome.tabs.captureVisibleTab(
        null, // defaults to current window)
        { format: "jpeg" },
        (dataURI) => {
          res(dataURI);
        }
      );
    });
  }

  sendAction(action, payload) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: action, payload },
        (response) => {
          console.log(response);
        }
      );
    });
  }

  setupListeners() {
    chrome.browserAction.onClicked.addListener((tab) => this.handleClick(tab));
  }
}

const bg = new Background();
bg.init();
