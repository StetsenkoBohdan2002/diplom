import mongoose from 'mongoose';

const querySchema = new mongoose.Schema({
  name: { type: String },
  created_date: { type: String, default: new Date().toISOString() },
  queryList: [String],
  query: String,
});

export default mongoose.model('Query', querySchema);
