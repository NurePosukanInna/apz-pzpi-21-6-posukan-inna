import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function ShopModal({ show, handleClose, formData, handleChange, handleSubmit }) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Shop</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <div className="form-group">
            <label>Name:</label>
            <input type="text" className="form-control" name="storeName" value={formData.storeName} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Address:</label>
            <input type="text" className="form-control" name="address" value={formData.address} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Phone Number:</label>
            <input type="text" className="form-control" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="btn btn-success" onClick={handleSubmit}>
          Add Shop
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ShopModal;
