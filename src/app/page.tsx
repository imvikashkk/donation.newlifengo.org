"use client"
import React, { useState } from 'react';
import { Heart, CreditCard, IndianRupee, User, Mail, Phone, MapPin, Upload, Building2, Receipt } from 'lucide-react';

interface DonationFormData {
  amount: number;
  frequency: 'once' | 'monthly' | 'yearly';
  paymentMethod: 'online' | 'bank_transfer' | 'cheque/dd';
  purpose: 'Welfare & Development' | 'Child Education';
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  anonymous: boolean;
  newsletter: boolean;
  receipt80G: boolean;
  panCard: string;
  cheque_or_dd_number: string;
  transferReceipt: File | null;
}

interface FormErrors {
  amount?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  panCard?: string;
  transferReceipt?: string;
}

const DonationForm: React.FC = () => {
  const [formData, setFormData] = useState<DonationFormData>({
    amount: 0,
    frequency: 'once',
    paymentMethod: 'online',
    purpose: 'Welfare & Development',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    anonymous: false,
    newsletter: true,
    receipt80G: false,
    panCard: '',
    cheque_or_dd_number: '',
    transferReceipt: null
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [submitted, setSubmitted] = useState(false);
  const predefinedAmounts = [100, 500, 1000, 5000, 10000];

  const indianStates = [
    'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam',
    'Bihar', 'Chandigarh', 'Chhattisgarh', 'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir',
    'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh',
    'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha',
    'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
    'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  const purposes = [
    "Welfare & Development", "Child Education"
  ]


  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Amount validation
    const finalAmount = formData.amount || parseFloat(`${formData.amount}`);
    if (!finalAmount || finalAmount <= 0) {
      newErrors.amount = 'Please select or enter a valid donation amount';
    }

    // Required fields
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'PIN code is required';

    // 80G receipt validation
    if (formData.receipt80G && !formData.panCard.trim()) {
      newErrors.panCard = 'PAN card is required for 80G receipt';
    }

    // Bank transfer receipt validation
    if (formData.paymentMethod === 'bank_transfer' && !formData.transferReceipt) {
      newErrors.transferReceipt = 'Please upload the transfer receipt';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAmountSelect = (amount: number) => {
    setFormData(prev => ({ ...prev, amount }));
    if (errors.amount) {
      setErrors(prev => ({ ...prev, amount: undefined }));
    }
  };

  const handleCustomAmountChange = (value: string | number) => {
    setFormData(prev => ({ ...prev, amount: Number(value) }));
    if (errors.amount) {
      setErrors(prev => ({ ...prev, amount: undefined }));
    }
  };

  const handleInputChange = (field: keyof DonationFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, transferReceipt: file }));
    if (errors.transferReceipt) {
      setErrors(prev => ({ ...prev, transferReceipt: undefined }));
    }
  };

  const handleInputChangeChequeDDNumber = (number: string) => {
    setFormData(prev => ({ ...prev, cheque_or_dd_number: number }));
  }

   const handlePayment = async () => {
    const res = await fetch('/api/phonepe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: 100, // ₹1.00
        mobileNumber: '9754159491',
      }),
    });

    const data = await res.json();

    const redirectUrl = data?.data?.instrumentResponse?.redirectInfo?.url;
    if (redirectUrl) {
      window.location.href = redirectUrl;
    } else {
      alert('Payment failed: ' + data?.message || 'Unknown error');
    }
  };

  const handleSubmit = async () => {
    // if (!validateForm()) return;

    // setIsSubmitting(true);

    try {
      // Create FormData object
      // const formDataToSend = new FormData();

      // Object.keys(formData).forEach((key) => {
      //   const typedKey = key as keyof typeof formData;
      //   const value = formData[typedKey];

      //   if (value === null || value === undefined) return;

      //   // Handle File or File[]
      //   if (value instanceof File) {
      //     formDataToSend.append(key, value);
      //   } else if (Array.isArray(value)) {
      //     value.forEach((item) => {
      //       formDataToSend.append(key, item as string | Blob);
      //     });
      //   } else {
      //     formDataToSend.append(key, value.toString());
      //   }
      // });

     await handlePayment()

      // // Make API call
      // const response = await fetch('/api/donation', {
      //   method: 'POST',
      //   body: formDataToSend,
      //   // Don't set Content-Type header - let browser set it with boundary for multipart/form-data
      // });

      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`);
      // }

      // const result = await response.json();
      // console.log('Success:', result);

      // setSubmitted(true);

    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error (show error message to user)
      alert('Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };


  const renderPaymentDetails = () => {
    if (formData.paymentMethod === 'bank_transfer') {
      return (
        <div className="mt-4 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
            <Building2 className="w-5 h-5 mr-2" />
            Bank Transfer Details
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-gray-700">Account Name:</p>
              <p className="text-gray-900">Newlife Welfare Foundation</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Account Number:</p>
              <p className="text-gray-900">123456789012</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">IFSC Code:</p>
              <p className="text-gray-900">SBIN0001234</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Bank Name:</p>
              <p className="text-gray-900">State Bank of India</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Branch:</p>
              <p className="text-gray-900">Main Branch, Raipur</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Account Type:</p>
              <p className="text-gray-900">Current Account</p>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Transfer Receipt *
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-4 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> transfer receipt
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG or PDF (MAX. 5MB)</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".png,.jpg,.jpeg,.pdf"
                  onChange={handleFileUpload}
                />
              </label>
            </div>
            {formData.transferReceipt && (
              <p className="mt-2 text-sm text-green-600">
                File uploaded: {formData.transferReceipt.name}
              </p>
            )}
            {errors.transferReceipt && (
              <p className="mt-2 text-sm text-red-600">{errors.transferReceipt}</p>
            )}
          </div>
        </div>
      );
    }

    if (formData.paymentMethod === 'cheque/dd') {
      return (
        <div className="mt-4 p-6 bg-green-50 rounded-lg border border-green-200">
          <h4 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
            <Receipt className="w-5 h-5 mr-2" />
            Cheque/DD Instructions
          </h4>
          <div className="space-y-3 text-sm text-gray-700">
            <div>
              <p className="font-medium">Cheque/DD should be drawn in favor of:</p>
              <p className="text-gray-900 font-semibold">Newlife Welfare Foundation</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cheque/DD Number *</label>
              <input
                type="text"
                value={formData.cheque_or_dd_number}
                onChange={(e) => handleInputChangeChequeDDNumber(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-300`}
              />
            </div>
            <div>
              <p className="font-medium">Send to Address:</p>
              <div className="text-gray-900">
                <p>Newlife Welfare Foundation</p>
                <p>123, Gandhi Nagar, Near City Mall</p>
                <p>Raipur, Chhattisgarh - 492001</p>
                <p>Phone: +91 771-2345678</p>
              </div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mt-4">
              <p className="text-yellow-800 text-xs">
                <strong>Note:</strong> Please write your contact details on the back of the cheque/DD and
                allow 3-5 working days for processing after we receive your payment.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  if (submitted) {
    const finalAmount = formData.amount;
    return (
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
            <Heart className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h2>
          <p className="text-lg text-gray-600 mb-6">
            Your ₹{finalAmount} {formData.frequency === 'once' ? 'donation' : `${formData.frequency} donation`} has been processed successfully.
          </p>
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Donation Details</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Amount: ₹{finalAmount}</p>
              <p>Frequency: {formData.frequency === 'once' ? 'One-time' : formData.frequency}</p>
              <p>Payment Method: {formData.paymentMethod}</p>
              {formData.receipt80G && <p>80G Receipt: Requested</p>}
            </div>
          </div>
          <p className="text-sm text-gray-500">
            A confirmation email has been sent to {formData.email}
            {formData.receipt80G && <br />}
            {formData.receipt80G && "Your 80G receipt will be sent within 7 working days."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Image */}
      <div className="w-full h-64 bg-gradient-to-r from-blue-600 to-green-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 flex items-center justify-center h-full text-white">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
              <Heart className="w-12 h-12 text-red-500" />
            </div>
            <h1 className="text-4xl font-bold mb-2">Newlife Welfare Foundation</h1>
            <p className="text-xl opacity-90">Creating Hope, Changing Lives</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-8 -mt-16 relative z-20">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* NGO Info */}
          <div className="text-center mb-8 pb-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Make a Donation</h2>
            <p className="text-gray-600 mb-4">Your support makes a difference in our community</p>
            <div className="text-sm text-gray-500 space-y-1">
              <p className="flex items-center justify-center">
                <MapPin className="w-4 h-4 mr-2" />
                123, Gandhi Nagar, Near City Mall, Raipur, Chhattisgarh - 492001
              </p>
              <p className="flex items-center justify-center">
                <Phone className="w-4 h-4 mr-2" />
                +91 771-2345678
              </p>
              <p className="flex items-center justify-center">
                <Mail className="w-4 h-4 mr-2" />
                info@newlifewelfare.org
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Donation Amount */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                <IndianRupee className="inline w-5 h-5 mr-2" />
                Donation Amount
              </label>

              <div className="grid grid-cols-3 gap-3 mb-4">
                {predefinedAmounts.map(amount => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => handleAmountSelect(amount)}
                    className={`p-3 rounded-lg border-2 font-semibold transition-all ${formData.amount === amount
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                  >
                    ₹{amount}
                  </button>
                ))}
              </div>

              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">₹</span>
                <input
                  type="number"
                  placeholder="Enter custom amount"
                  value={String(formData.amount)}
                  onChange={(e) => handleCustomAmountChange(e.target.value)}
                  className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.amount ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
              </div>
              {errors.amount && <p className="mt-2 text-sm text-red-600">{errors.amount}</p>}
            </div>

            {/* Purpose */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                Towards
              </label>

              <div>
                <select
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-300`}
                >
                  {purposes.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Frequency */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">Donation Frequency</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'once', label: 'One-time' },
                  { value: 'monthly', label: 'Monthly' },
                  { value: 'yearly', label: 'Yearly' }
                ].map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleInputChange('frequency', option.value)}
                    className={`p-3 rounded-lg border-2 font-medium transition-all ${formData.frequency === option.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                <CreditCard className="inline w-5 h-5 mr-2" />
                Payment Method
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'online', label: 'Online' },
                  { value: 'bank_transfer', label: 'Bank Transfer' },
                  { value: 'cheque/dd', label: 'Cheque/DD' }
                ].map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleInputChange('paymentMethod', option.value)}
                    className={`p-3 rounded-lg border-2 font-medium transition-all ${formData.paymentMethod === option.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {renderPaymentDetails()}
            </div>

            {/* 80G Receipt Option */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={formData.receipt80G}
                  onChange={(e) => handleInputChange('receipt80G', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                />
                <div className="ml-3">
                  <span className="text-sm font-medium text-gray-900">I need 80G tax exemption receipt</span>
                  <p className="text-xs text-gray-600 mt-1">
                    Get tax benefits under Section 80G of Income Tax Act. PAN card details required.
                  </p>
                </div>
              </label>
            </div>

            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <User className="inline w-5 h-5 mr-2" />
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.firstName ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                  {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.lastName ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                  {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="inline w-4 h-4 mr-1" />
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="inline w-4 h-4 mr-1" />
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                </div>
              </div>

              {/* PAN Card Field - Conditional */}
              {formData.receipt80G && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PAN Card Number *
                  </label>
                  <input
                    type="text"
                    placeholder="ABCDE1234F"
                    value={formData.panCard}
                    onChange={(e) => handleInputChange('panCard', e.target.value.toUpperCase())}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.panCard ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                  {errors.panCard && <p className="mt-1 text-sm text-red-600">{errors.panCard}</p>}
                </div>
              )}
            </div>

            {/* Address Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <MapPin className="inline w-5 h-5 mr-2" />
                Address Information
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.address ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                  {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.city ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State/UT *</label>
                    <select
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.state ? 'border-red-500' : 'border-gray-300'
                        }`}
                    >
                      <option value="">Choose State/UT</option>
                      {indianStates.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                    {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">PIN Code *</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.zipCode ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.zipCode && <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.anonymous}
                  onChange={(e) => handleInputChange('anonymous', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-3 text-sm text-gray-700">Make this donation anonymous</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.newsletter}
                  onChange={(e) => handleInputChange('newsletter', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-3 text-sm text-gray-700">Subscribe to our newsletter</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Heart className="w-5 h-5 mr-2" />
                  Complete Donation
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationForm;