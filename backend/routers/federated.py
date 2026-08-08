from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Any, Dict
from ml_pipeline.federated_learning import get_federated_engine

router = APIRouter(prefix="/federated", tags=["federated"])

class ClientUpdate(BaseModel):
    client_id: str
    gradients: Any  # In practice, this would be a large tensor payload or reference to a blob
    num_samples: int

class AggregationRequest(BaseModel):
    updates: List[ClientUpdate]

@router.get("/model")
async def download_global_model():
    """
    Allows enterprise clients to download the current global model weights
    to train on their private, local CV datasets.
    """
    engine = get_federated_engine()
    return engine.get_current_global_model()

@router.post("/aggregate")
async def aggregate_local_updates(request: AggregationRequest):
    """
    Secure endpoint for aggregating local gradients/weights uploaded by enterprise clients.
    Implements FedAvg to update the global model without seeing sensitive PII data.
    """
    engine = get_federated_engine()
    
    updates_dict = [update.dict() for update in request.updates]
    result = engine.aggregate_gradients(updates_dict)
    
    if not result.get("updated"):
        raise HTTPException(status_code=400, detail=result.get("status"))
        
    return result
