'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
  try {
    const { _id } = event;
    if (!_id) {
      return { code: 400, message: '缺少账单ID' };
    }
    const res = await db.collection('bills').doc(_id).remove();
    return { code: 200, message: '账单删除成功', data: res };
  } catch (error) {
    return { code: 500, message: '账单删除失败', error: error.message };
  }
}; 