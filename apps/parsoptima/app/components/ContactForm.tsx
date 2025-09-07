'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you within 24 hours.');
    setFormData({
      name: '',
      company: '',
      email: '',
      phone: '',
      message: ''
    });
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Name *</label>
        <input 
          type="text" 
          id="name" 
          name="name" 
          value={formData.name}
          onChange={handleInputChange}
          required 
        />
      </div>
      <div className="form-group">
        <label htmlFor="company">Company</label>
        <input 
          type="text" 
          id="company" 
          name="company" 
          value={formData.company}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email *</label>
        <input 
          type="email" 
          id="email" 
          name="email" 
          value={formData.email}
          onChange={handleInputChange}
          required 
        />
      </div>
      <div className="form-group">
        <label htmlFor="phone">Phone</label>
        <input 
          type="tel" 
          id="phone" 
          name="phone" 
          value={formData.phone}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="message">Message *</label>
        <textarea 
          id="message" 
          name="message" 
          value={formData.message}
          onChange={handleInputChange}
          placeholder="Tell us about your distribution needs, partnership opportunities, or any questions you have..."
          required
        ></textarea>
      </div>
      <button type="submit" className="cta-button">Send Message</button>
    </form>
  );
}