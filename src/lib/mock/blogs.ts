import type { JSONContent } from "@tiptap/core";

export type BlogStatus =
  | "draft"
  | "review"
  | "scheduled"
  | "published"
  | "archived";

export const HARDCODED_AUTHOR = "Leafs & Lines";

export const formatPublishedDate = (date: string) =>
  new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(date));

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  dek: string;
  readingTime: number;
  publishedAt: string;
  status: BlogStatus;
  contentJson: JSONContent;
};

export const blogPosts: BlogPost[] = [
  {
    id: "b-001",
    slug: "building-a-library-that-remembers",
    title: "Building a library that remembers where you left off",
    dek: "A product note on reading state, humane defaults, and why PDF tools should stay out of the way until needed.",
    readingTime: 7,
    publishedAt: "2026-07-12",
    status: "published",
    contentJson: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "When we designed this workspace, we wanted PDF documents and articles to share a single quiet environment. Many web readers push ads, popups, and sidebars before the user has read a paragraph. We chose the opposite approach: clean typography, calm tone, and immediate focus.",
            },
          ],
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Three principles for calm reading" }],
        },
        {
          type: "bulletList",
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "Give long-form prose generous line length and line height.",
                    },
                  ],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "Keep toolbars predictable so users don't hunt for basic actions.",
                    },
                  ],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "Store reading state naturally without requiring account clutter.",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: "blockquote",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Software for reading should feel like a sturdy desk, not a noisy airport terminal.",
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: "b-002",
    slug: "why-editorial-rows-beat-card-soup",
    title: "Why editorial rows beat card soup",
    dek: "Content discovery improves when articles keep their hierarchy, metadata, and rhythm instead of becoming identical tiles.",
    readingTime: 5,
    publishedAt: "2026-07-08",
    status: "published",
    contentJson: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Cards are useful, but a whole publication made only of cards quickly loses editorial judgment. Rows let titles breathe, summaries carry nuance, and metadata stay predictable.",
            },
          ],
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Hierarchy is a reading feature" }],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "A featured essay can be visual and generous. A latest list should be scannable. Related reading should be quiet. These differences help readers decide where to spend attention.",
            },
          ],
        },
        {
          type: "bulletList",
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Use rows for most articles." }],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [
                    { type: "text", text: "Reserve image cards for featured content." },
                  ],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [
                    { type: "text", text: "Keep metadata compact and consistent." },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: "b-003",
    slug: "notes-from-a-focused-pdf-reader",
    title: "Notes from a focused PDF reader",
    dek: "PDF reading works best when the toolbar is persistent, the page is stable, and side rails are optional.",
    readingTime: 6,
    publishedAt: "2026-06-28",
    status: "published",
    contentJson: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "PDFs are fixed-format documents, so the app around them has to be flexible. The reader should make the page stable first, then layer controls around it.",
            },
          ],
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Controls belong in predictable places" }],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Desktop readers can afford a toolbar and rails. Mobile readers need a single document viewport and large controls. In both cases, current page, progress, and search matches should use blue as the orientation signal.",
            },
          ],
        },
      ],
    },
  },
];

export const emptyTiptapDocument: JSONContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
    },
  ],
};
