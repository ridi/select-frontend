import React from 'react';

import CloseIcon from 'svgs/Close.svg';
import * as styles from 'app/components/Modal/styles';

interface ModalProps {
  title: string;
  onClose: () => void;
  children?: React.ReactNode;
}

export const Modal: React.FunctionComponent<ModalProps> = (props) => (
  <div css={styles.modalContainer}>
    <span
      css={styles.modalContainerDimmedBG}
      onClick={props.onClose}
    />
    <div css={styles.modalComponent}>
      <div css={styles.modalHeader}>
        <h4 css={styles.modalTitle}>{props.title}</h4>
        <button
          css={styles.modalCloseButton}
          onClick={props.onClose}
        >
          <CloseIcon css={styles.closeButtonIcon} />
          <span className="a11y">닫기</span>
        </button>
      </div>
      <div css={styles.modalContent}>
        {props.children}
      </div>
    </div>
  </div>
);
