import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import fetch from "node-fetch";
import * as cheerio from "cheerio";
import { SeoAnalysisResult, MetaTag, MetaTagStatus, SeoAnalysisCategory, SeoAnalysisSection } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Endpoint to analyze a website's SEO tags
  app.post("/api/analyze", async (req, res) => {
    try {
      const { url } = req.body;

      if (!url) {
        return res.status(400).json({ message: "URL is required" });
      }

      // Validate URL format
      try {
        new URL(url);
      } catch (error) {
        return res.status(400).json({ message: "Invalid URL format. Make sure to include https://" });
      }

      // Store request in memory storage
      await storage.saveRequest({
        url,
        requestDate: new Date().toISOString(),
      });

      // Fetch the HTML from the URL
      const response = await fetch(url);
      
      if (!response.ok) {
        return res.status(response.status).json({ 
          message: `Failed to fetch URL: ${response.statusText}` 
        });
      }

      const html = await response.text();
      
      // Parse the HTML and extract SEO meta tags
      const analysisResult = analyzeSeoTags(url, html);
      
      return res.status(200).json(analysisResult);
    } catch (error) {
      console.error("Error analyzing URL:", error);
      return res.status(500).json({ 
        message: "Failed to analyze website. Please try again." 
      });
    }
  });

  return httpServer;
}

function analyzeSeoTags(url: string, html: string): SeoAnalysisResult {
  const $ = cheerio.load(html);
  
  // Initialize tag containers
  const tags: Record<string, MetaTag[]> = {
    basic: [],
    socialMedia: [],
    technical: []
  };
  
  // Extract all meta tags
  // Basic SEO Tags
  const title = $('title').text();
  const metaDescription = $('meta[name="description"]').attr('content');
  const viewport = $('meta[name="viewport"]').attr('content');
  const robots = $('meta[name="robots"]').attr('content');
  
  // Social Media Tags
  const ogTitle = $('meta[property="og:title"]').attr('content');
  const ogDescription = $('meta[property="og:description"]').attr('content');
  const ogImage = $('meta[property="og:image"]').attr('content');
  const ogUrl = $('meta[property="og:url"]').attr('content');
  const ogType = $('meta[property="og:type"]').attr('content');
  const ogSiteName = $('meta[property="og:site_name"]').attr('content');
  
  const twitterCard = $('meta[name="twitter:card"]').attr('content');
  const twitterTitle = $('meta[name="twitter:title"]').attr('content');
  const twitterDescription = $('meta[name="twitter:description"]').attr('content');
  const twitterImage = $('meta[name="twitter:image"]').attr('content');
  const twitterSite = $('meta[name="twitter:site"]').attr('content');
  const twitterCreator = $('meta[name="twitter:creator"]').attr('content');
  
  // Technical SEO Tags
  const canonical = $('link[rel="canonical"]').attr('href');
  const schema = $('script[type="application/ld+json"]').html();
  const hreflangTags = $('link[rel="alternate"][hreflang]');
  const openSearch = $('link[rel="search"][type="application/opensearchdescription+xml"]').attr('href');
  
  // Evaluate basic SEO tags
  tags.basic.push(evaluateTitleTag(title));
  tags.basic.push(evaluateMetaDescription(metaDescription));
  tags.basic.push(evaluateViewport(viewport));
  tags.basic.push(evaluateRobotsTag(robots));
  
  // Evaluate social media tags
  tags.socialMedia.push(evaluateOgTitle(ogTitle));
  tags.socialMedia.push(evaluateOgDescription(ogDescription));
  tags.socialMedia.push(evaluateOgImage(ogImage));
  tags.socialMedia.push(evaluateTwitterCard(twitterCard));
  tags.socialMedia.push(evaluateTwitterImage(twitterImage));
  
  // Evaluate technical SEO tags
  tags.technical.push(evaluateCanonical(canonical, url));
  tags.technical.push(evaluateHreflang(hreflangTags.length > 0));
  tags.technical.push(evaluateSchema(schema));
  tags.technical.push(evaluateOpenSearch(openSearch));
  
  // Create analysis sections
  const sections: SeoAnalysisSection[] = [
    createAnalysisSection("basic", "Basic SEO Tags", "search", tags.basic),
    createAnalysisSection("socialMedia", "Social Media Tags", "share-alt", tags.socialMedia),
    createAnalysisSection("technical", "Technical SEO Tags", "cogs", tags.technical)
  ];
  
  // Count tags by status
  const allTags = [...tags.basic, ...tags.socialMedia, ...tags.technical];
  const presentCount = allTags.filter(tag => tag.status === "optimal" || tag.status === "good").length;
  const improveCount = allTags.filter(tag => tag.status === "improve").length;
  const missingCount = allTags.filter(tag => tag.status === "missing").length;
  
  // Calculate overall score (simple algorithm)
  const score = calculateScore(allTags);
  
  // Create recommendations
  const recommendations = generateRecommendations(allTags);
  
  return {
    url,
    score,
    tags,
    sections,
    presentCount,
    improveCount,
    missingCount,
    recommendations
  };
}

