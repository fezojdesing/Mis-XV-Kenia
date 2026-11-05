(() => {
  "use strict";

  // Detecta Android para aplicar un ajuste localizado al apartado de regalos.
  if (/Android/i.test(navigator.userAgent)) document.body.classList.add("is-android");

  // Cuenta regresiva: 19 de diciembre de 2026, 14:30 h, Sultepec (UTC-06:00).
  const eventDate = new Date("2026-12-19T14:30:00-06:00").getTime();
  const fields = {
    days: document.querySelector('[data-unit="days"]'),
    hours: document.querySelector('[data-unit="hours"]'),
    minutes: document.querySelector('[data-unit="minutes"]'),
    seconds: document.querySelector('[data-unit="seconds"]')
  };
  if (Object.values(fields).every(Boolean)) {
    let timerId;
    const updateCountdown = () => {
      const remaining = Math.max(0, eventDate - Date.now());
      const totalSeconds = Math.floor(remaining / 1000);
      const values = {
        days: Math.floor(totalSeconds / 86400),
        hours: Math.floor((totalSeconds % 86400) / 3600),
        minutes: Math.floor((totalSeconds % 3600) / 60),
        seconds: totalSeconds % 60
      };
      Object.entries(values).forEach(([unit, value]) => {
        const field = fields[unit];
        const nextText = String(value).padStart(unit === "days" ? 3 : 2, "0");
        if (field.textContent !== nextText) {
          field.textContent = nextText;
          field.classList.remove("is-ticking");
          // Reinicia la animación de cada cifra que cambia sin modificar su tamaño.
          void field.offsetWidth;
          field.classList.add("is-ticking");
        }
      });
      if (remaining === 0 && timerId) window.clearInterval(timerId);
    };
    updateCountdown();
    if (Date.now() < eventDate) timerId = window.setInterval(updateCountdown, 1000);
  }

  // Aparición progresiva del cronograma.
  const timeline = document.querySelector(".timeline-replacement");
  if (timeline && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        timeline.classList.add("is-visible");
        observer.disconnect();
      }
    }, { threshold: 0.12 });
    observer.observe(timeline);
  } else if (timeline) {
    timeline.classList.add("is-visible");
  }


  // Opciones de regalo: la descripción aparece al pasar el cursor,
  // al enfocar con teclado o al tocar la opción en dispositivos móviles.
  const giftChoices = document.querySelectorAll('.gift-choice');
  const giftMessage = document.getElementById('giftMessage');
  const giftCopy = {
    envelope: '<strong>Lluvia de sobres</strong>Si deseas obsequiar efectivo, el día del evento encontrarás un buzón especial para depositar tu sobre. ¡Gracias por tu cariño!',
    present: '<strong>Regalo tradicional</strong>Si prefieres sorprender a Kenia con un obsequio, será recibido con muchísimo cariño. ¡Tu detalle hará aún más especial este día!'
  };
  const giftInteraction = document.querySelector('.gift-interaction');
  let pinnedGift = null;

  const showGiftMessage = (choice) => {
    if (!giftMessage || !choice) return;
    giftMessage.innerHTML = giftCopy[choice.dataset.gift] || '';
    giftMessage.classList.add('is-visible');
  };
  const hideGiftMessage = () => {
    if (!giftMessage) return;
    giftMessage.classList.remove('is-visible');
    giftMessage.innerHTML = '';
  };
  const selectGift = (choice) => {
    giftChoices.forEach((item) => {
      const selected = item === choice;
      item.classList.toggle('is-selected', selected);
      item.setAttribute('aria-expanded', String(selected));
    });
  };

  if (giftInteraction && 'IntersectionObserver' in window) {
    const giftObserver = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        giftInteraction.classList.add('is-visible');
        giftObserver.disconnect();
      }
    }, { threshold: 0.18 });
    giftObserver.observe(giftInteraction);
  } else if (giftInteraction) {
    giftInteraction.classList.add('is-visible');
  }

  giftChoices.forEach((choice) => {
    choice.addEventListener('pointerenter', () => showGiftMessage(choice));
    choice.addEventListener('pointerleave', () => {
      if (pinnedGift) showGiftMessage(pinnedGift);
      else hideGiftMessage();
    });
    choice.addEventListener('focus', () => showGiftMessage(choice));
    choice.addEventListener('blur', () => {
      window.setTimeout(() => {
        const focused = document.activeElement && document.activeElement.closest('.gift-choice');
        if (focused) showGiftMessage(focused);
        else if (pinnedGift) showGiftMessage(pinnedGift);
        else hideGiftMessage();
      }, 0);
    });
    choice.addEventListener('click', () => {
      pinnedGift = pinnedGift === choice ? null : choice;
      selectGift(pinnedGift);
      if (pinnedGift) showGiftMessage(pinnedGift);
      else hideGiftMessage();
    });
  });

  const reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Destellos ambientales dorados y plateados: brillo discreto durante la visita.
  const ambientLayer = document.querySelector(".ambient-sparkles");
  if (ambientLayer && !reducedMotion) {
    const ambientPalette = ["#d4b56f", "#ead9aa", "#c8cdd2", "#f2f3f4", "#b9944f"];
    for (let i = 0; i < 22; i += 1) {
      const glint = document.createElement("i");
      glint.className = "ambient-glint";
      glint.style.setProperty("--x", `${4 + Math.random() * 92}%`);
      glint.style.setProperty("--y", `${5 + Math.random() * 90}%`);
      glint.style.setProperty("--size", `${2 + Math.random() * 3.5}px`);
      glint.style.setProperty("--delay", `${Math.random() * 6}s`);
      glint.style.setProperty("--duration", `${3.8 + Math.random() * 4.2}s`);
      glint.style.setProperty("--glint-color", ambientPalette[Math.floor(Math.random() * ambientPalette.length)]);
      ambientLayer.appendChild(glint);
    }
  }

  // Transición entre las dos páginas: lluvia breve de destellos dorados y plateados.
  const transitionLayer = document.querySelector(".sparkle-transition");
  const particleLayer = transitionLayer && transitionLayer.querySelector(".sparkle-transition__particles");
  if (transitionLayer && particleLayer && !reducedMotion) {
    const palette = ["#d4b56f", "#f0dfad", "#c8cdd2", "#eef1f3", "#b9944f"];
    for (let i = 0; i < 64; i += 1) {
      const particle = document.createElement("i");
      particle.className = "sparkle";
      particle.style.setProperty("--x", `${Math.random() * 100}%`);
      particle.style.setProperty("--size", `${2 + Math.random() * 4.5}px`);
      particle.style.setProperty("--delay", `${Math.random() * 0.24}s`);
      particle.style.setProperty("--duration", `${0.78 + Math.random() * 0.48}s`);
      particle.style.setProperty("--drift", `${Math.round((Math.random() - 0.5) * 100)}px`);
      particle.style.setProperty("--particle-color", palette[Math.floor(Math.random() * palette.length)]);
      particleLayer.appendChild(particle);
    }
  }

  document.querySelectorAll('a[href$="datos.html"], a[href$="index.html"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (link.target === "_blank") return;
      event.preventDefault();
      const destination = link.getAttribute("href");
      if (reducedMotion || !transitionLayer) {
        window.location.href = destination;
        return;
      }
      transitionLayer.classList.add("is-active");
      document.body.classList.add("is-page-leaving");
      window.setTimeout(() => { window.location.href = destination; }, 1120);
    });
  });

  // Reproductor YouTube. Intentamos autoplay donde el navegador lo permita.
  // En iPhone/Safari, el invitado podrá iniciar el audio con el botón.
  const musicButton = document.querySelector(".music-toggle");
  let player = null;
  let playerReady = false;
  let isPlaying = false;

  const updateMusicButton = (playing) => {
    isPlaying = playing;
    if (!musicButton) return;
    musicButton.setAttribute("aria-pressed", String(playing));
    musicButton.setAttribute("aria-busy", String(!playerReady));
    musicButton.setAttribute("aria-label", playing ? "Pausar canción" : (playerReady ? "Reproducir canción" : "La música se está preparando"));
    const label = musicButton.querySelector(".music-toggle__label");
    const icon = musicButton.querySelector(".music-toggle__icon");
    if (label) label.textContent = playing ? "Pausar música" : (playerReady ? "Toca para escuchar" : "Preparando música…");
    if (icon) icon.textContent = playing ? "Ⅱ" : "♫";
    musicButton.classList.toggle("is-playing", playing);
  };

  updateMusicButton(false);

  window.onYouTubeIframeAPIReady = () => {
    const mount = document.getElementById("youtube-player");
    if (!mount || !window.YT || !window.YT.Player) return;
    player = new YT.Player("youtube-player", {
      width: "200",
      height: "200",
      videoId: "31CNgtIEN80",
      playerVars: {
        autoplay: 1,
        controls: 0,
        disablekb: 1,
        fs: 0,
        loop: 1,
        playlist: "31CNgtIEN80",
        playsinline: 1,
        rel: 0
      },
      events: {
        onReady: (event) => {
          event.target.getIframe().setAttribute("allow", "autoplay; encrypted-media; picture-in-picture");
          event.target.setVolume(85);
          playerReady = true;
          updateMusicButton(false);
          // En equipos/navegadores que lo permiten, la canción comienza sola.
          // Si iOS lo bloquea, el botón queda disponible para iniciar con un toque.
          try { event.target.playVideo(); } catch (_) { updateMusicButton(false); }
        },
        onStateChange: (event) => {
          if (event.data === YT.PlayerState.PLAYING) updateMusicButton(true);
          if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) updateMusicButton(false);
        },
        onAutoplayBlocked: () => updateMusicButton(false),
        onError: () => {
          playerReady = false;
          updateMusicButton(false);
        }
      }
    });
  };

  if (musicButton) {
    musicButton.addEventListener("click", () => {
      if (!playerReady || !player) {
        updateMusicButton(false);
        return;
      }
      if (isPlaying) player.pauseVideo();
      else player.playVideo();
    });
  }
})();
