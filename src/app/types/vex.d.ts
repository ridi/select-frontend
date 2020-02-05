declare module 'vex-js' {
  export const registerPlugin: (plugin: any) => void;
  export const getAll: () => any;
  export const closeAll: () => void;
  export const dialog: {
    alert: (options: any) => void;
  };
}

declare module 'vex-dialog' {}
