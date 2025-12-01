export declare class RedisService {
    private client;
    constructor();
    get(key: string): Promise<any>;
    set(key: string, value: string, ttl?: number): Promise<any>;
    del(key: string): Promise<any>;
}