// Evaluation functions for different meta tags
function evaluateTitleTag(content: string | undefined): MetaTag {
  if (!content) {
    return {
      type: "title",
      name: "Title Tag",
      content: null,
      status: "missing",
      statusText: "Missing",
      description: "Defines the page title in search results",
      bestPractices: [
        "55-60 characters in length",
        "Include primary keyword near the beginning",
        "Unique for each page",
        "Be descriptive and compelling"
      ],
      recommendation: "Add a descriptive title tag that includes your primary keyword"
    };
  }
  
  // Check title length
  const length = content.length;
  if (length < 10) {
    return {
      type: "title",
      name: "Title Tag",
      content,
      status: "improve",
      statusText: "Too Short",
      description: "Defines the page title in search results",
      bestPractices: [
        "55-60 characters in length (current: " + length + ")",
        "Include primary keyword near the beginning",
        "Unique for each page",
        "Be descriptive and compelling"
      ],
      recommendation: "Make your title longer and more descriptive (aim for 55-60 characters)"
    };
  }
  
  if (length > 70) {
    return {
      type: "title",
      name: "Title Tag",
      content,
      status: "improve",
      statusText: "Too Long",
      description: "Defines the page title in search results",
      bestPractices: [
        "55-60 characters in length (current: " + length + ")",
        "Include primary keyword near the beginning",
        "Unique for each page",
        "Be descriptive and compelling"
      ],
      recommendation: "Shorten your title to prevent truncation in search results (aim for 55-60 characters)"
    };
  }
  
  return {
    type: "title",
    name: "Title Tag",
    content,
    status: "optimal",
    statusText: "Optimal",
    description: "Defines the page title in search results",
    bestPractices: [
      "55-60 characters in length (current: " + length + ")",
      "Include primary keyword near the beginning",
      "Unique for each page", 
      "Be descriptive and compelling"
    ]
  };
}

function evaluateMetaDescription(content: string | undefined): MetaTag {
  if (!content) {
    return {
      type: "description",
      name: "Meta Description",
      content: null,
      status: "missing",
      statusText: "Missing",
      description: "Provides a summary shown in search results",
      bestPractices: [
        "120-158 characters in length",
        "Include relevant keywords naturally",
        "Provide a compelling reason to click",
        "Accurately summarize page content"
      ],
      recommendation: "Add a meta description that summarizes your page content"
    };
  }
  
  const length = content.length;
  if (length < 70) {
    return {
      type: "description",
      name: "Meta Description",
      content,
      status: "improve",
      statusText: "Too Short",
      description: "Provides a summary shown in search results",
      bestPractices: [
        "120-158 characters in length (current: " + length + ")",
        "Include relevant keywords naturally",
        "Provide a compelling reason to click",
        "Accurately summarize page content"
      ],
      recommendation: "Add more specific details to reach optimal length (120-158 characters)"
    };
  }
  
  if (length > 160) {
    return {
      type: "description",
      name: "Meta Description",
      content,
      status: "improve",
      statusText: "Too Long",
      description: "Provides a summary shown in search results",
      bestPractices: [
        "120-158 characters in length (current: " + length + ")",
        "Include relevant keywords naturally",
        "Provide a compelling reason to click",
        "Accurately summarize page content"
      ],
      recommendation: "Shorten your description to prevent truncation in search results (aim for 120-158 characters)"
    };
  }
  
  return {
    type: "description",
    name: "Meta Description",
    content,
    status: "optimal",
    statusText: "Optimal",
    description: "Provides a summary shown in search results",
    bestPractices: [
      "120-158 characters in length (current: " + length + ")",
      "Include relevant keywords naturally",
      "Provide a compelling reason to click",
      "Accurately summarize page content"
    ]
  };
}

