import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.models import HealthResponse
from app.routers import coverage_scope, overview, risk, story_context

app = FastAPI(
    title="ImpactIQ API",
    description=(
        "Mock backend for the AI-Powered Regression Intelligence "
        "(QA Control Room) dashboard. Every endpoint here is documented "
        "and browsable at /docs."
    ),
    version="0.1.0",
)

# Comma-separated list of extra allowed origins, e.g. for a deployed
# frontend: ALLOWED_ORIGINS=https://my-frontend.example.com
_extra_origins = [
    origin.strip()
    for origin in os.environ.get("ALLOWED_ORIGINS", "").split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        *_extra_origins,
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(story_context.router, prefix="/api")
app.include_router(overview.router, prefix="/api")
app.include_router(coverage_scope.router, prefix="/api")
app.include_router(risk.router, prefix="/api")


@app.get("/api/health", response_model=HealthResponse, tags=["health"])
def health() -> dict:
    """Used by the frontend to detect whether the live backend is reachable."""
    return {"status": "ok"}


@app.get("/", tags=["health"])
def root() -> dict:
    return {
        "service": "ImpactIQ API",
        "docs": "/docs",
        "health": "/api/health",
    }
