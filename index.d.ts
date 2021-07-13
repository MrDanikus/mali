/// <reference types="node" />

import { EventEmitter } from 'events';
import * as grpc from '@grpc/grpc-js';

type CallType = 'unary' | 'request_stream' | 'response_stream' | 'duplex';

type MetadataValue = grpc.MetadataValue;
type Metadata = Record<string, MetadataValue>;

type GrpcRequest<T> = T;

type GrpcResponse<T> = T;

type GrpcCall<Request, Response> =
  | grpc.ServerUnaryCall<GrpcRequest<Request>, GrpcResponse<Response>>
  | grpc.ServerReadableStream<GrpcRequest<Request>, GrpcResponse<Response>>
  | grpc.ServerWritableStream<GrpcRequest<Request>, GrpcResponse<Response>>
  | grpc.ServerDuplexStream<GrpcRequest<Request>, GrpcResponse<Response>>;

interface App<T> {
  context: T;
}

declare class Mali<AppContextType> extends EventEmitter implements App<AppContextType> {
  constructor(path?: any, name?: string | ReadonlyArray<string>, options?: any);
  name: string;
  env: string;
  ports: ReadonlyArray<number>;
  silent: boolean;
  context: AppContextType;

  addService (path: any, name: string | ReadonlyArray<string>, options?: any): void;
  use (service?: any, name?: any, fns?: any): void;
  start (port: number | string, creds?: any, options?: any): Promise<grpc.Server>;
  toJSON (): any;
  close (): Promise<void>;
  inspect (): any;
}

declare namespace Mali {
  export interface Context<RequestType, ResponseType, AppContextType = any> {
    name: string;
    fullName: string;
    service: string;
    package: string;
    app: App<AppContextType>;
    call: GrpcCall<RequestType, ResponseType>;
    request: Request<RequestType, GrpcCall<RequestType, ResponseType>>;
    response: Response<ResponseType, GrpcCall<RequestType, ResponseType>>;
    req: Request<RequestType, GrpcCall<RequestType, ResponseType>>['req'];
    res: Response<ResponseType, GrpcCall<RequestType, ResponseType>>['res'];
    type: CallType;
    metadata: Metadata;
    locals: Record<string, any>;

    set (field: string, val: MetadataValue): void;
    set (metadata: grpc.Metadata | Metadata): void;
    get (field: string): MetadataValue;
    sendMetadata (md: grpc.Metadata | Metadata): void;

    getStatus (field: string): MetadataValue;
    setStatus (field: string, val: MetadataValue): void;
    setStatus (metadata: grpc.Metadata | Metadata): void;
  }

  export class Request<T, Call extends GrpcCall<any, any>> {
    constructor(call: Call, type: CallType);
    call: Call;
    type: CallType;
    metadata: Metadata;
    req: GrpcRequest<T>;

    getMetadata (): grpc.Metadata;
    get (field: string): MetadataValue;
  }

  export class Response<T, Call extends GrpcCall<any, any>> {
    constructor(call: Call, type: CallType);
    call: Call;
    type: CallType;
    metadata: Metadata;
    status: Metadata;
    res: GrpcResponse<T> | Error;

    set (field: string | grpc.Metadata, val: MetadataValue): void;
    set (metadata: grpc.Metadata | Metadata): void;
    get (field: string): MetadataValue;
    getMetadata (): grpc.Metadata;
    sendMetadata (md?: grpc.Metadata | Metadata): void;

    setStatus (field: string, val: MetadataValue): void;
    setStatus (metadata: grpc.Metadata | Metadata): void;
    getStatus (field: string): MetadataValue;
    getStatusMetadata (): grpc.Metadata;
  }
}

export = Mali;
