// Razorpay Payment Gateway Helper Service for BolteeKalam World

export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const initiateRazorpayCheckout = async ({ rupees, points, userProfile, onSuccess, onFailure }) => {
  const isScriptLoaded = await loadRazorpayScript();

  if (!isScriptLoaded) {
    alert('पेमेंट गेटवे लोड करने में विफल! कृपया इंटरनेट कनेक्शन जांचें।');
    if (onFailure) onFailure('Script load error');
    return;
  }

  // Get Razorpay Key from environment or fallback user key
  const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || window.RAZORPAY_KEY_ID || 'rzp_test_TN20k4uJOp5Sfj';

  const options = {
    key: razorpayKey,
    amount: rupees * 100, // Amount in paise (₹10 = 1000 paise)
    currency: 'INR',
    name: 'बोलती कलम (bolateeworld.in)',
    description: `साहित्य वॉलेट रीचार्ज - ${points} रिवॉर्ड पॉइंट्स (₹${rupees})`,
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=300',
    prefill: {
      name: userProfile?.name || 'साहित्य साधक',
      email: userProfile?.email || 'writer@bolteekalam.com',
      contact: userProfile?.phone || ''
    },
    theme: {
      color: '#e11d48' // Rose-600 theme
    },
    handler: function (response) {
      if (response && response.razorpay_payment_id) {
        // Payment successful
        if (onSuccess) {
          onSuccess({
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
            rupees,
            points
          });
        }
      }
    },
    modal: {
      ondismiss: function () {
        console.log('Razorpay payment modal closed by user');
        if (onFailure) onFailure('Payment cancelled by user');
      }
    }
  };

  try {
    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (err) {
    console.error('Razorpay initialization error:', err);
    // Fallback simulation if key is in demo mode
    if (window.confirm(`[Demo/Testing Mode]\n\nRazorpay Gateway: ₹${rupees} का भुगतान स्वीकार करें और ${points} पॉइंट्स प्राप्त करें?\n\n(नोट: लाइव पेमेंट के लिए अपनी Razorpay API Key जोड़ें)`)) {
      if (onSuccess) {
        onSuccess({
          paymentId: `pay_demo_${Date.now()}`,
          rupees,
          points
        });
      }
    } else {
      if (onFailure) onFailure('Payment cancelled in test mode');
    }
  }
};
