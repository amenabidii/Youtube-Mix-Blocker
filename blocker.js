(() => {
  const storageKey = "youtube-mix-blocker.allowed-list";
  let allowed = null;
  try { allowed = sessionStorage.getItem(storageKey); } catch {}

  function remember(list) {
    allowed = list;
    try {
      if (list) sessionStorage.setItem(storageKey, list);
      else sessionStorage.removeItem(storageKey);
    } catch {}
  }

  function mix(url) {
    const list = url.searchParams.get("list");
    return list?.startsWith("RD") ? list : null;
  }

  function clean(url) {
    for (const key of ["list", "index", "start_radio", "playnext"]) {
      url.searchParams.delete(key);
    }
    return url.href;
  }

  function explicitMix(anchor, url) {
    if (url.pathname === "/playlist") return true;
    if (anchor.closest("ytd-radio-renderer,ytd-compact-radio-renderer,ytm-radio-renderer")) return true;
    const card = anchor.closest("yt-lockup-view-model,ytm-lockup-view-model,ytd-rich-item-renderer,ytd-compact-video-renderer");
    if (card?.querySelector('a[href*="/playlist?list=RD"],ytd-thumbnail-overlay-bottom-panel-renderer')) return true;
    const label = anchor.getAttribute("aria-label") || anchor.title || anchor.textContent.trim();
    return /^(?:YouTube\s+)?Mix(?:$|\s*[-–—:])/i.test(label);
  }

  function handleLink(event) {
    const anchor = event.composedPath().find(node => node instanceof HTMLAnchorElement);
    if (!anchor?.href) return;
    const url = new URL(anchor.href);
    if (url.origin !== location.origin) return;
    const list = mix(url);
    if (!list || !["/watch", "/playlist"].includes(url.pathname)) return;
    const separate = event.ctrlKey || event.metaKey || event.shiftKey || event.button === 1 || anchor.target === "_blank";
    if (explicitMix(anchor, url)) {
      if (!separate) remember(list);
      return;
    }
    if (list === allowed && mix(new URL(location.href)) === list) return;
    if (url.pathname !== "/watch" || !url.searchParams.has("v")) return;
    anchor.href = clean(url);
    if (separate) {
      event.stopImmediatePropagation();
      return;
    }
    event.preventDefault();
    event.stopImmediatePropagation();
    remember(null);
    location.assign(anchor.href);
  }

  function inspect() {
    const url = new URL(location.href);
    const list = mix(url);
    if (list && url.pathname === "/playlist") remember(list);
    else if (list && url.pathname === "/watch" && url.searchParams.has("v")) {
      if (list !== allowed) location.replace(clean(url));
    } else remember(null);
  }

  const initial = new URL(location.href);
  // A pasted URL, bookmark, external link or newly opened tab can be an intentional Mix.
  const navigation = performance.getEntriesByType("navigation")[0];
  if (mix(initial) && (!document.referrer.startsWith(location.origin + "/") ||
      (history.length === 1 && navigation?.type === "navigate"))) remember(mix(initial));
  window.addEventListener("click", handleLink, true);
  window.addEventListener("auxclick", handleLink, true);
  for (const event of ["yt-navigate-finish", "yt-page-data-updated", "popstate", "pageshow"]) {
    window.addEventListener(event, inspect, true);
  }
  inspect();
})();