function evaluateViewport(content: string | undefined): MetaTag {
  if (!content) {
    return {
      type: "viewport",
      name: "Viewport Meta Tag",
      content: null,
      status: "missing",
      statusText: "Missing",
      description: "Controls how page displays on mobile devices",
      bestPractices: [
        "Include width=device-width to match screen width",
        "Set initial-scale=1.0 for proper zoom level",
        "Avoid user-scalable=no as it hurts accessibility",
        "Essential for mobile-friendly pages and SEO"
      ],
      recommendation: "Add viewport meta tag: <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">"
    };
  }
  
  const hasDeviceWidth = content.includes("width=device-width");
  const hasInitialScale = content.includes("initial-scale=1");
  const hasUserScalableNo = content.includes("user-scalable=no");
  
  if (!hasDeviceWidth || !hasInitialScale) {
    return {
      type: "viewport",
      name: "Viewport Meta Tag",
      content,
      status: "improve",
      statusText: "Incomplete",
      description: "Controls how page displays on mobile devices",
      bestPractices: [
        "Include width=device-width to match screen width",
        "Set initial-scale=1.0 for proper zoom level",
        "Avoid user-scalable=no as it hurts accessibility",
        "Essential for mobile-friendly pages and SEO"
      ],
      recommendation: "Use complete viewport tag: <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">"
    };
  }
  
  if (hasUserScalableNo) {
    return {
      type: "viewport",
      name: "Viewport Meta Tag",
      content,
      status: "improve",
      statusText: "Accessibility Issue",
      description: "Controls how page displays on mobile devices",
      bestPractices: [
        "Include width=device-width to match screen width",
        "Set initial-scale=1.0 for proper zoom level",
        "Avoid user-scalable=no as it hurts accessibility",
        "Essential for mobile-friendly pages and SEO"
      ],
      recommendation: "Remove user-scalable=no to improve accessibility for users who need to zoom"
    };
  }
  
  return {
    type: "viewport",
    name: "Viewport Meta Tag",
    content,
    status: "optimal",
    statusText: "Optimal",
    description: "Controls how page displays on mobile devices",
    bestPractices: [
      "Include width=device-width to match screen width",
      "Set initial-scale=1.0 for proper zoom level",
      "Avoid user-scalable=no as it hurts accessibility",
      "Essential for mobile-friendly pages and SEO"
    ]
  };
}

function evaluateRobotsTag(content: string | undefined): MetaTag {
  if (!content) {
    return {
      type: "robots",
      name: "Robots Meta Tag",
      content: null,
      status: "missing",
      statusText: "Missing",
      description: "Controls search engine crawling behavior",
      bestPractices: [
        "Use index,follow for most public pages",
        "Use noindex for duplicate or low-value pages",
        "Use nofollow for untrusted content",
        "Consider using max-snippet and other directives"
      ],
      recommendation: "Add <meta name=\"robots\" content=\"index, follow\"> for most public pages"
    };
  }
  
  const hasIndex = content.includes("index");
  const hasNoindex = content.includes("noindex");
  
  if (hasNoindex) {
    return {
      type: "robots",
      name: "Robots Meta Tag",
      content,
      status: "improve",
      statusText: "Blocking Indexing",
      description: "Controls search engine crawling behavior",
      bestPractices: [
        "Use index,follow for most public pages",
        "Use noindex for duplicate or low-value pages",
        "Use nofollow for untrusted content",
        "Consider using max-snippet and other directives"
      ],
      recommendation: "This page is set to not be indexed. If this is a public page, change to 'index, follow'"
    };
  }
  
  return {
    type: "robots",
    name: "Robots Meta Tag",
    content,
    status: "optimal",
    statusText: "Optimal",
    description: "Controls search engine crawling behavior",
    bestPractices: [
      "Use index,follow for most public pages",
      "Use noindex for duplicate or low-value pages",
      "Use nofollow for untrusted content",
      "Consider using max-snippet and other directives"
    ]
  };
}

