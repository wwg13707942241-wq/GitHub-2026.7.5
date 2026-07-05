(function () {
  const data = window.PORTFOLIO_DATA;
  if (!data) return;

  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => Array.from(parent.querySelectorAll(selector));

  const socials = [
    ["邮箱", "2734915567@qq.com"],
    ["微信", "15583852016"],
    ["小红书", "设计师-Gavin"],
    ["抖音", "AI设计师-Gavin"],
  ];

  const strengths = [
    {
      title: "个人评价",
      points: [
        "具备电商视觉设计与 AI 内容生产经验，熟悉产品主图、详情页、推广图、短视频及社媒素材的制作流程，能够根据产品卖点、平台调性和运营需求，快速完成视觉方案输出，并配合团队进行素材修改与迭代。",
        "熟悉 AI 生图、AI 视频及工作流搭建，能够使用多种 AIGC 工具完成图片生成、场景搭建、产品展示、视频分镜和动态画面制作。",
      ],
    },
    {
      title: "个人优势",
      points: [
        "具备跨境电商平台视觉经验，能兼顾产品一致性、卖点表达、转化率与平台规范，适合高频素材生产和商业项目落地。",
        "学习能力和执行能力强，能够持续优化提示词、画面控制、产品一致性、镜头分镜和后期包装，让 AI 工具更好服务视觉设计工作。",
      ],
    },
    {
      title: "AI 工作流能力",
      points: [
        "熟练使用 Stable Diffusion、ComfyUI、即梦、可灵、RunningHub、LibTV、Seedance 等工具，能完成从创意构思到画面输出的完整链路。",
        "能围绕产品主体、光影效果、场景适配和字幕节奏进行细化控制，提升图片与视频内容的商业质感。",
      ],
    },
    {
      title: "电商视觉能力",
      points: [
        "熟悉亚马逊主图、副图、A+ 页面和详情页视觉要求，能根据摄影素材、产品特点和运营反馈进行设计优化。",
        "能够与摄影师、开发人员、运营团队协同，完成产品图、安装说明书和平台视觉资产的制作与修改。",
      ],
    },
  ];

  function createElement(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  }

  function setMediaSource(selector, source) {
    const el = $(selector);
    if (!el || !source) return;
    el.src = source;
  }

  function formatAssetName(path) {
    return decodeURIComponent(path.split("/").pop() || path).replace(/\.[^.]+$/, "");
  }

  function setThumb(node, path) {
    if (!path) return;
    node.style.setProperty("--thumb", `url("${path}")`);
  }

  function scrollToReveal(selector) {
    const target = $(selector);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function renderHero() {
    setMediaSource(".hero-video", data.heroVideo);
    setMediaSource("#profilePhoto", data.profile.photo);
    const resumeLink = $("#resumeDownload");
    if (resumeLink) resumeLink.href = data.profile.resumePdf;
  }

  function getReelImages() {
    const brandImages = data.brandCases.flatMap((brand) => brand.images.slice(0, 5));
    const amazonImages = data.amazonCategories.flatMap((category) => {
      const firstProject = category.projects[0];
      return firstProject ? firstProject.images.slice(0, 2) : [];
    });
    return [...brandImages, ...amazonImages].filter(Boolean).slice(0, 18);
  }

  function renderMarquee() {
    const images = getReelImages();
    const firstRow = $(".marquee-row-one");
    const secondRow = $(".marquee-row-two");
    if (!firstRow || !secondRow) return;

    const rowOne = images.slice(0, Math.ceil(images.length / 2));
    const rowTwo = images.slice(Math.ceil(images.length / 2));

    function fillRow(row, assets) {
      row.innerHTML = "";
      [...assets, ...assets, ...assets].forEach((asset) => {
        const tile = createElement("figure", "marquee-tile");
        const img = document.createElement("img");
        img.src = asset.path;
        img.alt = asset.title || "作品预览";
        img.loading = "lazy";
        img.decoding = "async";
        tile.append(img);
        row.append(tile);
      });
    }

    fillRow(firstRow, rowOne);
    fillRow(secondRow, rowTwo);
  }

  function renderSocials() {
    const wrap = $(".social-list");
    wrap.innerHTML = "";
    socials.forEach(([label, value]) => {
      const item = createElement("div", "social-pill");
      item.append(createElement("span", "", label));
      item.append(createElement("strong", "", value));
      wrap.append(item);
    });
  }

  function renderTimeline() {
    const wrap = $(".timeline");
    wrap.innerHTML = "";
    data.experience.forEach((job) => {
      const item = createElement("article", "timeline-item");
      const meta = createElement("div", "timeline-meta");
      meta.append(createElement("span", "", job.period));
      meta.append(createElement("span", "", job.company));
      meta.append(createElement("span", "", job.role));
      item.append(meta);
      item.append(createElement("h3", "", job.title));
      job.points.forEach((point) => item.append(createElement("p", "", point)));
      wrap.append(item);
    });
  }

  function renderStrengths() {
    const wrap = $(".strength-grid");
    wrap.innerHTML = "";
    strengths.forEach((group, index) => {
      const card = createElement("article", "strength-card");
      card.append(createElement("span", "strength-index", String(index + 1).padStart(2, "0")));
      card.append(createElement("strong", "", group.title));
      group.points.forEach((point) => card.append(createElement("p", "", point)));
      wrap.append(card);
    });
  }

  function createImageCard(asset, category, project) {
    const figure = createElement("figure", "image-card work-card");
    figure.dataset.category = category || "";
    const img = document.createElement("img");
    img.src = asset.path;
    img.alt = asset.title || formatAssetName(asset.path);
    img.loading = "lazy";
    img.decoding = "async";
    const button = createElement("button", "icon-button open-preview", "查看原图");
    button.type = "button";
    button.setAttribute("aria-label", "查看原图");
    button.dataset.previewType = "image";
    button.dataset.src = asset.path;
    button.dataset.caption = asset.title || project || category || "作品";
    const caption = createElement("figcaption", "", asset.title || project || category || "作品");
    figure.append(img, button, caption);
    return figure;
  }

  function createVideoCard(video) {
    const card = createElement("article", "work-card video-card");
    const frame = createElement("div", "media-frame");
    const media = document.createElement("video");
    media.src = video.path;
    media.controls = true;
    media.preload = "metadata";
    media.playsInline = true;
    frame.append(media);
    const body = createElement("div", "card-body");
    body.append(createElement("span", "card-kicker", video.category));
    body.append(createElement("div", "card-title", video.title));
    body.append(createElement("p", "card-note", video.note));
    card.append(frame, body);
    return card;
  }

  function createCatalogCard({ title, meta, note, thumb, action }) {
    const card = createElement("article", "catalog-card");
    setThumb(card, thumb);
    const copy = createElement("div");
    copy.append(createElement("h3", "", title));
    copy.append(createElement("p", "", note));
    const button = createElement("button", "catalog-button", meta);
    button.type = "button";
    button.addEventListener("click", action);
    card.addEventListener("click", (event) => {
      if (event.target.closest("button")) return;
      action();
    });
    card.append(copy, button);
    return card;
  }

  function renderAmazonCatalog() {
    const wrap = $(".amazon-catalog");
    wrap.innerHTML = "";
    data.amazonCategories.forEach((category) => {
      const firstProject = category.projects[0];
      const firstImage = firstProject?.images?.[0]?.path;
      const card = createCatalogCard({
        title: category.name,
        meta: `查看 ${category.total} 张`,
        note: `${category.projects.length} 组项目，覆盖主图、副图、A+ 页面和场景图。`,
        thumb: firstImage,
        action: () => renderAmazonWorks(category),
      });
      wrap.append(card);
    });
  }

  function renderAmazonWorks(category) {
    const wrap = $("#amazonWorks");
    wrap.innerHTML = "";
    const head = createElement("div", "reveal-head");
    const copy = createElement("div");
    copy.append(createElement("h3", "", category.name));
    copy.append(createElement("p", "", `${category.projects.length} 组项目 / ${category.total} 张电商视觉图`));
    head.append(copy);
    const grid = createElement("div", "image-grid");
    category.projects.forEach((project) => {
      project.images.forEach((asset) => grid.append(createImageCard(asset, category.name, project.name)));
    });
    wrap.append(head, grid);
    revealDynamicWorks(wrap);
    scrollToReveal("#amazonWorks");
  }

  function renderBrandCatalog() {
    const wrap = $(".brand-catalog");
    wrap.innerHTML = "";
    data.brandCases.forEach((brand) => {
      const card = createCatalogCard({
        title: brand.title,
        meta: `查看 ${brand.images.length} 张`,
        note: brand.description,
        thumb: brand.images[0]?.path,
        action: () => renderBrandWorks(brand),
      });
      wrap.append(card);
    });
  }

  function renderBrandWorks(brand) {
    const wrap = $("#brandWorks");
    wrap.innerHTML = "";
    const head = createElement("div", "reveal-head");
    const copy = createElement("div");
    copy.append(createElement("h3", "", brand.title));
    copy.append(createElement("p", "", brand.description));
    head.append(copy);
    const grid = createElement("div", "image-grid brand-grid");
    brand.images.forEach((asset) => grid.append(createImageCard(asset, "品牌设计全案", brand.title)));
    wrap.append(head, grid);
    revealDynamicWorks(wrap);
    scrollToReveal("#brandWorks");
  }

  function renderVideoCatalog() {
    const wrap = $(".video-catalog");
    wrap.innerHTML = "";
    const groups = data.videos.reduce((acc, video) => {
      if (!acc[video.category]) acc[video.category] = [];
      acc[video.category].push(video);
      return acc;
    }, {});

    Object.entries(groups).forEach(([category, videos]) => {
      const card = createCatalogCard({
        title: category,
        meta: `查看 ${videos.length} 条`,
        note: category.includes("商业") ? "产品叙事、商业广告、动态分镜和场景化表达。" : "AI 微电影、叙事镜头、节奏控制和氛围影像。",
        thumb: "",
        action: () => renderVideoWorks(category, videos),
      });
      wrap.append(card);
    });
  }

  function renderVideoWorks(category, videos) {
    const wrap = $("#videoWorks");
    wrap.innerHTML = "";
    const head = createElement("div", "reveal-head");
    const copy = createElement("div");
    copy.append(createElement("h3", "", category));
    copy.append(createElement("p", "", `${videos.length} 条 AIGC 视频作品`));
    head.append(copy);
    const grid = createElement("div", "video-grid");
    videos.forEach((video) => grid.append(createVideoCard(video)));
    wrap.append(head, grid);
    revealDynamicWorks(wrap);
    scrollToReveal("#videoWorks");
  }

  function renderContact() {
    const wrap = $(".contact-panel");
    wrap.innerHTML = "";
    data.contact.forEach((row) => {
      const item = createElement("div", "contact-row");
      item.append(createElement("span", "", row.label));
      item.append(createElement("strong", "", row.value));
      wrap.append(item);
    });
  }

  function setupLightbox() {
    const dialog = $(".lightbox");
    const body = $(".lightbox-body");
    const caption = $(".lightbox-caption");
    const close = $(".lightbox-close");

    document.addEventListener("click", (event) => {
      const trigger = event.target.closest(".open-preview");
      if (!trigger) return;
      body.innerHTML = "";
      const media = document.createElement("img");
      media.src = trigger.dataset.src;
      media.alt = trigger.dataset.caption || "作品预览";
      body.append(media);
      caption.textContent = trigger.dataset.caption || "";
      dialog.showModal();
    });

    close.addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener("close", () => {
      body.innerHTML = "";
    });
  }

  let parallaxImages = [];

  function collectParallaxImages() {
    parallaxImages = $$(".motion-image");
  }

  function setupOpeningAnimation() {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      document.body.classList.remove("is-loading");
      document.body.classList.add("is-loaded");
      return;
    }

    requestAnimationFrame(() => {
      document.body.classList.add("is-loaded");
    });

    window.setTimeout(() => {
      document.body.classList.remove("is-loading");
    }, 2650);
  }

  function getMotionLabel(panel) {
    const labels = {
      experience: "EXPERIENCE",
      strengths: "EVALUATION",
      amazon: "AMAZON VISUAL",
      brand: "BRAND SYSTEM",
      video: "AIGC VIDEO",
      contact: "CONTACT",
    };
    return labels[panel.id] || panel.querySelector(".eyebrow")?.textContent?.trim() || "PORTFOLIO";
  }

  function setStagger(items, base = 0, step = 90) {
    items.forEach((item, index) => {
      item.classList.add("motion-item");
      item.style.setProperty("--stagger", `${base + Math.min(index, 14) * step}ms`);
    });
  }

  function prepareMotion(root = document) {
    setStagger($$(".section-heading, .marquee-heading, .contact-copy, .experience-profile, .reveal-head", root), 120, 110);

    [
      ".timeline",
      ".strength-grid",
      ".catalog-grid",
      ".image-grid",
      ".video-grid",
      ".contact-panel",
      ".marquee-row",
    ].forEach((selector) => {
      $$(selector, root).forEach((container) => {
        setStagger(Array.from(container.children), 260, 82);
      });
    });

    $$(".image-card img, .marquee-tile img, .portrait-frame img", root).forEach((image) => {
      image.classList.add("motion-image");
    });

    collectParallaxImages();
  }

  function revealDynamicWorks(wrap) {
    wrap.classList.remove("is-expanded");
    prepareMotion(wrap);
    requestAnimationFrame(() => {
      wrap.classList.add("is-expanded");
    });
  }

  function setupEditorialMotion() {
    $$(".panel").forEach((panel) => {
      if (panel.classList.contains("hero")) return;
      if (panel.querySelector(":scope > .motion-kicker")) return;
      const kicker = createElement("div", "motion-kicker", getMotionLabel(panel));
      panel.prepend(kicker);
    });
    prepareMotion();
    setupOpeningAnimation();
  }

  function setupSectionMotion() {
    const panels = $$(".panel");
    const navLinks = $$(".nav-links a");
    const particles = $("#particlesCanvas");
    const header = $(".site-header");

    const update = () => {
      const viewport = window.innerHeight || 1;
      const hero = $("#home");
      const heroRect = hero.getBoundingClientRect();
      const particleOpacity = heroRect.bottom < viewport * 0.64 ? 0.48 : 0;
      particles.style.opacity = String(particleOpacity);
      header.classList.toggle("is-floating", heroRect.bottom <= 80);

      let activeId = "home";
      panels.forEach((panel) => {
        const rect = panel.getBoundingClientRect();
        const visible = rect.top < viewport * 0.7 && rect.bottom > viewport * 0.18;
        const past = rect.bottom < viewport * 0.22;
        panel.classList.toggle("is-visible", visible);
        panel.classList.toggle("is-past", past && !visible);
        if (visible) panel.classList.add("has-entered");
        if (panel.id && rect.top <= viewport * 0.42 && rect.bottom > viewport * 0.42) {
          activeId = panel.id;
        }
      });

      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${activeId}`);
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  }

  function setupMarqueeMotion() {
    const section = $(".marquee-section");
    const rowOne = $(".marquee-row-one");
    const rowTwo = $(".marquee-row-two");
    if (!section || !rowOne || !rowTwo) return;

    const update = () => {
      const rect = section.getBoundingClientRect();
      const offset = (window.innerHeight - rect.top) * 0.25;
      rowOne.style.transform = `translate3d(${offset - 260}px, 0, 0)`;
      rowTwo.style.transform = `translate3d(${-offset}px, 0, 0)`;
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  }

  function setupImageParallax() {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let ticking = false;
    const update = () => {
      const viewport = window.innerHeight || 1;
      parallaxImages.forEach((image) => {
        const rect = image.getBoundingClientRect();
        if (rect.bottom < -80 || rect.top > viewport + 80) return;
        const center = rect.top + rect.height / 2;
        const progress = (center - viewport / 2) / viewport;
        const y = Math.max(-22, Math.min(22, progress * -34));
        image.style.setProperty("--parallax-y", `${y.toFixed(2)}px`);
      });
      ticking = false;
    };

    const requestUpdate = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    collectParallaxImages();
    requestUpdate();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", () => {
      collectParallaxImages();
      requestUpdate();
    });
  }

  function setupMagnet() {
    $$(".magnet").forEach((node) => {
      const getBaseTransform = () => {
        if (!node.classList.contains("hero-portrait")) return "";
        return window.matchMedia("(max-width: 1040px)").matches ? "" : "translateY(-43%)";
      };
      node.addEventListener("mousemove", (event) => {
        const rect = node.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        const strength = node.classList.contains("hero-portrait") ? 18 : 9;
        const base = getBaseTransform();
        node.style.transform = `${base} translate3d(${x / strength}px, ${y / strength}px, 0)`;
      });
      node.addEventListener("mouseleave", () => {
        node.style.transform = getBaseTransform();
      });
    });
  }

  function setupParticles() {
    const canvas = $("#particlesCanvas");
    const ctx = canvas.getContext("2d");
    const mouse = { x: 0, y: 0, active: false };
    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles = [];

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = Array.from({ length: Math.min(180, Math.floor(width / 9)) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 0.8 + 0.2,
        r: Math.random() * 2.2 + 0.7,
        vx: (Math.random() - 0.5) * 0.34,
        vy: (Math.random() - 0.5) * 0.34,
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";
      particles.forEach((p, index) => {
        const hoverX = mouse.active ? (mouse.x - width / 2) * 0.0008 * p.z : 0;
        const hoverY = mouse.active ? (mouse.y - height / 2) * 0.0008 * p.z : 0;
        p.x += p.vx + hoverX;
        p.y += p.vy + hoverY;

        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        const alpha = 0.07 + p.z * 0.22;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * p.z, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(217, 255, 236, ${alpha * 0.8})`;
        ctx.fill();

        for (let j = index + 1; j < particles.length; j += 1) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 110) {
            ctx.strokeStyle = `rgba(117, 247, 174, ${(1 - dist / 110) * 0.045})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      });
      requestAnimationFrame(draw);
    }

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", (event) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      mouse.active = true;
    });
    window.addEventListener("mouseleave", () => {
      mouse.active = false;
    });
    resize();
    draw();
  }

  renderHero();
  renderMarquee();
  renderSocials();
  renderTimeline();
  renderStrengths();
  renderAmazonCatalog();
  renderBrandCatalog();
  renderVideoCatalog();
  renderContact();
  setupEditorialMotion();
  setupLightbox();
  setupParticles();
  setupMarqueeMotion();
  setupImageParallax();
  setupMagnet();
  setupSectionMotion();
})();
