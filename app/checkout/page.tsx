'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/app/utils/supabase';
import { useRouter } from 'next/navigation';
import emailjs from '@emailjs/browser';
import Navbar from '../../components/Navbar';

// বাংলাদেশের ৮টি বিভাগ এবং সেগুলোর অধীনে জেলাসমূহের তালিকা
const DIVISION_DISTRICTS: { [key: string]: string[] } = {
  Dhaka: ['Dhaka', 'Faridpur', 'Gazipur', 'Gopalganj', 'Kishoreganj', 'Madaripur', 'Manikganj', 'Munshiganj', 'Narayanganj', 'Narsingdi', 'Rajbari', 'Shariatpur', 'Tangail'],
  Chattogram: ['Bandarban', 'Brahmanbaria', 'Chandpur', 'Chattogram', 'Cox\'s Bazar', 'Cumilla', 'Feni', 'Khagrachhari', 'Lakshmipur', 'Noakhali', 'Rangamati'],
  Rajshahi: ['Bogura', 'Chapainawabganj', 'Joypurhat', 'Naogaon', 'Natore', 'Pabna', 'Rajshahi', 'Sirajganj'],
  Khulna: ['Bagerhat', 'Chuadanga', 'Jashore', 'Jhenaidah', 'Khulna', 'Kushtia', 'Magura', 'Meherpur', 'Narail', 'Satkhira'],
  Barishal: ['Barguna', 'Barishal', 'Bhola', 'Jhalokati', 'Patuakhali', 'Pirojpur'],
  Sylhet: ['Habiganj', 'Moulvibazar', 'Sunamganj', 'Sylhet'],
  Rangpur: ['Dinajpur', 'Gaibandha', 'Kurigram', 'Lalmonirhat', 'Nilphamari', 'Panchagarh', 'Rangpur', 'Thakurgaon'],
  Mymensingh: ['Jamalpur', 'Mymensingh', 'Netrokona', 'Sherpur']
};

// ঢাকা সাব-এরিয়া বা সাব-আবান যেগুলো ১০০ টাকা চার্জের আওতায় পড়বে
const DHAKA_SUB_AREAS = ['Savar', 'Ashulia', 'Keraniganj', 'Tongi', 'Gazipur', 'Narayanganj'];

