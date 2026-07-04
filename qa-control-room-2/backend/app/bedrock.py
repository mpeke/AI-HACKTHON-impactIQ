"""
Integration point for AWS Bedrock.

Today, `generate_scenarios` just returns the mock RECOMMENDED_SCENARIOS so
the API has something realistic to serve without any AWS credentials. When
you're ready to wire up the real agent, replace the body of
`generate_scenarios` with a Bedrock call similar to the commented example
below and leave the function signature (and return shape) unchanged so the
rest of the app doesn't need to change.

Return shape expected by callers — a list of:
    {"tag": "BOUNDARY" | "EDGE" | "NEGATIVE", "text": str, "rationale": str}
"""

import json
import os
from typing import Any

from app.mock_data import RECOMMENDED_SCENARIOS

BEDROCK_MODEL_ID = os.environ.get(
    "BEDROCK_MODEL_ID", "anthropic.claude-3-5-sonnet-20241022-v2:0"
)


def generate_scenarios(
    story_description: str,
    acceptance_criteria: list[str],
    uncovered_criteria: list[str],
    code_diff_summary: str,
) -> list[dict[str, Any]]:
    """
    Ask the model for missing regression scenarios.

    Currently returns mock data. To go live:

    1. `pip install boto3` and add it to requirements.txt
    2. Configure AWS credentials (env vars, profile, or an IAM role if
       this runs on ECS/Lambda)
    3. Uncomment the implementation below

    ---------------------------------------------------------------------
    import boto3

    def generate_scenarios(story_description, acceptance_criteria,
                            uncovered_criteria, code_diff_summary):
        client = boto3.client("bedrock-runtime", region_name="us-east-1")

        prompt = f'''
        You are a QA engineer. Given the story description, the acceptance
        criteria that currently have NO linked test case, and a summary of
        the code diff, propose regression test scenarios that close the
        gap. Favor boundary, edge, and negative cases a developer would
        likely miss.

        Story description: {story_description}
        All acceptance criteria: {acceptance_criteria}
        Uncovered acceptance criteria: {uncovered_criteria}
        Code diff summary: {code_diff_summary}

        Respond ONLY as a JSON array of objects shaped like:
        [{{"tag": "BOUNDARY" | "EDGE" | "NEGATIVE",
           "text": "short scenario title",
           "rationale": "one or two sentences on why it matters"}}]
        '''

        response = client.invoke_model(
            modelId=BEDROCK_MODEL_ID,
            body=json.dumps({
                "anthropic_version": "bedrock-2023-05-31",
                "max_tokens": 1000,
                "messages": [{"role": "user", "content": prompt}],
            }),
        )
        payload = json.loads(response["body"].read())
        text = payload["content"][0]["text"]
        return json.loads(text)
    ---------------------------------------------------------------------
    """
    return RECOMMENDED_SCENARIOS
