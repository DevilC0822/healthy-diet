import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, index: true, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['admin', 'onlyReadAdmin', 'user'] },
  createdAt: { type: String, required: true },
  updatedAt: { type: String, required: true },
});

// 配置 toJSON 用于返回结果
UserSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const newObj = ret;
    newObj.id = ret._id;
    delete newObj._id;
    delete newObj.__v;
    return newObj;
  },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);