export default function CheckoutPage() {
  const supabase = createClient();
  const router = useRouter();
  const [cart, setCart] = useState<any[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    customer_name: '', contact_number: '', email: '',
    division: '', district: '', thana: '', detailed_address: '',
    delivery_charge: 120 // ডিফল্ট ডেলিভারি চার্জ
  });

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  // ডেলিভারি চার্জ ক্যালকুলেট করার ফাংশন
  const calculateDeliveryCharge = (division: string, district: string, thana: string) => {
    if (division !== 'Dhaka') {
      return 120; // ঢাকার বাইরে ১২০ টাকা
    }

    if (district === 'Dhaka' && thana.trim() !== '') {
      // যদি ঢাকা জেলার ভেতর হয়, চেক করব সাব-এরিয়ার মধ্যে পড়ে কি না
      const isSubArea = DHAKA_SUB_AREAS.some(area => 
        thana.toLowerCase().includes(area.toLowerCase())
      );
      if (isSubArea) {
        return 100; // ঢাকা সাব-এরিয়া ১০০ টাকা
      }
      return 60; // ঢাকা সিটি কর্পোরেশন এলাকা ৬০ টাকা
    }

    // যদি গাজীপুর বা নারায়ণগঞ্জ জেলা সিলেক্ট করা হয় কিন্তু বিভাগ ঢাকা হয়
    if (district === 'Gazipur' || district === 'Narayanganj') {
      return 100;
    }

    return 60; // ডিফল্ট ঢাকা সিটি চার্জ
  };

  // বিভাগ পরিবর্তনের লজিক
  const handleDivisionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDivision = e.target.value;
    
    setFormData(prev => {
      const newCharge = selectedDivision === 'Dhaka' ? 60 : 120;
      return { 
        ...prev, 
        division: selectedDivision, 
        district: '',
        delivery_charge: newCharge 
      };
    });
    setDistricts(selectedDivision ? DIVISION_DISTRICTS[selectedDivision] || [] : []);
  };

  // জেলা পরিবর্তনের লজিক
  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDistrict = e.target.value;
    let charge = 120;

    if (formData.division === 'Dhaka') {
      if (selectedDistrict === 'Dhaka') {
        charge = 60;
      } else if (selectedDistrict === 'Gazipur' || selectedDistrict === 'Narayanganj') {
        charge = 100;
      } else {
        charge = 120; // ঢাকার অন্যান্য দূরবর্তী জেলা যেমন কিশোরগঞ্জ, টাঙ্গাইল ইত্যাদি
      }
    }

    setFormData(prev => ({
      ...prev,
      district: selectedDistrict,
      delivery_charge: charge
    }));
  };

  // থানা বা এলাকা লেখার সময় চার্জ আপডেট করার লজিক
  const handleThanaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const thanaValue = e.target.value;
    setFormData(prev => {
      const updatedCharge = calculateDeliveryCharge(prev.division, prev.district, thanaValue);
      return {
        ...prev,
        thana: thanaValue,
        delivery_charge: updatedCharge
      };
    });
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.regular_price * item.quantity), 0);
  const totalAmount = subtotal + formData.delivery_charge;

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{ 
        customer_name: formData.customer_name,
        contact_number: formData.contact_number,
        email: formData.email,
        division: formData.division,
        district: formData.district,
        thana: formData.thana,
        detailed_address: formData.detailed_address,
        delivery_charge: formData.delivery_charge,
        total_amount: totalAmount 
      }])
      .select()
      .single();

    if (orderError) return alert("Error saving order");

    const orderItems = cart.map(item => ({
      order_id: order.id,
      product_id: item.id,
      product_name: item.name,
      quantity: item.quantity,
      price: item.regular_price
    }));

    await supabase.from('order_items').insert(orderItems);

    const templateParams = {
      order_id: order.id,
      customer_name: formData.customer_name,
      contact_number: formData.contact_number,
      detailed_address: `${formData.detailed_address}, Thana: ${formData.thana}, District: ${formData.district}, Division: ${formData.division}`,
      subtotal: subtotal,
      delivery_charge: formData.delivery_charge,
      total_amount: totalAmount,
      orders: cart.map(item => `${item.name} (QTY: ${item.quantity}) - ৳${item.regular_price * item.quantity}`).join('\n')
    };

    try {
      await emailjs.send(
        'service_chg15mr',      
        'template_2dv0c6l',    
        templateParams,
        'mKf2ckp72m_5OXExj'      
      );
    } catch (error) {
      console.error("Email failed:", error);
    }

    localStorage.removeItem('cart');
    alert("Order Placed Successfully!");
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar showSearchAndCart={false} />
      <main className="max-w-4xl mx-auto w-full p-6 grid md:grid-cols-2 gap-8 flex-1">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Shipping Details</h2>
          <form onSubmit={handleOrderSubmit} className="space-y-3">
            <input 
              name="customer_name" 
              placeholder="Full Name" 
              onChange={(e) => setFormData({...formData, customer_name: e.target.value})} 
              className="w-full p-3 border rounded-xl outline-none focus:border-orange-500 text-sm" 
              required 
            />
            <input 
              name="contact_number" 
              placeholder="Contact Number" 
              onChange={(e) => setFormData({...formData, contact_number: e.target.value})} 
              className="w-full p-3 border rounded-xl outline-none focus:border-orange-500 text-sm" 
              required 
            />
            <input 
              type="email"
              name="email" 
              placeholder="Email (Optional)" 
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
              className="w-full p-3 border rounded-xl outline-none focus:border-orange-500 text-sm" 
            />

            {/* বিভাগ এবং জেলা ড্রপডাউন */}
            <div className="grid grid-cols-2 gap-2">
              <select 
                value={formData.division}
                onChange={handleDivisionChange} 
                className="w-full p-3 border rounded-xl outline-none focus:border-orange-500 text-sm bg-white" 
                required
              >
                <option value="">Select Division</option>
                {Object.keys(DIVISION_DISTRICTS).map((div) => (
                  <option key={div} value={div}>{div}</option>
                ))}
              </select>

              <select 
                value={formData.district}
                onChange={handleDistrictChange} 
                className="w-full p-3 border rounded-xl outline-none focus:border-orange-500 text-sm bg-white" 
                required
                disabled={!formData.division}
              >
                <option value="">Select District</option>
                {districts.map((dist) => (
                  <option key={dist} value={dist}>{dist}</option>
                ))}
              </select>
            </div>

            <input 
              name="thana" 
              placeholder="Thana / Upazila / Area (e.g. Savar, Uttara)" 
              onChange={handleThanaChange} 
              className="w-full p-3 border rounded-xl outline-none focus:border-orange-500 text-sm" 
              required 
            />

            <textarea 
              name="detailed_address" 
              placeholder="Detailed Address (House No, Road No, Village, etc.)" 
              rows={2}
              onChange={(e) => setFormData({...formData, detailed_address: e.target.value})} 
              className="w-full p-3 border rounded-xl outline-none focus:border-orange-500 text-sm resize-none" 
              required 
            />

            <button className="w-full bg-green-600 text-white py-3.5 rounded-xl font-bold shadow-md hover:bg-green-700 transition mt-2">
              Confirm Order (Total: ৳{totalAmount})
            </button>
          </form>
        </div>

        {/* অর্ডার সামারি ও ডেলিভারি চার্জ ডিসপ্লে */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 self-start">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Order Summary</h2>
          {cart.map((item, i) => (
            <div key={i} className="flex justify-between py-2 border-b text-sm">
              <span className="text-gray-600">{item.name} x {item.quantity}</span>
              <span className="font-semibold">৳{item.regular_price * item.quantity}</span>
            </div>
          ))}

          <div className="flex justify-between py-2 border-b text-sm mt-2 text-gray-600">
            <span>Subtotal:</span>
            <span className="font-semibold">৳{subtotal}</span>
          </div>

          <div className="flex justify-between py-2 border-b text-sm text-gray-600">
            <span>Delivery Charge:</span>
            <span className="font-semibold">৳{formData.delivery_charge}</span>
          </div>

          <div className="flex justify-between mt-4 text-lg font-bold">
            <span>Total:</span>
            <span className="text-orange-600">৳{totalAmount}</span>
          </div>
        </div>
      </main>
    </div>
  );
}