import type { BlogPost } from "@/lib/mock/blogs";

export function ArticleMark({
  post,
  size = "regular",
}: {
  post: Pick<BlogPost, "title">;
  size?: "regular" | "large";
}) {
  return (
    <div
      className="grid aspect-[4/3] place-items-center rounded-lg border border-indigo-500/40 bg-[#1e1b4b] p-5 text-[#e0e7ff] shadow-md dark:border-indigo-400/50 dark:bg-[#1e1b4b] dark:text-[#f0f3ff]"
      aria-label={`${post.title} visual`}
    >
      <div className="w-full">
        <p
          className={`font-display font-semibold leading-tight ${
            size === "large" ? "text-2xl" : "text-lg"
          }`}
        >
          {post.title}
        </p>
      </div>
    </div>
  );
}
