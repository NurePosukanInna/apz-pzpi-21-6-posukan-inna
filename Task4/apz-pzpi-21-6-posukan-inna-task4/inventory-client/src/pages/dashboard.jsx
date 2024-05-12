import React from 'react';
import Menu from '../component/menu/menu';

function Dashboard() {
  return (
    <div className='dashboard-page'>
      <div className="dashboard">
        <Menu />
      </div>
      <div className="content">
        <div className="label-dashboard">Dashboard</div>
      </div>
    </div>
  );
}

export default Dashboard;