function evaluateOgTitle(content: string | undefined): MetaTag {
  if (!content) {
    return {
      type: "ogTitle",
      name: "og:title",
      content: null,
      status: "missing",
      statusText: "Missing",
      description: "Title displayed when shared on Facebook",
      bestPractices: [
        "Keep under 60 characters",
        "Be specific and engaging",
        "Include branding if relevant",
        "Should match or be similar to page title"
      ],
      recommendation: "Add <meta property=\"og:title\" content=\"Your Page Title\"> for better social sharing"
    };
  }
  
  const length = content.length;
  if (length > 90) {
    return {
      type: "ogTitle",
      name: "og:title",
      content,
      status: "improve",
      statusText: "Too Long",
      description: "Title displayed when shared on Facebook",
      bestPractices: [
        "Keep under 60 characters (current: " + length + ")",
        "Be specific and engaging",
        "Include branding if relevant",
        "Should match or be similar to page title"
      ],
      recommendation: "Shorten your og:title to under 60 characters for optimal display"
    };
  }
  
  return {
    type: "ogTitle",
    name: "og:title",
    content,
    status: "optimal",
    statusText: "Present",
    description: "Title displayed when shared on Facebook",
    bestPractices: [
      "Keep under 60 characters (current: " + length + ")",
      "Be specific and engaging",
      "Include branding if relevant",
      "Should match or be similar to page title"
    ]
  };
}

function evaluateOgDescription(content: string | undefined): MetaTag {
  if (!content) {
    return {
      type: "ogDescription",
      name: "og:description",
      content: null,
      status: "missing",
      statusText: "Missing",
      description: "Description displayed in social shares",
      bestPractices: [
        "Aim for 2-4 sentences (around 200 characters)",
        "Be compelling and informative",
        "Include a call to action if appropriate",
        "Can be similar to meta description"
      ],
      recommendation: "Add <meta property=\"og:description\" content=\"Your description\"> for better social sharing"
    };
  }
  
  const length = content.length;
  if (length < 100) {
    return {
      type: "ogDescription",
      name: "og:description",
      content,
      status: "improve",
      statusText: "Too Short",
      description: "Description displayed in social shares",
      bestPractices: [
        "Aim for 2-4 sentences (around 200 characters)",
        "Current length: " + length + " characters",
        "Be compelling and informative",
        "Include a call to action if appropriate"
      ],
      recommendation: "Extend your og:description to be more informative (aim for ~200 characters)"
    };
  }
  
  return {
    type: "ogDescription",
    name: "og:description",
    content,
    status: "optimal",
    statusText: "Present",
    description: "Description displayed in social shares",
    bestPractices: [
      "Aim for 2-4 sentences (around 200 characters)",
      "Current length: " + length + " characters",
      "Be compelling and informative",
      "Include a call to action if appropriate"
    ]
  };
}

function evaluateOgImage(content: string | undefined): MetaTag {
  if (!content) {
    return {
      type: "ogImage",
      name: "og:image",
      content: null,
      status: "missing",
      statusText: "Missing",
      description: "Image displayed in social shares",
      bestPractices: [
        "Use images at least 1200×630 pixels (ideal ratio 1.91:1)",
        "Keep file size under 8MB",
        "Use PNG, JPEG or GIF format",
        "Include branding and relevant content"
      ],
      recommendation: "Add <meta property=\"og:image\" content=\"https://yoursite.com/images/social-share.jpg\"> for better visibility"
    };
  }
  
  return {
    type: "ogImage",
    name: "og:image",
    content,
    status: "optimal",
    statusText: "Present",
    description: "Image displayed in social shares",
    bestPractices: [
      "Use images at least 1200×630 pixels (ideal ratio 1.91:1)",
      "Keep file size under 8MB",
      "Use PNG, JPEG or GIF format",
      "Include branding and relevant content"
    ]
  };
}

