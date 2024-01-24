const imagesArray = [];
const url = window.location.href;
const isYouTubeVideo = url.includes("youtube.com/watch");
const isYouTubeSearch = url.includes("https://www.youtube.com/results");

for (let i = 1; i <= 28; i++) {
  imagesArray.push(`${i}.png`);
}

function getRandomImage() {
  const index = Math.floor(Math.random() * imagesArray.length);
  return chrome.runtime.getURL(`./images/` + imagesArray[index]);
}

function addOverlay() {
  const thumbnails = document.querySelectorAll(
    "ytd-thumbnail:not(.overlay-added, .ytd-video-preview, .ytd-rich-grid-slim-media, .ytd-reel-item-renderer)"
  );

  const duration = document.querySelectorAll(
    "ytd-thumbnail-overlay-time-status-renderer"
  );

  thumbnails.forEach((thumbnail) => {
    const videoLink = thumbnail.querySelector("a").href;

    const link = document.createElement("a");
    link.href = videoLink;
    link.style.position = "absolute";
    link.style.top = "0";
    link.style.left = "0";
    link.style.width = "100%";
    link.style.height = "100%";
    link.style.zIndex = "10";

    const overlay = document.createElement("img");
    overlay.src = getRandomImage();
    overlay.classList.add("my-overlay");
    overlay.style.position = "absolute";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.zIndex = "10";
    overlay.style.transition = "opacity 0.3s";

    if (Math.random() > 0.5) {
      overlay.style.transform = "scaleX(-1)";
    }

    link.appendChild(overlay);
    thumbnail.appendChild(link);

    thumbnail.style.position = "relative";

    thumbnail.classList.add("overlay-added"); // Mark the thumbnail so it doesn't get multiple overlays

    if (
      !thumbnail.parentElement.parentElement.parentElement.classList.contains(
        "miniplayer"
      )
    ) {
      if (isYouTubeVideo) {
        if (
          thumbnail.parentElement.nodeName !=
            "YTD-STRUCTURED-DESCRIPTION-VIDEO-LOCKUP-RENDERER" &&
          thumbnail.parentElement.querySelector(".details")
        ) {
          thumbnail.parentElement
            .querySelector(".details")
            .addEventListener("mouseenter", () => {
              overlay.style.opacity = "0";
            });

          thumbnail.parentElement
            .querySelector(".details")
            .addEventListener("mouseleave", () => {
              overlay.style.opacity = "1";
            });
        }
      } else if (isYouTubeSearch) {
        document
          .querySelector("ytd-video-renderer")
          .addEventListener("mouseeneter", () => {
            overlay.style.opacity = "0";
          });
        document
          .querySelector("ytd-video-renderer")
          .addEventListener("mouseleave", () => {
            overlay.style.opacity = "1";
          });
      } else if (
        thumbnail.parentElement.parentElement.parentElement.querySelector(
          "#dismissible"
        )
      ) {
        thumbnail.parentElement.parentElement.parentElement
          .querySelector("#dismissible")
          .addEventListener("mouseenter", () => {
            overlay.style.opacity = "0";
          });

        thumbnail.parentElement.parentElement.parentElement
          .querySelector("#dismissible")
          .addEventListener("mouseleave", () => {
            overlay.style.opacity = "1";
          });
      }
    }

    thumbnail.addEventListener("mouseenter", () => {
      overlay.style.opacity = "0";
    });
    thumbnail.addEventListener("mouseleave", () => {
      overlay.style.opacity = "1";
    });
  });

  duration.forEach((durationTime) => {
    durationTime.style.position = "absolute";
    durationTime.style.zIndex = "15";
  });
}

// Check when the DOM is fully loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", addOverlay);
} else {
  addOverlay();
}

// This will re-apply overlays when new content is loaded without refreshing the page
setInterval(addOverlay, 100);
