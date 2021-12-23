import { Subject } from 'rxjs';
import { AttemptOptions } from '@lifeomic/attempt';
import { Options } from 'request';
import { IgApiClient } from './client';
import { IgClientError } from '../errors';
import { IgResponse } from '../types';
declare type Payload = {
    [key: string]: any;
} | string;
interface SignedPost {
    signed_body: string;
    ig_sig_key_version: string;
}
export declare class Request {
    private client;
    private static requestDebug;
    end$: Subject<unknown>;
    error$: Subject<IgClientError>;
    attemptOptions: Partial<AttemptOptions<any>>;
    defaults: Partial<Options>;
    constructor(client: IgApiClient | any);
    private static requestTransform;
    send<T = any>(userOptions: Options, onlyCheckHttpStatus?: boolean): Promise<IgResponse<T>>;
    private updateState;
    signature(data: string): string;
    sign(payload: Payload): SignedPost;
    userBreadcrumb(size: number): string;
    private handleResponseError;
    protected faultTolerantRequest(options: Options): Promise<any>;
    getDefaultHeaders(): {
        'User-Agent': any;
        'X-Ads-Opt-Out': string;
        'X-CM-Bandwidth-KBPS': string;
        'X-CM-Latency': string;
        'X-IG-App-Locale': any;
        'X-IG-Device-Locale': any;
        'X-Pigeon-Session-Id': any;
        'X-Pigeon-Rawclienttime': string;
        'X-IG-Connection-Speed': string;
        'X-IG-Bandwidth-Speed-KBPS': string;
        'X-IG-Bandwidth-TotalBytes-B': string;
        'X-IG-Bandwidth-TotalTime-MS': string;
        'X-IG-EU-DC-ENABLED': any;
        'X-IG-Extended-CDN-Thumbnail-Cache-Busting-Value': any;
        'X-Bloks-Version-Id': any;
        'X-MID': any;
        'X-IG-WWW-Claim': any;
        'X-Bloks-Is-Layout-RTL': any;
        'X-IG-Connection-Type': any;
        'X-IG-Capabilities': any;
        'X-IG-App-ID': any;
        'X-IG-Device-ID': any;
        'X-IG-Android-ID': any;
        'Accept-Language': any;
        'X-FB-HTTP-Engine': string;
        Authorization: any;
        Host: string;
        'Accept-Encoding': string;
        Connection: string;
    };
}
export {};
