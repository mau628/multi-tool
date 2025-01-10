export interface Order {
  items: Array<Item>
  totalShipping: number
}

export interface Params {
  fee: number
  minimumFee: number
}

export interface Item {
  actualFee: number = 0.0
  actualPrice: number = 0.0
  fee: number = 0.0
  name: string = ''
  percentage: number = 0.0
  price: number = 0.0
  shipping: number = 0.0
  total: number = 0.0
}