import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { fetchAllStores } from '../../http/shopApi';
import { useAuth } from '../../context/authContext'; 

function AddEmployeeModal({ show, handleClose, formData, handleChange, handleSubmit }) {
  const { userId } = useAuth(); 
  const [stores, setStores] = useState([]);

  useEffect(() => {
    if (show && userId) {
      fetchAllStores(userId).then(fetchedStores => {
        setStores(fetchedStores);
      });
    }
  }, [show, userId]);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Employee</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <div className="form-group">
            <label>Email:</label>
            <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Position:</label>
            <select className="form-control" name="position" value={formData.position} onChange={handleChange}>
              <option value="">Select Role</option>
              <option value="Cashier">Cashier</option>
              <option value="Store Manager">Store Manager</option>
            </select>
          </div>
          <div className="form-group">
            <label>First Name:</label>
            <input type="text" className="form-control" name="firstName" value={formData.firstName} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Last Name:</label>
            <input type="text" className="form-control" name="lastName" value={formData.lastName} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Store:</label>
            <select className="form-control" name="storeId" value={formData.storeId} onChange={handleChange}>
              <option value="">Select Store</option>
              {stores.map(store => (
                <option key={store.storeId} value={store.storeId}>{store.storeName}</option>
              ))}
            </select>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleSubmit}>
          Add User
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddEmployeeModal;
