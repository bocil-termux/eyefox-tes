// tiktok.js - browser-only, baca input dari HTML
async function downloadTikTok() {
    const url = document.getElementById("tiktokLink").value.trim();
    const resultBox = document.getElementById("result");

    if (!url) {
        alert("Masukkan URL TikTok");
        return;
    }

    // tampilkan loading di tengah
    resultBox.innerHTML = `<p>Loading...</p>`;
    resultBox.style.display = "flex";
    resultBox.style.flexDirection = "column";
    resultBox.style.alignItems = "center";
    resultBox.style.justifyContent = "center";

    try {
        // Panggil API Xvoid
        const apiUrl = `https://xvoidofc.xvoidx.my.id/download/tiktok?apikey=Xvoid&url=${encodeURIComponent(url)}`;
        const res = await fetch(apiUrl);
        const data = await res.json();

        if (data.status && data.result) {
            // Pilih video No Watermark / HD
            const videoUrl = data.result.video_nowm || data.result.video_hd || "";
            const audioUrl = data.result.audio_url || "";

            if (!videoUrl) {
                resultBox.innerHTML = `<p style="color:red">Video tidak tersedia</p>`;
                return;
            }

            // Tampilkan preview video + tombol download audio
            resultBox.innerHTML = `
                <p><b>${data.title || "No Title"}</b> by <em>tiyarmybe</em></p>
                <video src="${videoUrl}" controls style="max-width:100%;border-radius:8px;margin-top:10px"></video>
                ${audioUrl ? `<p><a href="${audioUrl}" target="_blank">Download Audio</a></p>` : ""}
                <p>
                    <a href="${videoUrl}" download="TikTokVideo.mp4">
                        <button style="margin-top:10px;padding:10px 20px;border:none;border-radius:6px;background:red;color:white;cursor:pointer">
                            Download Video
                        </button>
                    </a>
                </p>
            `;

        } else {
            resultBox.innerHTML = `<p style="color:red">${data.error || "Video tidak tersedia"}</p>`;
        }
    } catch (err) {
        resultBox.innerHTML = `<p style="color:red">Terjadi error: ${err}</p>`;
        console.error(err);
    }
}
