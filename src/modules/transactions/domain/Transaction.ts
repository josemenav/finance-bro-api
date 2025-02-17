export interface Transaction{
    id: string;
    type: string;
    category: string;
    amount: number;
    description: string;
    userId: string;
    date: Date;
    updatedAt: Date;
}
