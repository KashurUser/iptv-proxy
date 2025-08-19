export async function handler(event, context) {
  const source = "https://raw.githubusercontent.com/alex4528/m3u/refs/heads/main/jstar.m3u";

  try {
    const resp = await fetch(source);
    let text = await resp.text();

    // Branding: add TG@KASHURFLIX once
    text = text.replace(/group-title="([^"]+)"/gi, (match, g1) => {
      if (!g1.includes("TG@KASHURFLIX")) {
        return `group-title="TG@KASHURFLIX ${g1}"`;
      }
      return match;
    });

    // If user opens in browser → redirect to Telegram
    const ua = event.headers["user-agent"] || "";
    if (ua.includes("Mozilla") || ua.includes("Safari") || ua.includes("Chrome")) {
      return {
        statusCode: 302,
        headers: { Location: "https://t.me/+TP1EQM2kQg9mZTQ1" },
        body: "",
      };
    }

    // Send playlist to IPTV players
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "audio/x-mpegurl; charset=utf-8",
      },
      body: text,
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: "#EXTM3U\n# Error fetching playlist",
    };
  }
}
