'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
  try {
    const { _id } = event;
    if (!_id) {
      return { code: 400, message: '缺少成员ID' };
    }
    const res = await db.collection('members').doc(_id).remove();
    return { code: 200, message: '成员删除成功', data: res };
  } catch (error) {
    return { code: 500, message: '成员删除失败', error: error.message };
  }
}; 