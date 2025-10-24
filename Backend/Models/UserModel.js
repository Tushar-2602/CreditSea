import mongoose from 'mongoose';
const { Schema } = mongoose;

/////////////////////////////
// User Schema
/////////////////////////////
const userSchema = new Schema({
  PAN: { type: String, required: true, unique: true },
  name: { 
    type: String, 
    required: true, 
    maxlength: 200, 
    match: /^[A-Za-z ]+$/ 
  },
  mobilePhone: { 
    type: String, 
    required: true, 
    unique: true, 
    match: /^[0-9]{10}$/ 
  },
  creditScore: { type: Number, required: true }
}, { timestamps: true });


const User = mongoose.model('User', userSchema);



export { User};
