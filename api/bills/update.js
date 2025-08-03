
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const db = client.db('jzapp');

try {
    'use strict';


export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }
    
    const event = req.body;
  try {
    const { _id, amount, category, description, date, memberId, payType, type, location } = event;
    if (!_id) {
      res.status(200).json({ code: 400, message: '缺少账单ID' };
    }
    const updateData = {};
    if (amount !== undefined) updateData.amount = parseFloat(amount);
    if (category !== undefined) updateData.category = category;
    if (description !== undefined) updateData.description = description;
    if (date !== undefined) updateData.date = new Date(date);
    if (memberId !== undefined) updateData.memberId = memberId;
    if (payType !== undefined) updateData.payType = payType;
    if (type !== undefined) updateData.type = type;
    if (location !== undefined) updateData.location = location;
    updateData.updateTime = new Date();
    const res = await db.collection('bills').doc(_id).update(updateData);
    res.status(200).json({ code: 200, message: '账单更新成功', data: res };
  } catch (error) {
        console.error('updateBill 失败:', error);
        res.status(500).json({
    res.status(200).json({ code: 500, message: '账单更新失败', error: error.message };
  }
}; 
} finally {
    await client.close();
}