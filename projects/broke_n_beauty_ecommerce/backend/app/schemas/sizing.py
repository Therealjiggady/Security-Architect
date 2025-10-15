from pydantic import BaseModel
from enum import Enum

class FitPreference(str, Enum):
    SLIM = "slim"
    REGULAR = "regular"
    RELAXED = "relaxed"

class FabricStretch(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class SizeRecommendationRequest(BaseModel):
    user_id: int = None  # Optional for anonymous users
    height: float  # inches
    weight: float  # lbs
    chest: float = None   # inches (bust/chest circumference) - optional
    waist: float = None   # inches - optional
    hips: float = None    # inches - optional
    shoulders: float = None  # inches (shoulder width) - optional
    inseam: float = None  # inches (for bottoms) - optional
    fit_preference: FitPreference
    fabric_stretch: FabricStretch
    product_type: str = "general"  # Product type for context

class SizeRecommendationResponse(BaseModel):
    top_size: str
    bottom_size: str
    top_confidence: float  # 0-1 score
    bottom_confidence: float  # 0-1 score
    notes: list[str]

class SizingFeedbackRequest(BaseModel):
    user_id: int
    actual_top_size: str
    recommended_top_size: str
    actual_bottom_size: str = None
    recommended_bottom_size: str = None