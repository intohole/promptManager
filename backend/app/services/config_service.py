import yaml
import os
from typing import Dict, Any, Optional

class ConfigService:
    def __init__(self, config_path: str = None):
        # 获取当前文件的绝对路径
        current_dir = os.path.dirname(os.path.abspath(__file__))
        # 构建配置文件的绝对路径，确保在backend目录下
        default_config_path = os.path.join(current_dir, "../../config.yaml")
        
        self.config_path = config_path or default_config_path
        self.config = self._load_config()
    
    def _load_config(self) -> Dict[str, Any]:
        """加载YAML配置文件"""
        if not os.path.exists(self.config_path):
            # 返回默认配置
            return self._get_default_config()
        
        try:
            with open(self.config_path, 'r', encoding='utf-8') as f:
                config = yaml.safe_load(f)
            return config
        except Exception as e:
            print(f"Failed to load config from {self.config_path}: {e}")
            return self._get_default_config()
    
    def _get_default_config(self) -> Dict[str, Any]:
        """获取默认配置"""
        return {
            "llm": {
                "model": "gpt-3.5-turbo",
                "api_key": os.getenv("OPENAI_API_KEY", ""),
                "base_url": os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1"),
                "timeout": 30,
                "max_retries": 3,
                "temperature": 0.7,
                "max_tokens": 1000
            },
            "embedding": {
                "model": "text-embedding-3-small",
                "api_key": os.getenv("OPENAI_API_KEY", ""),
                "base_url": os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1"),
                "timeout": 30,
                "max_retries": 3,
                "dimension": 1536,
                "normalize": True
            },
            "chroma": {
                "host": "localhost",
                "port": 8999,
                "collection_name": "prompts",
                "timeout": 30
            }
        }
    
    def get_llm_config(self) -> Dict[str, Any]:
        """获取LLM配置"""
        return self.config.get("llm", self._get_default_config()["llm"])
    
    def get_embedding_config(self) -> Dict[str, Any]:
        """获取嵌入服务配置"""
        embedding_config = self.config.get("embedding", {})
        # 如果embedding的api_key为空，使用llm的api_key
        if not embedding_config.get("api_key"):
            embedding_config["api_key"] = self.get_llm_config()["api_key"]
        # 如果embedding的base_url为空，使用llm的base_url
        if not embedding_config.get("base_url"):
            embedding_config["base_url"] = self.get_llm_config()["base_url"]
        return embedding_config
    
    def get_chroma_config(self) -> Dict[str, Any]:
        """获取Chroma配置"""
        return self.config.get("chroma", self._get_default_config()["chroma"])
    
    def reload_config(self) -> None:
        """重新加载配置文件"""
        self.config = self._load_config()
    
    def save_config(self, config: Dict[str, Any]) -> None:
        """保存配置到文件"""
        try:
            with open(self.config_path, 'w', encoding='utf-8') as f:
                yaml.dump(config, f, default_flow_style=False, allow_unicode=True)
            self.reload_config()
        except Exception as e:
            print(f"Failed to save config to {self.config_path}: {e}")
