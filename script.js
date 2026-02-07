/* ======================================================
   DATA SOURCE (MUDAH DITAMBAH TANPA UBAH LOGIC)
====================================================== */

const PASSWORD = "ourlovestory"; // ganti password di sini

const SPECIAL_DATES = {
  birthday: { month: 7, day: 15, message: "Happy Birthday, My Love 🎂" },
  anniversary: { month: 3, day: 20, message: "Happy Anniversary 💍" }
};

const photos = [
  { src: "media/photos/1.jpg", caption: "Hari pertama kita" },
  { src: "media/photos/2.jpg", caption: "Kenangan tak terlupakan" }
];

const videos = [
  {
    src: "media/videos/1.mp4",
    thumbnail: "media/thumbs/1.jpg",
    title: "Moment Special"
  }
];

const audios = [
  { src: "media/audio/1.mp3", title: "Romantic Night", mood: "romantis" },
  { src: "media/audio/2.mp3", title: "Calm Heart", mood: "tenang" }
];

const timeline = [
  {
    date: "2023-05-01",
    title: "First Meet",
    description: "Hari pertama kita bertemu",
    image: "media/timeline/1.jpg"
  }
];

/* ======================================================
   UTILITIES
====================================================== */

const $ = (id) => document.getElementById(id);
const create = (tag, cls) => {
  const el = document.createElement(tag);
  if (cls) el.className = cls;
  return el;
};

/* ======================================================
   PASSWORD PAGE
====================================================== */

(function passwordGate() {
  const input = $("passwordInput");
  const btn = $("passwordBtn");
  const gate = $("passwordPage");
  const content = $("mainContent");

  btn?.addEventListener("click", () => {
    if (input.value === PASSWORD) {
      gate.classList.add("fade-out");
      setTimeout(() => {
        gate.style.display = "none";
        content.classList.add("fade-in");
      }, 800);
    } else {
      gate.classList.add("shake");
      setTimeout(() => gate.classList.remove("shake"), 500);
    }
  });
})();

/* ======================================================
   DAY / NIGHT MODE
====================================================== */

(function themeToggle() {
  const toggle = $("themeToggle");
  const saved = localStorage.getItem("theme");

  if (saved) document.body.dataset.theme = saved;

  toggle?.addEventListener("click", () => {
    const theme = document.body.dataset.theme === "night" ? "day" : "night";
    document.body.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  });
})();

/* ======================================================
   SPECIAL DATE DETECTION
====================================================== */

(function specialDay() {
  const today = new Date();
  const banner = $("specialBanner");

  Object.values(SPECIAL_DATES).forEach((d) => {
    if (today.getMonth() + 1 === d.month && today.getDate() === d.day) {
      banner.textContent = d.message;
      banner.classList.add("show");
    }
  });
})();

/* ======================================================
   PHOTO GALLERY (LAZY + BATCH LOAD)
====================================================== */

(function photoGallery() {
  const container = $("photoGallery");
  if (!container) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const img = e.target;
          img.src = img.dataset.src;
          observer.unobserve(img);
        }
      });
    },
    { rootMargin: "200px" }
  );

  photos.forEach((p) => {
    const wrap = create("div", "photo-item");
    const img = create("img");
    img.dataset.src = p.src;
    img.alt = p.caption;

    const cap = create("p");
    cap.textContent = p.caption;

    wrap.append(img, cap);
    container.appendChild(wrap);
    observer.observe(img);
  });
})();

/* ======================================================
   VIDEO GALLERY (CINEMATIC)
====================================================== */

(function videoGallery() {
  const list = $("videoList");
  const player = $("videoPlayer");
  if (!list || !player) return;

  videos.forEach((v) => {
    const item = create("div", "video-thumb");
    item.style.backgroundImage = `url(${v.thumbnail})`;
    item.textContent = v.title;

    item.addEventListener("click", () => {
      player.pause();
      player.src = v.src;
      player.load();
    });

    list.appendChild(item);
  });
})();

/* ======================================================
   MUSIC PLAYER ADVANCED
====================================================== */

(function musicPlayer() {
  const audio = $("audioPlayer");
  const title = $("audioTitle");
  let index = 0;
  let currentMood = null;

  function filteredList() {
    return currentMood
      ? audios.filter((a) => a.mood === currentMood)
      : audios;
  }

  function load(i) {
    const list = filteredList();
    if (!list[i]) return;
    audio.src = list[i].src;
    title.textContent = list[i].title;
    audio.load();
  }

  $("playBtn")?.addEventListener("click", () => audio.play());
  $("pauseBtn")?.addEventListener("click", () => audio.pause());

  $("nextBtn")?.addEventListener("click", () => {
    index = (index + 1) % filteredList().length;
    load(index);
  });

  $("prevBtn")?.addEventListener("click", () => {
    index = (index - 1 + filteredList().length) % filteredList().length;
    load(index);
  });

  document.querySelectorAll("[data-mood]").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentMood = btn.dataset.mood;
      index = 0;
      load(index);
    });
  });

  load(index);
})();

/* ======================================================
   LOVE LETTER (SCROLL ANIMATION)
====================================================== */

(function loveLetter() {
  const letters = document.querySelectorAll(".love-line");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("show");
      }
    });
  });

  letters.forEach((l) => observer.observe(l));
})();

/* ======================================================
   TIMELINE INTERAKTIF
====================================================== */

(function timelineRender() {
  const container = $("timeline");
  if (!container) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("show");
    });
  });

  timeline.forEach((t) => {
    const item = create("div", "timeline-item");
    item.innerHTML = `
      <h3>${t.title}</h3>
      <span>${t.date}</span>
      <p>${t.description}</p>
      <img data-src="${t.image}">
    `;
    container.appendChild(item);

    const img = item.querySelector("img");
    observer.observe(item);
    observer.observe(img);
    img.src = img.dataset.src;
  });
})();
