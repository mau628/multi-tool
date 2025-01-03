export interface Item {
  name: string;
  price: number;
}

export interface Order {
  name: string;
  items: Item[];
  totalShipping: number;
}