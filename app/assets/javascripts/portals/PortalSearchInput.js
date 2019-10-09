import ReactDOM from 'react-dom';

const PortalSearchInput = ({ children }) => ReactDOM.createPortal(
  children,
  document.getElementById('portal-search-input'),
);

export default PortalSearchInput;
