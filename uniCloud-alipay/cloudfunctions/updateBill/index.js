'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
  try {
    const { _id, amount, category, description, date, memberId, payType, type, location } = event;
    if (!_id) {
      return { code: 400, message: '缺少账单ID' };
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
    return { code: 200, message: '账单更新成功', data: res };
  } catch (error) {
    return { code: 500, message: '账单更新失败', error: error.message };
  }
}; 