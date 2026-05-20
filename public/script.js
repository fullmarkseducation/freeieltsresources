const requestForm = document.querySelector("#requestForm");
const requestStatus = document.querySelector("#requestStatus");
const requestEmail = "freeieltsresources@outlook.com";
const blogList = document.querySelector("#blogList");
const postView = document.querySelector("#postView");
const postCategory = document.querySelector("#postCategory");
const postTitle = document.querySelector("#postTitle");
const postMeta = document.querySelector("#postMeta");
const postBody = document.querySelector("#postBody");

let blogPosts = [];

if (requestForm) {
  requestForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(requestForm);
    const summary = [
      `Name: ${data.get("name")}`,
      `Email: ${data.get("email")}`,
      `Help type: ${data.get("helpType")}`,
      `IELTS type: ${data.get("ieltsType")}`,
      `Target band: ${data.get("targetBand") || "Not provided"}`,
      `Test date: ${data.get("testDate") || "Not provided"}`,
      "",
      "Message:",
      data.get("message")
    ].join("\n");

    requestStatus.textContent = summary;

    const subject = encodeURIComponent(`Free IELTS Resources request: ${data.get("helpType")}`);
    const body = encodeURIComponent(summary);
    window.location.href = `mailto:${requestEmail}?subject=${subject}&body=${body}`;
  });
}

const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;"
  })[character]);

const renderInlineMarkdown = (value) => escapeHtml(value)
  .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
  .replace(/\*(.+?)\*/g, "<em>$1</em>");

const parseMarkdownImage = (value) => {
  const match = value.match(/^!\[([^\]]*)\]\((<[^>]+>|[^)\s]+)(?:\s+["']([^"']+)["'])?\)$/);

  if (!match) {
    return null;
  }

  const source = match[2].replace(/^<|>$/g, "");

  return {
    alt: match[1],
    source,
    title: match[3] || ""
  };
};

const renderMarkdown = (markdown) => {
  const lines = markdown.split(/\r?\n/);
  const html = [];
  let listOpen = false;

  const closeList = () => {
    if (listOpen) {
      html.push("</ul>");
      listOpen = false;
    }
  };

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed) {
      closeList();
      return;
    }

    if (trimmed.startsWith("### ")) {
      closeList();
      html.push(`<h3>${renderInlineMarkdown(trimmed.slice(4))}</h3>`);
      return;
    }

    if (trimmed.startsWith("## ")) {
      closeList();
      html.push(`<h2>${renderInlineMarkdown(trimmed.slice(3))}</h2>`);
      return;
    }

    const image = parseMarkdownImage(trimmed);
    if (image) {
      closeList();
      const title = image.title ? ` title="${escapeHtml(image.title)}"` : "";
      html.push(`<figure class="post-image"><img src="${escapeHtml(image.source)}" alt="${escapeHtml(image.alt)}"${title} loading="lazy"></figure>`);
      return;
    }

    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      if (!listOpen) {
        html.push("<ul>");
        listOpen = true;
      }
      html.push(`<li>${renderInlineMarkdown(trimmed.slice(2))}</li>`);
      return;
    }

    closeList();
    html.push(`<p>${renderInlineMarkdown(trimmed)}</p>`);
  });

  closeList();
  return html.join("");
};

const renderBlogPosts = (posts) => {
  blogList.innerHTML = "";
  const limit = Number(blogList.dataset.limit || posts.length);

  posts.slice(0, limit).forEach((post) => {
    const article = document.createElement("article");
    article.className = "blog-card";
    article.innerHTML = `
      <span class="tag">${escapeHtml(post.category || "IELTS")}</span>
      <h3>${escapeHtml(post.title)}</h3>
      <p class="post-meta">${escapeHtml(post.dateLabel)} · ${escapeHtml(post.readingTime)}</p>
      <p>${escapeHtml(post.excerpt)}</p>
      <a href="/blog/post.html?slug=${encodeURIComponent(post.slug)}">Read article</a>
    `;
    blogList.append(article);
  });
};

const renderPostPage = (posts) => {
  const slug = new URLSearchParams(window.location.search).get("slug");
  const post = posts.find((item) => item.slug === slug) || posts[0];

  if (!post) {
    postTitle.textContent = "Article not found";
    postMeta.textContent = "";
    postBody.innerHTML = "<p>Return to the blog to choose another article.</p>";
    return;
  }

  document.title = `${post.title} | Free IELTS Resources`;
  postCategory.textContent = post.category || "IELTS";
  postTitle.textContent = post.title;
  postMeta.textContent = `${post.dateLabel} · ${post.readingTime}`;
  postBody.innerHTML = renderMarkdown(post.body);
};

const loadBlogPosts = async () => {
  try {
    const response = await fetch("/blog-data.json");
    if (!response.ok) {
      throw new Error("Blog data failed to load");
    }

    blogPosts = await response.json();
    if (blogList) {
      renderBlogPosts(blogPosts);
    }
    if (postView) {
      renderPostPage(blogPosts);
    }
  } catch (error) {
    if (blogList) {
      blogList.innerHTML = `
        <article class="blog-card">
          <span class="tag">Blog</span>
          <h3>Blog posts are not available yet</h3>
          <p>Run npm run content after adding Markdown posts through TinaCMS.</p>
        </article>
      `;
    }
    if (postView) {
      postTitle.textContent = "Article not available";
      postBody.innerHTML = "<p>Run npm run content after adding Markdown posts through TinaCMS.</p>";
    }
  }
};

if (blogList || postView) {
  loadBlogPosts();
}
