export interface RestResponse<T> {
    code: number;
    data: T;
    status: string;
}
