
#!/bin/bash

# 云函数部署脚本

echo "开始部署云函数到腾讯云..."

# 设置环境变量
export TENCENT_CLOUD_SECRET_ID="YOUR_SECRET_ID"
export TENCENT_CLOUD_SECRET_KEY="YOUR_SECRET_KEY"
export TENCENT_CLOUD_REGION="ap-singapore-1"

# 部署每个云函数

echo "部署云函数: addBill"
cd uniCloud-tencent/cloudfunctions/addBill
npm install
tccli scf deploy-function --function-name addBill --runtime Nodejs12.16 --code . --handler index.main


echo "部署云函数: getBills"
cd uniCloud-tencent/cloudfunctions/getBills
npm install
tccli scf deploy-function --function-name getBills --runtime Nodejs12.16 --code . --handler index.main


echo "部署云函数: updateBill"
cd uniCloud-tencent/cloudfunctions/updateBill
npm install
tccli scf deploy-function --function-name updateBill --runtime Nodejs12.16 --code . --handler index.main


echo "部署云函数: deleteBill"
cd uniCloud-tencent/cloudfunctions/deleteBill
npm install
tccli scf deploy-function --function-name deleteBill --runtime Nodejs12.16 --code . --handler index.main


echo "部署云函数: addMember"
cd uniCloud-tencent/cloudfunctions/addMember
npm install
tccli scf deploy-function --function-name addMember --runtime Nodejs12.16 --code . --handler index.main


echo "部署云函数: getMembers"
cd uniCloud-tencent/cloudfunctions/getMembers
npm install
tccli scf deploy-function --function-name getMembers --runtime Nodejs12.16 --code . --handler index.main


echo "部署云函数: updateMember"
cd uniCloud-tencent/cloudfunctions/updateMember
npm install
tccli scf deploy-function --function-name updateMember --runtime Nodejs12.16 --code . --handler index.main


echo "部署云函数: deleteMember"
cd uniCloud-tencent/cloudfunctions/deleteMember
npm install
tccli scf deploy-function --function-name deleteMember --runtime Nodejs12.16 --code . --handler index.main


echo "部署云函数: getStats"
cd uniCloud-tencent/cloudfunctions/getStats
npm install
tccli scf deploy-function --function-name getStats --runtime Nodejs12.16 --code . --handler index.main


echo "部署云函数: initData"
cd uniCloud-tencent/cloudfunctions/initData
npm install
tccli scf deploy-function --function-name initData --runtime Nodejs12.16 --code . --handler index.main


echo "部署云函数: backupData"
cd uniCloud-tencent/cloudfunctions/backupData
npm install
tccli scf deploy-function --function-name backupData --runtime Nodejs12.16 --code . --handler index.main


echo "部署云函数: errorHandler"
cd uniCloud-tencent/cloudfunctions/errorHandler
npm install
tccli scf deploy-function --function-name errorHandler --runtime Nodejs12.16 --code . --handler index.main


echo "部署云函数: testConnection"
cd uniCloud-tencent/cloudfunctions/testConnection
npm install
tccli scf deploy-function --function-name testConnection --runtime Nodejs12.16 --code . --handler index.main


echo "部署云函数: fixBillDate"
cd uniCloud-tencent/cloudfunctions/fixBillDate
npm install
tccli scf deploy-function --function-name fixBillDate --runtime Nodejs12.16 --code . --handler index.main


echo "部署云函数: fixBillDateType"
cd uniCloud-tencent/cloudfunctions/fixBillDateType
npm install
tccli scf deploy-function --function-name fixBillDateType --runtime Nodejs12.16 --code . --handler index.main


echo "所有云函数部署完成！"
