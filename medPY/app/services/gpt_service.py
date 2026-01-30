import os
import json
from typing import Dict, Any, Optional
from dotenv import load_dotenv
from openai import AsyncOpenAI

load_dotenv()

class GptService:
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY", "")
        self.model = os.getenv("GPT_MODEL", "gpt-4o-mini")
        if not self.api_key:
             # In production, we might log a warning or rely on it being passed later,
             # but here we'll raise/print if you want strict checks.
             pass

    async def analyze_with_gpt(self, prompt: str) -> Dict[str, Any]:
        """
        GPT API를 호출하여 분석을 수행합니다.
        """
        if not self.api_key:
            raise ValueError("OPENAI_API_KEY 환경변수가 설정되지 않았습니다")
        
        client = AsyncOpenAI(api_key=self.api_key)

        try:
            response = await client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a medical assistant. Always respond in valid JSON format only. All text content (descriptions, reasons, summaries, etc.) must be written in Korean (한글). Do not use English for any text fields."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                response_format={"type": "json_object"}
            )
            
            content = response.choices[0].message.content
            print(f"GPT raw response: {content}") # Debugging
            
            return json.loads(content)

        except Exception as e:
            raise ValueError(f"GPT API 호출 중 오류 발생: {str(e)}")

