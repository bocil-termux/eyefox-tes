// lexerium.js
// Customer Service virtual for your app (Downloaders + AI Chat).
// Default language: English. Supported: en, id, vi.
// Exported API: getWelcomeMessage(lang='en'), getResponse(userMsg, lang='en')

/* ===============================
   Language Packs
================================= */
const LANG = {
  en: {
    appName: "Lexerium AI — Virtual Customer Service",
    hi: "Hello! 👋 Welcome to",
    intro:
      "I'm your virtual CS assistant. I can help you with video downloading (Instagram, TikTok, Facebook, YouTube, MediaFire and more) and answer questions about our AI Chat feature.",
    howToStart:
      "Before you start, please read the quick guide below so your requests can be handled faster:",
    quickGuide: [
      "Paste a valid media link (e.g., Instagram post/reel, TikTok share link, Facebook video URL, YouTube link, MediaFire file page, etc.).",
      "Choose the correct downloader page (Instagram Downloader for IG only; Random Downloader for everything else).",
      "For AI Chat, type your question in plain English/Indonesian/Vietnamese. Avoid sensitive data."
    ],
    buttons:
      "Don’t want to type? Tap one of these quick prompts:\n• Help\n• Download Instagram\n• Download TikTok\n• Download Facebook\n• Download YouTube\n• MediaFire help\n• AI Chat error\n• Contact",
    contact:
      "If you need further assistance, email us at: <b>yourmail@gmail.com</b> (we typically respond within 24–48 hours).",
    sections: {
      downloaderTitle: "📥 Downloader Help",
      igStepsTitle: "Instagram Downloader — Steps",
      igSteps: [
        "Open <b>Instagram Downloader</b> page.",
        "Paste an Instagram URL (post/reel/story if public).",
        "Press <b>Download</b> and wait for links.",
        "Preview the video/image. Use the <b>Download</b> button beside each item."
      ],
      randomStepsTitle: "Random Downloader — Steps (YouTube, MediaFire, etc.)",
      randomSteps: [
        "Go to <b>Random Downloader</b> page.",
        "Paste your link (YouTube, MediaFire file page, TikTok/Facebook alt links, etc.).",
        "Click <b>Download</b>. If multiple qualities exist, choose the desired one.",
        "Preview the media first to ensure it’s correct, then save it."
      ],
      notesTitle: "Important Notes",
      notes: [
        "Some private or region-restricted content may not be downloadable.",
        "If Instagram/TikTok changes layout or blocks scraping, try again later.",
        "For MediaFire, paste the full page URL (not direct CDN) so we can resolve the final file link."
      ],
      aiTitle: "🤖 AI Chat Help",
      aiIntro:
        "Our AI Chat supports question answering via server route <code>/chat</code>. If you hit issues, check the tips below.",
      aiTips: [
        "Use clear prompts; avoid extremely short inputs like 'help' only.",
        "If you see <b>429</b> (too many requests), wait and retry later.",
        "If you see <b>403</b> or <b>CORS</b> error in console, ensure you access via your configured domain or http://localhost:PORT.",
        "If responses show 'no answer', the upstream AI may be throttled; try different wording, or wait.",
        "Large responses are auto-formatted (links clickable, basic styling)."
      ]
    },
    faqsTitle: "FAQ (Frequently Asked Questions)",
    faqs: [
      {
        q: "My Instagram link returns no downloads. What should I do?",
        a: "Make sure the post is public and the link is complete (includes /p/ or /reel/ etc.). If still failing, it may be rate-limited or IG changed structure temporarily—try again later."
      },
      {
        q: "TikTok downloads only SD but not HD.",
        a: "Some TikTok links only provide SD depending on region or block. Try a different share link or use the Random Downloader as fallback."
      },
      {
        q: "YouTube/MediaFire link not working.",
        a: "Ensure it’s the full URL (no shortened link if possible). For MediaFire, use the main item page URL; we will extract the final file URL."
      },
      {
        q: "AI Chat error or empty answer.",
        a: "Server may be busy or upstream model throttled. Retry with a simpler prompt, or wait and try later."
      }
    ],
    errorBlocksTitle: "Common Error Handling",
    errors: {
      generic:
        "We’re sorry for the trouble. Please try again and check your link or your internet connection. If the issue persists, contact us with the link you used.",
      code429:
        "You’re hitting request limits (HTTP 429). Please slow down and try again in a few minutes.",
      code403:
        "Access blocked (HTTP 403). If you’re testing locally, make sure CORS is allowed and origins are correct. If remote, verify the endpoint and headers.",
      code404:
        "Resource not found (HTTP 404). Double-check the URL.",
      network:
        "Network error detected. Please check connectivity (VPN/Proxy/Firewall) and retry.",
      cors:
        "CORS error: your browser blocked a cross-origin request. Ensure your server enables CORS and your front-end uses the correct origin.",
      parse:
        "Parsing failed (HTML structure changed). This usually happens when the target site updates layout. Please retry later."
    },
    closing:
      "I hope this helps! If you need personalized assistance, send us your exact link and a short description of the problem to <b>yourmail@gmail.com</b>. 💜",
    // Dynamic templates
    intent: {
      greet:
        "Hi there! How can I help you today? You can ask about Instagram/TikTok/YouTube/MediaFire downloads or AI Chat issues.",
      ig:
        "Instagram help selected. Follow the steps above under <b>Instagram Downloader — Steps</b>. Send your public Instagram URL to proceed.",
      tiktok:
        "TikTok help selected. Paste your TikTok link. If HD is missing, try a different share link or use Random Downloader.",
      facebook:
        "Facebook help selected. Paste your Facebook video URL (public). Some private videos cannot be downloaded.",
      youtube:
        "YouTube help selected. Use the Random Downloader page and paste your YouTube link.",
      mediafire:
        "MediaFire help selected. Paste the full MediaFire page URL (not the direct CDN). We’ll resolve the final link.",
      random:
        "Random downloader selected. Paste any supported platform URL (YouTube, MediaFire, alternate links, etc.).",
      ai:
        "AI Chat help selected. If you get empty/slow responses, check the tips under AI Chat Help. You can also retry with a clearer prompt.",
      contact:
        "You can contact us at <b>yarunban@gmail.com</b>. Include your link and a short description so we can help faster."
    }
  },

  id: {
    appName: "Lexerium AI — Customer Service Virtual",
    hi: "Halo! 👋 Selamat datang di",
    intro:
      "Saya CS virtual kamu. Saya bisa bantu unduh video (Instagram, TikTok, Facebook, YouTube, MediaFire, dll) dan menjawab pertanyaan tentang fitur AI Chat.",
    howToStart:
      "Sebelum mulai, baca panduan singkat di bawah agar permintaanmu bisa diproses lebih cepat:",
    quickGuide: [
      "Tempelkan link media yang valid (contoh: link post/reel Instagram, tautan TikTok, URL video Facebook, link YouTube, halaman file MediaFire, dll).",
      "Pilih halaman downloader yang tepat (Instagram Downloader khusus IG; Random Downloader untuk platform lain).",
      "Untuk AI Chat, ketik pertanyaanmu dalam Bahasa Indonesia/Inggris/Vietnam. Hindari data sensitif."
    ],
    buttons:
      "Males ngetik? Tap salah satu prompt cepat ini:\n• Bantuan\n• Download Instagram\n• Download TikTok\n• Download Facebook\n• Download YouTube\n• Bantuan MediaFire\n• Error AI Chat\n• Kontak",
    contact:
      "Butuh bantuan lanjutan? Email kami: <b>yourmail@gmail.com</b> (balasan 24–48 jam).",
    sections: {
      downloaderTitle: "📥 Bantuan Downloader",
      igStepsTitle: "Instagram Downloader — Langkah",
      igSteps: [
        "Buka halaman <b>Instagram Downloader</b>.",
        "Tempel URL Instagram (post/reel/story jika publik).",
        "Klik <b>Download</b> dan tunggu tautan keluar.",
        "Preview video/gambar. Gunakan tombol <b>Download</b> di tiap item."
      ],
      randomStepsTitle: "Random Downloader — Langkah (YouTube, MediaFire, dll)",
      randomSteps: [
        "Buka halaman <b>Random Downloader</b>.",
        "Tempel link kamu (YouTube, halaman MediaFire, link TikTok/Facebook alternatif, dll).",
        "Klik <b>Download</b>. Jika ada banyak kualitas, pilih yang diinginkan.",
        "Preview dulu untuk memastikan benar, lalu simpan."
      ],
      notesTitle: "Catatan Penting",
      notes: [
        "Konten privat atau region-locked mungkin tidak bisa diunduh.",
        "Jika IG/TikTok berubah tampilan atau membatasi scraping, coba lagi nanti.",
        "Untuk MediaFire, tempel URL halaman utama file (bukan direct CDN) agar link final bisa diambil."
      ],
      aiTitle: "🤖 Bantuan AI Chat",
      aiIntro:
        "AI Chat lewat route server <code>/chat</code>. Jika ada masalah, cek tips berikut.",
      aiTips: [
        "Gunakan prompt jelas; hindari input terlalu singkat seperti 'help' saja.",
        "Jika muncul <b>429</b>, tunggu beberapa menit dan coba lagi.",
        "Jika <b>403</b> atau <b>CORS</b> di console, pastikan domain/origin sudah benar (localhost/port yang sesuai).",
        "Jika kosong/tidak menjawab, model upstream sedang padat; coba ubah pertanyaan atau tunggu.",
        "Jawaban besar diformat otomatis (link klik, styling dasar)."
      ]
    },
    faqsTitle: "FAQ (Sering Ditanyakan)",
    faqs: [
      {
        q: "Link Instagram saya tidak ada hasil.",
        a: "Pastikan postingan publik dan link lengkap (/p/ atau /reel/). Jika masih gagal, bisa karena rate-limit atau perubahan struktur IG—coba lagi nanti."
      },
      {
        q: "TikTok cuma SD, tidak ada HD.",
        a: "Beberapa link TikTok hanya menyediakan SD tergantung region atau blokir. Coba share link lain, atau pakai Random Downloader."
      },
      {
        q: "YouTube/MediaFire tidak jalan.",
        a: "Pastikan URL penuh. Untuk MediaFire, gunakan URL halaman item utama; sistem akan ambil link final."
      },
      {
        q: "AI Chat error atau kosong.",
        a: "Server sibuk atau model sedang dibatasi. Coba prompt lebih sederhana, atau tunggu sebentar."
      }
    ],
    errorBlocksTitle: "Penanganan Error Umum",
    errors: {
      generic:
        "Maaf atas kendalanya. Silakan coba lagi dan cek link/Internet kamu. Jika masih gagal, kirim link yang dipakai ke email kami.",
      code429:
        "Kena batas permintaan (HTTP 429). Mohon tunggu beberapa menit lalu coba lagi.",
      code403:
        "Akses diblok (HTTP 403). Jika lokal, pastikan CORS dan origin benar. Jika remote, cek endpoint & headers.",
      code404:
        "Sumber tidak ditemukan (HTTP 404). Periksa kembali URL.",
      network:
        "Terjadi error jaringan. Periksa koneksi (VPN/Proxy/Firewall) lalu coba ulang.",
      cors:
        "Error CORS: browser memblokir request lintas origin. Aktifkan CORS di server dan pastikan origin front-end benar.",
      parse:
        "Gagal parsing (struktur HTML berubah). Kemungkinan target situs baru update. Coba lagi nanti."
    },
    closing:
      "Semoga membantu! Jika butuh bantuan personal, kirim link dan deskripsi singkat masalah ke <b>yourmail@gmail.com</b>. 💜",
    intent: {
      greet:
        "Halo! Ada yang bisa kami bantu? Kamu bisa tanya soal download Instagram/TikTok/YouTube/MediaFire atau masalah AI Chat.",
      ig:
        "Bantuan Instagram dipilih. Ikuti langkah di bagian <b>Instagram Downloader — Langkah</b>. Kirim URL Instagram publik untuk lanjut.",
      tiktok:
        "Bantuan TikTok dipilih. Tempel link TikTok. Jika HD tidak ada, coba share link lain atau pakai Random Downloader.",
      facebook:
        "Bantuan Facebook dipilih. Tempel URL video Facebook (publik). Video privat biasanya tidak bisa.",
      youtube:
        "Bantuan YouTube dipilih. Gunakan halaman Random Downloader dan tempel link YouTube.",
      mediafire:
        "Bantuan MediaFire dipilih. Tempel URL halaman MediaFire (bukan CDN langsung). Sistem akan ambil link final.",
      random:
        "Random downloader dipilih. Tempel link dari platform apa pun (YouTube, MediaFire, dll).",
      ai:
        "Bantuan AI Chat dipilih. Jika error/lemot, cek tips di bagian Bantuan AI Chat. Coba juga ubah pertanyaan.",
      contact:
        "Hubungi kami di <b>yarunban@gmail.com</b>. Sertakan link yang dipakai dan deskripsi singkat masalahnya."
    }
  },

  vi: {
    appName: "Lexerium AI — Dịch vụ khách hàng ảo",
    hi: "Xin chào! 👋 Chào mừng đến với",
    intro:
      "Tôi là CS ảo của bạn. Tôi có thể hỗ trợ tải video (Instagram, TikTok, Facebook, YouTube, MediaFire, v.v.) và giải đáp về tính năng AI Chat.",
    howToStart:
      "Vui lòng đọc hướng dẫn nhanh phía dưới trước khi bắt đầu để xử lý yêu cầu nhanh hơn:",
    quickGuide: [
      "Dán liên kết hợp lệ (ví dụ: bài đăng Instagram, liên kết chia sẻ TikTok, video Facebook, liên kết YouTube, trang tệp MediaFire...).",
      "Chọn trang tải xuống phù hợp (Instagram Downloader dành cho IG; Random Downloader cho các nền tảng khác).",
      "Đối với AI Chat, hãy nhập câu hỏi bằng Tiếng Anh/Indonesia/Tiếng Việt. Tránh dữ liệu nhạy cảm."
    ],
    buttons:
      "Không muốn gõ? Nhấn các gợi ý sau:\n• Trợ giúp\n• Tải Instagram\n• Tải TikTok\n• Tải Facebook\n• Tải YouTube\n• Hỗ trợ MediaFire\n• Lỗi AI Chat\n• Liên hệ",
    contact:
      "Cần hỗ trợ thêm? Gửi email: <b>yarunban@gmail.com</b> (chúng tôi phản hồi trong 24–48 giờ).",
    sections: {
      downloaderTitle: "📥 Hỗ trợ tải xuống",
      igStepsTitle: "Instagram Downloader — Các bước",
      igSteps: [
        "Mở trang <b>Instagram Downloader</b>.",
        "Dán URL Instagram (bài viết/reel/story công khai).",
        "Nhấn <b>Download</b> và chờ liên kết xuất hiện.",
        "Xem trước video/ảnh. Nhấn <b>Download</b> để lưu."
      ],
      randomStepsTitle: "Random Downloader — Các bước (YouTube, MediaFire, v.v.)",
      randomSteps: [
        "Vào trang <b>Random Downloader</b>.",
        "Dán liên kết (YouTube, trang tệp MediaFire, liên kết TikTok/Facebook thay thế...).",
        "Bấm <b>Download</b>. Nếu có nhiều chất lượng, hãy chọn chất lượng mong muốn.",
        "Xem trước để đảm bảo đúng nội dung, sau đó tải xuống."
      ],
      notesTitle: "Lưu ý quan trọng",
      notes: [
        "Một số nội dung riêng tư hoặc bị giới hạn khu vực có thể không tải được.",
        "Nếu Instagram/TikTok thay đổi giao diện hoặc chặn scraping, vui lòng thử lại sau.",
        "Với MediaFire, dùng URL trang tệp gốc (không phải CDN trực tiếp) để lấy liên kết cuối."
      ],
      aiTitle: "🤖 Hỗ trợ AI Chat",
      aiIntro:
        "AI Chat chạy qua route máy chủ <code>/chat</code>. Nếu gặp vấn đề, hãy kiểm tra các mẹo bên dưới.",
      aiTips: [
        "Nhập câu hỏi rõ ràng; tránh quá ngắn như 'help' thôi.",
        "Nếu gặp <b>429</b>, hãy đợi vài phút và thử lại.",
        "Nếu <b>403</b> hoặc <b>CORS</b> trong console, đảm bảo domain/origin đúng (localhost/port phù hợp).",
        "Nếu không trả lời, có thể máy chủ/LLM đang bận; thử đổi cách diễn đạt hoặc đợi.",
        "Câu trả lời dài sẽ được định dạng (liên kết có thể nhấn, style cơ bản)."
      ]
    },
    faqsTitle: "Câu hỏi thường gặp",
    faqs: [
      {
        q: "Liên kết Instagram không tải được.",
        a: "Đảm bảo bài viết công khai và URL đầy đủ (/p/ hoặc /reel/). Nếu vẫn thất bại, có thể bị giới hạn hoặc IG vừa thay đổi—hãy thử lại sau."
      },
      {
        q: "TikTok chỉ có SD, không có HD.",
        a: "Tùy khu vực, có liên kết chỉ có SD. Hãy thử liên kết chia sẻ khác hoặc dùng Random Downloader."
      },
      {
        q: "YouTube/MediaFire không hoạt động.",
        a: "Hãy dùng URL đầy đủ. MediaFire nên dùng URL trang tệp chính; hệ thống sẽ trích liên kết cuối."
      },
      {
        q: "AI Chat lỗi hoặc không trả lời.",
        a: "Máy chủ bận hoặc LLM bị giới hạn. Hãy thử câu hỏi rõ ràng hơn hoặc thử lại sau."
      }
    ],
    errorBlocksTitle: "Xử lý lỗi phổ biến",
    errors: {
      generic:
        "Xin lỗi vì sự cố. Vui lòng thử lại và kiểm tra liên kết/kết nối Internet. Nếu vẫn lỗi, hãy liên hệ và gửi kèm liên kết bạn dùng.",
      code429:
        "Giới hạn yêu cầu (HTTP 429). Hãy thử lại sau vài phút.",
      code403:
        "Bị chặn (HTTP 403). Nếu chạy local, hãy bật CORS và kiểm tra origin. Nếu chạy remote, kiểm tra endpoint & headers.",
      code404:
        "Không tìm thấy tài nguyên (HTTP 404). Kiểm tra lại URL.",
      network:
        "Lỗi mạng. Vui lòng kiểm tra kết nối (VPN/Proxy/Tường lửa) và thử lại.",
      cors:
        "Lỗi CORS: trình duyệt chặn yêu cầu cross-origin. Bật CORS trên server và đảm bảo origin front-end đúng.",
      parse:
        "Phân tích thất bại (HTML thay đổi). Có thể trang đích vừa cập nhật. Hãy thử lại sau."
    },
    closing:
      "Hy vọng điều này hữu ích! Nếu cần hỗ trợ riêng, gửi liên kết và mô tả ngắn đến <b>yourmail@gmail.com</b>. 💜",
    intent: {
      greet:
        "Xin chào! Tôi có thể giúp gì? Bạn có thể hỏi về tải Instagram/TikTok/YouTube/MediaFire hoặc vấn đề AI Chat.",
      ig:
        "Đã chọn hỗ trợ Instagram. Xem phần <b>Instagram Downloader — Các bước</b>. Gửi URL IG công khai để tiếp tục.",
      tiktok:
        "Đã chọn hỗ trợ TikTok. Dán liên kết TikTok. Nếu không có HD, thử liên kết khác hoặc dùng Random Downloader.",
      facebook:
        "Đã chọn hỗ trợ Facebook. Dán URL video công khai. Video riêng tư có thể không tải được.",
      youtube:
        "Đã chọn hỗ trợ YouTube. Vào Random Downloader và dán liên kết YouTube.",
      mediafire:
        "Đã chọn hỗ trợ MediaFire. Dán URL trang tệp (không phải CDN). Hệ thống sẽ trích liên kết cuối.",
      random:
        "Đã chọn Random downloader. Dán liên kết từ bất kỳ nền tảng được hỗ trợ.",
      ai:
        "Đã chọn hỗ trợ AI Chat. Nếu lỗi/chậm, xem mẹo trong phần Hỗ trợ AI Chat. Hãy thử diễn đạt khác.",
      contact:
        "Liên hệ: <b>yourmail@gmail.com</b>. Vui lòng gửi kèm liên kết và mô tả ngắn."
    }
  }
};

