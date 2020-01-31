import { getNotAvailableConvertDate, getNotAvailableConvertDateDiff } from 'app/utils/expiredDate';
import React from 'react';

interface ExpireRemaningTimeProps {
  expireDate: string;
}

export const ExpireIconComponent = (props: any) => (
  <svg width={10} height={10} {...props}>
    <g fill="none" fillRule="evenodd">
      <circle cx={5} cy={5} r={4.444} stroke="#0077D9" strokeWidth={1.111} />
      <path fill="#0077D9" d="M1.464 2.25l.786-.786L8.536 7.75l-.786.786z" />
    </g>
  </svg>
);

export const ExpireRemaningTime: React.SFC<ExpireRemaningTimeProps> = (props: ExpireRemaningTimeProps) => getNotAvailableConvertDateDiff(props.expireDate) <= 25 ? (
  <div className="ExpireRemaningTime">
    <ExpireIconComponent className="MySelectBookList_BlockIcon" />
    <span className="MySelectBookList_expired">
      {getNotAvailableConvertDate(props.expireDate)}
    </span>
  </div>
) : null;
