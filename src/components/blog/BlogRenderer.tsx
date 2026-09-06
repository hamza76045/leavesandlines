import type { ReactNode } from "react";
import Image from "next/image";
import type { JSONContent } from "@tiptap/core";

function renderChildren(node: JSONContent) {
  return node.content?.map((child, index) => renderNode(child, index));
}

function renderText(node: JSONContent, key: number): ReactNode {
  let content: ReactNode = node.text;

  for (const mark of node.marks ?? []) {
    if (mark.type === "bold") content = <strong>{content}</strong>;
    if (mark.type === "italic") content = <em>{content}</em>;
    if (mark.type === "strike") content = <s>{content}</s>;
    if (mark.type === "code") content = <code>{content}</code>;
    if (mark.type === "link") {
      content = (
        <a href={String(mark.attrs?.href ?? "#")}>
          {content}
        </a>
      );
    }
  }

  return <span key={key}>{content}</span>;
}

function renderNode(node: JSONContent, key: number): ReactNode {
  if (node.type === "text") return renderText(node, key);

  const children = renderChildren(node);
  switch (node.type) {
    case "doc":
      return <div key={key}>{children}</div>;
    case "paragraph":
      return <p key={key}>{children}</p>;
    case "heading": {
      const level = Math.min(Math.max(Number(node.attrs?.level) || 2, 2), 4);
      if (level === 3) return <h3 key={key}>{children}</h3>;
      if (level === 4) return <h4 key={key}>{children}</h4>;
      return <h2 key={key}>{children}</h2>;
    }
    case "bulletList":
      return <ul key={key}>{children}</ul>;
    case "orderedList":
      return <ol key={key}>{children}</ol>;
    case "listItem":
      return <li key={key}>{children}</li>;
    case "blockquote":
      return <blockquote key={key}>{children}</blockquote>;
    case "codeBlock":
      return <pre key={key}><code>{children}</code></pre>;
    case "hardBreak":
      return <br key={key} />;
    case "horizontalRule":
      return <hr key={key} />;
    case "image":
      return node.attrs?.src ? (
        <Image
          key={key}
          src={String(node.attrs.src)}
          alt={String(node.attrs.alt ?? "Article image")}
          width={Number(node.attrs.width) || 1200}
          height={Number(node.attrs.height) || 675}
          sizes="(max-width: 768px) 100vw, 740px"
        />
      ) : null;
    default:
      return <span key={key}>{children}</span>;
  }
}

export function BlogRenderer({ content }: { content: JSONContent }) {
  return <div className="editorial-prose">{renderChildren(content)}</div>;
}
