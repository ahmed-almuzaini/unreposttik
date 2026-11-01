# My Unrepost

A small Chrome extension that removes your own reposts from your TikTok profile, one video at a time, with randomized human-like delays.

It runs entirely in your browser on tiktok.com. It does not ask for your password, does not send data anywhere, and has no server.

> Independent tool. Not affiliated with, endorsed by, or sponsored by TikTok or ByteDance.

## Install

1. Download or clone this repository.
2. Open `chrome://extensions` in Chrome, Edge, or Brave.
3. Turn on **Developer mode**.
4. Click **Load unpacked** and select this folder.

## Use

1. Sign in to tiktok.com on a desktop browser.
2. Open your profile, go to the **Reposts** tab, and open the first video.
3. Use the panel in the bottom-right corner: set how many reposts to remove and press **Start**.
4. Press **Stop** at any time.

## Tips

- Test with a small number (3 to 5) first.
- Work in batches of about 100 and rest 10 to 15 minutes between them.
- Keep the TikTok tab visible while it runs.
- Stop if TikTok shows a captcha or a "too many requests" message.

## How it works

The extension finds the repost icon in the video player, clicks it, and clicks the "Remove repost" option only. If that option does not appear, or the video does not change after moving on, it stops instead of continuing. This avoids accidentally reposting a video.

## Limitations

- It depends on TikTok's page layout, which changes without notice. If it stops working, open an issue with a screenshot and the outer HTML of the repost icon.
- Automating actions may violate TikTok's terms of service. Use it at your own risk; the usual consequence is a temporary action limit on your account.

## License

MIT
