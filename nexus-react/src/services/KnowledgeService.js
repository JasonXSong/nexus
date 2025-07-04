import axios from 'axios';

// API 基础配置
const API_BASE_URL = 'http://localhost:8000/api/v1';
const API_TIMEOUT = 5000; // 5秒超时

// 创建 axios 实例
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    // 如果需要认证，可以添加 token
    // 'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

// 转换 API 数据为前端所需格式
const transformKnowledgeData = (apiData) => {
  return {
    id: apiData.id.toString(),
    name: apiData.name,
    description: `${apiData.chunking_mode} | ${apiData.chunking_path}`,
    fileCount: 0, // API 未提供，暂时设为0
    createdAt: new Date(apiData.created_at).toLocaleDateString(),
    updatedAt: new Date(apiData.updated_at).toLocaleDateString(),
    chunkingMode: apiData.chunking_mode,
    chunkingPath: apiData.chunking_path,
    documents_: apiData.documents_
  };
};

export const fetchKnowledgeBases = async () => {
  try {
    const response = await api.get('/knowledge/', {
      params: {
        page_num: 0,
        page_size: 10
      }
    });
    
    if (response.data && Array.isArray(response.data)) {
      return response.data.map(transformKnowledgeData);
    }
    
    throw new Error('Invalid API response format');
  } catch (error) {
    console.error('获取知识库失败:', error);
    throw error;
  }
};

export const createKnowledgeBase = async (formData) => {
  try {
    // 准备 API 所需数据格式
    const payload = {
      name: formData.get('name'),
      description: formData.get('description'),
      chunking_mode: formData.get('chunking_mode'), // 默认值
    };
    
    const response = await api.post('/knowledge/', payload);
    
    if (response.data && response.data.id) {
      return transformKnowledgeData(response.data);
    }
    
    throw new Error('创建知识库失败');
  } catch (error) {
    console.error('创建知识库失败:', error);
    throw error;
  }
};

export const uploadFileToKnowledge = (knowledgeId, file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);
  
  return api.post(`/knowledge/${knowledgeId}/files`, file, {
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      onProgress(file.name, percentCompleted);
    }
  });
};

export const updateKnowledgeBase = async (id, data) => {
  try {
    const response = await api.put(`/knowledge/${id}/`, data);
    
    if (response.data && response.data.id) {
      return transformKnowledgeData(response.data);
    }
    
    throw new Error('更新知识库失败');
  } catch (error) {
    console.error('更新知识库失败:', error);
    throw error;
  }
};

export const deleteKnowledgeBase = async (id) => {
  try {
    await api.delete(`/knowledge/${id}/`);
    return true;
  } catch (error) {
    console.error('删除知识库失败:', error);
    throw error;
  }
};