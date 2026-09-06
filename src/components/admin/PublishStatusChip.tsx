import type { BlogStatus } from "@/lib/mock/blogs";

const statusStyles: Record<BlogStatus, string> = {
  draft: "bg-blue-600 text-white font-bold shadow-sm",
  review: "bg-cyan-600 text-white font-bold shadow-sm",
  scheduled: "bg-amber-600 text-white font-bold shadow-sm",
  published: "bg-emerald-600 text-white font-bold shadow-sm",
  archived: "bg-orange-600 text-white font-bold shadow-sm",
};

export function PublishStatusChip({ status }: { status: BlogStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold capitalize text-white ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}
