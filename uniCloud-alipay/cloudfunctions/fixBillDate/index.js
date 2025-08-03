'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
  // 直接查出所有账单（如数据量大可分批处理）
  const bills = await db.collection('bills').get();

  let count = 0;
  for (const bill of bills.data) {
    const dateVal = bill.date;
    // 只处理date为字符串的
    if (typeof dateVal === 'string') {
      const dateObj = new Date(dateVal);
      if (!isNaN(dateObj.getTime())) {
        await db.collection('bills').doc(bill._id).update({
          date: dateObj
        });
        count++;
      }
    }
  }
  return { fixed: count };
};