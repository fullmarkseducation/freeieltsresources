import { defineConfig } from "tinacms";

const branch =
  process.env.NEXT_PUBLIC_TINA_BRANCH ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  token: process.env.TINA_TOKEN,
  localContentPath: "../content",
  build: {
    publicFolder: "public",
    outputFolder: "admin"
  },
  media: {
    tina: {
      publicFolder: "public",
      mediaRoot: "uploads"
    }
  },
  schema: {
    collections: [
      {
        name: "blog",
        label: "Blog Posts",
        path: "blog",
        format: "md",
        defaultItem: () => ({
          title: "New IELTS article",
          date: new Date().toISOString().slice(0, 10),
          category: "Writing",
          published: true
        }),
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true
          },
          {
            type: "string",
            name: "slug",
            label: "Slug",
            description: "Use lowercase words separated by hyphens, for example task-2-cohesion-tips."
          },
          {
            type: "datetime",
            name: "date",
            label: "Publish Date",
            required: true
          },
          {
            type: "string",
            name: "category",
            label: "Category",
            options: ["Writing", "Speaking", "Reading", "Listening", "Vocabulary", "Study Plan"]
          },
          {
            type: "string",
            name: "excerpt",
            label: "Excerpt",
            ui: {
              component: "textarea"
            }
          },
          {
            type: "boolean",
            name: "published",
            label: "Published"
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true
          }
        ]
      }
    ]
  }
});
