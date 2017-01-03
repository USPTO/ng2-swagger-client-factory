export declare class SwaggerClientFactory {
    private Swagger;
    private RSVP;
    arrayFindIndex: any;
    private clients;
    private promises;
    constructor();
    private getCachedClient(basePath);
    private addClientToCache(client, refresh);
    private getPromise(basePath, refresh);
    private removePromise(basePath);
    getSwaggerClient(basePath: string, refresh: boolean): any;
}
