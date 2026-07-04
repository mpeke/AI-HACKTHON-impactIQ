from fastapi import APIRouter

from app.mock_data import STORY_CONTEXT
from app.models import StoryContext

router = APIRouter(tags=["story-context"])


@router.get("/story-context", response_model=StoryContext)
def get_story_context() -> dict:
    """The commit / branch / Jira story bar shown on every page."""
    return STORY_CONTEXT
