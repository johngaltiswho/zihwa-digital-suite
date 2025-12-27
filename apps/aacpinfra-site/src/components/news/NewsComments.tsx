"use client";

import { useState } from "react";

type Comment = {
  name: string;
  message: string;
  date: string;
};

export default function NewsComments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !message.trim()) return;

    setComments((prev) => [
      ...prev,
      {
        name,
        message,
        date: new Date().toLocaleDateString(),
      },
    ]);

    setName("");
    setMessage("");
  };

  return (
    <div className="mt-20 border-t pt-12">
      {/* ===== Heading ===== */}
      <h2 className="text-2xl font-serif text-black mb-8">
        Comments
      </h2>

      {/* ===== Existing Comments ===== */}
      <div className="space-y-6 mb-10">
        {comments.length === 0 && (
          <p className="text-gray-500 text-sm">
            No comments yet. Be the first to comment.
          </p>
        )}

        {comments.map((comment, index) => (
          <div
            key={index}
            className="border border-gray-200 p-4 rounded"
          >
            <p className="font-medium text-black">
              {comment.name}
            </p>
            <p className="text-xs text-gray-500 mb-2">
              {comment.date}
            </p>
            <p className="text-gray-700">
              {comment.message}
            </p>
          </div>
        ))}
      </div>

      {/* ===== Comment Form ===== */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 max-w-xl"
      >
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Comment
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full border text-black border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black"
            placeholder="Write your comment"
          />
        </div>

        <button
          type="submit"
          className="inline-block bg-black text-white px-6 py-2 text-sm uppercase tracking-wide hover:bg-gray-800 transition"
        >
          Post Comment
        </button>
      </form>
    </div>
  );
}
