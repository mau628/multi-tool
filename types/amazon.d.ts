export interface Item {
  name: string;
  price: number;
}

export interface Order {
  items: Item[];
  totalShipping: number;
}

export interface ItemTotal {
  price: number;
  shipping: number;
  fee: number;
  total: number;
  tax: number;
}