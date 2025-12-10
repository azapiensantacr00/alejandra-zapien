// open modal
const zyraTrigger = document.getElementById("zyra");
const zyraModal = document.getElementById("zyra-modal");
const racktracTrigger = document.getElementById("racktrack");
const racktracModal = document.getElementById("racktrack-modal");
const zineTrigger = document.getElementById("zine");
const zineModal = document.getElementById("zine-modal");
const backdrop = document.querySelector(".backdrop");
const zinebackdrop = document.getElementById("zine-backdrop");

zyraTrigger.addEventListener("click", () => {
  zyraModal.classList.toggle("open");
});
racktracTrigger.addEventListener("click", () => {
  racktracModal.classList.toggle("open");
});
zineTrigger.addEventListener("click", () => {
  zineModal.classList.toggle("open");
});

// close when clicking outside the card
backdrop.addEventListener("click", () => {
  zyraModal.classList.remove("open");
  racktracModal.classList.remove("open");
});
// zineModal.addEventListener("click", () => {
//   zineModal.classList.remove("open");
// });
class ControlledCarousel {
  constructor(root, options = {}) {
    this.root = root;
    this.options = options;

    this.viewport = root.querySelector(".carousel__viewport");
    this.track = root.querySelector(".carousel__track");
    this.slides = Array.from(root.querySelectorAll(".carousel__slide"));
    this.prevBtn = root.querySelector('[data-action="prev"]');
    this.nextBtn = root.querySelector('[data-action="next"]');
    this.dotsWrap = root.querySelector(".carousel__dots");

    this.state = {
      index: 0,
      slidesPerView: options.slidesPerView || 1,
    };

    this.readSlidesPerViewAttr();
    this.buildDots();
    this.bindEvents();
    this.observeResize();
    this.update();

    this.isReady = true;
  }

  readSlidesPerViewAttr() {
    const attr = parseInt(this.root.dataset.slidesPerView, 10);
    if (!Number.isNaN(attr) && attr > 0) {
      this.state.slidesPerView = attr;
    }
  }

  buildDots() {
    if (!this.dotsWrap) return;
    this.dotsWrap.innerHTML = "";

    this.dots = this.slides.map((_, i) => {
      const btn = document.createElement("button");
      btn.className = "carousel__dot";
      btn.type = "button";
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-label", `Go to slide ${i + 1}`);
      btn.addEventListener("click", () => this.goTo(i, "user"));
      this.dotsWrap.appendChild(btn);
      return btn;
    });
  }

  bindEvents() {
    this.prevBtn?.addEventListener("click", () => this.prev("user"));
    this.nextBtn?.addEventListener("click", () => this.next("user"));

    this.viewport?.addEventListener("keydown", (e) => {
      const key = e.key;
      if (key === "ArrowLeft") {
        e.preventDefault();
        this.prev("user");
      }
      if (key === "ArrowRight") {
        e.preventDefault();
        this.next("user");
      }
      if (key === "Home") {
        e.preventDefault();
        this.goTo(0, "user");
      }
      if (key === "End") {
        e.preventDefault();
        this.goTo(this.maxIndex(), "user");
      }
    });
  }

  observeResize() {
    if (!window.ResizeObserver) {
      window.addEventListener("resize", () => this.update());
      return;
    }
    this.ro = new ResizeObserver(() => this.update());
    this.ro.observe(this.viewport);
  }

  maxIndex() {
    return Math.max(0, this.slides.length - this.state.slidesPerView);
  }

  clampIndex(i) {
    return Math.min(Math.max(i, 0), this.maxIndex());
  }

  goTo(i, reason = "program") {
    const nextIndex = this.clampIndex(i);

    if (nextIndex === this.state.index && reason !== "init") return;

    this.state.index = nextIndex;
    this.update();

    if (this.isReady && reason === "user") {
      const activeSlide = this.slides[this.state.index];
      this.options.onIndexChange?.(this.state.index, activeSlide);
    }
  }

  next(reason) {
    this.goTo(this.state.index + 1, reason);
  }

  prev(reason) {
    this.goTo(this.state.index - 1, reason);
  }

  slideWidth() {
    const first = this.slides[0];
    if (!first) return 0;
    return first.getBoundingClientRect().width;
  }

  gapSize() {
    const styles = getComputedStyle(this.track);
    const gap = parseFloat(styles.columnGap || styles.gap || "0");
    return Number.isNaN(gap) ? 0 : gap;
  }

  updateTransform() {
    const w = this.slideWidth();
    const gap = this.gapSize();
    const x = (w + gap) * this.state.index;
    this.track.style.transform = `translateX(${-x}px)`;
  }

  updateButtons() {
    if (this.prevBtn) this.prevBtn.disabled = this.state.index <= 0;
    if (this.nextBtn)
      this.nextBtn.disabled = this.state.index >= this.maxIndex();
  }

  updateDots() {
    if (!this.dots) return;
    this.dots.forEach((d, i) => {
      const current = i === this.state.index;
      d.setAttribute("aria-current", current ? "true" : "false");
      d.setAttribute("tabindex", current ? "0" : "-1");
    });
  }

  updateAria() {
    const total = this.slides.length;
    const current = Math.min(this.state.index + 1, total);
    this.viewport?.setAttribute("aria-label", `Slide ${current} of ${total}`);
  }

  update() {
    this.readSlidesPerViewAttr();
    this.state.index = this.clampIndex(this.state.index);

    this.updateTransform();
    this.updateButtons();
    this.updateDots();
    this.updateAria();
  }
}

const carouselEl = document.getElementById("workCarousel");

const carousel = new ControlledCarousel(carouselEl, {
  onIndexChange: (index, slide) => {
    const targetSelector = slide?.dataset?.target;
    if (!targetSelector) return;

    const targetEl = document.querySelector(targetSelector);
    if (!targetEl) return;

    targetEl.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  },
});

// zine modal
const nextPage = document.getElementById("next-page");
const prevPage = document.getElementById("prev-page");

const page1 = document.getElementById("pg1");
const page2 = document.getElementById("pg2");
const page3 = document.getElementById("pg3");
const page4 = document.getElementById("pg4");
const page5 = document.getElementById("pg5");
const page6 = document.getElementById("pg6");
const page7 = document.getElementById("pg7");
const page8 = document.getElementById("pg8");
const page9 = document.getElementById("pg9");
const page10 = document.getElementById("pg10");
const page11 = document.getElementById("pg11");
const page12 = document.getElementById("pg12");
const page13 = document.getElementById("pg13");
const page14 = document.getElementById("pg14");

const pairs = [
  [page1, page2],
  [page3, page4],
  [page5, page6],
  [page7, page8],
  [page9, page10],
  [page11, page12],
  [page13, page14],
];

let currIdx = 0;

function flipPair(frontPage, backPage, delay = 500) {
  frontPage.classList.add("flip");
  setTimeout(() => {
    backPage.classList.add("flipback");
  }, delay);
}

function unflipPair(frontPage, backPage, delay = 500) {
  // hide the revealed page first
  backPage.classList.remove("flipback");
  // then bring back the front page after delay
  setTimeout(() => {
    frontPage.classList.remove("flip");
  }, delay);
}

nextPage.addEventListener("click", () => {
  if (currIdx >= pairs.length) return;

  const [front, back] = pairs[currIdx];
  flipPair(front, back, 500);

  currIdx++;
  console.log("currIdx:", currIdx);
});
prevPage.addEventListener("click", () => {
  if (currIdx <= 0) return;

  currIdx--;

  const [front, back] = pairs[currIdx];
  unflipPair(front, back, 500);

  console.log("currIdx:", currIdx);
});
