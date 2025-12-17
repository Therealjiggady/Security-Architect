from celery import Celery
from app.config import settings

celery_app = Celery(
    "broke_n_beauty",
    broker=settings.REDIS_URL if hasattr(settings, 'REDIS_URL') else "redis://localhost:6379/0",
    backend=settings.REDIS_URL if hasattr(settings, 'REDIS_URL') else "redis://localhost:6379/0"
)

celery_app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
    task_routes={
        'app.tasks.email.*': {'queue': 'emails'},
        'app.tasks.tracking.*': {'queue': 'tracking'},
    },
)

# Auto-discover tasks
celery_app.autodiscover_tasks(['app.tasks'])
