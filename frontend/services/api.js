// API服务层 - 封装所有与后端的API调用
const API_BASE_URL = 'http://localhost:8000/api';

// Prompt相关API
const PromptAPI = {
    // 获取所有Prompt
    getAll: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/prompts/`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch prompts:', error);
            throw error;
        }
    },
    
    // 获取单个Prompt
    getById: async (id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/prompts/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Failed to fetch prompt ${id}:`, error);
            throw error;
        }
    },
    
    // 创建Prompt
    create: async (promptData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/prompts/`, promptData);
            return response.data;
        } catch (error) {
            console.error('Failed to create prompt:', error);
            throw error;
        }
    },
    
    // 更新Prompt
    update: async (id, promptData) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/prompts/${id}`, promptData);
            return response.data;
        } catch (error) {
            console.error(`Failed to update prompt ${id}:`, error);
            throw error;
        }
    },
    
    // 删除Prompt
    delete: async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/prompts/${id}`);
        } catch (error) {
            console.error(`Failed to delete prompt ${id}:`, error);
            throw error;
        }
    },
    
    // 搜索Prompt
    search: async (query, category = null) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/prompts/search/${encodeURIComponent(query)}`, {
                params: { category }
            });
            return response.data;
        } catch (error) {
            console.error('Failed to search prompts:', error);
            throw error;
        }
    }
};

// Version相关API
const VersionAPI = {
    // 获取指定Prompt的所有版本
    getAllByPromptId: async (promptId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/versions/prompt/${promptId}`);
            return response.data;
        } catch (error) {
            console.error(`Failed to fetch versions for prompt ${promptId}:`, error);
            throw error;
        }
    },
    
    // 获取单个版本
    getById: async (versionId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/versions/${versionId}`);
            return response.data;
        } catch (error) {
            console.error(`Failed to fetch version ${versionId}:`, error);
            throw error;
        }
    },
    
    // 根据版本号获取版本
    getByNumber: async (promptId, versionNumber) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/versions/prompt/${promptId}/number/${versionNumber}`);
            return response.data;
        } catch (error) {
            console.error(`Failed to fetch version ${versionNumber} for prompt ${promptId}:`, error);
            throw error;
        }
    },
    
    // 创建新版本
    create: async (promptId, versionData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/versions/prompt/${promptId}`, versionData);
            return response.data;
        } catch (error) {
            console.error(`Failed to create version for prompt ${promptId}:`, error);
            throw error;
        }
    },
    
    // 获取版本差异
    getDiff: async (promptId, version1, version2) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/versions/diff/prompt/${promptId}`, {
                params: { version1, version2 }
            });
            return response.data;
        } catch (error) {
            console.error(`Failed to get diff between versions ${version1} and ${version2}:`, error);
            throw error;
        }
    },
    
    // 回滚到指定版本
    rollback: async (promptId, versionNumber) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/versions/rollback/prompt/${promptId}/version/${versionNumber}`);
            return response.data;
        } catch (error) {
            console.error(`Failed to rollback to version ${versionNumber}:`, error);
            throw error;
        }
    }
};

// Token相关API
const TokenAPI = {
    // 获取所有Token
    getAll: async (modelType = null) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/tokens/`, {
                params: { model_type: modelType }
            });
            return response.data;
        } catch (error) {
            console.error('Failed to fetch tokens:', error);
            throw error;
        }
    },
    
    // 获取单个Token
    getById: async (tokenId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/tokens/${tokenId}`);
            return response.data;
        } catch (error) {
            console.error(`Failed to fetch token ${tokenId}:`, error);
            throw error;
        }
    },
    
    // 创建Token
    create: async (tokenData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/tokens/`, tokenData);
            return response.data;
        } catch (error) {
            console.error('Failed to create token:', error);
            throw error;
        }
    },
    
    // 更新Token
    update: async (tokenId, tokenData) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/tokens/${tokenId}`, tokenData);
            return response.data;
        } catch (error) {
            console.error(`Failed to update token ${tokenId}:`, error);
            throw error;
        }
    },
    
    // 删除Token
    delete: async (tokenId) => {
        try {
            await axios.delete(`${API_BASE_URL}/tokens/${tokenId}`);
        } catch (error) {
            console.error(`Failed to delete token ${tokenId}:`, error);
            throw error;
        }
    },
    
    // 获取活跃Token
    getActive: async (modelType) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/tokens/active/${modelType}`);
            return response.data;
        } catch (error) {
            console.error(`Failed to fetch active tokens for model type ${modelType}:`, error);
            throw error;
        }
    }
};

// 索引管理API
const IndexAPI = {
    // 重建索引
    rebuild: async () => {
        try {
            const response = await axios.post(`${API_BASE_URL}/rebuild-index`);
            return response.data;
        } catch (error) {
            console.error('Failed to rebuild index:', error);
            throw error;
        }
    }
};

// 导出所有API服务
window.API = {
    Prompt: PromptAPI,
    Version: VersionAPI,
    Token: TokenAPI,
    Index: IndexAPI
};
