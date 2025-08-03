
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
    const { name } = event;
    if (!name) {
      res.status(200).json({ code: 400, message: '成员名不能为空' };
    }
    const res = await db.collection('members').add({ name, createTime: new Date(), updateTime: new Date() });
    res.status(200).json({ code: 200, message: '成员添加成功', data: res };
  } catch (error) {
        console.error('addMember 失败:', error);
        res.status(500).json({
    res.status(200).json({ code: 500, message: '成员添加失败', error: error.message };
  }
});
} finally {
    await client.close();
}