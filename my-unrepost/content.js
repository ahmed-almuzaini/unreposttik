(() => {
  const REPOST_ICON_PATH = 'path[d^="M33 28.06h3.11"]';
  const REMOVE_PATTERN = new RegExp(
    "remove repost|undo repost|" +
      "\u0625\u0632\u0627\u0644\u0629 \u0625\u0639\u0627\u062f\u0629 \u0627\u0644\u0646\u0634\u0631|" +
      "\u0625\u0644\u063a\u0627\u0621 \u0625\u0639\u0627\u062f\u0629 \u0627\u0644\u0646\u0634\u0631",
    "i"
  );
  const DEFAULT_COUNT = 50;
  const MAX_COUNT = 500;
  const STORAGE_KEY = "myUnrepostCount";

  let running = false;

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const pause = (min, max) => sleep(min + Math.random() * (max - min));

  const loadCount = () => {
    try {
      const saved = parseInt(localStorage.getItem(STORAGE_KEY), 10);
      return saved >= 1 && saved <= MAX_COUNT ? saved : DEFAULT_COUNT;
    } catch (e) {
      return DEFAULT_COUNT;
    }
  };

  const saveCount = (value) => {
    try {
      localStorage.setItem(STORAGE_KEY, String(value));
    } catch (e) {}
  };

  const panel = document.createElement("div");
  panel.style.cssText =
    "position:fixed;bottom:20px;right:20px;z-index:999999;width:220px;padding:12px;" +
    "background:#161823;color:#fff;border-radius:10px;font:13px system-ui,sans-serif;" +
    "box-shadow:0 4px 16px rgba(0,0,0,.4);display:flex;flex-direction:column;gap:8px";

  const title = document.createElement("div");
  title.textContent = "My Unrepost";
  title.style.cssText = "font-weight:600;font-size:14px";

  const label = document.createElement("label");
  label.textContent = "Reposts to remove";
  label.style.cssText = "display:flex;flex-direction:column;gap:4px";

  const input = document.createElement("input");
  input.type = "number";
  input.min = "1";
  input.max = String(MAX_COUNT);
  input.value = String(loadCount());
  input.style.cssText =
    "padding:6px;border-radius:6px;border:1px solid #444;background:#0d0e14;color:#fff";
  label.appendChild(input);

  const button = document.createElement("button");
  button.textContent = "Start";
  button.style.cssText =
    "padding:8px;background:#fe2c55;color:#fff;border:0;border-radius:6px;" +
    "font-size:14px;cursor:pointer";

  const status = document.createElement("div");
  status.textContent = "Open a video from your Reposts tab, then press Start.";
  status.style.cssText = "font-size:12px;color:#aaa;line-height:1.4";

  panel.append(title, label, button, status);
  document.body.appendChild(panel);

  const setStatus = (text) => {
    status.textContent = text;
  };

  const findRepostButton = () => {
    const icon = document.querySelector(REPOST_ICON_PATH);
    if (!icon) return null;
    return (
      icon.closest('button, [role="button"], [data-e2e]') ||
      icon.parentElement.parentElement.parentElement
    );
  };

  const findRemoveOption = () =>
    [...document.querySelectorAll('button, [role="button"], [role="menuitem"], div, span')]
      .filter((el) => REMOVE_PATTERN.test((el.textContent || "").trim()))
      .sort((a, b) => a.textContent.length - b.textContent.length)[0];

  const goToNextVideo = () => {
    const next = document.querySelector('[data-e2e="arrow-right"]');
    if (next) {
      next.click();
      return;
    }
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowDown", keyCode: 40, bubbles: true })
    );
  };

  const run = async (limit) => {
    let removed = 0;
    let reason = "Finished.";

    while (running && removed < limit) {
      const urlBefore = location.href;

      const repostButton = findRepostButton();
      if (!repostButton) {
        reason = "Repost button not found. Open a video from your Reposts tab.";
        break;
      }
      repostButton.click();
      await pause(1000, 2000);

      const option = findRemoveOption();
      if (!option) {
        reason = "Remove option did not appear. Stopped to avoid reposting.";
        break;
      }
      option.click();

      removed += 1;
      setStatus(`Removed ${removed} of ${limit}`);
      await pause(1500, 3000);

      goToNextVideo();
      await pause(1500, 3000);

      if (location.href === urlBefore) {
        reason = "Video did not change. Stopped for safety.";
        break;
      }
    }

    if (!running) reason = "Stopped.";
    setStatus(`${reason} Total removed: ${removed}`);
  };

  button.addEventListener("click", async () => {
    if (running) {
      running = false;
      return;
    }

    const limit = Math.min(Math.max(parseInt(input.value, 10) || DEFAULT_COUNT, 1), MAX_COUNT);
    input.value = String(limit);
    saveCount(limit);

    running = true;
    button.textContent = "Stop";
    input.disabled = true;
    setStatus("Starting...");

    await run(limit);

    running = false;
    button.textContent = "Start";
    input.disabled = false;
  });
})();
