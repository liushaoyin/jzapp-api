'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
  try {
    const batchSize = 100;
    let hasMore = true;
    let page = 0;
    let totalFixed = 0;
    while (hasMore) {
      const res = await db.collection('bills')
        .where({ date: db.command.exists(true) })
        .skip(page * batchSize)
        .limit(batchSize)
        .get();
      if (res.data.length === 0) break;
      for (const bill of res.data) {
        if (typeof bill.date === 'string') {
          await db.collection('bills').doc(bill._id).update({
            date: new Date(bill.date)
          });
          console.log(`Fixed bill ${bill._id}: ${bill.date} => ${new Date(bill.date)}`);
          totalFixed++;
        }
      }
      hasMore = res.data.length === batchSize;
      page++;
    }
    return {
      code: 200,
      message: '批量修正完成',
      totalFixed
    };
  } catch (error) {
    return {
      code: 500,
      message: '批量修正失败',
      error: error.message
    };
  }
}; 