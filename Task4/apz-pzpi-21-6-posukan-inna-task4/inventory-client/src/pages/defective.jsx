import React, { useState, useEffect } from 'react';
import Menu from '../component/menu/menu';
import { fetchDefectiveProductsForStore } from '../http/productApi';

function Defective() {
  const [defectiveProducts, setDefectiveProducts] = useState([]);
  const [shopId, setShopId] = useState(null); 

  useEffect(() => {
    const storedShopId = localStorage.getItem('shopId');
    console.log(storedShopId); 

    if (storedShopId) {
      setShopId(storedShopId);
    }
  }, []);

  useEffect(() => {
    if (shopId) {
      const fetchData = async () => {
        try {
          const products = await fetchDefectiveProductsForStore(shopId);
          setDefectiveProducts(products);
        } catch (error) {
          console.error('Error fetching defective products:', error);
        }
      };
      fetchData();
    }
  }, [shopId]);

  return (
    <div className="defective-page">
      <div className="defective-menu">
        <Menu />
      </div>
  
      <div className='content'>
        <div className="label-products">Defective products for shop: {shopId}</div> 
        <hr />
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Volume</th>
                <th>Measure Of Units</th>
                <th>Reason</th>
                <th>Date Detected</th>
              </tr>
            </thead>
            <tbody>
              {defectiveProducts.length > 0 ? (
                defectiveProducts.map((defectiveProduct) => (
                  <tr key={defectiveProduct.defectiveProductId}>
                    <td>{defectiveProduct.productName}</td>
                    <td>{defectiveProduct.volume}</td>
                    <td>{defectiveProduct.measureOfUnits}</td>
                    <td>{defectiveProduct.reason}</td>
                    <td>{defectiveProduct ? new Date(defectiveProduct.dateDetected).toLocaleString() : ''}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No defective products</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Defective;
