import logging
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

class NaturalLanguageRAGSearch:
    """
    Implements a Retrieval-Augmented Generation (RAG) system for Natural Language 
    querying of CVs. Replaces complex Boolean search strings with LLM-powered semantic search.
    """
    
    def __init__(self, embedding_model: str = "all-MiniLM-L6-v2", llm_model: str = "google/flan-t5-small"):
        self.embedding_model_name = embedding_model
        self.llm_model_name = llm_model
        
        self.encoder = None
        self.llm = None
        self._is_loaded = False
        
    def _load_models(self):
        if self._is_loaded:
            return True
            
        try:
            from sentence_transformers import SentenceTransformer, util
            from transformers import pipeline
            
            logger.info(f"[RAG Search] Loading Embedding Model {self.embedding_model_name}...")
            self.encoder = SentenceTransformer(self.embedding_model_name)
            
            logger.info(f"[RAG Search] Loading Open-Source LLM {self.llm_model_name}...")
            # Using text2text-generation for a lightweight QA/Explanation model.
            # In production, this would be a large Mistral/LLaMA model.
            self.llm = pipeline("text2text-generation", model=self.llm_model_name)
            
            self._is_loaded = True
            return True
        except Exception as e:
            logger.error(f"[RAG Search] Failed to load models: {e}")
            return False

    def search_candidates(self, query: str, candidate_db: List[Dict[str, Any]], top_k: int = 3) -> Dict[str, Any]:
        """
        Executes a RAG query:
        1. Retrieval: Embeds the NL query and retrieves the closest CVs using Cosine Similarity.
        2. Generation: Uses the LLM to explain *why* the top candidate matches the query.
        """
        if not query or not candidate_db:
            return {"status": "Missing query or candidate database.", "results": []}
            
        if not self._load_models():
            return {"status": "Model load error. RAG unavailable.", "results": []}
            
        try:
            from sentence_transformers import util
            
            # Step 1: Retrieval (Vector Search)
            query_emb = self.encoder.encode(query, convert_to_tensor=True)
            
            # Encode candidate summaries (in a real app, these are pre-computed in a VectorDB like Pinecone)
            candidate_texts = [c.get("summary_text", "") for c in candidate_db]
            candidate_embs = self.encoder.encode(candidate_texts, convert_to_tensor=True)
            
            # Calculate cosine similarities
            cosine_scores = util.cos_sim(query_emb, candidate_embs)[0]
            
            # Get top k matches
            top_results = torch_topk(cosine_scores, k=min(top_k, len(candidate_db)))
            
            results = []
            for score, idx in zip(top_results[0], top_results[1]):
                candidate = candidate_db[int(idx)]
                match_score = float(score) * 100
                
                # Step 2: Generation (Augmenting context with LLM)
                # Ask the LLM to explain why this candidate is a good fit based on the query.
                prompt = f"Query: '{query}'. Candidate profile: '{candidate.get('summary_text', '')}'. Briefly explain why this candidate is a good match:"
                llm_response = self.llm(prompt, max_length=60, num_return_sequences=1)
                explanation = llm_response[0]['generated_text'].strip()
                
                results.append({
                    "candidate_id": candidate.get("id"),
                    "match_score": round(match_score, 2),
                    "ai_explanation": explanation,
                    "profile_snippet": candidate.get("summary_text", "")[:150] + "..."
                })
                
            return {
                "status": "Success",
                "query": query,
                "results": results
            }
            
        except Exception as e:
            logger.error(f"[RAG Search] Query failed: {e}")
            return {"status": f"Error: {e}", "results": []}

def torch_topk(scores, k):
    """Helper to get top k indices from a tensor without strictly importing torch at module level"""
    import torch
    return torch.topk(scores, k=k)

# Singleton Instance
_rag_search = None

def get_rag_search():
    global _rag_search
    if _rag_search is None:
        _rag_search = NaturalLanguageRAGSearch()
    return _rag_search
