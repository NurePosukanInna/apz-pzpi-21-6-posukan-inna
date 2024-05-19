import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';

function UpdateRequestModal({ show, handleClose, handleUpdate, request }) {
  const [formData, setFormData] = useState({
    quantity: '',
    requestStatus: '',
  });

  useEffect(() => {
    if (request) {
      setFormData({
        quantity: request.quantity,
        requestStatus: request.requestStatus,
      });
    }
  }, [request]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpdate(formData);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Update Request</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="quantity">Quantity:</label>
            <input
              type="number"
              className="form-control"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="requestStatus">Request Status:</label>
            <select
              className="form-control"
              id="requestStatus"
              name="requestStatus"
              value={formData.requestStatus}
              onChange={handleChange}
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default UpdateRequestModal;
