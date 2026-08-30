export type BookStatus = "available" | "saved" | "completed";

export type Book = {
  id: string;
  slug: string;
  title: string;
  author: string;
  category: string;
  description: string;
  pages: number;
  language: string;
  format: string;
  status: BookStatus;
  pdfUrl: string;
  coverImage: string;
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
    language: "Urdu",
    format: "PDF",
    status: "available",
    pdfUrl: "/Docs/Taj%20Mehal%20Say%20Zero%20Point.pdf",
    coverImage: "/book-covers/taj-mahal-say-zero-point.jpg",
  },
];

export function getBookBySlug(slug: string) {
  return books.find((book) => book.slug === slug);
}

export function getBookById(id: string) {
  return books.find((book) => book.id === id);
}
