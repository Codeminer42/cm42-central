import { useState } from 'react';

const AsyncForm = ({ onSubmit, getFormData, children }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async ev => {
    ev.preventDefault();
    setLoading(true);
    try {
      await onSubmit(getFormData());
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return children({ loading, handleSubmit });
};

export default AsyncForm;
