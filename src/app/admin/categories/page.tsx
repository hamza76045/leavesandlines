const categories = [
  { name: "Agriculture", posts: 0, books: 3 },
  { name: "Editorial", posts: 1, books: 0 },
  { name: "Product", posts: 1, books: 1 },
  { name: "Books", posts: 1, books: 0 },
  { name: "Programming", posts: 0, books: 1 },
  { name: "Publishing", posts: 0, books: 1 },
];

export default function CategoriesPage() {
  return (
    <div className="mx-auto w-full max-w-[960px] px-4 py-6 sm:px-6">
      <header className="flex flex-col gap-4 border-b border-border pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-bold text-brand">
            Categories
          </p>
          <h1 className="mt-2 font-serif text-3xl font-semibold text-text">
            Content taxonomy
          </h1>
        </div>
        <button
          type="button"
          className="h-10 rounded-lg bg-brand-fill px-4 text-sm font-bold text-on-brand-fill transition hover:bg-brand-fill-hover"
        >
          New Category
        </button>
      </header>

      <section className="mt-6 rounded-lg border border-border bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead className="border-b border-border bg-bg-soft text-xs text-subtle">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Posts</th>
                <th className="px-5 py-3">Books</th>
                <th className="px-5 py-3">State</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr
                  key={category.name}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-5 py-4 font-bold text-text">
                    {category.name}
                  </td>
                  <td className="px-5 py-4 text-muted">{category.posts}</td>
                  <td className="px-5 py-4 text-muted">{category.books}</td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-brand-soft px-2.5 py-1 text-xs font-bold text-brand">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
