# YouTube Mix Blocker

Open a song on YouTube and the extension strips an automatically attached radio playlist from the watch URL. The selected video, timestamp and unrelated URL options carry over. Ordinary playlists keep their queue.

## Install in Chrome or Edge

1. Download this repository from GitHub using **Code → Download ZIP**, then extract it.
2. Open `chrome://extensions` or `edge://extensions` and enable **Developer mode**.
3. Choose **Load unpacked** and select the extracted folder containing `manifest.json`.
4. Refresh any open YouTube tabs.

## Try it

- Choose a song recommendation with a watch URL containing `list=RD…`. The song should open on its own.
- Choose a Mix card or open a bookmarked Mix URL. Its playlist should stay active as you advance through its songs.
- Open an ordinary playlist and advance to its next song. The playlist should stay active.

The extension recognizes explicit Mix choices using YouTube's playlist links, card markup and common English Mix labels. Recognition can vary with YouTube's layout and language. All processing happens in your browser.
