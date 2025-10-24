import mongoose from 'mongoose';
const { Schema } = mongoose;

const reportSummarySchema = new Schema({
  PAN: { type: String, required: true, ref: 'User', unique: true },
  totalAccounts: { type: Number, required: true },
  activeAccounts: { type: Number, required: true },
  closedAccounts: { type: Number, required: true },
  currentBalanceAmount: { type: Number, required: true },
  securedAccountsAmount: { type: Number, required: true },
  unsecuredAccountsAmount: { type: Number, required: true },
  last7DaysCreditEnquiries: { type: Number, required: true }
}, { timestamps: true });

const ReportSummary = mongoose.model('ReportSummary', reportSummarySchema);

export {ReportSummary}