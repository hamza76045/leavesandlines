import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";

export const tiptapExtensions = [
  StarterKit.configure({
    heading: {
      levels: [2, 3, 4],
    },
    link: {
      autolink: true,
      defaultProtocol: "https",
      openOnClick: false,
    },
  }),
  Image.configure({
    allowBase64: false,
  }),
  Placeholder.configure({
    placeholder: "Write the article body...",
  }),
];
