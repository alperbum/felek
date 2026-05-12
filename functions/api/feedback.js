/**
 * Cloudflare Pages Function — Telegram Feedback Proxy
 * 
 * Environment Variables (Cloudflare Dashboard → Settings → Environment Variables):
 *   TG_BOT_TOKEN  — BotFather'dan alınan bot token
 *   TG_CHAT_ID    — Mesajın gönderileceği chat ID
 * 
 * Bu fonksiyon istemci tarafından gelen feedback mesajlarını alır ve
 * Telegram Bot API'ye güvenli bir şekilde iletir. Token sunucu tarafında kalır.
 */

// Basit rate limiting (IP başına dakikada max 3 istek)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60_000; // 1 dakika
const RATE_LIMIT_MAX = 3;
const ALLOWED_ORIGINS = [
    "https://felekmangalbasi.com",
    "https://www.felekmangalbasi.com",
    "https://felek-mangalbasi.pages.dev"
];

function getCorsOrigin(request) {
    const origin = request.headers.get("Origin");
    if (origin && ALLOWED_ORIGINS.includes(origin)) {
        return origin;
    }
    return ALLOWED_ORIGINS[0];
}

function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function isRateLimited(ip) {
    const now = Date.now();
    const entry = rateLimitMap.get(ip);

    if (!entry || now - entry.timestamp > RATE_LIMIT_WINDOW) {
        rateLimitMap.set(ip, { timestamp: now, count: 1 });
        return false;
    }

    if (entry.count >= RATE_LIMIT_MAX) {
        return true;
    }

    entry.count++;
    return false;
}

export async function onRequestPost(context) {
    const { request, env } = context;

    // CORS Headers
    const corsHeaders = {
        "Access-Control-Allow-Origin": getCorsOrigin(request),
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json",
    };

    // Environment variables kontrolü
    const botToken = env.TG_BOT_TOKEN;
    const chatId = env.TG_CHAT_ID;

    if (!botToken || !chatId) {
        return new Response(
            JSON.stringify({ ok: false, error: "Server configuration error" }),
            { status: 500, headers: corsHeaders }
        );
    }

    // Rate limiting
    const clientIP = request.headers.get("CF-Connecting-IP") || "unknown";
    if (isRateLimited(clientIP)) {
        return new Response(
            JSON.stringify({ ok: false, error: "Too many requests. Please try again later." }),
            { status: 429, headers: corsHeaders }
        );
    }

    // Request body oku
    let body;
    try {
        body = await request.json();
    } catch {
        return new Response(
            JSON.stringify({ ok: false, error: "Invalid JSON" }),
            { status: 400, headers: corsHeaders }
        );
    }

    const { name, message } = body;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
        return new Response(
            JSON.stringify({ ok: false, error: "Message is required" }),
            { status: 400, headers: corsHeaders }
        );
    }

    // Mesaj metnini oluştur
    const sanitizedName = name ? String(name).slice(0, 100) : "";
    const sanitizedMsg = String(message).slice(0, 2000);

    const escapedName = sanitizedName ? escapeHtml(sanitizedName) : "";
    const escapedMsg = escapeHtml(sanitizedMsg);

    const text = escapedName
        ? `\u{1F4CB} <b>Felek Mangalba\u015F\u0131 \u2013 Yeni Geri Bildirim</b>\n\n\u{1F464} Ad: ${escapedName}\n\u{1F4AC} Mesaj:\n${escapedMsg}`
        : `\u{1F4CB} <b>Felek Mangalba\u015F\u0131 \u2013 Yeni Geri Bildirim</b>\n\n\u{1F4AC} Mesaj:\n${escapedMsg}`;

    // Telegram API'ye gönder
    try {
        const tgResponse = await fetch(
            `https://api.telegram.org/bot${botToken}/sendMessage`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: text,
                    parse_mode: "HTML",
                }),
            }
        );

        const tgData = await tgResponse.json();

        if (tgData.ok) {
            return new Response(
                JSON.stringify({ ok: true }),
                { status: 200, headers: corsHeaders }
            );
        } else {
            console.error("Telegram API error:", tgData.description);
            return new Response(
                JSON.stringify({ ok: false, error: "Failed to send message" }),
                { status: 502, headers: corsHeaders }
            );
        }
    } catch (err) {
        console.error("Telegram fetch error:", err);
        return new Response(
            JSON.stringify({ ok: false, error: "Internal server error" }),
            { status: 500, headers: corsHeaders }
        );
    }
}

// CORS preflight
export async function onRequestOptions(context) {
    const origin = context.request.headers.get("Origin");
    const allowedOrigin = (origin && ALLOWED_ORIGINS.includes(origin)) ? origin : ALLOWED_ORIGINS[0];
    return new Response(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": allowedOrigin,
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Max-Age": "86400",
        },
    });
}
