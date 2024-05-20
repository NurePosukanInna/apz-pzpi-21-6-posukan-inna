import React, { useEffect, useState } from 'react';
import Menu from '../component/menu/menu';
import { getSubscriptionTypes, addSubscriptionToUser } from '../http/subscriptionApi';
import '../styles/subscription.css';
import { useAuth } from '../context/authContext';

function Subscription() {
  const [subscriptionTypes, setSubscriptionTypes] = useState([]);
  const { userId } = useAuth();

  const fetchSubscriptionTypes = async () => {
    try {
      const types = await getSubscriptionTypes();
      setSubscriptionTypes(types);
    } catch (error) {
      console.error('Error fetching subscription types:', error);
    }
  };

  useEffect(() => {
    fetchSubscriptionTypes();
  }, []);

  const handleBuyNow = async (subscriptionTypeId) => {
    try {
      const subscriptionData = { subscriptionTypeId };
      await addSubscriptionToUser(userId, subscriptionData);
      fetchSubscriptionTypes();
    } catch (error) {
      console.error('Error buying subscription:', error);
    }
  };

  return (
    <div className="subscription-page">
      <div className="subscription-menu">
        <Menu />
      </div>
      <div className="content">
        <div className="label-subscription">Subscription</div>
        <hr />
        <div className="subscription-types">
          {subscriptionTypes.map((type, index) => (
            <div key={index} className="subscription-item">
              <div className="subscription-item-inner">
                <h3>{type.name}</h3>
                <p>{type.description}</p>
                <p className="subscription-price">{type.price}$ <small>/ per month</small></p>
                <ul className="features-list">
                  <div className="label-subscription-features">In this subscription we prefer:</div>
                  {type.name === 'Premium' ? (
                    <li>&#x2713; All functions</li>
                  ) : (
                    <li>&#x2713; All function except analytics</li>
                  )}
                </ul>
                <button className="btn btn-success" onClick={() => handleBuyNow(type.subscriptionTypeId)}>Buy now</button>
              </div>
            </div>
          ))}
        </div>        
      </div>
    </div>
  );
}

export default Subscription;