function evaluateTwitterCard(content: string | undefined): MetaTag {
  if (!content) {
    return {
      type: "twitterCard",
      name: "twitter:card",
      content: null,
      status: "missing",
      statusText: "Missing",
      description: "Controls Twitter share display type",
      bestPractices: [
        "Use summary_large_image for better visibility",
        "summary is acceptable but less engaging",
        "app card for mobile applications",
        "player card for media content"
      ],
      recommendation: "Add <meta name=\"twitter:card\" content=\"summary_large_image\"> for better Twitter visibility"
    };
  }
  
  if (content === "summary") {
    return {
      type: "twitterCard",
      name: "twitter:card",
      content,
      status: "improve",
      statusText: "Suboptimal",
      description: "Controls Twitter share display type",
      bestPractices: [
        "Use summary_large_image for better visibility",
        "summary is acceptable but less engaging",
        "app card for mobile applications",
        "player card for media content"
      ],
      recommendation: "Change to <meta name=\"twitter:card\" content=\"summary_large_image\"> for better visibility"
    };
  }
  
  return {
    type: "twitterCard",
    name: "twitter:card",
    content,
    status: "optimal",
    statusText: "Optimal",
    description: "Controls Twitter share display type",
    bestPractices: [
      "Use summary_large_image for better visibility",
      "summary is acceptable but less engaging",
      "app card for mobile applications",
      "player card for media content"
    ]
  };
}

function evaluateTwitterImage(content: string | undefined): MetaTag {
  if (!content) {
    return {
      type: "twitterImage",
      name: "twitter:image",
      content: null,
      status: "missing",
      statusText: "Missing",
      description: "Image for Twitter shares",
      bestPractices: [
        "Minimum size of 144x144 pixels",
        "For summary_large_image: 300x157 pixels minimum",
        "Maximum file size of 5MB",
        "Use png, jpg, or gif format"
      ],
      recommendation: "Add <meta name=\"twitter:image\" content=\"https://yoursite.com/images/twitter.jpg\"> for better engagement"
    };
  }
  
  return {
    type: "twitterImage",
    name: "twitter:image",
    content,
    status: "optimal",
    statusText: "Present",
    description: "Image for Twitter shares",
    bestPractices: [
      "Minimum size of 144x144 pixels",
      "For summary_large_image: 300x157 pixels minimum",
      "Maximum file size of 5MB",
      "Use png, jpg, or gif format"
    ]
  };
}

function evaluateCanonical(content: string | undefined, pageUrl: string): MetaTag {
  if (!content) {
    return {
      type: "canonical",
      name: "Canonical URL",
      content: null,
      status: "missing",
      statusText: "Missing",
      description: "Specifies the preferred version of a page",
      bestPractices: [
        "Should point to the most authoritative version of the page",
        "Use absolute URLs with protocol (https://)",
        "Should match the current URL for unique pages",
        "Essential for pages with multiple entry points or parameters"
      ],
      recommendation: `Add <link rel="canonical" href="${pageUrl}">`
    };
  }
  
  // Check if canonical URL matches current URL or is relative
  const canonicalUrl = new URL(content, pageUrl);
  const currentUrl = new URL(pageUrl);
  
  if (canonicalUrl.pathname !== currentUrl.pathname) {
    return {
      type: "canonical",
      name: "Canonical URL",
      content,
      status: "improve",
      statusText: "Different URL",
      description: "Specifies the preferred version of a page",
      bestPractices: [
        "Should point to the most authoritative version of the page",
        "Use absolute URLs with protocol (https://)",
        "Should match the current URL for unique pages",
        "Essential for pages with multiple entry points or parameters"
      ],
      recommendation: "Current canonical URL points to a different page, which may be intentional for duplicate content"
    };
  }
  
  return {
    type: "canonical",
    name: "Canonical URL",
    content,
    status: "optimal",
    statusText: "Present",
    description: "Specifies the preferred version of a page",
    bestPractices: [
      "Should point to the most authoritative version of the page",
      "Use absolute URLs with protocol (https://)",
      "Should match the current URL for unique pages",
      "Essential for pages with multiple entry points or parameters"
    ]
  };
}

