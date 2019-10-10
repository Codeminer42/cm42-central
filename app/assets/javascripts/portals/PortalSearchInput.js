import ReactDOM from 'react-dom';

const PortalSearchInput = ({ children }) => ReactDOM.createPortal(
  children,
  document.querySelector('[data-portal="portal-search-input"]')
);

export default PortalSearchInput;
