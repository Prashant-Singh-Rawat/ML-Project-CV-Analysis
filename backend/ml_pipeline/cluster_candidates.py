import logging
import numpy as np

logger = logging.getLogger(__name__)

class CandidateClusterer:
    """
    Unsupervised Clustering of Candidates into Niche Expertise Groups.
    Applies HDBSCAN clustering on candidate embeddings to automatically discover 
    and group candidates into niche micro-segments (e.g., "Fintech Backend Devs")
    without predefined labels.
    """
    
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        self.model_name = model_name
        self.encoder = None
        self.clusterer = None
        self._is_loaded = False
        
    def _load_model(self):
        if self._is_loaded:
            return True
            
        try:
            from sentence_transformers import SentenceTransformer
            try:
                from sklearn.cluster import HDBSCAN
            except ImportError:
                # Fallback for older scikit-learn versions
                from hdbscan import HDBSCAN
                
            logger.info(f"[Candidate Clusterer] Loading embedding model {self.model_name}...")
            self.encoder = SentenceTransformer(self.model_name)
            # min_cluster_size specifies the smallest size grouping we wish to consider a "niche"
            self.clusterer = HDBSCAN(min_cluster_size=3, min_samples=2, metric='euclidean')
            self._is_loaded = True
            return True
        except Exception as e:
            logger.error(f"[Candidate Clusterer] Failed to load models: {e}")
            return False

    def cluster_candidates(self, candidates: list[dict]) -> dict:
        """
        Takes a list of candidate dictionaries containing 'id' and 'summary_text'
        and groups them into niche clusters based on semantic similarity.
        """
        if not candidates or len(candidates) < 3:
            return {"status": "Not enough candidates to form meaningful clusters.", "clusters": {}}
            
        if not self._load_model():
            return {"status": "Error loading clustering models.", "clusters": {}}
            
        try:
            # Extract text to encode
            texts = [c.get("summary_text", "") for c in candidates]
            
            # 1. Generate Embeddings
            embeddings = self.encoder.encode(texts)
            
            # 2. Perform HDBSCAN Clustering
            labels = self.clusterer.fit_predict(embeddings)
            
            # 3. Group Candidates by Cluster Label
            clusters = {}
            for idx, label in enumerate(labels):
                cluster_id = int(label)
                if cluster_id not in clusters:
                    clusters[cluster_id] = []
                
                # Append candidate ID to the respective cluster
                clusters[cluster_id].append(candidates[idx].get("id", f"candidate_{idx}"))
                
            # Filter noise (HDBSCAN assigns noise points a label of -1)
            noise = clusters.pop(-1, [])
            
            return {
                "status": "Success",
                "num_clusters_found": len(clusters),
                "clusters": clusters,
                "noise_candidates": noise
            }
            
        except Exception as e:
            logger.error(f"[Candidate Clusterer] Clustering failed: {e}")
            return {"status": f"Error: {e}", "clusters": {}}

# Singleton Instance
_clusterer = None

def get_candidate_clusterer():
    global _clusterer
    if _clusterer is None:
        _clusterer = CandidateClusterer()
    return _clusterer

if __name__ == "__main__":
    # Quick Test
    clusterer = get_candidate_clusterer()
    mock_candidates = [
        {"id": "c1", "summary_text": "Experienced Fintech Backend Developer building scalable trading systems in Java."},
        {"id": "c2", "summary_text": "Backend Software Engineer with a focus on financial payments and trading architectures."},
        {"id": "c3", "summary_text": "Healthcare Data Scientist analyzing medical records using PyTorch and deep learning."},
        {"id": "c4", "summary_text": "Machine Learning Engineer working on medical imaging and healthcare diagnostics."},
        {"id": "c5", "summary_text": "Junior Web Developer doing basic HTML and CSS frontend work."}
    ]
    
    result = clusterer.cluster_candidates(mock_candidates)
    print("Clustering Result:", result)
