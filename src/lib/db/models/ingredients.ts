import mongoose from 'mongoose';

const IngredientsSchema = new mongoose.Schema({
  name: { type: String, index: true, required: true, unique: true, trim: true },
  description: { type: String, required: false, default: '', trim: true },
  count: { type: Number, required: true, default: 1 },
  inType: { type: String, required: true, default: '0' },
  inSourceModel: { type: String, required: false, default: '' },
  type: { type: String, required: true, default: '' }, // 配料类型
  createdAt: { type: String, required: true },
  updatedAt: { type: String, required: true },
});

// 配置 toJSON 用于返回结果
IngredientsSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const newObj = ret;
    newObj.id = ret._id;
    delete newObj._id;
    delete newObj.__v;
    return newObj;
  },
});

export default mongoose.models.Ingredients || mongoose.model('Ingredients', IngredientsSchema);