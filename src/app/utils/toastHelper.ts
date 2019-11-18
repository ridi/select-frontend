/** src/css/base/toast.css */

import toast from 'app/utils/toast';

export default function showMessageForRequestError(e?: any) {
  toast.failureMessage();
}
