import { useState } from 'react';
import { contactInfo } from '../data/contactData.js'; 
import './Contact.css'; 

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would send this data to a server or email service.
    // For now, we'll just log it to the console.
    console.log("Form submitted:", formData);
    alert("Thank you for your message! I'll be in touch soon.");
    // Reset the form
    setFormData({ name: '', phone: '', email: '', message: '' });
  };

  return (
    <div className="contact-section" id="contact">
      <div className="contact-container">
        <div className="contact-form-wrapper">
          <h2>Get in Touch</h2>
          <p>Have a question or want to work together? Leave your details and I'll get back to you.</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Your Name" required />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="Your Phone Number" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="Your Email Address" required />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" value={formData.message} onChange={handleChange} placeholder="Your Message" rows="5" required></textarea>
            </div>
            <button type="submit" className="submit-btn">Send Message</button>
          </form>
        </div>
        <div className="contact-info-wrapper">
          <h3>Contact Information</h3>
          <p>Feel free to reach out to me directly through any of the following channels.</p>
          <ul className="contact-list">
            <li><strong>Email:</strong> <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a></li>
            <li><strong>Phone:</strong> <a href={`tel:${contactInfo.phone}`}>{contactInfo.phone}</a></li>
            <li><strong>LinkedIn:</strong> <a href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer">/in/keynbrosdahl</a></li>
            <li><strong>GitHub:</strong> <a href={contactInfo.github} target="_blank" rel="noopener noreferrer">/Keynb23</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Contact;
