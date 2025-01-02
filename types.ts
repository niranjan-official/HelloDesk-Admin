export interface Token {
    id: string;
    created_at: Date;
    status: "pending" | "completed";
    token: number;
    uid: string;
}