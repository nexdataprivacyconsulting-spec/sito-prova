/* Moretti & Associati – sito dimostrativo. Nessun cookie, nessun tracciamento, nessuna richiesta esterna. */
(function () {
  "use strict";
  var doc = document.documentElement;
  var ridotto = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Intestazione: bordo dopo il primo scroll */
  var testata = document.querySelector(".testata");
  function sullaTestata() {
    if (testata) testata.classList.toggle("scrolled", window.scrollY > 8);
  }
  sullaTestata();
  window.addEventListener("scroll", sullaTestata, { passive: true });

  /* Menu su telefono */
  var bottone = document.querySelector(".menu-btn");
  var nav = document.getElementById("nav-principale");
  if (bottone && nav) {
    function chiudi() {
      nav.classList.remove("aperto");
      bottone.setAttribute("aria-expanded", "false");
      bottone.querySelector(".etichetta").textContent = "Menu";
    }
    bottone.addEventListener("click", function () {
      var aperto = nav.classList.toggle("aperto");
      bottone.setAttribute("aria-expanded", aperto ? "true" : "false");
      bottone.querySelector(".etichetta").textContent = aperto ? "Chiudi" : "Menu";
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("aperto")) {
        chiudi();
        bottone.focus();
      }
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) chiudi();
    });
  }

  /* Rivelazioni allo scroll (a gruppi, con ritardo progressivo) */
  var elementi = [].slice.call(document.querySelectorAll("[data-r]"));
  if (elementi.length) {
    if (ridotto || !("IntersectionObserver" in window)) {
      elementi.forEach(function (el) { el.classList.add("in"); });
    } else {
      var oss = new IntersectionObserver(function (voci) {
        voci.forEach(function (v) {
          if (!v.isIntersecting) return;
          var el = v.target;
          var gruppo = el.parentElement ? [].slice.call(el.parentElement.querySelectorAll(":scope > [data-r]")) : [el];
          var indice = Math.max(0, gruppo.indexOf(el));
          el.style.setProperty("--d", Math.min(indice, 5) * 0.09 + "s");
          el.classList.add("in");
          oss.unobserve(el);
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
      elementi.forEach(function (el) { oss.observe(el); });
    }
  }

  /* Parallasse leggero (solo transform) */
  var par = [].slice.call(document.querySelectorAll("[data-par]"));
  if (par.length && !ridotto) {
    var attesa = false;
    var aggiorna = function () {
      attesa = false;
      var h = window.innerHeight;
      par.forEach(function (el) {
        var r = el.parentElement.getBoundingClientRect();
        if (r.bottom < -100 || r.top > h + 100) return;
        var centro = r.top + r.height / 2 - h / 2;
        var v = parseFloat(el.getAttribute("data-par"));
        el.style.transform = "translate3d(0," + (-centro * v).toFixed(1) + "px,0)";
      });
    };
    window.addEventListener("scroll", function () {
      if (!attesa) { attesa = true; requestAnimationFrame(aggiorna); }
    }, { passive: true });
    window.addEventListener("resize", aggiorna);
    aggiorna();
  }

  /* Selettore "da dove parte il problema" */
  [].forEach.call(document.querySelectorAll("[data-scelta]"), function (blocco) {
    var tab = [].slice.call(blocco.querySelectorAll('[role="tab"]'));
    var pannelli = [].slice.call(blocco.querySelectorAll('[role="tabpanel"]'));
    function seleziona(i, sposta) {
      tab.forEach(function (t, k) {
        t.setAttribute("aria-selected", k === i ? "true" : "false");
        t.tabIndex = k === i ? 0 : -1;
      });
      pannelli.forEach(function (p, k) { p.hidden = k !== i; });
      if (sposta) tab[i].focus();
    }
    tab.forEach(function (t, i) {
      t.addEventListener("click", function () { seleziona(i, false); });
      t.addEventListener("keydown", function (e) {
        var n = null;
        if (e.key === "ArrowRight") n = (i + 1) % tab.length;
        if (e.key === "ArrowLeft") n = (i - 1 + tab.length) % tab.length;
        if (e.key === "Home") n = 0;
        if (e.key === "End") n = tab.length - 1;
        if (n !== null) { e.preventDefault(); seleziona(n, true); }
      });
    });
    seleziona(0, false);
  });

  /* Domande frequenti */
  [].forEach.call(document.querySelectorAll(".faq-voce"), function (voce) {
    var b = voce.querySelector("button");
    var r = voce.querySelector(".faq-risposta");
    if (!b || !r) return;
    b.addEventListener("click", function () {
      var aperta = voce.classList.toggle("aperta");
      b.setAttribute("aria-expanded", aperta ? "true" : "false");
    });
  });

  /* Filtri per categoria (Approfondimenti) */
  var filtri = document.querySelector("[data-filtri]");
  if (filtri) {
    var schede = [].slice.call(document.querySelectorAll("[data-cat]"));
    filtri.addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (!b) return;
      [].forEach.call(filtri.querySelectorAll("button"), function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      var cat = b.getAttribute("data-filtro");
      schede.forEach(function (s) { s.hidden = cat !== "tutti" && s.getAttribute("data-cat") !== cat; });
    });
  }

  /* Barra di lettura (solo se il browser non la gestisce da CSS) */
  var barra = document.querySelector(".progresso");
  if (barra && !(window.CSS && CSS.supports && CSS.supports("animation-timeline: scroll()")) && !ridotto) {
    var calcola = function () {
      var max = doc.scrollHeight - window.innerHeight;
      barra.style.transform = "scaleX(" + (max > 0 ? Math.min(1, window.scrollY / max) : 0) + ")";
    };
    window.addEventListener("scroll", calcola, { passive: true });
    calcola();
  }
})();
