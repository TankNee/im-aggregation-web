export interface User {
    status: string;
    name: string;
}


export interface AdapterInfo {
    name: string;
    modified: string;
    url: string;
    status?: string;
    loginAt?: string;
    user: User;
}
