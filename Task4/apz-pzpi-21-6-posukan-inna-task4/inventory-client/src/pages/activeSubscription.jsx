import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { getActiveSubscriptionsForUser } from '../http/subscriptionApi';
import Menu from '../component/menu/menu';
import '../styles/subscription.css';

function ActiveSubscription() {
    const { userId } = useAuth();
    const [activeSubscription, setActiveSubscription] = useState(null);

    useEffect(() => {
        const fetchActiveSubscriptions = async () => {
            try {
                const activeSubs = await getActiveSubscriptionsForUser(userId);
                setActiveSubscription(activeSubs[0]);
            } catch (error) {
                console.error('Error fetching active subscriptions:', error);
            }
        };

        fetchActiveSubscriptions();
    }, [userId]);

    return (
        <div className="subscription-page">
            <div className="subscription-menu">
                <Menu />
            </div>
            <div className="content">
                <div className="label-subscription">Your subscription:</div>
                <hr />
                <div className="subscription-details">
                    {activeSubscription && (
                        <div className="subscription-item">
                            <p>Status: {activeSubscription.subscriptionStatus}</p>
                            <p>Start Date: {activeSubscription ? new Date(activeSubscription.startDate).toLocaleDateString() : ''}</p>
                            <p>End Date: {activeSubscription ? new Date(activeSubscription.endDate).toLocaleDateString() : ''}</p>
                            <p>Name: {activeSubscription.subscriptionType.name}</p>
                            <p>Price: {activeSubscription.subscriptionType.price}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ActiveSubscription;
