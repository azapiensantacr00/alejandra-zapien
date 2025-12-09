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
