from openai import OpenAI
from typing import Dict, Any, List
from .config_service import ConfigService

class LLMService:
    def __init__(self):
        self.config_service = ConfigService()
        self.llm_client = None
        self.embedding_client = None
        
        try:
            self.llm_client = self._create_llm_client()
        except Exception as e:
            print(f"Warning: Failed to initialize LLM client: {e}")
        
        try:
            self.embedding_client = self._create_embedding_client()
        except Exception as e:
            print(f"Warning: Failed to initialize embedding client: {e}")
    
    def _create_llm_client(self) -> OpenAI:
        """创建LLM客户端"""
        llm_config = self.config_service.get_llm_config()
        return OpenAI(
            api_key=llm_config["api_key"],
            base_url=llm_config["base_url"]
        )
    
    def _create_embedding_client(self) -> OpenAI:
        """创建嵌入服务客户端"""
        embedding_config = self.config_service.get_embedding_config()
        return OpenAI(
            api_key=embedding_config["api_key"],
            base_url=embedding_config["base_url"]
        )
    
    def generate_completion(self, prompt: str, **kwargs) -> str:
        """生成文本补全"""
        llm_config = self.config_service.get_llm_config()
        
        # 合并配置参数和传入参数
        params = {
            "model": llm_config["model"],
            "temperature": llm_config["temperature"],
            "max_tokens": llm_config["max_tokens"],
            **kwargs
        }
        
        try:
            response = self.llm_client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                **params
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Failed to generate completion: {e}")
            raise
    
    def generate_embedding(self, text: str) -> List[float]:
        """生成文本嵌入"""
        embedding_config = self.config_service.get_embedding_config()
        
        try:
            response = self.embedding_client.embeddings.create(
                model=embedding_config["model"],
                input=text,
                encoding_format="float"
            )
            embedding = response.data[0].embedding
            
            # 如果需要归一化向量
            if embedding_config["normalize"]:
                import numpy as np
                embedding = np.array(embedding)
                embedding = embedding / np.linalg.norm(embedding)
                embedding = embedding.tolist()
            
            return embedding
        except Exception as e:
            print(f"Failed to generate embedding: {e}")
            raise
    
    def get_llm_config(self) -> Dict[str, Any]:
        """获取LLM配置"""
        return self.config_service.get_llm_config()
    
    def generate_embeddings_batch(self, texts: List[str]) -> List[List[float]]:
        """批量生成文本嵌入"""
        embedding_config = self.config_service.get_embedding_config()
        
        try:
            response = self.embedding_client.embeddings.create(
                model=embedding_config["model"],
                input=texts,
                encoding_format="float"
            )
            
            embeddings = []
            for item in response.data:
                embedding = item.embedding
                
                # 如果需要归一化向量
                if embedding_config["normalize"]:
                    import numpy as np
                    embedding = np.array(embedding)
                    embedding = embedding / np.linalg.norm(embedding)
                    embedding = embedding.tolist()
                
                embeddings.append(embedding)
            
            return embeddings
        except Exception as e:
            print(f"Failed to generate embeddings batch: {e}")
            raise
    
    def get_embedding_config(self) -> Dict[str, Any]:
        """获取嵌入服务配置"""
        return self.config_service.get_embedding_config()
    
    def reload_config(self) -> None:
        """重新加载配置"""
        self.config_service.reload_config()
        self.llm_client = self._create_llm_client()
        self.embedding_client = self._create_embedding_client()
