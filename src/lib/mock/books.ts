export type BookStatus = "available" | "saved" | "completed";

export type Book = {
  id: string;
  slug: string;
  title: string;
  author: string;
  category: string;
  description: string;
  pages: number;
  status: BookStatus;
  pdfUrl: string;
  coverTone: "blue" | "cyan" | "slate";
  hidden?: boolean;
};

export const books: Book[] = [
  {
    id: "book-taj-mahal-zero-point",
    slug: "taj-mahal-say-zero-point",
    title: "Taj Mahal Say Zero Point",
    author: "Mustansar Hussain Tarar",
    category: "Travelogue & Literature",
    description:
      "An extraordinary travelogue and literary work detailing the epic journey from Taj Mahal to Zero Point.",
    pages: 350,
    status: "available",
    pdfUrl: "/Docs/Taj%20Mehal%20Say%20Zero%20Point%20(1).pdf",
    coverTone: "cyan",
  },
  {
    id: "book-python-intro",
    slug: "intro-to-python",
    title: "Intro to Python",
    author: "Course Notes",
    category: "Programming & Computer Science",
    description:
      "A practical PDF introduction to Python fundamentals, written as a compact learning companion.",
    pages: 152,
    status: "available",
    pdfUrl: "/Docs/intro%20to%20python",
    coverTone: "blue",
  },
];

export function getBookBySlug(slug: string) {
  return books.find((book) => book.slug === slug);
}

export function getBookById(id: string) {
  return books.find((book) => book.id === id);
}
