import React, { useState, useEffect } from 'react';
import Menu from '../component/menu/menu';
import { fetchAllStores, createStore } from '../http/shopApi';
import { useAuth } from '../context/authContext';
import ShopModal from '../component/modals/shopModal';
import '../styles/shop.css';

function Shop() {
    const { userId } = useAuth();
    const [stores, setStores] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        storeName: '',
        address: '',
        phoneNumber: ''
    });

    useEffect(() => {
        async function fetchData() {
            if (!userId) return; 
            const data = await fetchAllStores(userId);
            setStores(data || []);
        }
        fetchData();
    }, [userId]);

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
            const updatedStores = await fetchAllStores(userId);
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
                <div className="action">
                <button className="btn btn-success" style={{ marginBottom: "20px" }} onClick={handleShowModal}>Add Store</button>
                </div>
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
                                        <React.Fragment>
                                            <td title={formatTimestamp(store.sensors[0].timestamp)}>
                                                {store.sensors[0].temperature === 0 ? 'Initial temperature value' : `${store.sensors[0].temperature} \u00B0C`} {/* Градус Цельсия */}
                                            </td>
                                            <td title={formatTimestamp(store.sensors[0].timestamp)}>
                                                {store.sensors[0].humidity === 0 ? 'Initial humidity value' : `${store.sensors[0].humidity} %`} {/* Проценты */}
                                            </td>
                                        </React.Fragment>
                                    ) : (
                                        <React.Fragment>
                                            <td>-</td>
                                            <td>-</td>
                                        </React.Fragment>
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
