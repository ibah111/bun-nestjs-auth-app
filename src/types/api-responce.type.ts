export type ApiResponce<T = {}> = {
    success: boolean;
    message: string | Record<string, any>;
    data?: T;
}