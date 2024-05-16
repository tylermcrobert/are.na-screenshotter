/* global chrome */

const IS_LOCAL = true;
const PREVIEW_URL = IS_LOCAL
  ? "http://localhost:3000/preview"
  : "https://viewport.gallery/preview";

const html = `<style>
  #swipe-root {
    display: none;
  }

  #swipe-root.-open {
    display: block;
  }

  #swipe-root * {
    box-sizing: border-box;
  }

  .swipe__layout {
    display: none;
    font-family: helvetica;
    font-size: 16px;
    position: fixed;
    z-index: 9999999999999999999999;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .swipe__background {
    position: fixed;
    z-index: 0;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.2);
  }

  .swipe__window {
    background: white;
    border-radius: 0.4rem;
    position: relative;
    z-index: 10;
    box-shadow: 0 0 50px rgba(0, 0, 0, 0.3);
    width: 100%;
    max-width: 45em;
    overflow: hidden;
  }

  #swipe-root .-visible {
    display: block;
  }

  iframe {
    width: 100%;
    height: 500px;
    max-height:95vh;
    border: 0;
    display: block;
  }
</style>

<div id="swipe-root" class="swipe">
  <div class="swipe__layout">
    <div class="swipe__background"></div>
    <div class="swipe__window">
      <div class="swipe__close">(x)</div>
      <iframe id="swipe__frame" src="${PREVIEW_URL}"></iframe>
    </div>
  </div>
</div>
`;

class ContentController {
  init() {
    document.body.insertAdjacentHTML("beforeend", html);
    this.cacheDom();
    this.bindListeners();
  }

  cacheDom() {
    this.$root = document.querySelector("#swipe-root");
    this.$close = document.querySelector(".swipe__close");
    this.$background = document.querySelector(".swipe__background");
    // TODO: Mount after click
    this.$iframe = document.querySelector("#swipe__frame");
  }

  getMetaData() {
    let description = null;
    const metaTag = document.querySelector('meta[name="description"]');

    if (metaTag) {
      description = metaTag.content;
    }

    return {
      link: window.location.href,
      title: document.title,
      description,
    };
  }

  closeWindow() {
    this.$root.classList.remove("-open");
  }

  openWindow() {
    this.$root.classList.add("-open");
  }

  sendMessage = (src) => {
    // timeout is janky but works
    // TODO: find another fix
    setTimeout(() => {
      this.$iframe.contentWindow.postMessage(
        {
          type: "SWIPE_MESSAGE",
          src,
          ...this.getMetaData(),
        },
        "*"
      );
    }, 100);
  };

  handleMessage(request, sender, sendResponse) {
    switch (request.action) {
      case "OPEN_DIALOG":
        this.openWindow();
        this.sendMessage(request.payload.uri);
        sendResponse({ message: "opening dialog" });
        break;
      default:
        break;
    }
  }

  bindListeners() {
    // close window
    this.$close.addEventListener("click", () => this.closeWindow());
    this.$background.addEventListener("click", () => this.closeWindow());

    // chrome messages
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) =>
      this.handleMessage(request, sender, sendResponse)
    );
  }
}

new ContentController().init();
