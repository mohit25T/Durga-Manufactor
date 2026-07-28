import Product from "../models/Product.js";

/* =========================
   CREATE PRODUCT
========================= */

export const createProduct = async (req, res) => {
  try {

    const imageUrls = req.files?.map(file => file.path) || [];

    let table = req.body.table;
    let whatsappNumbers = req.body.whatsappNumbers;

    if (typeof table === "string") {
      table = JSON.parse(table);
    }

    if (typeof whatsappNumbers === "string") {
      whatsappNumbers = JSON.parse(whatsappNumbers);
    }

    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      table,
      category: req.body.category,
      price: req.body.price,
      whatsappNumbers,
      images: imageUrls
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


/* =========================
   GET ALL PRODUCTS
========================= */

export const getProducts = async (req, res) => {
  try {

    const products = await Product.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: products.length,
      data: products
    });

  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


/* =========================
   GET SINGLE PRODUCT
========================= */

export const getProductById = async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.json({
      success: true,
      data: product
    });

  } catch (error) {
    console.error("GET PRODUCT BY ID ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


/* =========================
   INCREASE PRODUCT VIEW
========================= */

export const increaseProductView = async (req, res) => {
  try {

    const product = await Product.findOneAndUpdate(
      { _id: req.params.id },
      { $inc: { views: 1 } },
      { returnDocument: "after" }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "View counted",
      views: product.views,
    });

  } catch (error) {
    console.error("INCREASE PRODUCT VIEW ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


/* =========================
   UPDATE PRODUCT
========================= */

export const updateProduct = async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    const imageUrls = req.files?.map(file => file.path) || [];

    const updatedImages = [
      ...product.images,
      ...imageUrls
    ];

    let table = req.body.table;
    let whatsappNumbers = req.body.whatsappNumbers;

    if (typeof table === "string") {
      table = JSON.parse(table);
    }

    if (typeof whatsappNumbers === "string") {
      whatsappNumbers = JSON.parse(whatsappNumbers);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        table,
        category: req.body.category,
        price: req.body.price,
        whatsappNumbers,
        images: updatedImages
      },
      { new: true }
    );

    res.json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


/* =========================
   DELETE PRODUCT
========================= */

export const deleteProduct = async (req, res) => {
  try {

    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.json({
      success: true,
      message: "Product deleted successfully"
    });

  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


/* =========================
   DELETE PRODUCT IMAGE
========================= */

export const deleteProductImage = async (req, res) => {
  try {

    const { id } = req.params;
    const { imageUrl } = req.body;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    product.images = product.images.filter(img => img !== imageUrl);

    await product.save();

    res.json({
      success: true,
      message: "Image deleted successfully",
      data: product
    });

  } catch (error) {
    console.error("DELETE PRODUCT IMAGE ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

/* =========================
   CREATE PRODUCT REVIEW
========================= */

export const createProductReview = async (req, res) => {
  try {
    const { name, city, rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    if (!name || !city || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, city, rating and comment"
      });
    }

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5"
      });
    }

    const review = {
      name: name.trim(),
      city: city.trim(),
      rating: numRating,
      comment: comment.trim()
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.averageRating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: product
    });

  } catch (error) {
    console.error("CREATE PRODUCT REVIEW ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* =========================
   DELETE PRODUCT REVIEW
========================= */

export const deleteProductReview = async (req, res) => {
  try {
    const { id, reviewId } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    product.reviews = product.reviews.filter(
      (r) => r._id.toString() !== reviewId
    );

    product.numReviews = product.reviews.length;
    product.averageRating =
      product.reviews.length === 0
        ? 0
        : product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();

    res.json({
      success: true,
      message: "Review deleted successfully",
      data: product
    });

  } catch (error) {
    console.error("DELETE PRODUCT REVIEW ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ======================================================
   GENERATE AI PRODUCT DESCRIPTION
====================================================== */
export const generateProductAiDescription = async (req, res) => {
  try {
    const { name, category, description, table } = req.body;

    if (!name && !category && (!table || table.length === 0)) {
      return res.status(400).json({
        success: false,
        message: "Please enter product name, category, or table specifications to generate AI description.",
      });
    }

    // Format specification table into key-value context
    let formattedSpecs = "";
    if (Array.isArray(table) && table.length > 0) {
      formattedSpecs = table
        .map((row) => {
          if (!Array.isArray(row)) return "";
          const cleaned = row.filter((cell) => cell && cell.toString().trim() !== "");
          return cleaned.join(": ");
        })
        .filter(Boolean)
        .join("\n• ");
    }

    const apiKey = process.env.GEMINI_API_KEY;
    let generatedDescription = "";

    // 1. Try Gemini API if API key exists
    if (apiKey) {
      try {
        const prompt = `You are an elite industrial machinery copywriter for Durga Manufactor.
Generate a premium, beautifully structured commercial product description for this machinery listing:

Product Details:
- Product Name: ${name || "Industrial Machine"}
- Category: ${category || "Commercial Food Processing Machine"}
- Current Overview Notes: ${description || "N/A"}
- Technical Specifications:
${formattedSpecs ? "• " + formattedSpecs : "Standard commercial specifications"}

STRICT STRUCTURE & FORMATTING REQUIREMENTS:
1. OVERVIEW PARAGRAPH: Write a compelling opening paragraph (2-3 sentences). Use **bold text** for the product name and key highlights (e.g. **1.5 H.P. heavy-duty motor**, **75 KG solid frame**, **high-yield output**).
2. SECTION HEADING: On a new line separated by double newlines (\n\n), include the section title:
   ### Key Features & Technical Specifications:
3. BULLET LIST: Include 4 to 6 specific bullet points starting with "• ". Each bullet point MUST begin with a **Bold Feature Name:** followed by details (e.g. • **Powerful Motor:** Driven by a robust 1.5 H.P. motor...). Use **bold text** for key numbers, capacities, or materials inside the description text. Put EACH bullet point on its own new line separated by blank lines (\n\n).
4. CLOSING PARAGRAPH: On a new line separated by double newlines (\n\n), write a short closing sentence emphasizing low maintenance, durability, and factory-direct warranty from Durga Manufactor.
5. NO INLINE BLOBS: Always put double line breaks (\n\n) between paragraphs, headers, and bullets. Never merge headings or bullets inline on the same line. Do NOT output code fences or quotes.`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ role: "user", parts: [{ text: prompt }] }],
            }),
          }
        );

        const data = await response.json();
        if (data?.error) {
          console.error("Gemini AI API Error:", data.error.message || data.error);
        } else {
          generatedDescription = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        }
      } catch (err) {
        console.error("Gemini AI Description generation error:", err.message);
      }
    }

    // 2. Smart local generator fallback if Gemini key is not set or call failed
    if (!generatedDescription) {
      generatedDescription = buildLocalAiDescription({ name, category, description, table });
    }

    res.json({
      success: true,
      data: {
        description: generatedDescription.trim(),
      },
    });
  } catch (error) {
    console.error("Generate AI Description Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate AI description.",
      error: error.message,
    });
  }
};

function buildLocalAiDescription({ name, category, description, table }) {
  const prodName = name?.trim() || "Commercial Machinery Unit";
  const catName = category?.trim() || "Food Processing Equipment";

  let specsList = [];
  if (Array.isArray(table)) {
    table.forEach((row) => {
      if (Array.isArray(row) && row.length >= 2) {
        const key = row[0]?.trim();
        const val = row[1]?.trim();
        if (key && val) {
          specsList.push(`• **${key}:** ${val}`);
        }
      } else if (Array.isArray(row) && row.length === 1 && row[0]?.trim()) {
        specsList.push(`• ${row[0].trim()}`);
      }
    });
  }

  let intro = `The **${prodName}** by **Durga Manufactor** is a premium commercial-grade machine specifically engineered for high-volume commercial kitchens, food processing units, and catering outlets.`;

  if (catName) {
    intro += ` Designed for continuous operational excellence in the **${catName}** segment, this heavy-duty unit delivers high output yield with low operational vibration and minimal maintenance.`;
  }

  let bodyText = "";
  if (description && description.trim()) {
    bodyText = `\n\n${description.trim()}`;
  }

  let specsText = "";
  if (specsList.length > 0) {
    specsText = `\n\n### Key Features & Technical Specifications:\n\n` + specsList.join("\n\n");
  } else {
    specsText = `\n\n### Key Features & Technical Specifications:\n\n` +
      `• **Commercial Duty Build:** Heavy-duty body structure for continuous duty cycles.\n\n` +
      `• **High Efficiency Output:** Engineered for fast processing speeds and optimal energy efficiency.\n\n` +
      `• **Safety & Protection:** Thermal overload protection with vibration-dampened frame design.`;
  }

  const outro = `\n\nInvest in long-term operational reliability with this ultra-durable machine backed by Durga Manufactor's trusted factory-direct warranty and service support.`;

  return `${intro}${bodyText}${specsText}${outro}`;
}

// @desc    Bulk format and structure descriptions for ALL products in DB using Gemini AI or Local Generator
// @route   POST /api/products/bulk-format-descriptions
// @access  Private / Admin
export const bulkFormatDescriptions = async (req, res) => {
  try {
    const products = await Product.find({});
    if (!products || products.length === 0) {
      return res.json({
        success: true,
        message: "No products found in database to format.",
        updatedCount: 0,
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    let updatedCount = 0;

    for (const product of products) {
      let formattedDesc = "";
      const { name, category, description, table } = product;

      let formattedSpecs = "";
      if (Array.isArray(table)) {
        formattedSpecs = table
          .map((row) => (Array.isArray(row) ? row.join(": ") : row))
          .filter(Boolean)
          .join("\n• ");
      }

      if (apiKey) {
        try {
          const prompt = `You are an elite industrial machinery copywriter for Durga Manufactor.
Generate a premium, beautifully structured commercial product description for this machinery listing:

Product Details:
- Product Name: ${name || "Industrial Machine"}
- Category: ${category || "Commercial Food Processing Machine"}
- Current Overview Notes: ${description || "N/A"}
- Technical Specifications:
${formattedSpecs ? "• " + formattedSpecs : "Standard commercial specifications"}

STRICT STRUCTURE & FORMATTING REQUIREMENTS:
1. OVERVIEW PARAGRAPH: Write a compelling opening paragraph (2-3 sentences). Use **bold text** for the product name and key highlights (e.g. **1.5 H.P. heavy-duty motor**, **75 KG solid frame**, **high-yield output**).
2. SECTION HEADING: On a new line separated by double newlines (\n\n), include the section title:
   ### Key Features & Technical Specifications:
3. BULLET LIST: Include 4 to 6 specific bullet points starting with "• ". Each bullet point MUST begin with a **Bold Feature Name:** followed by details (e.g. • **Powerful Motor:** Driven by a robust 1.5 H.P. motor...). Use **bold text** for key numbers, capacities, or materials inside the description text. Put EACH bullet point on its own new line separated by blank lines (\n\n).
4. CLOSING PARAGRAPH: On a new line separated by double newlines (\n\n), write a short closing sentence emphasizing low maintenance, durability, and factory-direct warranty from Durga Manufactor.
5. NO INLINE BLOBS: Always put double line breaks (\n\n) between paragraphs, headers, and bullets. Never merge headings or bullets inline on the same line. Do NOT output code fences or quotes.`;

          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: prompt }] }],
              }),
            }
          );

          const data = await response.json();
          if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
            formattedDesc = data.candidates[0].content.parts[0].text;
          }
        } catch (err) {
          console.error(`Bulk format error for ${product._id}:`, err.message);
        }
      }

      // Fallback to local formatter if Gemini key is missing or failed
      if (!formattedDesc || !formattedDesc.trim()) {
        formattedDesc = buildLocalAiDescription({ name, category, description, table });
      }

      if (formattedDesc && formattedDesc.trim()) {
        product.description = formattedDesc.trim();
        await product.save();
        updatedCount++;
      }
    }

    res.json({
      success: true,
      message: `Successfully formatted descriptions for ${updatedCount} product(s) using Gemini AI!`,
      updatedCount,
    });
  } catch (error) {
    console.error("Bulk Format Descriptions Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to bulk format descriptions.",
      error: error.message,
    });
  }
};
