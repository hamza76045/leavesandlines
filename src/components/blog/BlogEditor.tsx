"use client";

import type { JSONContent } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";
import {
  Bold,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Save,
  Undo2,
} from "lucide-react";
import { useState } from "react";
import { tiptapExtensions } from "@/lib/tiptap/extensions";

type BlogEditorProps = {
  initialId?: string;
  initialSlug?: string;
  initialTitle?: string;
  initialDek?: string;
  initialContent: JSONContent;
};

type ToolButtonProps = {
  label: string;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick: () => void;
};

function ToolButton({
  label,
  active = false,
  disabled = false,
  children,
  onClick,
}: ToolButtonProps) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`grid size-10 place-items-center rounded-lg border text-sm transition ${
        active
          ? "border-brand bg-brand-soft text-brand"
          : "border-border bg-surface text-muted hover:border-brand hover:text-brand"
      } disabled:cursor-not-allowed disabled:opacity-40`}
    >
      {children}
    </button>
  );
}

export function BlogEditor({
  initialId,
  initialSlug,
  initialTitle = "",
  initialDek = "",
  initialContent,
}: BlogEditorProps) {
  const [postId, setPostId] = useState(initialId);
  const [postSlug, setPostSlug] = useState(initialSlug);
  const [title, setTitle] = useState(initialTitle);
  const [dek, setDek] = useState(initialDek);
  const [contentJson, setContentJson] = useState<JSONContent>(initialContent);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editor = useEditor({
    extensions: tiptapExtensions,
    content: initialContent,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "editorial-prose max-w-none rounded-lg border border-border bg-surface px-5 py-5 focus:outline-none focus:border-brand w-full",
      },
    },
    onUpdate({ editor: currentEditor }) {
      setContentJson(currentEditor.getJSON());
    },
  });

  const canUndo = editor?.can().undo() ?? false;
  const canRedo = editor?.can().redo() ?? false;

  async function handleSave(status: "draft" | "published") {
    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: postId,
          slug: postSlug,
          title,
          dek,
          status,
          contentJson,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save post");
      } else if (data.post) {
        setPostId(data.post.id);
        setPostSlug(data.post.slug);
        setSavedAt(new Date().toLocaleTimeString());
        setSaveMessage(
          status === "published"
            ? "Published successfully to Supabase!"
            : "Draft saved successfully to Supabase!",
        );
      }
    } catch {
      setError("Failed to persist to Supabase");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="min-w-0 space-y-4">
        <div className="rounded-lg border border-border bg-surface p-5">
          <div>
            <label className="block">
              <span className="text-sm font-bold text-text">Title</span>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="mt-2 h-12 w-full rounded-lg border border-border bg-surface px-3 text-lg font-semibold text-text outline-none transition focus:border-brand"
                placeholder="Article title"
              />
            </label>
          </div>
          <label className="mt-4 block">
            <span className="text-sm font-bold text-text">Dek</span>
            <textarea
              value={dek}
              onChange={(event) => setDek(event.target.value)}
              className="mt-2 min-h-24 w-full resize-y rounded-lg border border-border bg-surface px-3 py-3 text-text outline-none transition focus:border-brand"
              placeholder="Short summary for index and article header"
            />
          </label>
        </div>

        <div className="mt-5 rounded-lg border border-border bg-surface-raised">
          <div className="flex flex-wrap items-center gap-2 border-b border-border p-3">
            <ToolButton
              label="Undo"
              disabled={!canUndo}
              onClick={() => editor?.chain().focus().undo().run()}
            >
              <Undo2 size={17} />
            </ToolButton>
            <ToolButton
              label="Redo"
              disabled={!canRedo}
              onClick={() => editor?.chain().focus().redo().run()}
            >
              <Redo2 size={17} />
            </ToolButton>
            <span className="mx-1 h-8 w-px bg-border" />
            <ToolButton
              label="Heading 2"
              active={editor?.isActive("heading", { level: 2 })}
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 2 }).run()
              }
            >
              <Heading2 size={17} />
            </ToolButton>
            <ToolButton
              label="Heading 3"
              active={editor?.isActive("heading", { level: 3 })}
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 3 }).run()
              }
            >
              <Heading3 size={17} />
            </ToolButton>
            <ToolButton
              label="Bold"
              active={editor?.isActive("bold")}
              onClick={() => editor?.chain().focus().toggleBold().run()}
            >
              <Bold size={17} />
            </ToolButton>
            <ToolButton
              label="Italic"
              active={editor?.isActive("italic")}
              onClick={() => editor?.chain().focus().toggleItalic().run()}
            >
              <Italic size={17} />
            </ToolButton>
            <ToolButton
              label="Bulleted list"
              active={editor?.isActive("bulletList")}
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
            >
              <List size={17} />
            </ToolButton>
            <ToolButton
              label="Numbered list"
              active={editor?.isActive("orderedList")}
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            >
              <ListOrdered size={17} />
            </ToolButton>
            <ToolButton
              label="Quote"
              active={editor?.isActive("blockquote")}
              onClick={() => editor?.chain().focus().toggleBlockquote().run()}
            >
              <Quote size={17} />
            </ToolButton>
          </div>
          <div className="tiptap-editor p-4">
            {editor ? (
              <EditorContent className="w-full" editor={editor} />
            ) : (
              <div className="h-96 animate-pulse rounded-lg bg-slate-100" />
            )}
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="min-h-5 flex-1 text-sm font-semibold" aria-live="polite">
          {saving ? (
            <span className="text-muted">Saving to Supabase...</span>
          ) : error ? (
            <span className="text-danger">{error}</span>
          ) : saveMessage ? (
            <span className="text-success">
              {saveMessage} ({savedAt})
            </span>
          ) : null}
        </div>
        <div className="flex shrink-0 justify-end gap-3">
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave("draft")}
            className="flex h-11 items-center justify-center gap-2 rounded-lg bg-brand-fill px-5 text-sm font-bold text-on-brand-fill transition hover:bg-brand-fill-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={16} className="text-white" />
            Save Draft
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave("published")}
            className="flex h-11 items-center justify-center rounded-lg bg-emerald-600 px-5 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Publish Article
          </button>
        </div>
      </div>
    </div>
  );
}
