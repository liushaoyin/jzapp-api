// common/api-config.js
const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? 'https://your-app.vercel.app/api'
    : 'http://localhost:3000/api';

export const apiConfig = {
    baseUrl: API_BASE_URL,
    endpoints: {
        addBill: '/bills/add',
        getBills: '/bills/get',
        updateBill: '/bills/update',
        deleteBill: '/bills/delete',
        addMember: '/members/add',
        getMembers: '/members/get',
        updateMember: '/members/update',
        deleteMember: '/members/delete',
        getStats: '/stats/get',
        initData: '/data/init',
        backupData: '/data/backup'
    }
};

// API调用工具函数
export const apiCall = async (endpoint, data = null, method = 'GET') => {
    const url = apiConfig.baseUrl + apiConfig.endpoints[endpoint];
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    
    if (data && method !== 'GET') {
        options.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'API调用失败');
        }
        
        return result;
    } catch (error) {
        console.error('API调用错误:', error);
        throw error;
    }
};

// 便捷方法
export const api = {
    addBill: (data) => apiCall('addBill', data, 'POST'),
    getBills: (params) => apiCall('getBills', params, 'POST'),
    updateBill: (data) => apiCall('updateBill', data, 'POST'),
    deleteBill: (data) => apiCall('deleteBill', data, 'POST'),
    addMember: (data) => apiCall('addMember', data, 'POST'),
    getMembers: () => apiCall('getMembers', null, 'POST'),
    updateMember: (data) => apiCall('updateMember', data, 'POST'),
    deleteMember: (data) => apiCall('deleteMember', data, 'POST'),
    getStats: (params) => apiCall('getStats', params, 'POST'),
    initData: () => apiCall('initData', null, 'POST'),
    backupData: () => apiCall('backupData', null, 'POST')
};
