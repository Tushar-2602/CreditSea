import mongoose from 'mongoose';
const { Schema } = mongoose;

const creditAccountSchema = new Schema({
  accountNumber: { type: String, required: true, unique: true },
  PAN: { type: String, required: true, ref: 'User' },
  bankName: { type: String, required: true },
  address: { type: String, required: true },
  amountOverdue: { type: Number, required: true },
  currentBalance: { type: Number, required: true }
}, { timestamps: true });

const CreditAccount = mongoose.model('CreditAccount', creditAccountSchema);

export {CreditAccount}