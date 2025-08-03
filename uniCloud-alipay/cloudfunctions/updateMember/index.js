'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
  try {
    const { _id, name } = event;
    if (!_id || !name) {
      return { code: 400, message: '缺少成员ID或成员名' };
    }
    const res = await db.collection('members').doc(_id).update({ name, updateTime: new Date() });
    return { code: 200, message: '成员更新成功', data: res };
  } catch (error) {
    return { code: 500, message: '成员更新失败', error: error.message };
  }
}; 