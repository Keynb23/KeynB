import { useNavigate } from 'react-router-dom';
import './Btn.css'; // Using your existing button styles

const ToBtn = ({ to, children }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Navigate to the route specified in the 'to' prop
    navigate(to);
  };

  return (
    // You can create a new class or use your default button styles
    <button className="to-btn" onClick={handleClick}>
      {children}
    </button>
  );
};

export default ToBtn;
