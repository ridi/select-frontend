import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Button } from '@ridi/rsg';

import { Actions, CashReceiptIssueType } from 'app/services/user';
import { Modal } from 'app/components/Modal';
import { Radio } from 'app/components/Forms/Radio';
import * as styles from 'app/components/OrderHistory/styles';
import toast from 'app/utils/toast';
import { RidiSelectState } from 'app/store';

interface CashReceiptIssueModalProps {
  id: number;
  closeModal: () => void;
}
export const CashReceiptIssueModal: React.FunctionComponent<CashReceiptIssueModalProps> = (props) => {
  const { id, closeModal } = props;

  enum CashReceiptNumberType {
    RegistrationNumber = 'REGISTRATION_NUMBER',
    PhoneNumber = 'PHONE_NUMBER',
    CashReceiptCardNumber = 'CASH_RECEIPT_CARD_NUMBER',
  }

  enum InputPlaceholders {
    RegistrationPlaceholder = '주민등록번호 13자리 입력',
    PhonePlaceholder = '휴대폰 번호 11자리 입력',
    CashReceiptCardNumber = '현금영수증 카드번호 18자리 입력',
    BusinessNumber = '사업자 번호 입력',
  };

  const isIssueFetching = useSelector((state: RidiSelectState) => state.user.purchaseHistory.isCashReceiptIssueFetching);

  const [issueType, setIssueType] = React.useState(CashReceiptIssueType.INCOME_DEDUCTION);
  const [numberType, setNumberType] = React.useState(CashReceiptNumberType.RegistrationNumber);
  const [issueNumber, setIssueNumber] = React.useState('');
  const [inputPlaceholder, setInputPlaceholder] = React.useState(InputPlaceholders.RegistrationPlaceholder);
  const [inputMinLength, setInputMinLength] = React.useState(10);

  const dispatch = useDispatch();

  const handleIssueTypeChange = (e: any) => {
    if (!e.currentTarget.checked) {
      return;
    }
    setIssueNumber('');
    setIssueType(e.currentTarget.value);
  }

  const handleNumberTypeChange = (e: any) => {
    if (!e.currentTarget.checked) {
      return;
    }
    setIssueNumber('');
    setNumberType(e.currentTarget.value);
  }

  const submitCashReceiptIssueRequest = () => {
    if (isIssueFetching) {
      return;
    }
    if (!issueNumber || issueNumber.length < inputMinLength) {
      toast.failureMessage('입력하신 발급 번호가 올바르지 않습니다. 다시 확인해주세요.');
      return;
    }

    dispatch(Actions.cashReceiptIssueRequest({
      ticketId: id,
      method: 'POST',
      issuePurpose: issueType,
      issueNumber: issueNumber,
    }));
  }

  React.useEffect(() => {
    if (issueType === CashReceiptIssueType.EXPENSE_EVIDENCE) {
      setInputPlaceholder(InputPlaceholders.BusinessNumber);
      setInputMinLength(10);
      return;
    }
    let placholder = InputPlaceholders.RegistrationPlaceholder;
    switch (numberType) {
      case CashReceiptNumberType.RegistrationNumber:
        placholder = InputPlaceholders.RegistrationPlaceholder;
        setInputMinLength(13);
        break;
      case CashReceiptNumberType.PhoneNumber:
        placholder = InputPlaceholders.PhonePlaceholder;
        setInputMinLength(11);
        break;
      case CashReceiptNumberType.CashReceiptCardNumber:
        placholder = InputPlaceholders.CashReceiptCardNumber;
        setInputMinLength(18);
        break;
    }
    setInputPlaceholder(placholder);
  }, [issueType, numberType])

  return (
    <Modal
      title="현금영수증 발급 신청"
      onClose={closeModal}
    >
      <div css={styles.cashReceiptIssueModalWrapper}>
        <p css={styles.cashReceiptIssueModalSubTitle}>발행 용도</p>
        <ul css={styles.cashReceiptIssueModalIssueTypeList}>
          <li css={styles.cashReceiptIssueModalIssueTypeListItem}>
            <Radio
              inputName="IssueType"
              id="cashReceipt_incomeDeduction"
              value={CashReceiptIssueType.INCOME_DEDUCTION}
              isChecked={issueType === CashReceiptIssueType.INCOME_DEDUCTION}
              onChange={handleIssueTypeChange}
              displayName="소득 공제용"
            />
          </li>
          <li css={styles.cashReceiptIssueModalIssueTypeListItem}>
            <Radio
              inputName="IssueType"
              id="cashReceipt_ExpenseEvidence"
              value={CashReceiptIssueType.EXPENSE_EVIDENCE}
              isChecked={issueType === CashReceiptIssueType.EXPENSE_EVIDENCE}
              onChange={handleIssueTypeChange}
              displayName="지출 증빙용"
            />
          </li>
        </ul>
        <p css={styles.cashReceiptIssueModalSubTitle}>발급 번호</p>
        {issueType === CashReceiptIssueType.INCOME_DEDUCTION ? (
          <ul css={styles.cashReceiptIssueModalNumberTypeListItem}>
            <li>
              <Radio
                inputName="NumberType"
                id="cashReceipt_RegistrationNumber"
                value={CashReceiptNumberType.RegistrationNumber}
                isChecked={numberType === CashReceiptNumberType.RegistrationNumber}
                onChange={handleNumberTypeChange}
                displayName="주민등록번호"
              />
            </li>
            <li>
              <Radio
                inputName="NumberType"
                id="cashReceipt_PhoneNumber"
                value={CashReceiptNumberType.PhoneNumber}
                isChecked={numberType === CashReceiptNumberType.PhoneNumber}
                onChange={handleNumberTypeChange}
                displayName="휴대폰 번호"
              />
            </li>
            <li>
              <Radio
                inputName="NumberType"
                id="cashReceipt_CashReceiptCardNumber"
                value={CashReceiptNumberType.CashReceiptCardNumber}
                isChecked={numberType === CashReceiptNumberType.CashReceiptCardNumber}
                onChange={handleNumberTypeChange}
                displayName="현금영수증 카드 번호"
              />
            </li>
          </ul>
        ) : null}
        <div css={styles.cashReceiptIssueModalIssueNumberInputWrapper}>
          <input
            type="text"
            css={styles.cashReceiptIssueModalIssueNumberInput}
            placeholder={inputPlaceholder}
            onChange={(e) => setIssueNumber(e.currentTarget.value.replace(/[^0-9]/g, ''))}
            value={issueNumber}
            maxLength={inputMinLength}
          />
        </div>
        <div css={styles.cashReceiptIssueModalIssueButtonWrapper}>
          <Button
            color="blue"
            size="large"
            type="button"
            css={styles.cashReceiptIssueModalIssueButton}
            onClick={submitCashReceiptIssueRequest}
            disabled={issueNumber.length < inputMinLength}
          >
            확인
          </Button>
        </div>
      </div>
    </Modal>
  );
}
