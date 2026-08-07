import networkx as nx

class SkillKnowledgeGraph:
    """
    A Graph Neural Network (GNN) inspired Knowledge Graph for inferring implicit skills
    based on a candidate's existing tech stack.
    """
    def __init__(self):
        self.graph = nx.Graph()
        self._build_base_graph()

    def _build_base_graph(self):
        # Define some basic tech stack dependencies (Skill, Dependency, Weight)
        edges = [
            ("React", "JavaScript", 0.9),
            ("React", "HTML", 0.8),
            ("React", "CSS", 0.8),
            ("Redux", "React", 0.85),
            ("Redux", "JavaScript", 0.9),
            ("Node.js", "JavaScript", 0.9),
            ("Express", "Node.js", 0.85),
            ("Django", "Python", 0.95),
            ("Flask", "Python", 0.9),
            ("Pandas", "Python", 0.85),
            ("NumPy", "Python", 0.8),
            ("TensorFlow", "Python", 0.9),
            ("TensorFlow", "Machine Learning", 0.95),
            ("PyTorch", "Python", 0.9),
            ("PyTorch", "Machine Learning", 0.95),
            ("Docker", "Linux", 0.7),
            ("Kubernetes", "Docker", 0.8),
            ("AWS", "Cloud Computing", 0.9)
        ]
        for src, dst, weight in edges:
            self.graph.add_edge(src.lower(), dst.lower(), weight=weight)

    def infer_implicit_skills(self, explicit_skills: list[str], threshold: float = 0.7) -> list[dict]:
        """
        Uses a localized label propagation / personalized PageRank approach 
        to infer missing skills.
        """
        inferred = []
        explicit_lower = {s.lower() for s in explicit_skills}
        
        # Calculate Personalized PageRank where explicit skills are the teleport set
        personalization = {node: (1.0 if node in explicit_lower else 0.0) for node in self.graph.nodes()}
        
        if sum(personalization.values()) == 0:
            return [] # No known skills in the graph
            
        try:
            pagerank_scores = nx.pagerank(self.graph, personalization=personalization, weight='weight')
            
            # Normalize scores and filter by threshold
            max_score = max(pagerank_scores.values()) if pagerank_scores else 1.0
            
            for node, score in pagerank_scores.items():
                normalized_score = score / max_score
                if node not in explicit_lower and normalized_score >= threshold:
                    # Find original casing (if any) or title case
                    original_case_node = node.title()
                    # A small heuristic to fix common casings
                    if node == "javascript": original_case_node = "JavaScript"
                    if node == "node.js": original_case_node = "Node.js"
                    
                    inferred.append({
                        "skill": original_case_node,
                        "confidence": round(normalized_score * 100, 1)
                    })
                    
        except Exception as e:
            print(f"Error inferring skills from Knowledge Graph: {e}")
            
        # Sort by confidence descending
        return sorted(inferred, key=lambda x: x["confidence"], reverse=True)

# Singleton instance for lazy loading
_kg_instance = None

def get_skill_knowledge_graph():
    global _kg_instance
    if _kg_instance is None:
        _kg_instance = SkillKnowledgeGraph()
    return _kg_instance
