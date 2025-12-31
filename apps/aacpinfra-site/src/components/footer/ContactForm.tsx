"use client";

import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const mailTo = "info@aacpinfra.com";
    const subject = encodeURIComponent(form.subject || "Website Inquiry");
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`
    );

    window.location.href = `mailto:${mailTo}?subject=${subject}&body=${body}`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="name"
        placeholder="Name *"
        required
        value={form.name}
        onChange={handleChange}
        className="w-full p-3 bg-gray-100"
      />

      <input
        name="email"
        type="email"
        placeholder="Email *"
        required
        value={form.email}
        onChange={handleChange}
        className="w-full p-3 bg-gray-100"
      />

      <input
        name="subject"
        placeholder="Subject"
        value={form.subject}
        onChange={handleChange}
        className="w-full p-3 bg-gray-100"
      />

      <textarea
        name="message"
        placeholder="Message *"
        required
        value={form.message}
        onChange={handleChange}
        className="w-full p-3 bg-gray-100 h-32"
      />

      <button
        type="submit"
        className="bg-black text-white px-6 py-2"
      >
        Send
      </button>
    </form>
  );
}
