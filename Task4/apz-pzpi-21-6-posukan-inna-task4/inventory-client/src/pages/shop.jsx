import React, { useState, useEffect } from 'react';
import { fetchStoresByEmployeeId } from '../http/employeeApi';
import { fetchAllStores, createStore } from '../http/shopApi';
import { useAuth } from '../context/authContext';
import Menu from '../component/menu/menu';
import ShopModal from '../component/modals/shopModal';

function Shop() {
  const [stores, setStores] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    storeName: '',
    address: '',
    phoneNumber: ''
  });

  const { employeeId, position, userId } = useAuth();

  useEffect(() => {
    async function fetchData() {
      try {
        let storesData;
        if (position === "Cashier") {
          storesData = await fetchStoresByEmployeeId(employeeId);
        } else {
          if (userId !== null) {
            storesData = await fetchAllStores(userId);
          } else {
            storesData = [];
          }
        }
        setStores(storesData || []);
      } catch (error) {
        console.error('Error fetching stores:', error);
      }
    }

    fetchData();
  }, [employeeId, position, userId]);

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      storeName: '',
      address: '',
      phoneNumber: ''
    });
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      await createStore({ ...formData, userId });

      const updatedStores = position === 'Cashier' ? await fetchStoresByEmployeeId(employeeId) : await fetchAllStores(userId);
      setStores(updatedStores || []);
    } catch (error) {
      console.error('Error adding store:', error);
    }
    setShowModal(false);
  };

  const redirectToStorePage = (shopId) => {
    window.location.href = `/shop/${shopId}`;
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="invoice-page">
      <div className="invoice-menu">
        <Menu />
      </div>
      <div className="content">
        <div className="label-shop">Stores</div>
        <hr/>
        {position !== "Cashier" && (
          <div className="action">
            <button className="btn btn-success" style={{ marginBottom: "20px" }} onClick={handleShowModal}>Add Store</button>
          </div>
        )}
        <div className="table-responsive">
          <table className="table table-striped">
            <thead className="thead-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Address</th>
                <th>Temperature</th>
                <th>Humidity</th>
              </tr>
            </thead>
            <tbody>
              {stores.map(store => (
                <tr key={store.storeId} onClick={() => redirectToStorePage(store.storeId)}>
                  <td>{store.storeId}</td>
                  <td>{store.storeName}</td>
                  <td>{store.address}</td>
                  {store.sensors.length > 0 ? (
                    <>
                      <td title={formatTimestamp(store.sensors[0].timestamp)}>
                        {store.sensors[0].temperature === 0 ? 'Initial temperature value' : `${store.sensors[0].temperature} \u00B0C`}
                      </td>
                      <td title={formatTimestamp(store.sensors[0].timestamp)}>
                        {store.sensors[0].humidity === 0 ? 'Initial humidity value' : `${store.sensors[0].humidity} %`}
                      </td>
                    </>
                  ) : (
                    <>
                      <td>-</td>
                      <td>-</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ShopModal
        show={showModal}
        handleClose={handleCloseModal}
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}

export default Shop;
