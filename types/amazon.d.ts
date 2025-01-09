export interface Item {
  name: string;
  price: number;
}

export interface Order {
  items: Item[];
  totalShipping: number;
}