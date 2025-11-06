# Upgraded Size Recommendation Algorithm Design

## Overview
This design upgrades the existing size recommendation system to provide more accurate and detailed sizing recommendations. Key improvements include additional measurements, separate charts for tops/bottoms, weighted scoring, and consideration of fit preferences and fabric properties.

## New Schema

### SizeRecommendationRequest
```python
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
    height: float  # inches
    weight: float  # lbs
    chest: float   # inches (bust/chest circumference)
    waist: float   # inches
    hips: float    # inches
    shoulders: float  # inches (shoulder width)
    inseam: float  # inches (for bottoms)
    fit_preference: FitPreference
    fabric_stretch: FabricStretch
```

### SizeRecommendationResponse
```python
class SizeRecommendationResponse(BaseModel):
    top_size: str
    bottom_size: str
    top_confidence: float  # 0-1 score
    bottom_confidence: float  # 0-1 score
    notes: list[str]
```

## Size Charts

### Top Sizes Chart
```python
TOP_SIZE_CHART = {
    "XS": {
        "chest": {"min": 31, "max": 32},
        "shoulders": {"min": 14, "max": 15},
        "waist": {"min": 23, "max": 24}  # for fit reference
    },
    "S": {
        "chest": {"min": 33, "max": 34},
        "shoulders": {"min": 15, "max": 16},
        "waist": {"min": 25, "max": 26}
    },
    "M": {
        "chest": {"min": 35, "max": 36},
        "shoulders": {"min": 16, "max": 17},
        "waist": {"min": 27, "max": 28}
    },
    "L": {
        "chest": {"min": 37, "max": 39},
        "shoulders": {"min": 17, "max": 18},
        "waist": {"min": 29, "max": 31}
    },
    "XL": {
        "chest": {"min": 40, "max": 42},
        "shoulders": {"min": 18, "max": 19},
        "waist": {"min": 32, "max": 34}
    },
    "XXL": {
        "chest": {"min": 43, "max": 45},
        "shoulders": {"min": 19, "max": 20},
        "waist": {"min": 35, "max": 37}
    }
}
```

### Bottom Sizes Chart
```python
BOTTOM_SIZE_CHART = {
    "XS": {
        "waist": {"min": 23, "max": 24},
        "hips": {"min": 33, "max": 34},
        "inseam": {"min": 28, "max": 30}
    },
    "S": {
        "waist": {"min": 25, "max": 26},
        "hips": {"min": 35, "max": 36},
        "inseam": {"min": 29, "max": 31}
    },
    "M": {
        "waist": {"min": 27, "max": 28},
        "hips": {"min": 37, "max": 38},
        "inseam": {"min": 30, "max": 32}
    },
    "L": {
        "waist": {"min": 29, "max": 31},
        "hips": {"min": 39, "max": 41},
        "inseam": {"min": 31, "max": 33}
    },
    "XL": {
        "waist": {"min": 32, "max": 34},
        "hips": {"min": 42, "max": 44},
        "inseam": {"min": 32, "max": 34}
    },
    "XXL": {
        "waist": {"min": 35, "max": 37},
        "hips": {"min": 45, "max": 47},
        "inseam": {"min": 33, "max": 35}
    }
}
```

## Fit and Stretch Adjustments

### Fit Preference Multipliers
```python
FIT_MULTIPLIERS = {
    "slim": {"range_multiplier": 0.8, "tolerance": 0.1},  # tighter ranges, less tolerance
    "regular": {"range_multiplier": 1.0, "tolerance": 0.2},
    "relaxed": {"range_multiplier": 1.2, "tolerance": 0.3}  # wider ranges, more tolerance
}
```

### Fabric Stretch Adjustments
```python
STRETCH_ADJUSTMENTS = {
    "low": {"deviation_penalty": 1.0},  # strict
    "medium": {"deviation_penalty": 0.7},
    "high": {"deviation_penalty": 0.4}  # forgiving
}
```

## Weighted Scoring Algorithm