/* ===============================
   Helpers
================================= */
function pickLang(lang) {
  return LANG[lang] ? lang : "en";
}

function bullets(arr) {
  return arr.map((x) => `• ${x}`).join("<br>");
}

function section(title, contentHtml) {
  return `<h3 style="color:#8b45ff;margin:10px 0 6px;">${title}</h3>${contentHtml}`;
}

function renderWelcome(pkg) {
  const {
    appName,
    hi,
    intro,
    howToStart,
    quickGuide,
    buttons,
    contact,
    sections,
    faqsTitle,
    faqs,
    closing
  } = pkg;

  const dlHelp =
    section(sections.downloaderTitle, "") +
    section(sections.igStepsTitle, bullets(sections.igSteps)) +
    section(sections.randomStepsTitle, bullets(sections.randomSteps)) +
    section(sections.notesTitle, bullets(sections.notes));

  const aiHelp =
    section(sections.aiTitle, `<p>${sections.aiIntro}</p>`) +
    `<div style="margin-top:6px">${bullets(sections.aiTips)}</div>`;

  const faqHtml = faqs
    .map(
      (f) =>
        `<div style="margin:8px 0"><b>Q:</b> ${f.q}<br><b>A:</b> ${f.a}</div>`
    )
    .join("");

  return `
<b>${hi} ${appName}</b><br><br>
${intro}<br><br>
<b>${howToStart}</b><br>
${bullets(quickGuide)}<br><br>
${buttons}<br><br>
${dlHelp}<br>
${aiHelp}<br>
<h3 style="color:#8b45ff;margin:10px 0 6px;">${faqsTitle}</h3>
${faqHtml}<br>
${contact}<br><br>
${closing}
  `.trim();
}

