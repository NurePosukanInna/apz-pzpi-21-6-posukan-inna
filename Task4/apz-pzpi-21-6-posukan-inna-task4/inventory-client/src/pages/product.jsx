import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Menu from '../component/menu/menu';
import { fetchStoreById } from '../http/shopApi';
import { addProduct, fetchAllProducts, deleteProduct, fetchCurrencies, updateProduct } from '../http/productApi';
import AddProductModal from '../component/modals/addProductModal';
import UpdateProductModal from '../component/modals/updateProductModal';

function Product() {
  const { shopId } = useParams(); 
  const [store, setStore] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [formData, setFormData] = useState({
    ProductName: '',
    Price: '',
    MinQuantity: '',
    Volume: '',
    MeasureOfUnits: '',
    isFresh: false,
    currency: 'USD',
    expiryDate: null
  })
  const [products, setProducts] = useState([]);
  const [availableCurrencies, setAvailableCurrencies] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storeData = await fetchStoreById(shopId);
        setStore(storeData);
        const products = await fetchAllProducts(shopId); // Используем shopId в запросе
        setProducts(products || []);

        const currencies = await fetchCurrencies();
        setAvailableCurrencies(currencies || []);
      } catch (error) {
        console.error('Error fetching store and products:', error);
      }
    };
    fetchData();
  }, [shopId]);

  const handleAddModalOpen = () => {
    setShowAddModal(true);
  };

  const handleAddModalClose = () => {
    setShowAddModal(false);
  };

  const handleUpdateModalOpen = (productId) => {
    const selectedProduct = products.find(product => product.productId === productId);
    const storeProductsInfo = selectedProduct.storeProducts && selectedProduct.storeProducts.length > 0 ?
      selectedProduct.storeProducts[0] : null;
    const updatedFormData = {
      ...selectedProduct,
      minQuantity: storeProductsInfo ? storeProductsInfo.minQuantity : 0,
      quantity: storeProductsInfo ? storeProductsInfo.minQuantity : 0
    };
    setFormData(updatedFormData);
    setSelectedProductId(productId);
    setShowUpdateModal(true);
  };
  
  const handleUpdateModalClose = () => {
    setShowUpdateModal(false);
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    const finalValue = name === 'isFresh' ? !formData.isFresh : newValue;
  
    setFormData(prevState => ({
      ...prevState,
      [name]: name === 'expiryDate' ? (newValue === '' ? null : new Date(newValue)) : finalValue
    }));
  };
  
  const handleSubmitAdd = async () => {
    try {
      await addProduct({ ...formData, storeId: shopId });
      const updatedProducts = await fetchAllProducts(shopId);
      setProducts(updatedProducts || []);
      handleAddModalClose();
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleSubmitUpdate = async () => {
    try {
      await updateProduct(selectedProductId, formData);
      const updatedProducts = await fetchAllProducts(shopId);
      setProducts(updatedProducts || []);
      handleUpdateModalClose();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

 

  const handleDeleteProduct = async (productId) => {
    try {
      await deleteProduct(productId);
      const updatedProducts = products.filter(product => product.productId !== productId);
      setProducts(updatedProducts);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  if (!store) {
    return <div>Loading...</div>;
  }

  return (
    <div className="product-page">
      <div className="product-menu">
        <Menu />
      </div>
      <AddProductModal
        show={showAddModal}
        handleClose={handleAddModalClose}
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmitAdd}
        availableCurrencies={availableCurrencies}
      />

      <UpdateProductModal
        show={showUpdateModal}
        handleClose={handleUpdateModalClose}
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmitUpdate}
        availableCurrencies={availableCurrencies}
      />

      <div className='content'>
      <div className="label-products">Product for shop: {shopId}</div>
        <hr/>
        <div className="action" style={{ marginBottom: '20px' }}>
          <button className="btn btn-success" onClick={() => handleAddModalOpen()}>Add Product</button>
        </div>
        {products.length === 0 ? (
          <p>No products available in the store.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Currency</th>
                <th>Volume</th>
                <th>Fresh</th>
                <th>Expiry Date</th>
                <th>Quantity</th>
                <th>Min Quantity</th>
                <th>Supplier</th>
                <th>Category</th>
                <th>Action</th>
                <th>Update</th>

              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.productId}>
                  <td>{product.productName}</td>
                  <td>{product.price}</td>
                  <td>{product.currency}</td>
                  <td>{product.volume}</td>
                  <td>{product.isFresh ? '+' : '-'}</td>
                  <td>{product.expiryDate ? new Date(product.expiryDate).toLocaleDateString() : 'Not Fresh'}</td>
                  <td>{product.storeProducts && product.storeProducts.length > 0 ?
                    product.storeProducts[0].quantity : 'Not Available'}
                  </td>
                  <td>{product.storeProducts && product.storeProducts.length > 0 ?
                    product.storeProducts[0].minQuantity : 'Not Available'}
                  </td>
                  <td>{product.supplier ? product.supplier.address : 'Not Available'}</td>
                  <td>{product.category ? product.category.categoryName : 'Not Available'}</td>

                  <td>
                    <button className='btn btn-danger' onClick={() => handleDeleteProduct(product.productId)}>Delete</button>
                  </td>
                  <td>
                  <button className='btn btn-info' onClick={() => handleUpdateModalOpen(product.productId)}>Update</button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Product;
