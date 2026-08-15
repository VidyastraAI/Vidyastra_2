import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
from config import settings
from utils.helper import load_prompt

class LLMService:
    def __init__(self):
        try:
            self.tokenizer = AutoTokenizer.from_pretrained(settings.LLM_MODEL_NAME)
            self.model = AutoModelForCausalLM.from_pretrained(
                settings.LLM_MODEL_NAME, torch_dtype=torch.float32, device_map="auto"
            )
            self.pipe = pipeline("text-generation", model=self.model, tokenizer=self.tokenizer, max_new_tokens=1024, temperature=0.3, do_sample=True)
        except Exception:
            self.pipe = None

    def generate(self, prompt_filename: str, context: str, user_query: str = "") -> str:
        base_prompt = load_prompt(prompt_filename)
        full_prompt = f"{base_prompt}\n\nContext:\n{context}\n\nQuery/Topic: {user_query}\nOutput:"
        if not self.pipe:
            return f"[Mock LLM Output - Model unavailable] Context received length: {len(context)}"
        out = self.pipe(full_prompt)
        text = out[0]["generated_text"]
        return text.split("Output:")[-1].strip() if "Output:" in text else text.strip()

llm_service = LLMService()