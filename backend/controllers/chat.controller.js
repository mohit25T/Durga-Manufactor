import Product from "../models/Product.js";

/* ======================================================
   HELPER: GREETING DETECTOR
====================================================== */
const GREETING_WORDS = [
  "hi", "hello", "hey", "hallo", "greetings", "namaste", "namaskar",
  "good morning", "good afternoon", "good evening", "good day", "good night",
  "howdy", "hola", "hi there", "hello there", "hey there",
  "how are you", "who are you", "what can you do", "help", "ssup", "sup"
];

function isGreetingMessage(query) {
  if (!query) return false;
  const clean = query.toLowerCase().trim().replace(/[^\w\s]/g, "");
  if (!clean) return false;

  if (GREETING_WORDS.includes(clean)) return true;

  const pattern = /^(hi+|hello+|hey+|hallo|greetings|namaste|namaskar|good\s*(morning|afternoon|evening|day)|howdy|hola)(\s+|$)/i;
  if (pattern.test(clean)) {
    const remaining = clean.replace(pattern, "").trim();
    const fillerWords = ["", "durga", "sir", "mam", "maam", "there", "bot", "assistant", "ai", "team", "friend", "friends", "bro", "boss"];
    if (fillerWords.includes(remaining)) {
      return true;
    }
  }

  return false;
}

export const handleAiChat = async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid message.",
      });
    }

    // 1. Fetch live product catalog from database for accurate dynamic context
    const products = await Product.find({}).lean();

    const catalogContext = products
      .map((p) => {
        let specs = "";
        if (p.table && Array.isArray(p.table)) {
          specs = p.table
            .map((row) => (Array.isArray(row) ? row.join(": ") : ""))
            .filter(Boolean)
            .join("; ");
        }
        return `• Product Name: ${p.name} | Category: ${p.category} | Description: ${
          p.description || "Industrial machinery"
        } | Price: ${p.price ? "₹" + p.price : "Quote on Request"} | Specs: ${
          specs || "N/A"
        }`;
      })
      .join("\n");

    const systemPrompt = `You are "Durga AI", the official intelligent AI sales & support assistant for Durga Manufactor - leading manufacturers of commercial food processing machinery, pulverizers, potato slicers, flour mills, vegetable cutters, onion peelers, and dough kneaders.

Company Details:
- Contact Phone / WhatsApp: +91 94281 56213
- Catalog & Products:
${catalogContext}

Your Responsibilities:
1. Answer customer queries warmly, professionally, and accurately using the product catalog provided.
2. If the user sends a greeting (e.g. "hi", "hello", "good morning", "namaste"), respond warmly and concisely, welcoming them to Durga Manufactor and asking how you can help.
3. Recommend specific Durga Manufactor machines based on user needs (e.g. potato cutting, grinding flour, spice pulverizing).
4. Provide prices or instruct customers to click the WhatsApp button for custom quotes & bulk inquiries.
5. Keep answers clear, structured, and friendly. Use bullet points or short paragraphs when listing specs.`;

    const apiKey = process.env.GEMINI_API_KEY;

    let replyText = "";

    // 2. Try Google Gemini API if API key exists
    if (apiKey) {
      try {
        let historyContext = "";
        if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
          historyContext = conversationHistory
            .slice(-6)
            .map((msg) => `${msg.sender === "user" ? "Customer" : "Durga AI"}: ${msg.text}`)
            .join("\n");
        }

        const fullPrompt = `${systemPrompt}${
          historyContext ? `\n\nRecent Conversation History:\n${historyContext}` : ""
        }\n\nCustomer Question: ${message}`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [
                    {
                      text: fullPrompt,
                    },
                  ],
                },
              ],
            }),
          }
        );

        const data = await response.json();
        if (data?.error) {
          console.error("Gemini API Error:", data.error.message || data.error);
        } else {
          replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        }
      } catch (err) {
        console.error("Gemini API call failed, using fallback engine:", err.message);
      }
    }

    // 3. Smart local AI knowledge engine fallback if Gemini key is missing or call failed
    if (!replyText) {
      replyText = generateSmartFallbackReply(message, products);
    }

    // Identify related products for direct CTA chips in response (skip for pure greetings)
    const isGreeting = isGreetingMessage(message);
    let recommendedProducts = [];

    if (!isGreeting) {
      const queryLower = message.toLowerCase().trim();
      const stopWords = ["the", "for", "and", "with", "have", "you", "are", "this", "that", "what", "how", "can", "want", "need", "please", "give"];
      const searchTokens = queryLower
        .split(/[^\w]+/)
        .filter((w) => w.length >= 3 && !stopWords.includes(w));

      if (searchTokens.length > 0) {
        recommendedProducts = products
          .filter((p) => {
            const nameLower = p.name.toLowerCase();
            const catLower = p.category.toLowerCase();
            return searchTokens.some(
              (token) => nameLower.includes(token) || catLower.includes(token)
            );
          })
          .slice(0, 3)
          .map((p) => ({
            _id: p._id,
            name: p.name,
            category: p.category,
            price: p.price,
          }));
      }
    }

    res.json({
      success: true,
      data: {
        reply: replyText,
        recommendedProducts,
        contactWhatsApp: "9428156213",
      },
    });
  } catch (error) {
    console.error("AI Chat Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process chat message.",
      error: error.message,
    });
  }
};

