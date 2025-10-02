// Buttons/Modal-Btns.jsx

import './Btn.css'; // Styles for these buttons go in your main button stylesheet

/**
 * A reusable close button for modals.
 * @param {object} props - Component props.
 * @param {function} props.onClick - The function to call when the button is clicked.
 */
export const CloseBtn = ({ onClick }) => (
  <button className="modal-close-btn" onClick={onClick} aria-label="Close modal">
    &times;
  </button>
);

/**
 * A reusable 'Next' navigation button for modals or slideshows.
 * @param {object} props - Component props.
 * @param {function} props.onClick - The function to call when the button is clicked.
 */
export const NextBtn = ({ onClick }) => (
  <button className="modal-nav-btn next-btn" onClick={onClick} aria-label="Next item">
    &#8250;
  </button>
);

/**
 * A reusable 'Previous' navigation button for modals or slideshows.
 * @param {object} props - Component props.
 * @param {function} props.onClick - The function to call when the button is clicked.
 */
export const PrevBtn = ({ onClick }) => (
  <button className="modal-nav-btn prev-btn" onClick={onClick} aria-label="Previous item">
    &#8249;
  </button>
);
