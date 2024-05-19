import React, { useEffect, useState } from 'react';
import Menu from '../component/menu/menu';
import { getSalesByStoreId } from '../http/saleApi';

function Sale() {
    const [sales, setSales] = useState([]);
    const [storeId, setStoreId] = useState(null); // Define storeId state

    useEffect(() => {
        const storedShopId = localStorage.getItem('shopId');
        console.log(storedShopId); 
    
        if (storedShopId) {
          setStoreId(storedShopId); // Update storeId state
        }
    }, []);

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const salesData = await getSalesByStoreId(storeId);
                setSales(salesData);
            } catch (error) {
                console.error('Error fetching sales:', error);
            }
        };

        if (storeId) { // Check if storeId is available
            fetchSales();
        }
    }, [storeId]);

    return (
        <div className="sale-page">
            <div className="sale-menu">
                <Menu />
            </div>
            <div className="content">
                <div className="label-sale">Sales</div>
                <hr/>
                <div className="sales-list">
                <table className="table">
        <thead>
            <tr>
                <th>Sale ID</th>
                <th>Sale Date</th>
                <th>Employee</th>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Price</th>
            </tr>
        </thead>
        <tbody>
            {sales.map(sale => (
                <React.Fragment key={sale.saleId}>
                    {sale.saleItems.map(item => (
                        <tr key={item.saleItemId}>
                            <td>{sale.saleId}</td>
                            <td>{sale.saleDate ? new Date(sale.saleDate).toLocaleString() : ''}</td>
                            <td>{sale.employee && `${sale.employee.firstName} ${sale.employee.lastName}`}</td>
                            <td>{item.product && item.product.productName}</td>
                            <td>{item.quantity}</td>
                            <td>{item.quantity * item.price} $</td>
                        </tr>
                    ))}
                </React.Fragment>
            ))}
        </tbody>
    </table>
                </div>
            </div>
        </div>
    );
}

export default Sale;