function evaluateHreflang(hasHreflang: boolean): MetaTag {
  if (!hasHreflang) {
    return {
      type: "hreflang",
      name: "Hreflang Tags",
      content: null,
      status: "notApplicable",
      statusText: "N/A",
      description: "Indicates language/region variants of the page",
      bestPractices: [
        "Use for pages that target multiple languages or regions",
        "Include self-referencing hreflang tags",
        "Use correct language and region codes (e.g., en-us)",
        "All referenced pages should have reciprocal hreflang tags"
      ],
      recommendation: "Only needed for multilingual sites with specific regional targeting"
    };
  }
  
  return {
    type: "hreflang",
    name: "Hreflang Tags",
    content: "Multiple hreflang tags present",
    status: "optimal",
    statusText: "Present",
    description: "Indicates language/region variants of the page",
    bestPractices: [
      "Use for pages that target multiple languages or regions",
      "Include self-referencing hreflang tags",
      "Use correct language and region codes (e.g., en-us)",
      "All referenced pages should have reciprocal hreflang tags"
    ]
  };
}

function evaluateSchema(content: string | undefined): MetaTag {
  if (!content) {
    return {
      type: "schema",
      name: "Schema.org Markup",
      content: null,
      status: "missing",
      statusText: "Missing",
      description: "Structured data for rich search results",
      bestPractices: [
        "Use appropriate Schema.org type for your content",
        "Include all required properties for your Schema type",
        "Test with Google's Structured Data Testing Tool",
        "Consider multiple Schema types if appropriate"
      ],
      recommendation: "Add structured data in JSON-LD format based on your content type"
    };
  }
  
  let jsonContent;
  try {
    jsonContent = JSON.parse(content);
    
    // Simple check if it has basic schema properties
    if (!jsonContent['@context'] || !jsonContent['@type']) {
      return {
        type: "schema",
        name: "Schema.org Markup",
        content: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
        status: "improve",
        statusText: "Incomplete",
        description: "Structured data for rich search results",
        bestPractices: [
          "Use appropriate Schema.org type for your content",
          "Include all required properties for your Schema type",
          "Test with Google's Structured Data Testing Tool",
          "Consider multiple Schema types if appropriate"
        ],
        recommendation: "Schema.org markup is missing required properties (@context or @type)"
      };
    }
    
    // Check if it has minimal properties beyond the basics
    const propertyCount = Object.keys(jsonContent).length;
    if (propertyCount < 4) {
      return {
        type: "schema",
        name: "Schema.org Markup",
        content: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
        status: "improve",
        statusText: "Basic Only",
        description: "Structured data for rich search results",
        bestPractices: [
          "Use appropriate Schema.org type for your content",
          "Include all required properties for your Schema type",
          "Test with Google's Structured Data Testing Tool",
          "Consider multiple Schema types if appropriate"
        ],
        recommendation: "Add more properties to your Schema.org markup for richer search results"
      };
    }
    
  } catch (e) {
    return {
      type: "schema",
      name: "Schema.org Markup",
      content: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
      status: "improve",
      statusText: "Invalid Format",
      description: "Structured data for rich search results",
      bestPractices: [
        "Use appropriate Schema.org type for your content",
        "Include all required properties for your Schema type",
        "Test with Google's Structured Data Testing Tool",
        "Consider multiple Schema types if appropriate"
      ],
      recommendation: "Your Schema.org markup has invalid JSON. Check for syntax errors."
    };
  }
  
  return {
    type: "schema",
    name: "Schema.org Markup",
    content: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
    status: "optimal",
    statusText: "Present",
    description: "Structured data for rich search results",
    bestPractices: [
      "Use appropriate Schema.org type for your content",
      "Include all required properties for your Schema type",
      "Test with Google's Structured Data Testing Tool",
      "Consider multiple Schema types if appropriate"
    ]
  };
}

