import { Icon } from '@ridi/rsg';
import { ConnectedCompactPageHeader } from 'app/components/CompactPageHeader';
import { ErrorResponseData } from 'app/services/serviceStatus';
import React from 'react';

interface MaintenanceContextProps {
  responseData: ErrorResponseData;
}

const ServiceList: React.SFC<{ services: string[] }> = ({ services }) => (
  <ul>
    {services.map((service) => (
      <React.Fragment key={service}>
        <li>
          <div>{service}</div>
        </li>
      </React.Fragment>
    ))}
  </ul>
);

export const MaintenanceContext: React.FunctionComponent<MaintenanceContextProps> = (props) => {
  const { responseData } = props;

  return (
    <section className="PageMaintenance">
      <ConnectedCompactPageHeader />
      <main className="MaintenanceWrapper">
        <header className="MaintenanceHeader">
          <h1>시스템 점검 안내</h1>
          <p>안녕하세요.</p>
          보다 나은 서비스 제공을 위해 시스템 점검을 실시합니다.<br />
          점검 중에는 일부 서비스 제공이 어려우니 양해 부탁드립니다.
        </header>
        <section className="MaintenanceContentSection">
          <Icon name="exclamation_3" />
          <dl>
            <dt>점검 기간</dt>
            <dd>
              <ul>
                <li>{responseData.period}</li>
              </ul>
            </dd>
            <dt>점검 기간 중 이용이 제한되는 서비스</dt>
            <dd>
              <ServiceList services={responseData.unavailableService || []} />
            </dd>
          </dl>
        </section>
        <footer className="MaintenanceFooter">
          언제나 편리하게 서비스를 이용하실 수 있도록 최선을 다하겠습니다.<br />
          감사합니다.
        </footer>
      </main>

    </section>
  );
};
