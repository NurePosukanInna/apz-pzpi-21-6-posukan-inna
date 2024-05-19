import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Menu from '../component/menu/menu';
import { fetchStoreById } from '../http/shopApi';
import { fetchAllProducts, deleteProduct, fetchCurrencies, updateProduct, addProduct } from '../http/productApi';
import AddProductModal from '../component/modals/addProductModal';
import UpdateProductModal from '../component/modals/updateProductModal';
import { addSale } from '../http/saleApi';
import { useProductContext } from '../context/productContext';
import { useAuth } from '../context/authContext';

function Product() {
  const { shopId } = useParams();
  const { userId, position, employeeId } = useAuth();
  const [storeId, setStoreId] = useState(null); 
  const { selectedProducts, addSelectedProduct, removeProductFromContext, clearSelectedProducts } = useProductContext();
  const [store, setStore] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [searchQuery, setSearchQuery] = useState(''); 
  const [formData, setFormData] = useState({
    ProductName: '',
    Price: '',
    MinQuantity: '',
    Volume: '',
    MeasureOfUnits: '',
    isFresh: false,
    currency: 'USD',
    expiryDate: null
  });
  const [products, setProducts] = useState([]);
  const [availableCurrencies, setAvailableCurrencies] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    localStorage.setItem('shopId', shopId);
    setStoreId(shopId);
  }, [shopId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setStoreId(shopId); 
        const storeData = await fetchStoreById(shopId);
        setStore(storeData);
        const products = await fetchAllProducts(shopId);
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
      quantity: storeProductsInfo ? storeProductsInfo.quantity : 0
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
    const updatedValue = name === 'quantity' ? parseFloat(newValue) : finalValue;
    setFormData(prevState => ({
      ...prevState,
      [name]: name === 'expiryDate' ? (newValue === '' ? null : new Date(newValue)) : updatedValue,
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
      const updatedProductData = {
        productId: selectedProductId,
        productName: formData.productName,
        price: formData.price,
        categoryId: formData.categoryId,
        supplierId: formData.supplierId,
        currency: formData.currency,
        volume: formData.volume,
        measureOfUnits: formData.measureOfUnits,
        isFresh: formData.isFresh,
        expiryDate: formData.isFresh ? formData.expiryDate : null,
        quantity: formData.quantity,
        minQuantity: formData.minQuantity
      };
      await updateProduct(selectedProductId, updatedProductData);
      const updatedProducts = await fetchAllProducts(shopId);
      setProducts(updatedProducts || []);
      handleUpdateModalClose();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };
  const handleAddSale = async () => {
    try {
      const saleItems = selectedProducts.filter(product => {
        const quantity = quantities[product.productId] || 0;
        return quantity > 0;
      }).map(product => ({
        productId: product.productId,
        quantity: quantities[product.productId]
      }));
      
      if (saleItems.length === 0) {
        alert('No products available for sale.');
        return; 
      }
  
      let saleData = {
        storeId: shopId,
        saleItems: saleItems
      };
  
      if (position === 'Cashier') {
        saleData.employeeId = employeeId;
      } else {
        saleData.userId = userId;
      }
  
      await addSale(saleData);
      alert('Sale added successfully');
  
      setQuantities({});
      clearSelectedProducts();
    } catch (error) {
      console.error('Error adding sale:', error);
    }
  };
  
  
  const handleQuantityChange = (productId, newQuantity) => {
    setQuantities(prevState => ({
      ...prevState,
      [productId]: newQuantity.trim() === '' ? '' : parseFloat(newQuantity)
    }));
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

  const calculateTotalPrice = () => {
    let total = 0;
    selectedProducts.forEach(product => {
      const quantity = quantities[product.productId] || 1; 
      total += product.price * quantity; 
    });
    setTotalPrice(total);
  };

  useEffect(() => {
    calculateTotalPrice();
  }, [selectedProducts, quantities]);

  const filteredProducts = products.filter(product =>
    Object.values(product).some(value => {
      if (typeof value === 'string') {
        return value.toLowerCase().includes(searchQuery.toLowerCase());
      } else if (typeof value === 'number') {
        return value.toString().includes(searchQuery);
      }
      return false;
    })
  );

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
        <hr />
        <div className="action" style={{ marginBottom: '20px', marginTop: '20px' }}>
          <button className="btn btn-success" onClick={() => handleAddModalOpen()}>Add Product</button>
          <span style={{ marginRight: '10px' }}></span>
          <Link to="/defective" className="btn btn-success">View Defective Products</Link>
          <span style={{ marginRight: '10px' }}></span>
          <Link to="/sale" className="btn btn-success">View Sale</Link>
        </div>
        <input
          type="text"
          className="form-control"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ marginBottom: '10px' }}
        />
        {filteredProducts.length === 0 ? (
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
              {filteredProducts.map(product => (
                <tr key={product.productId}>
                  <td onClick={() => addSelectedProduct(product)}>{product.productName}</td>
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
        <div className="additional-content">
          <div className="label-sale">Product for sale</div>
          <hr/>
          {selectedProducts.length > 0 ? (
            <div>
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Currency</th>
                    <th>Volume</th>
                    <th>Measure of Units</th>
                    <th>Quantity</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProducts.map(product => (
                    <tr key={product.productId}>
                      <td>{product.productName}</td>
                      <td>{product.price}</td>
                      <td>{product.currency}</td>
                      <td>{product.volume}</td>
                      <td>{product.measureOfUnits}</td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          value={quantities[product.productId] || ''}
                          onChange={(e) => handleQuantityChange(product.productId, e.target.value)}
                          min={1} 
                        />
                      </td>
                      <td>
                        <button className="btn btn-danger" onClick={() => removeProductFromContext(product.productId)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p>Total Price: {totalPrice}</p>
              <div className="action" style={{ marginBottom: '20px' }}>
                <button className="btn btn-primary" onClick={() => handleAddSale()}>Add Sale</button>
              </div>
            </div>
          ) : (
            <p>No products selected</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Product;