function evaluateOpenSearch(content: string | undefined): MetaTag {
  if (!content) {
    return {
      type: "openSearch",
      name: "Open Search",
      content: null,
      status: "missing",
      statusText: "Missing",
      description: "Allows browsers to search your site directly",
      bestPractices: [
        "Create an XML file with search parameters",
        "Link to it from your HTML",
        "Include a descriptive title for your search",
        "Specify the search URL template with parameters"
      ],
      recommendation: "Add <link rel=\"search\" type=\"application/opensearchdescription+xml\" title=\"Search Your Site\" href=\"/opensearch.xml\">"
    };
  }
  
  return {
    type: "openSearch",
    name: "Open Search",
    content,
    status: "optimal",
    statusText: "Present",
    description: "Allows browsers to search your site directly",
    bestPractices: [
      "Create an XML file with search parameters",
      "Link to it from your HTML",
      "Include a descriptive title for your search",
      "Specify the search URL template with parameters"
    ]
  };
}

// Helper function to create analysis sections
function createAnalysisSection(
  category: SeoAnalysisCategory, 
  title: string, 
  icon: string,
  tags: MetaTag[]
): SeoAnalysisSection {
  // Determine section status based on the worst tag status
  let sectionStatus: MetaTagStatus = "optimal";
  let statusText = "Good";
  
  if (tags.some(tag => tag.status === "missing" && tag.status !== "notApplicable")) {
    sectionStatus = "missing";
    statusText = "Missing Tags";
  } else if (tags.some(tag => tag.status === "improve")) {
    sectionStatus = "improve";
    statusText = "Needs Improvement";
  }
  
  return {
    category,
    title,
    icon,
    status: sectionStatus,
    statusText,
    tags
  };
}

// Calculate overall SEO score
function calculateScore(tags: MetaTag[]): number {
  const relevantTags = tags.filter(tag => tag.status !== "notApplicable");
  if (relevantTags.length === 0) return 0;
  
  // Weight by importance
  const weights: Record<MetaTagStatus, number> = {
    optimal: 1,
    good: 0.8,
    improve: 0.4,
    missing: 0,
    notApplicable: 0
  };
  
  // Calculate weighted score
  const totalScore = relevantTags.reduce((score, tag) => score + weights[tag.status], 0);
  const maxPossibleScore = relevantTags.length;
  
  return Math.round((totalScore / maxPossibleScore) * 100);
}

// Generate recommendations based on tag analysis
function generateRecommendations(tags: MetaTag[]) {
  const criticalMissing = tags
    .filter(tag => tag.status === "missing" && tag.status !== "notApplicable")
    .map(tag => tag.recommendation || `Add ${tag.name}`);
  
  const improvements = tags
    .filter(tag => tag.status === "improve")
    .map(tag => tag.recommendation || `Improve ${tag.name}`);
  
  const additional = [
    "Ensure proper heading structure (H1, H2, H3) throughout the page",
    "Optimize image alt text for better accessibility and SEO",
    "Consider adding breadcrumb navigation for improved user experience"
  ];
  
  return [
    {
      type: "critical",
      title: "Add Critical Missing Tags",
      description: "Implement the following missing tags to improve SEO performance:",
      items: criticalMissing.length > 0 ? criticalMissing : ["No critical missing tags found"]
    },
    {
      type: "improvement",
      title: "Optimize Existing Tags",
      description: "Improve these tags to enhance visibility:",
      items: improvements.length > 0 ? improvements : ["All existing tags are well optimized"]
    },
    {
      type: "additional",
      title: "Additional Considerations",
      description: "These improvements could further enhance your SEO:",
      items: additional
    }
  ];
}
