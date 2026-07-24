"use client";

import type { JSONContent } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";
import {
  Bold,
  Heading2,
  Heading3,
  ImageIcon,
  Italic,
  LinkIcon,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Save,
  ShieldCheck,
  Undo2,
} from "lucide-react";
import { useState } from "react";
import { tiptapExtensions } from "@/lib/tiptap/extensions";
import { BlogRenderer } from "./BlogRenderer";

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
  const [currentStatus, setCurrentStatus] = useState<"draft" | "published">("draft");
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
          "editorial-prose max-w-none rounded-lg border border-border bg-surface px-5 py-5 focus:outline-none focus:border-brand",
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
        setCurrentStatus(data.post.status);
        setSavedAt(new Date().toLocaleTimeString());
        setSaveMessage(
          status === "published"
            ? "Published successfully to Supabase!"
            : "Draft saved successfully to Supabase!"
        );
      }
    } catch {
      setError("Failed to persist to Supabase");
    } finally {
      setSaving(false);
    }
  }

  function addLink() {
    if (!editor) {
      return;
    }

    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", previousUrl ?? "https://");

    if (url === null) {
      return;
    }

    if (url.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  function addImage() {
    if (!editor) {
      return;
    }

    const url = window.prompt("Image URL");

    if (url?.trim()) {
      editor.chain().focus().setImage({ src: url.trim(), alt: title }).run();
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section className="min-w-0 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-brand/40 bg-brand-soft px-4 py-3 text-sm font-bold text-brand">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} />
            <span>Admin Editor Mode (Tiptap Rich Text Enabled)</span>
          </div>
          <span className="text-xs font-semibold text-muted">
            Only admins can edit or write. Readers have read-only access.
          </span>
        </div>

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
            <ToolButton
              label="Link"
              active={editor?.isActive("link")}
              onClick={addLink}
            >
              <LinkIcon size={17} />
            </ToolButton>
            <ToolButton label="Image" onClick={addImage}>
              <ImageIcon size={17} />
            </ToolButton>
          </div>
          <div className="tiptap-editor p-4">
            {editor ? (
              <EditorContent editor={editor} />
            ) : (
              <div className="h-96 animate-pulse rounded-lg bg-slate-100" />
            )}
          </div>
        </div>
      </section>

      <aside className="space-y-5">
        <div className="rounded-lg border border-border bg-surface p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-semibold text-text">
                Publish State
              </h2>
              <p className="mt-1 text-sm font-semibold text-muted">
                {saving ? "Saving to Supabase..." : "Ready"}
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${
                currentStatus === "published"
                  ? "bg-emerald-500/10 text-emerald-500"
                  : "bg-amber-500/10 text-amber-500"
              }`}
            >
              {currentStatus}
            </span>
          </div>

          {error ? (
            <div className="mt-4 rounded-lg bg-red-500/10 p-3 text-xs font-semibold text-red-500">
              {error}
            </div>
          ) : null}

          <div className="mt-5 grid gap-2">
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave("draft")}
              className="flex h-11 items-center justify-center gap-2 rounded-lg bg-brand px-4 text-sm font-bold !text-white transition hover:bg-brand-strong disabled:opacity-50"
            >
              <Save size={16} className="!text-white" />
              Save Draft
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave("published")}
              className="flex h-11 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-bold !text-white transition hover:bg-emerald-700 disabled:opacity-50"
            >
              Publish Article
            </button>
          </div>
          {saveMessage ? (
            <p className="mt-3 text-sm font-semibold text-success">
              {saveMessage} ({savedAt})
            </p>
          ) : null}
        </div>

        <div className="rounded-lg border border-border bg-surface p-5">
          <h2 className="font-display text-lg font-semibold text-text">
            Article Preview
          </h2>
          <p className="mt-1 text-sm text-muted">
            Check layout, hierarchy, and reading rhythm before publishing.
          </p>
          <div className="mt-5 border-t border-border pt-5">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand">
              Publication Preview
            </p>
            <h3 className="mt-2 font-display text-2xl font-semibold leading-tight text-text">
              {title || "Untitled article"}
            </h3>
            <p className="mt-3 text-sm leading-6 text-muted">
              {dek || "Add a dek to preview index copy."}
            </p>
            <div className="mt-5 max-h-[420px] overflow-auto rounded-lg border border-border bg-bg px-4 py-4">
              <BlogRenderer content={contentJson} />
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