function detectIntent(text) {
  const s = (text || "").toLowerCase();
  if (!s) return "greet";

  // Simple keyword-based intent routing
  if (/(ig|instagram|reel|story|post)/.test(s)) return "ig";
  if (/(tiktok|tt)/.test(s)) return "tiktok";
  if (/(facebook|fb)/.test(s)) return "facebook";
  if (/(youtube|yt)/.test(s)) return "youtube";
  if (/(mediafire|mf)/.test(s)) return "mediafire";
  if (/(random|all platforms|semua|tat ca)/.test(s)) return "random";
  if (/(ai chat|model|perplexity|lexerium)/.test(s)) return "ai";
  if (/(contact|email|hubungi|lien he)/.test(s)) return "contact";

  // Error hints
  if (/429|too many|rate limit/.test(s)) return "err429";
  if (/403|forbidden|blocked/.test(s)) return "err403";
  if (/404|not found/.test(s)) return "err404";
  if (/cors/.test(s)) return "errCORS";
  if (/network|timeout|offline/.test(s)) return "errNetwork";
  if (/parse|cheerio|html/.test(s)) return "errParse";

  if (/help|bantuan|tro giup/.test(s)) return "greet";

  return "greet";
}

/* ===============================
   Public API
================================= */
export function getWelcomeMessage(lang = "en") {
  const L = LANG[pickLang(lang)];
  return renderWelcome(L);
}

