import { useState } from "react";
// Import necessary services for the form submission
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { contactInfo } from "../data/contactData.js";
// NOTE: This now refers to the merged styles (Contact + Footer Bottom)
import "./Footer.css";

// ==========================================================
// 1. SVG Icons (Moved from Contact.jsx)
// ==========================================================

// SVG Icon for GitHub
const GitHubIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

// SVG Icon for LinkedIn
const LinkedInIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

// ==========================================================
// 2. Main Footer Component (Incorporates Contact Logic)
// ==========================================================

const Footer = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      await addDoc(collection(db, "inquiries"), {
        ...formData,
        timestamp: serverTimestamp(),
        status: "new",
      });

      setSubmitSuccess(true);
      setFormData({ name: "", phone: "", email: "", message: "" });
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error("Error submitting contact form:", error);
      setSubmitError(
        "Failed to send message. Please try again or use the email link."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // We use 'contact-section' as the main wrapper for the footer
    <footer className="contact-section" id="contact">
      <div className="contact-container">
        {/* FORM WRAPPER */}
        <div className="contact-form-wrapper">
          <h2>Get in Touch</h2>
          <p>
            Have a question or want to work together? Leave your details and
            I'll get back to you.
          </p>

          {submitSuccess && (
            <p className="form-alert success">
              Message sent successfully! I'll be in touch.
            </p>
          )}
          {submitError && (
            <p className="form-alert error">Error: {submitError}</p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                className="input-field-wrapper"
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                className="input-field-wrapper"
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Your Phone Number"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                className="input-field-wrapper"
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email Address"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message"
                rows="5"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>

        {/* INFO WRAPPER */}
        <div className="contact-info-wrapper">
          <h3>Contact Information</h3>
          <p>
            Feel free to reach out to me directly through any of the following
            channels.
          </p>
          <ul className="contact-list">
            <li>
              <strong>Email:</strong>{" "}
              <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
            </li>
            <li>
              <strong>Phone:</strong>{" "}
              <a href={`tel:${contactInfo.phone}`}>{contactInfo.phone}</a>
            </li>
          </ul>
          {/* Social Media Icons (Using the external contactInfo links) */}
          <div className="footer-sm-links">
            <a
              href={contactInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
            >
              <GitHubIcon />
            </a>
            <a
              href={contactInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
            >
              <LinkedInIcon />
            </a>
          </div>
        </div>
      </div>
      {/* Separate div for the copyright text */}
      <div className="footer-bottom">
        <p className="copyright-text">
          &copy; {new Date().getFullYear()} Key'n Brosdahl. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
