import mongoose, { Schema, Document } from 'mongoose';

export interface Donation extends Document {
  amount: number;
  paymentMethod: 'online' | 'bank_transfer' | 'cheque/dd';
  purpose: 'Welfare & Development' | 'Child Education';
  frequency: 'once' | 'monthly' | 'yearly';
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
  transactionID:string;
  cheque_or_dd_number: string;
  transferReceipt: string;
  status: 'pending' | 'failed' | 'success';
}

const DonationSchema: Schema = new Schema({
  amount: { type: Number, required: true },
  paymentMethod: {
    type: String,
    enum: ['online', 'bank_transfer', 'cheque/dd'],
    required: true,
  },
  purpose: {
    type: String,
    enum: ['Welfare & Development', 'Child Education'],
    required: true,
  },
  frequency: {
    type: String,
    enum: ['once', 'monthly', 'yearly'],
    default: 'once',
  },
  status: {
    type: String,
    enum: ['pending', 'failed', 'success'],
    default: 'pending',
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  anonymous: { type: Boolean, required: true },
  newsletter: { type: Boolean, required: true },
  receipt80G: { type: Boolean, required: true },
  panCard: {
    type: String,
    validate: {
      validator: function (this: Donation, value: string | undefined): boolean {
        if (this.receipt80G && (!value || value.trim() === '')) {
          return false;
        }
        return true;
      },
      message: 'PAN Card is required when receipt80G is true.',
    },
  },
  transactionID:{ type: String, required: false },
  cheque_or_dd_number: { type: String, required: false },
  transferReceipt: { type: String, required: false },
}, {
  timestamps: true,
});

const DonationModel = mongoose.models.Donation || mongoose.model<Donation>('Donation', DonationSchema);


export default DonationModel;
