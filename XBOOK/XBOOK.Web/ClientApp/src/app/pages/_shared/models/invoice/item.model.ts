export class ItemModel {
  constructor(id, productId, price, quantity, amount, discount, description) {
    this.id = id || 0;
    this.productId = productId;
    this.price = price;
    this.quantity = quantity;
    this.amount = amount;
    this.discount = discount;
    this.description = description;
  }
  id: number;
  productId: number;
  price: number;
  quantity: number;
  amount: number;
  discount: number;
  description: string;
}