export function getResponse(userMsg, lang = "en") {
  const codeLang = pickLang(lang);
  const L = LANG[codeLang];
  const intent = detectIntent(userMsg);

  // Error-specific blocks
  if (intent === "err429") return L.errors.code429 + "<br><br>" + L.closing;
  if (intent === "err403") return L.errors.code403 + "<br><br>" + L.closing;
  if (intent === "err404") return L.errors.code404 + "<br><br>" + L.closing;
  if (intent === "errCORS") return L.errors.cors + "<br><br>" + L.closing;
  if (intent === "errNetwork") return L.errors.network + "<br><br>" + L.closing;
  if (intent === "errParse") return L.errors.parse + "<br><br>" + L.closing;

  // Intent messaging (downloader & AI)
  if (intent in L.intent) {
    let extra = "";
    switch (intent) {
      case "ig":
        extra = section(L.sections.igStepsTitle, bullets(L.sections.igSteps));
        break;
      case "random":
        extra = section(
          L.sections.randomStepsTitle,
          bullets(L.sections.randomSteps)
        );
        break;
      case "ai":
        extra =
          section(L.sections.aiTitle, `<p>${L.sections.aiIntro}</p>`) +
          `<div style="margin-top:6px">${bullets(L.sections.aiTips)}</div>`;
        break;
      case "youtube":
      case "mediafire":
      case "tiktok":
      case "facebook":
        // Short add-on linking to random/ig steps as needed
        extra = section(
          L.sections.downloaderTitle,
          `<i>${L.notesTitle || L.sections.notesTitle}</i><br>${bullets(
            L.sections.notes
          )}`
        );
        break;
    }
    return `${L.intent[intent]}<br><br>${extra}<br><br>${L.contact}`;
  }

  // Generic fallback CS answer (long form)
  return `
<b>${L.appName}</b><br><br>
${L.errors.generic}<br><br>
${section(L.sections.downloaderTitle, "")}
${section(L.sections.igStepsTitle, bullets(L.sections.igSteps))}
${section(L.sections.randomStepsTitle, bullets(L.sections.randomSteps))}
${section(L.sections.notesTitle, bullets(L.sections.notes))}
${section(L.sections.aiTitle, `<p>${L.sections.aiIntro}</p>`)}
<div style="margin-top:6px">${bullets(L.sections.aiTips)}</div>
<br>${L.contact}<br><br>${L.closing}
  `.trim();
}

/* ===============================
   (Optional) Utility: change language at runtime
   Example: window.LEX.setLang('id')
================================= */
export const LEX = {
  setLang(lang) {
    const l = pickLang(lang);
    return l; // return resolved language code
  },
};

/* ===============================
   Usage (in ai2.html)
   --------------------------------
   import { getWelcomeMessage, getResponse } from './lexerium.js';
   // On model switch to 'lexerium':
   addMessage(getWelcomeMessage('en'), 'ai'); // default EN
   // On user message:
   addMessage(getResponse(userText, 'en'), 'ai');

   Supported languages: 'en' | 'id' | 'vi'
================================= */
