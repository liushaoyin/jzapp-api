'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
  try {
    const { name } = event;
    if (!name) {
      return { code: 400, message: '成员名不能为空' };
    }
    const res = await db.collection('members').add({ name, createTime: new Date(), updateTime: new Date() });
    return { code: 200, message: '成员添加成功', data: res };
  } catch (error) {
    return { code: 500, message: '成员添加失败', error: error.message };
  }
};