export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  barcode?: string;
  shortcut?: string; // e.g., "1", "2"
}

export interface CartItem extends Product {
  quantity: number;
}

export enum InputMethod {
  SCANNER = 'SCANNER',
  KEYBOARD = 'KEYBOARD',
  VOICE = 'VOICE',
  CLICK = 'CLICK'
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

// Extend Window for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}