/* ======================================================
   LOCAL AI KNOWLEDGE ENGINE (Fallback for immediate ops)
====================================================== */
function generateSmartFallbackReply(query, products) {
  const q = query.toLowerCase().trim();

  // 1. Greetings check
  if (isGreetingMessage(q)) {
    return `Hello! Welcome to **Durga Manufactor** 👋\n\n` +
      `I am **Durga AI**, your technical sales assistant. How can I help you today?\n\n` +
      `You can ask me about:\n` +
      `• **Potato Slicers** & Commercial Snack Machines\n` +
      `• **Industrial Flour Mills** & Heavy-Duty Pulverizers\n` +
      `• **Vegetable Cutters** & Automatic Onion Peelers\n` +
      `• **Dough Kneaders** & Food Processing Equipment\n\n` +
      `Feel free to select a category below or ask any product question!`;
  }

  // 2. Categories query
  if (q.includes("category") || q.includes("types") || q.includes("catalog") || q.includes("machines")) {
    const cats = [...new Set(products.map((p) => p.category).filter(Boolean))];
    return `At Durga Manufactor, we manufacture heavy-duty, commercial-grade machinery across these primary categories:\n\n` +
      cats.map((c) => `• **${c}**`).join("\n") +
      `\n\nWhich category or capacity are you interested in? You can ask me for recommendations!`;
  }

  // 3. Slicer query
  if (q.includes("slice") || q.includes("potato") || q.includes("chip")) {
    const slicers = products.filter((p) => p.category?.toLowerCase().includes("slic") || p.name.toLowerCase().includes("slic"));
    if (slicers.length) {
      return `We manufacture high-capacity commercial Potato Slicers designed for crisp & snack production:\n\n` +
        slicers.map((s) => `• **${s.name}**: ${s.description || "Stainless steel body."}`).join("\n") +
        `\n\nWould you like a direct price quote on WhatsApp? Call or message us at +91 94281 56213.`;
    }
  }

  // 4. Mill / Pulverizer query
  if (q.includes("mill") || q.includes("pulverizer") || q.includes("grind") || q.includes("flour") || q.includes("spice")) {
    const mills = products.filter((p) => p.category?.toLowerCase().includes("mill") || p.name.toLowerCase().includes("mill") || p.name.toLowerCase().includes("pulverizer"));
    if (mills.length) {
      return `Our Industrial Flour Mills & Pulverizers provide high-speed grinding for grains & spices:\n\n` +
        mills.map((m) => `• **${m.name}**: ${m.description || "Heavy-duty motor."}`).join("\n") +
        `\n\nNeed assistance selecting the right HP motor power? Ask me or chat with our team on WhatsApp (+91 94281 56213).`;
    }
  }

  // 5. Price or Quote query
  if (q.includes("price") || q.includes("cost") || q.includes("quote") || q.includes("rate") || q.includes("buy")) {
    return `Prices depend on machine capacity and motor HP configuration. We offer direct factory rates for commercial buyers.\n\n` +
      `You can inquire directly on WhatsApp at **+91 94281 56213** or submit an inquiry on any product page for instant pricing!`;
  }

  // 6. Contact query
  if (q.includes("contact") || q.includes("phone") || q.includes("whatsapp") || q.includes("address") || q.includes("location")) {
    return `You can reach Durga Manufactor directly:\n\n` +
      `📞 **Phone / WhatsApp**: +91 94281 56213\n` +
      `🏬 **Factory & Showroom**: Contact us on WhatsApp for exact factory visit schedules & machine demos.`;
  }

  // 7. Specific product search match
  const matchedProduct = products.find((p) => q.includes(p.name.toLowerCase()) || (p.description && q.includes(p.description.toLowerCase())));
  if (matchedProduct) {
    let specText = matchedProduct.description || "";
    return `Here are details for **${matchedProduct.name}**:\n\n` +
      `• **Category**: ${matchedProduct.category}\n` +
      `• **Overview**: ${specText}\n` +
      `• **Price**: ${matchedProduct.price ? "₹" + matchedProduct.price : "Factory Rate on Request"}\n\n` +
      `Would you like to connect on WhatsApp (+91 94281 56213) to place an order?`;
  }

  // 8. General fallback
  return `Hello! I am Durga AI, your industrial food processing machinery assistant.\n\n` +
    `I can help you explore our Potato Slicers, Flour Mills, Pulverizers, Vegetable Cutters, Onion Peelers, and Dough Kneaders.\n\n` +
    `Feel free to ask about machine specifications, motor power, or contact us directly on WhatsApp at **+91 94281 56213**!`;
}

