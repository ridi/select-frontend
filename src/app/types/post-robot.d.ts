declare module 'post-robot' {
  // Warning: This is not actually a Promise, but the interface is the same.
  type ZalgoPromise<T> = Promise<T>;

  // For our purposes, Window is cross domain enough. For now at least.
  type CrossDomainWindowType = Window;
  type WindowResolverType = CrossDomainWindowType | string | HTMLIFrameElement;

  // Client
  // Loosely based on: https://github.com/krakenjs/post-robot/blob/master/src/public/client.js
  interface RequestOptionsType {
    window?: WindowResolverType;
    domain?: string | string[] | RegExp;
    name?: string;
    data?: object;
    fireAndForget?: boolean;
    timeout?: number;
  }
  interface ResponseMessageEvent {
    source: CrossDomainWindowType;
    origin: string;
    data: any;
  }

  function send(
    window: WindowResolverType,
    name: string,
    data?: object,
    options?: any,
  ): ZalgoPromise<ResponseMessageEvent>;
  interface Sendable {
    send: (name: string, data?: object) => ZalgoPromise<ResponseMessageEvent>;
  }
  function client(options?: RequestOptionsType): Sendable;

  // Server
  // Loosely based on: https://github.com/krakenjs/post-robot/blob/master/src/public/server.js
  type ErrorHandlerType = (err: any) => void;

  type HandlerType = (arg: {
    source: Window;
    origin: string;
    data: object;
  }) => void | any | ZalgoPromise<any>;

  interface ServerOptionsType {
    handler?: HandlerType;
    errorHandler?: ErrorHandlerType;
    window?: CrossDomainWindowType;
    name?: string;
    domain?: string | RegExp | string[];
    once?: boolean;
    errorOnClose?: boolean;
  }

  interface Cancellable {
    cancel: () => void;
  }
  function listener(
    options?: ServerOptionsType,
  ): { on: (name: string, handler: HandlerType) => Cancellable };
  function listen(options: ServerOptionsType): Cancellable;
  function on(
    name: string,
    options: ServerOptionsType | HandlerType,
    handler?: HandlerType,
  ): Cancellable;
}
