/** src/css/base/toast.css */

import * as vexDialog from 'vex-dialog';
import * as vex from 'vex-js';

import { Omit } from 'app/types';

vex.registerPlugin(vexDialog);

export const TOAST_CLASS_NAME = 'RSGToast';
export const TOAST_DEFAULT_DURATION = 3000;
export const TOAST_DEFAULT_ERROR_MESSAGE =
  '처리 도중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
export enum ToastStatusIcon {
  info = 'info',
  success = 'success',
  fail = 'fail',
}

export interface ToastOptions {
  iconType?: ToastStatusIcon;
  button?: {
    label: string;
    callback: () => void;
    showArrowIcon?: boolean;
  };
  link?: {
    url: string;
    label: string;
    showArrowIcon?: boolean;
  };
  durationMs?: number;
  callback?: () => any;
}

export type SimpleToastOptions = Omit<ToastOptions, 'iconType'>;

class Toast {
  constructor() {
    this.toastTimer = null;
    this.documentRootElement = null;

    this.init(); // TODO: main.js에서만 실행하므로 일단 이렇게 함.
  }

  private toastTimer: number | null;

  private documentRootElement: HTMLBodyElement | null;

  private getMessage(message: string, options: ToastOptions) {
    const { link, button } = options;

    const arrowIcon = `<span class="${TOAST_CLASS_NAME}_ArrowIcon"></span>`;

    const messageDOMText = `<span class="${TOAST_CLASS_NAME}_Message">${message}</span>`;

    const linkDOMText = link
      ? `<a
        href="${link.url}"
        class="${TOAST_CLASS_NAME}_FunctionButton"
      >${link.label}${link.showArrowIcon ? arrowIcon : ''}</a>`
      : '';

    const buttonDOMText = button
      ? `<button
        class="${TOAST_CLASS_NAME}_FunctionButton"
      >${button.label}${button.showArrowIcon ? arrowIcon : ''}</button>`
      : '';

    return messageDOMText + linkDOMText + buttonDOMText;
  }

  private setButtonCallback(buttonCallback: () => void) {
    const button = document.querySelector(`.${TOAST_CLASS_NAME}_FunctionButton`);
    if (!button) {
      return;
    }

    const buttonCallbackHandler = () => {
      button.removeEventListener('click', buttonCallbackHandler);
      buttonCallback();
    };

    button.addEventListener('click', buttonCallbackHandler);
  }

  private show(message: string, options: ToastOptions) {
    if (!this.documentRootElement) {
      return;
    }

    const {
      iconType = ToastStatusIcon.info,
      durationMs = TOAST_DEFAULT_DURATION,
      callback = () => null,
      button,
    } = options;

    window.requestAnimationFrame(() => {
      this.close();
      this.documentRootElement!.classList.add(`${TOAST_CLASS_NAME}-open`);

      vex.dialog.alert({
        className: TOAST_CLASS_NAME,
        showCloseButton: true,
        unsafeMessage: this.getMessage(message, options),
        contentClassName: `${TOAST_CLASS_NAME}_Content ${TOAST_CLASS_NAME}_Content-${iconType}`,
        afterOpen: () => {
          this.setTimer(durationMs);
          if (button) {
            this.setButtonCallback(button.callback);
          }
        },
        afterClose: callback,
      });
    });
  }

  public init() {
    this.documentRootElement = document.querySelector('body');
    if (!this.documentRootElement) {
      return;
    }

    this.documentRootElement.addEventListener('click', (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains(`${TOAST_CLASS_NAME}_FunctionButton`)) {
        this.close();
      }
    });

    // 인스턴트 메세지 자동 닫기 마우스 오버할 때 지연되도록
    this.documentRootElement.addEventListener('mouseover', (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains('vex-content')) {
        window.clearTimeout(this.toastTimer || undefined);
      }
    });

    this.documentRootElement.addEventListener('mouseout', (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains('vex-content') && Object.keys(vex.getAll()).length > 0) {
        this.setTimer(TOAST_DEFAULT_DURATION);
      }
    });
  }

  public setTimer(durationMs: number) {
    this.toastTimer = window.setTimeout(() => this.close(), durationMs);
  }

  public info(message: string, options: SimpleToastOptions = {}) {
    this.show(message, {
      ...options,
      iconType: ToastStatusIcon.info,
    });
  }

  public success(message: string, options: SimpleToastOptions = {}) {
    this.show(message, {
      ...options,
      iconType: ToastStatusIcon.success,
    });
  }

  public failureMessage(
    message: string = TOAST_DEFAULT_ERROR_MESSAGE,
    options: SimpleToastOptions = {},
  ) {
    this.show(message, {
      ...options,
      iconType: ToastStatusIcon.fail,
    });
  }

  public close() {
    if (!this.documentRootElement) {
      return;
    }

    this.documentRootElement.classList.remove(`${TOAST_CLASS_NAME}-open`);
    this.documentRootElement.classList.remove('vex-open');
    if (Object.keys(vex.getAll()).length > 0) {
      vex.closeAll();
    }
    window.clearTimeout(this.toastTimer || undefined);
  }
}

const toast = new Toast();

export default toast;
