
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
    const { _id } = event;
    if (!_id) {
      res.status(200).json({ code: 400, message: '缺少成员ID' };
    }
    const res = await db.collection('members').doc(_id).remove();
    res.status(200).json({ code: 200, message: '成员删除成功', data: res };
  } catch (error) {
        console.error('deleteMember 失败:', error);
        res.status(500).json({
    res.status(200).json({ code: 500, message: '成员删除失败', error: error.message };
  }
}; 
} finally {
    await client.close();
}