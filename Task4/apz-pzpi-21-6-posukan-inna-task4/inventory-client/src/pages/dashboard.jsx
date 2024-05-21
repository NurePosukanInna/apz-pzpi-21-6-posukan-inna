import React from 'react';
import Menu from '../component/menu/menu';
import { useTranslation } from 'react-i18next';

function Dashboard() {
  const { t } = useTranslation('dashboard');

  return (
    <div className='dashboard-page'>
      <div className="dashboard">
        <Menu />
      </div>
      <div className="content">
        <div className="label-dashboard">{t('label_dashboard')}</div>
      </div>
    </div>
  );
}

export default Dashboard;
