module.exports = function(eleventyConfig) {

  // Pass CSS through to output
  eleventyConfig.addPassthroughCopy("css");

  // Date filter
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return new Date(dateObj).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric", timeZone: "UTC"
    });
  });

  // Filter out draft posts in production
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi
      .getFilteredByGlob("posts/*.md")
      .filter(post => !post.data.draft)
      .sort((a, b) => b.date - a.date);
  });

  // All posts including drafts (for local preview)
  eleventyConfig.addCollection("allPosts", function(collectionApi) {
    return collectionApi
      .getFilteredByGlob("posts/*.md")
      .sort((a, b) => b.date - a.date);
  });

  // Transform: wrap **Mike:** / **Claude:** paragraphs into conversation turns
  eleventyConfig.addTransform("conversation-turns", function(content, outputPath) {
    if (!outputPath || !outputPath.endsWith(".html")) return content;

    const lines = content.split("\n");
    const output = [];
    let inConversation = false;
    let currentSpeaker = null;
    let turnLines = [];

    function closeTurn() {
      if (currentSpeaker) {
        output.push(`<div class="turn">`);
        output.push(`<div class="turn-speaker ${currentSpeaker.toLowerCase()}">${currentSpeaker}</div>`);
        output.push(`<div class="turn-content">`);
        output.push(...turnLines);
        output.push(`</div></div>`);
        turnLines = [];
        currentSpeaker = null;
      }
    }

    function closeConversation() {
      closeTurn();
      if (inConversation) {
        output.push("</div>"); // close .conversation
        inConversation = false;
      }
    }

    for (const line of lines) {
      const speakerMatch = line.match(/^<p><strong>(Mike|Claude):<\/strong>\s*(.*)<\/p>$/);
      const isBreaker = /^<h[1-6][\s>]|^<hr/.test(line);
      const isParagraph = line.startsWith("<p>");

      if (speakerMatch) {
        const [, speaker, text] = speakerMatch;
        closeTurn();
        if (!inConversation) {
          output.push('<div class="conversation">');
          inConversation = true;
        }
        currentSpeaker = speaker;
        turnLines.push(`<p>${text}</p>`);
      } else if (currentSpeaker && isParagraph && !isBreaker) {
        // Continuation paragraph — belongs to current speaker's turn
        turnLines.push(line);
      } else if (isBreaker) {
        closeConversation();
        output.push(line);
      } else {
        if (currentSpeaker) closeConversation();
        output.push(line);
      }
    }

    closeConversation();
    return output.join("\n");
  });

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
