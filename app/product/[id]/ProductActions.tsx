// app/product/[id]/ProductActions.tsx
'use client';
import { useRouter } from 'next/navigation';

export default function ProductActions({ product }: { product: any }) {
  const router = useRouter();

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item: any) => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    alert("Added to cart!");
  };

  const buyNow = () => {
    addToCart();
    router.push('/checkout');
  };

  return (
    <div className="flex gap-4 mb-8">
      <button onClick={addToCart} className="flex-1 bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition">
        Add to Cart
      </button>
      <button onClick={buyNow} className="flex-1 bg-orange-500 text-white py-4 rounded-xl font-bold hover:bg-orange-600 transition">
        Buy Now
      </button>
    </div>
  );
}