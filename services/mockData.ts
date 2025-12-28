export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  barcode?: string;
  shortcut?: string;
}

export const INITIAL_INVENTORY: Product[] = [
  { id: '1', name: 'Maggi Noodles', price: 14, category: 'Food', stock: 50, barcode: '89010588' },
  { id: '2', name: 'Coke (500ml)', price: 40, category: 'Drink', stock: 24, barcode: '54490000' },
  { id: '3', name: 'Good Day Biscuit', price: 20, category: 'Food', stock: 5, barcode: '89010633' },
  { id: '4', name: 'Dettol Soap', price: 35, category: 'Household', stock: 100, barcode: '89010222' },
  { id: '5', name: 'Dairy Milk', price: 10, category: 'Food', stock: 2, barcode: '76222018' },
];
