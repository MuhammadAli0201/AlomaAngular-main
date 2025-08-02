export interface ColumnItem {
    name: string;
    key?: string;
    formatter?: (value: any) => string;
}
