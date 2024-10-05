// ---------------------- DATE ------------------

let date = new Date();
let convertedDates = [];

function lastSevenDays() {
  let today = Date.now();
  let dates = [];
  let millisecondsDay = 24 * 60 * 60 * 1000;

  for (let i = 0; i < 13; i++) {
    dates.push(today);
    today -= millisecondsDay;
  }
  dates.map((dateConv) => {
    let dateConverter = new Date(dateConv);
    let [year, month, day] = [
      dateConverter.getFullYear(),
      dateConverter.getMonth() + 1,
      dateConverter.getDate(),
    ];
    // let year = dateConverter.getFullYear();
    // let month = dateConverter.getMonth() + 1;
    // let day = dateConverter.getDate();

    convertedDates.push(`${year}-${month}-${day}`);
  });
}

lastSevenDays();

//------------------------- MAIN FUNCTIONS -------------------

const API_KEY = "hn8xoyKfSOK6a0h98N84xaD35i3dnqjMr65ginH8";
const APOD_URL = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&start_date=${convertedDates[12]}&end_date=${convertedDates[0]}`;

fetch(APOD_URL)
  .then((res) => res.json())
  .then((apodInfo) => apodImageUpdate(apodInfo));

function apodImageUpdate(apodInfo) {
  console.log(apodInfo);
  apodInfo.reverse();
  const apodImage = document.querySelector(".main-photo");

  let explanation = apodInfo[0].explanation;

  const maxLength = 200;
  let visibleText = explanation.substring(0, maxLength);
  let hiddenText =
    explanation.length > maxLength ? explanation.substring(maxLength) : "";

  if (apodInfo[0].media_type === "video") {
    apodImage.innerHTML = `
  <iframe id="apod-video" src="${apodInfo[0].url}" controls alt=""></iframe>
  <p class="photo-description">
    ${visibleText}<span id="moreText" class="hidden">${hiddenText}</span>
    ${hiddenText ? '<a href="#" id="toggleButton">More...</a>' : ""}
  </p>`;
  } else {
    apodImage.innerHTML = `
  <img id="apod-image" src="${apodInfo[0].hdurl}" alt="">
  <p class="photo-description">
    ${visibleText}<span id="moreText" class="hidden">${hiddenText}</span>
    ${hiddenText ? '<a href="#" id="toggleButton">More...</a>' : ""}
  </p>`;
  }

  if (hiddenText) {
    let toggleButton = document.getElementById("toggleButton");
    toggleButton.addEventListener("click", function (event) {
      event.preventDefault(); // Previene il comportamento predefinito del link
      let moreTextSpan = document.getElementById("moreText");

      if (moreTextSpan.classList.contains("hidden")) {
        moreTextSpan.classList.remove("hidden");
        toggleButton.textContent = "Hide...";
      } else {
        moreTextSpan.classList.add("hidden");
        toggleButton.textContent = "More...";
      }
    });
  }

  // GALLERY BUTTONS
  galleryButtonGenerator(apodInfo);
}

function galleryButtonGenerator(apodInfo) {
  const gallery = document.querySelector(".gallery");
  for (let i = 1; i < convertedDates.length; i++) {
    let mediaElement;
    if (apodInfo[i].media_type === "video") {
      mediaElement = `
          <button class="gallery-button" data-index="${i}">
              <iframe src="${apodInfo[i].url}" controls></iframe>
          </button>`;
    } else {
      mediaElement = `
          <button class="gallery-button" data-index="${i}">
            <img src="${apodInfo[i].url}" alt="">
          </button>`;
    }
    gallery.innerHTML += mediaElement;
  }
  addGalleryEventListeners(apodInfo);
}

// MODAL WINDOW

function addGalleryEventListeners(apodInfo) {
  const modal = document.getElementById("modal");
  const modalContent = document.getElementById("modal-content");
  const closeBtn = document.querySelector(".close");
  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");
  const galleryButtons = document.querySelectorAll(".gallery-button");
  let currentIndex;

  galleryButtons.forEach((button, index) => {
    button.addEventListener("click", function () {
      openModal(index);
    });
  });

  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", function (event) {
    if (event.target === modal) {
      closeModal();
    }
  });
  prevBtn.addEventListener("click", showPrevMedia);
  nextBtn.addEventListener("click", showNextMedia);

  window.addEventListener("keyup", (e) => {
    if (e.key === "ArrowRight" && currentIndex < galleryButtons.length) {
      showNextMedia();
    }
    if (e.key === "ArrowLeft" && currentIndex > 1) {
      showPrevMedia();
    }
  });

  function openModal(index) {
    currentIndex = index + 1;
    modal.style.display = "flex";
    updateModalContent(apodInfo[currentIndex]);
    updateNavigationButtons();
    document.body.classList.add("no-scroll");
  }

  function closeModal() {
    modal.style.display = "none";
    document.body.classList.remove("no-scroll");
  }

  function showPrevMedia() {
    currentIndex =
      currentIndex > 0 ? currentIndex - 1 : galleryButtons.length - 1;
    updateModalContent(apodInfo[currentIndex]);
    updateNavigationButtons();
  }

  function showNextMedia() {
    currentIndex = currentIndex < galleryButtons.length ? currentIndex + 1 : 0;
    updateModalContent(apodInfo[currentIndex]);
    updateNavigationButtons();
  }

  function updateModalContent(media) {
    if (media.media_type === "video") {
      modalContent.innerHTML = `<iframe src="${media.url}" controls></iframe>
                                <p class="photo-description">${apodInfo[currentIndex].explanation}</p>`;
    } else {
      modalContent.innerHTML = `<img src="${media.hdurl}" alt="">
                                <p class="photo-description">${apodInfo[currentIndex].explanation}</p>`;
    }
  }

  function updateNavigationButtons() {
    if (currentIndex === 1) {
      prevBtn.style.display = "none";
    } else {
      prevBtn.style.display = "block";
    }

    if (currentIndex === galleryButtons.length) {
      nextBtn.style.display = "none";
    } else {
      nextBtn.style.display = "block";
    }
  }
}
