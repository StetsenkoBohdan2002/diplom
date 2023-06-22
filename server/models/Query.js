// Репозиторій проект: https://github.com/StetsenkoBohdan2002/diplom
import mongoose from 'mongoose';

const querySchema = new mongoose.Schema({
  name: { type: String },
  created_date: { type: String, default: new Date(Date.now()).toISOString() },
  queryList: [String],
  query: String,
});

export default mongoose.model('Query', querySchema);

