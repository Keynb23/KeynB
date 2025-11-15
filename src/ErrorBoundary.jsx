// ErrorBoundary.jsx

import { Component } from 'react';
import './Error.css';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  // Called when a descendant component throws an error
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  // Used for logging error details
  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Render custom fallback UI using the Error-Glitch class
      return (
        <div className="Error-Glitch">
          <h2>Oops! Something went wrong.</h2>
          <p>We're sorry for the inconvenience. Please try refreshing the page.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
