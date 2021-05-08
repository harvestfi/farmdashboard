export class RestResponse<T> {
    code: number;
    data: T;
    status: string;

    public static isRestResponse(val): val is RestResponse<any> {
        return !!val
            && (val as RestResponse<any>).code !== undefined
            && (val as RestResponse<any>).data !== undefined
            && (val as RestResponse<any>).status !== undefined;
    }
}
