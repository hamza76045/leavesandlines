"use client";

import type { JSONContent } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";
import { useEffect } from "react";
import { tiptapExtensions } from "@/lib/tiptap/extensions";

export function BlogRenderer({ content }: { content: JSONContent }) {
  const editor = useEditor({
    extensions: tiptapExtensions,
    content,
    editable: false,
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return (
      <div className="h-80 animate-pulse rounded-lg bg-slate-100" aria-hidden="true" />
    );
  }

  return <EditorContent editor={editor} className="editorial-prose" />;
}
