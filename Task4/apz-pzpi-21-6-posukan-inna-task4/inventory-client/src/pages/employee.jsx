import React, { useState, useEffect } from 'react';
import { fetchAllEmployees, addEmployee, deleteEmployee, updateEmployee } from '../http/employeeApi'; 
import Menu from '../component/menu/menu';
import AddEmployeeModal from '../component/modals/addEmployeeModal';
import UpdateEmployeeModal from '../component/modals/updateEmployeeModal';
import '../styles/employee.css';
import { useAuth } from '../context/authContext';

function Employee() {
  const [employee, setEmployee] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    position: '',
    firstName: '',
    lastName: '',
    password: ''
  });
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false); 

  const { userId } = useAuth();

  useEffect(() => {
    fetchData();
  }, [userId]);

  useEffect(() => {
    if (showSuccessAlert) {
      const timeout = setTimeout(() => {
        setShowSuccessAlert(false);
      }, 1200);

      return () => clearTimeout(timeout);
    }
  }, [showSuccessAlert]);

  const fetchData = async () => {
    try {
      const data = await fetchAllEmployees(userId);
      setEmployee(data); 
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleAddUserClick = () => {
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await addEmployee(formData);
      
      alert('Employee successfully added!');
      setShowAddModal(false);
      
      await fetchData();
      
      setFormData({
        email: '',
        position: '',
        firstName: '',
        lastName: '',
        password: ''
      });
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  const handleDeleteUser = async (employeeId) => {
    try {
      await deleteEmployee(employeeId);
      alert('Employee successfully deleted!');
      await fetchData();
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const handleUpdateUser = (employeeId) => {
    const selected = employee.find(emp => emp.employeeId === employeeId);
    setSelectedEmployee(selected);
    setShowUpdateModal(true);
  };

  const handleUpdateEmployee = async (employeeId, updatedData) => {
    try {
      await updateEmployee(employeeId, updatedData);
      setShowSuccessAlert(true); 
      setShowUpdateModal(false);
      await fetchData();
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };
  
  return (
    <div className='employee-page'>
      <div className="employee-menu">
        <Menu />
      </div>
      <div className="content">
        <div className="label-employee">Employee</div>
        <hr/>
        <div className="action" style={{ marginBottom: '20px' }}>
          <button className="btn btn-success" onClick={handleAddUserClick}>Add User</button>
        </div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Email</th>
              <th>Position</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Store</th>
              <th>Action</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {employee.map((employee) => (
              <tr key={employee.employeeId}>
                <td>{employee.email}</td>
                <td>{employee.position}</td>
                <td>{employee.firstName}</td>
                <td>{employee.lastName}</td>
                <td>{employee.store ? employee.store.storeName : 'Not Available'}</td>
                <td>
                  <button className='btn btn-danger' onClick={() => handleDeleteUser(employee.employeeId)}>Delete</button>
                </td>
                <td>
                  <button className='btn btn-info' onClick={() => handleUpdateUser(employee.employeeId)}>Update</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <AddEmployeeModal 
          show={showAddModal} 
          handleClose={handleCloseAddModal} 
          formData={formData} 
          handleChange={handleChange} 
          handleSubmit={handleSubmit} 
        />
        <UpdateEmployeeModal 
          show={showUpdateModal} 
          handleClose={handleCloseUpdateModal} 
          employeeData={selectedEmployee} 
          handleUpdate={handleUpdateEmployee} 
        />
      </div>
      {showSuccessAlert && (
        <div className="bottom-alert">
          <div className="alert alert-success" role="alert">
            Employee successfully updated!
          </div>
        </div>
      )}
    </div>
  );
}

export default Employee;
