"use client";

import { useEffect, useState } from "react";

type Comment = {
  id: string;
  text: string;
  date: string;
};

export default function JobComments({ slug }: { slug: string }) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);

  // Load comments for this job
  useEffect(() => {
    const stored = localStorage.getItem(`job-comments-${slug}`);
    if (stored) {
      setComments(JSON.parse(stored));
    }
  }, [slug]);

  // Save comment
  const handleSubmit = () => {
    if (!comment.trim()) return;

    const newComment: Comment = {
      id: crypto.randomUUID(),
      text: comment,
      date: new Date().toLocaleDateString(),
    };

    const updated = [newComment, ...comments];
    setComments(updated);
    localStorage.setItem(
      `job-comments-${slug}`,
      JSON.stringify(updated)
    );
    setComment("");
  };

  return (
    <section className="max-w-3xl mx-auto px-6 py-1">
      <h2 className="text-2xl font-semibold mb-2">
         Comments
      </h2>

      {/* Comment Input */}
      <div className=" rounded-md p-4 mb-2">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a comment..."
          className="w-full border rounded p-1 text-sm focus:outline-none focus:ring"
          rows={4}
        />
        <button
          onClick={handleSubmit}
          className="mt-2 border border-black px-6 py-2 text-sm tracking-widest hover:bg-black hover:text-white transition"
        >
          POST COMMENT
        </button>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((c) => (
          <div key={c.id} className="border-b pb-4">
            <p className="text-gray-800 mb-1">{c.text}</p>
            <span className="text-xs text-gray-500">{c.date}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
