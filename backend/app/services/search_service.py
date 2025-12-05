import chromadb
from typing import List, Dict, Any, Optional
from chromadb.config import Settings
from ..models import Prompt
from ..database.config import get_db
from .config_service import ConfigService

class SearchService:
    def __init__(self):
        # 初始化配置服务
        self.config_service = ConfigService()
        # 获取Chroma配置
        chroma_config = self.config_service.get_chroma_config()
        
        # 连接到ChromaDB服务（兼容chromadb 0.4.17版本）
        self.client = chromadb.Client(
            chromadb.config.Settings(
                chroma_api_impl="rest",
                chroma_server_host=chroma_config.get("host", "localhost"),
                chroma_server_http_port=chroma_config.get("port", 8999),
                allow_reset=True
            )
        )
        
        # 获取集合名称
        collection_name = chroma_config.get("collection_name", "prompts")
        # 获取或创建集合
        self.collection = self.client.get_or_create_collection(name=collection_name)
    
    def add_prompt_to_index(self, prompt: Prompt) -> None:
        """将Prompt添加到向量索引"""
        # 准备文档内容
        document = f"{prompt.name}\n{prompt.description or ''}\n{prompt.content}"
        
        # 准备元数据
        metadata = {
            "prompt_id": prompt.id,
            "name": prompt.name,
            "category": prompt.category or "",
            "tags": ",".join(prompt.tags) if prompt.tags else ""
        }
        
        # 添加到索引
        self.collection.add(
            documents=[document],
            metadatas=[metadata],
            ids=[f"prompt_{prompt.id}"]
        )
    
    def update_prompt_in_index(self, prompt: Prompt) -> None:
        """更新向量索引中的Prompt"""
        # 准备文档内容
        document = f"{prompt.name}\n{prompt.description or ''}\n{prompt.content}"
        
        # 准备元数据
        metadata = {
            "prompt_id": prompt.id,
            "name": prompt.name,
            "category": prompt.category or "",
            "tags": ",".join(prompt.tags) if prompt.tags else ""
        }
        
        # 更新索引
        self.collection.update(
            documents=[document],
            metadatas=[metadata],
            ids=[f"prompt_{prompt.id}"]
        )
    
    def delete_prompt_from_index(self, prompt_id: int) -> None:
        """从向量索引中删除Prompt"""
        self.collection.delete(ids=[f"prompt_{prompt_id}"])
    
    def search_prompts(self, query: str, n_results: int = 10, category: Optional[str] = None) -> List[Dict[str, Any]]:
        """搜索Prompt"""
        # 构建过滤条件
        where_clause = None
        if category:
            where_clause = {"category": category}
        
        # 执行搜索
        results = self.collection.query(
            query_texts=[query],
            n_results=n_results,
            where=where_clause
        )
        
        # 处理搜索结果
        search_results = []
        for i in range(len(results["ids"][0])):
            # 从ID中提取prompt_id
            prompt_id = int(results["ids"][0][i].split("_")[1])
            
            search_results.append({
                "prompt_id": prompt_id,
                "name": results["metadatas"][0][i]["name"],
                "score": results["distances"][0][i],
                "category": results["metadatas"][0][i]["category"],
                "tags": results["metadatas"][0][i]["tags"].split(",") if results["metadatas"][0][i]["tags"] else []
            })
        
        return search_results
    
    def rebuild_index(self) -> None:
        """重建向量索引"""
        # 获取Chroma配置
        chroma_config = self.config_service.get_chroma_config()
        collection_name = chroma_config.get("collection_name", "prompts")
        
        # 删除并重新创建集合
        self.client.delete_collection(name=collection_name)
        self.collection = self.client.get_or_create_collection(name=collection_name)
        
        # 获取所有Prompt
        db = next(get_db())
        prompts = db.query(Prompt).all()
        
        # 批量添加到索引
        documents = []
        metadatas = []
        ids = []
        
        for prompt in prompts:
            document = f"{prompt.name}\n{prompt.description or ''}\n{prompt.content}"
            metadata = {
                "prompt_id": prompt.id,
                "name": prompt.name,
                "category": prompt.category or "",
                "tags": ",".join(prompt.tags) if prompt.tags else ""
            }
            
            documents.append(document)
            metadatas.append(metadata)
            ids.append(f"prompt_{prompt.id}")
        
        # 添加到索引
        if documents:
            self.collection.add(
                documents=documents,
                metadatas=metadatas,
                ids=ids
            )
    
    def get_config(self) -> Dict[str, Any]:
        """获取搜索服务配置"""
        return {
            "chroma": self.config_service.get_chroma_config(),
            "embedding": self.config_service.get_embedding_config()
        }
