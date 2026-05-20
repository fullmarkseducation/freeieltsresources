const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const contentDir = path.join(root, "content", "blog");
const outputPaths = [
  path.join(root, "public", "blog-data.json"),
  path.join(root, "blog-data.json")
];
const checkOnly = process.argv.includes("--check");

const parseFrontmatter = (source, filePath) => {
  const match = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

  if (!match) {
    throw new Error(`${filePath} is missing YAML frontmatter`);
  }

  const data = {};
  match[1].split(/\r?\n/).forEach((line) => {
    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) {
      return;
    }

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();
    value = value.replace(/^["']|["']$/g, "");
    data[key] = value;
  });

  return {
    data,
    body: match[2].trim()
  };
};

const formatDate = (value) => {
  if (!value) {
    return "Undated";
  }

  const parsedDate = new Date(value);
  const date = Number.isNaN(parsedDate.getTime()) ? new Date(`${value}T00:00:00`) : parsedDate;

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
};

const estimateReadingTime = (body) => {
  const words = body.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 220));
  return `${minutes} min read`;
};

const files = fs.existsSync(contentDir)
  ? fs.readdirSync(contentDir).filter((file) => file.endsWith(".md"))
  : [];

const posts = files
  .map((file) => {
    const filePath = path.join(contentDir, file);
    const { data, body } = parseFrontmatter(fs.readFileSync(filePath, "utf8"), filePath);
    const slug = data.slug || file.replace(/\.md$/, "");

    return {
      title: data.title || "Untitled post",
      slug,
      date: data.date || "",
      dateLabel: formatDate(data.date),
      category: data.category || "IELTS",
      excerpt: data.excerpt || body.split(/\n+/)[0].replace(/^#+\s*/, ""),
      readingTime: data.readingTime || estimateReadingTime(body),
      published: data.published !== "false",
      body
    };
  })
  .filter((post) => post.published)
  .sort((a, b) => b.date.localeCompare(a.date));

const json = `${JSON.stringify(posts, null, 2)}\n`;

if (checkOnly) {
  outputPaths.forEach((outputPath) => {
    const current = fs.existsSync(outputPath) ? fs.readFileSync(outputPath, "utf8") : "";
    if (current !== json) {
      throw new Error(`${path.relative(root, outputPath)} is out of date. Run npm run content.`);
    }
  });
} else {
  outputPaths.forEach((outputPath) => fs.writeFileSync(outputPath, json));
}

console.log(`${checkOnly ? "Checked" : "Built"} ${posts.length} blog post${posts.length === 1 ? "" : "s"}.`);
