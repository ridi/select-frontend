import * as React from 'react';

export const MaintenacePage: React.SFC = () => (
  <main className="SceneWrapper">
    <section className="PageMaintenance">
      <h2 className="MaintenanceTitle">시스템 점검 안내</h2>
      <div className="MaintenanceDescription">
        <h3 className="MaintenanceSubTitle">점검기간</h3>
        <p className="MaintenanceDescription_Text">2019년 2월 26일(화) 새벽 3시 ~ 5시 (한국시간 기준, 2시간)</p>
        <h3 className="MaintenanceSubTitle">점검 기간 중 이용이 제한되는 서비스</h3>
        <ul className="MaintenanceDescription_ServiceList">
          <li className="MaintenanceDescription_ServiceItem">
            - 리디북스 서점(ridibooks.com) 전체 서비스
          </li>
          <li className="MaintenanceDescription_ServiceItem">
            - 리디셀렉트(select.ridibooks.com) 전체 서비스
          </li>
          <li className="MaintenanceDescription_ServiceItem">
            - 리디북스 서점(ridibooks.com)의 판타지/BL/로맨스 연재 스트리밍 서비스
          </li>
          <li className="MaintenanceDescription_ServiceItem">
            - 리디북스 앱/페이퍼 내의 [구매목록] 및 [무료책] 이용
          </li>
          <li className="MaintenanceDescription_ServiceItem">
            - 리디북스 앱/페이퍼 내의 [독서노트] 및 [마지막 페이지] 동기화
          </li>
          <li className="MaintenanceDescription_ServiceItem">
            - 페이퍼 샵(https://paper.ridibooks.com/intro) 전체 서비스
          </li>
          <li className="MaintenanceDescription_ServiceItem">
            - 서비스 점검 중에도 리디북스 앱과 리디 페이퍼 내의 [내 서재], [책 읽기]는 이용 가능합니다.
          </li>
        </ul>
      </div>
      <p className="MaintenanceDescription">
        보다 나은 서비스를 제공해 드리기 위한 시스템 점검으로,
        이용에 불편함을 드리게 된 점 양해 부탁드립니다.<br />
        언제나 편리하고 즐겁게 리디북스를 이용하실 수 있도록
        최선을 다하겠습니다.<br />
        감사합니다.<br />
        <br />
        <strong>리디북스 드림.</strong>
      </p>
    </section>
  </main>
);