### Measurement Weights
```python
TOP_WEIGHTS = {
    "chest": 0.5,
    "shoulders": 0.3,
    "waist": 0.2
}

BOTTOM_WEIGHTS = {
    "waist": 0.4,
    "hips": 0.4,
    "inseam": 0.2
}
```

### Scoring Function
```python
def calculate_size_score(measurements: dict, size_chart: dict, weights: dict,
                        fit_multiplier: dict, stretch_adjustment: dict) -> float:
    """
    Calculate weighted score for how well measurements fit a size.
    Returns score between 0-1, where 1 is perfect fit.
    """
    total_score = 0
    total_weight = 0

    for measurement, value in measurements.items():
        if measurement in size_chart and measurement in weights:
            min_val = size_chart[measurement]["min"] * fit_multiplier["range_multiplier"]
            max_val = size_chart[measurement]["max"] * fit_multiplier["range_multiplier"]
            weight = weights[measurement]

            if min_val <= value <= max_val:
                # Perfect fit within adjusted range
                score = 1.0
            else:
                # Calculate deviation score
                range_width = max_val - min_val
                deviation = min(abs(value - min_val), abs(value - max_val))
                tolerance = fit_multiplier["tolerance"] * range_width
                penalty = stretch_adjustment["deviation_penalty"]

                if deviation <= tolerance:
                    score = 1.0 - (deviation / tolerance) * penalty
                else:
                    score = max(0, 1.0 - (deviation / range_width) * penalty)

            total_score += score * weight
            total_weight += weight

    return total_score / total_weight if total_weight > 0 else 0
```

## Main Recommendation Function

```python
def recommend_sizes(request: SizeRecommendationRequest) -> SizeRecommendationResponse:
    fit_mult = FIT_MULTIPLIERS[request.fit_preference]
    stretch_adj = STRETCH_ADJUSTMENTS[request.fabric_stretch]

    # Top measurements
    top_measurements = {
        "chest": request.chest,
        "shoulders": request.shoulders,
        "waist": request.waist
    }

    # Bottom measurements
    bottom_measurements = {
        "waist": request.waist,
        "hips": request.hips,
        "inseam": request.inseam
    }

    # Calculate scores for tops
    top_scores = {}
    for size, ranges in TOP_SIZE_CHART.items():
        top_scores[size] = calculate_size_score(
            top_measurements, ranges, TOP_WEIGHTS, fit_mult, stretch_adj
        )

    # Calculate scores for bottoms
    bottom_scores = {}
    for size, ranges in BOTTOM_SIZE_CHART.items():
        bottom_scores[size] = calculate_size_score(
            bottom_measurements, ranges, BOTTOM_WEIGHTS, fit_mult, stretch_adj
        )

    # Select best sizes
    top_size = max(top_scores, key=top_scores.get)
    top_confidence = top_scores[top_size]

    bottom_size = max(bottom_scores, key=bottom_scores.get)
    bottom_confidence = bottom_scores[bottom_size]

    # Generate notes
    notes = []
    if top_confidence < 0.7:
        notes.append(f"Top size {top_size} may not fit perfectly. Consider trying on.")
    if bottom_confidence < 0.7:
        notes.append(f"Bottom size {bottom_size} may not fit perfectly. Consider trying on.")
    if request.fit_preference == "slim":
        notes.append("Slim fit prioritizes a close, tailored look.")
    if request.fabric_stretch == "high":
        notes.append("High stretch fabric allows for more flexibility in sizing.")

    return SizeRecommendationResponse(
        top_size=top_size,
        bottom_size=bottom_size,
        top_confidence=round(top_confidence, 2),
        bottom_confidence=round(bottom_confidence, 2),
        notes=notes
    )
```

## Implementation Notes

1. **Units**: All measurements assumed to be in inches. Add conversion if needed.
2. **Validation**: Add input validation for realistic measurement ranges.
3. **Edge Cases**: Handle cases where measurements are far outside chart ranges.
4. **Testing**: Include unit tests for scoring function and edge cases.
5. **Performance**: Charts are small, so no optimization needed.
6. **Extensibility**: Easy to add more sizes or measurements.

This design provides a robust, flexible sizing algorithm that considers multiple factors for accurate recommendations.