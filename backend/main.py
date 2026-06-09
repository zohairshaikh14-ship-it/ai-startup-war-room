from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from tavily import TavilyClient
import google.generativeai as genai
import os
import asyncio
import json

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
tavily = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class IdeaRequest(BaseModel):
    idea: str
    location: str = "India"
    category: str = ""
    stage: str = ""

# ── Gemini caller ─────────────────────────────────────────────

async def call_gemini(system: str, user: str) -> str:
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        res = await asyncio.to_thread(
            model.generate_content,
            f"{system}\n\n{user}"
        )
        return res.text
    except Exception as e:
        return f"Analysis error: {str(e)}"

# ── Web search ────────────────────────────────────────────────

async def search(query: str) -> str:
    try:
        res = await asyncio.to_thread(
            tavily.search,
            query=query,
            max_results=5,
            search_depth="advanced"
        )
        results = []
        for r in res.get("results", []):
            results.append(f"- {r['title']}: {r['content'][:200]}")
        return "\n".join(results)
    except Exception as e:
        return f"Search unavailable: {str(e)}"

# ── Location context ──────────────────────────────────────────

LOCATION_DATA = {
    "Mumbai": {
        "population": "2.1 crore (city), 2.4 crore (metro)",
        "tier": "Tier-1 Metro",
        "per_capita_income": "₹4.5 lakh/year (highest in India)",
        "internet_penetration": "78%",
        "startup_ecosystem": "2nd largest in India, 5000+ startups",
        "notable": "Financial capital, fashion hub, entertainment industry, large corporate workforce",
        "challenges": "Very high real estate costs, intense competition, high customer acquisition cost",
        "digital_adoption": "Very High",
        "purchasing_power": "Very High",
    },
    "Bengaluru": {
        "population": "1.4 crore (city)",
        "tier": "Tier-1 Metro",
        "per_capita_income": "₹5.5 lakh/year",
        "internet_penetration": "82%",
        "startup_ecosystem": "Largest in India, 12,000+ startups, Silicon Valley of India",
        "notable": "IT capital, highest tech talent density, VC hub, global MNCs",
        "challenges": "Traffic, infrastructure stress, high competition for tech talent",
        "digital_adoption": "Very High",
        "purchasing_power": "Very High",
    },
    "Delhi NCR": {
        "population": "3.2 crore (NCR)",
        "tier": "Tier-1 Metro",
        "per_capita_income": "₹4.2 lakh/year",
        "internet_penetration": "75%",
        "startup_ecosystem": "3rd largest, 4000+ startups, strong D2C and edtech",
        "notable": "Government proximity, large middle class, strong retail market",
        "challenges": "Pollution concerns, regulatory complexity, diverse consumer base",
        "digital_adoption": "High",
        "purchasing_power": "High",
    },
    "Pune": {
        "population": "70 lakh (city)",
        "tier": "Tier-1 city",
        "per_capita_income": "₹3.8 lakh/year",
        "internet_penetration": "72%",
        "startup_ecosystem": "Growing, 2000+ startups, strong manufacturing and IT",
        "notable": "Large student population, IT hub, automotive industry, proximity to Mumbai",
        "challenges": "Smaller market than Mumbai, infrastructure catching up",
        "digital_adoption": "High",
        "purchasing_power": "High",
    },
    "Hyderabad": {
        "population": "1 crore (city)",
        "tier": "Tier-1 Metro",
        "per_capita_income": "₹3.5 lakh/year",
        "internet_penetration": "70%",
        "startup_ecosystem": "4th largest, strong pharma, IT, and biotech",
        "notable": "HITEC City, pharma hub, lower cost of living vs Mumbai/Bangalore",
        "challenges": "Smaller VC ecosystem, talent moving to Bengaluru",
        "digital_adoption": "High",
        "purchasing_power": "Medium-High",
    },
    "India": {
        "population": "140 crore",
        "tier": "Pan-India",
        "per_capita_income": "₹1.97 lakh/year (national average)",
        "internet_penetration": "52% (75 crore users)",
        "startup_ecosystem": "3rd largest globally, 1 lakh+ startups, 100+ unicorns",
        "notable": "Massive scale, diverse markets, growing middle class, UPI revolution",
        "challenges": "Huge diversity, logistics complexity, varying digital adoption",
        "digital_adoption": "Medium-High and growing fast",
        "purchasing_power": "Varies widely by region",
    },
}

def get_location_context(location: str) -> str:
    data = LOCATION_DATA.get(location, LOCATION_DATA["India"])
    return f"""
Location: {location}
Population: {data['population']}
Market Tier: {data['tier']}
Per Capita Income: {data['per_capita_income']}
Internet Penetration: {data['internet_penetration']}
Startup Ecosystem: {data['startup_ecosystem']}
Key Characteristics: {data['notable']}
Key Challenges: {data['challenges']}
Digital Adoption: {data['digital_adoption']}
Purchasing Power: {data['purchasing_power']}
"""

# ── Agent prompts ─────────────────────────────────────────────

def market_prompt(idea: str, location: str, search_data: str, loc_context: str) -> tuple:
    system = f"""You are a senior market research analyst at a top Indian VC firm.
You have access to real search data and location intelligence.
Your analysis must be specific, evidence-based, and location-aware.
Never make generic statements. Every claim must be supported by data from the search results or location context.
Structure your response with these exact headers:
## Market Demand
## Industry Trends  
## Competitor Landscape (name actual competitors with details)
## Location Fit for {location}
## Opportunity Score: X/10 (explain why)"""

    user = f"""Startup Idea: {idea}
Target Location: {location}

Location Intelligence:
{loc_context}

Real Market Data (from web search):
{search_data}

Analyze this startup idea for {location} using the real data above.
Name specific competitors. Cite specific trends. Explain every conclusion."""
    return system, user

def product_prompt(idea: str, location: str, search_data: str, loc_context: str) -> tuple:
    system = f"""You are an experienced product manager and founder who has built products for Indian markets.
You deeply understand the differences between Tier-1, Tier-2, and Tier-3 Indian city users.
Your analysis must be specific to {location} and its users.
Structure your response with these exact headers:
## Target User Profile in {location}
## Core Problem Being Solved
## MVP Feature List (exactly 5 features, prioritized)
## 90-Day Roadmap
## Biggest Product Risk in {location}"""

    user = f"""Startup Idea: {idea}
Target Location: {location}

Location Intelligence:
{loc_context}

Market Research Data:
{search_data}

Define the exact product strategy for launching in {location}.
Be specific about user behavior, local preferences, and regional nuances."""
    return system, user

def finance_prompt(idea: str, location: str, search_data: str, loc_context: str) -> tuple:
    system = f"""You are a startup financial strategist who has evaluated 500+ Indian startups.
You understand Indian market pricing, unit economics, and business models deeply.
Your analysis must use realistic Indian market numbers for {location}.
Structure your response with these exact headers:
## Recommended Revenue Model
## Pricing Strategy for {location} (with specific ₹ numbers)
## Path to First ₹10 Lakh Revenue
## Unit Economics
## Investment Attractiveness: X/10 (explain why)
## Key Financial Risks"""

    user = f"""Startup Idea: {idea}
Target Location: {location}

Location Intelligence:
{loc_context}

Market Data:
{search_data}

Provide a realistic financial analysis for launching in {location}.
Use actual ₹ numbers. Cite realistic customer acquisition costs, pricing, and revenue projections."""
    return system, user

def devil_prompt(idea: str, location: str, search_data: str, loc_context: str) -> tuple:
    system = f"""You are a brutally honest startup critic and risk analyst.
You have seen thousands of Indian startups fail and you know exactly why.
You are NOT supportive. Your job is to find every reason this idea will fail in {location}.
Be specific. Name real competitors. Cite real market conditions.
Structure your response with these exact headers:
## Critical Assumptions Being Made
## Top 5 Failure Risks for {location}
## What Founders Always Underestimate
## Competitive Threats (name specific companies)
## Brutal Verdict"""

    user = f"""Startup Idea: {idea}
Target Location: {location}

Location Intelligence:
{loc_context}

Market Reality (from web):
{search_data}

Aggressively challenge this startup idea for {location}.
Use real data. Name real competitors. Expose real risks."""
    return system, user

# ── Weighted scoring ──────────────────────────────────────────

async def calculate_score(
    idea: str, location: str,
    market: str, product: str,
    finance: str, devil: str
) -> dict:
    prompt = f"""You are a startup scoring engine for a VC firm.
Based on the four expert analyses below, calculate a weighted startup score.

Score each factor from 1-10:
1. Market Demand (weight: 20%)
2. Market Growth Rate (weight: 10%)
3. Competition Level - lower is better (weight: 15%)
4. Customer Pain Severity (weight: 15%)
5. Revenue Potential (weight: 15%)
6. Scalability (weight: 10%)
7. Regional Fit for {location} (weight: 10%)
8. Execution Complexity - lower is better (weight: 5%)

Market Analysis: {market[:400]}
Product Analysis: {product[:400]}
Finance Analysis: {finance[:400]}
Risk Analysis: {devil[:400]}

Return ONLY this JSON with no extra text:
{{
  "viability_score": 7.4,
  "market_demand": 8,
  "market_growth": 7,
  "competition": 5,
  "pain_severity": 8,
  "revenue_potential": 7,
  "scalability": 8,
  "regional_fit": 7,
  "execution_complexity": 6,
  "verdict": "STRONG OPPORTUNITY",
  "verdict_color": "green",
  "one_line": "One specific sentence about this exact idea in this exact location.",
  "entry_strategy": "One specific recommended entry strategy for {location}."
}}"""
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        res = await asyncio.to_thread(
            model.generate_content, prompt
        )
        text = res.text.strip()
        text = text.replace("```json", "").replace("```", "").strip()
        return json.loads(text)
    except Exception as e:
        return {
            "viability_score": 6.5,
            "market_demand": 6, "market_growth": 6,
            "competition": 6, "pain_severity": 6,
            "revenue_potential": 6, "scalability": 6,
            "regional_fit": 6, "execution_complexity": 6,
            "verdict": "PROCEED WITH CAUTION",
            "verdict_color": "yellow",
            "one_line": "Analysis complete. Review agent reports for details.",
            "entry_strategy": "Start with a focused MVP in one locality before expanding."
        }

# ── Main endpoint ─────────────────────────────────────────────

@app.post("/analyze")
async def analyze(req: IdeaRequest):
    loc_context = get_location_context(req.location)

    # Run 4 targeted searches in parallel
    search1, search2, search3, search4 = await asyncio.gather(
        search(f"{req.idea} market size India {req.location} 2024"),
        search(f"{req.idea} competitors startups India {req.location}"),
        search(f"{req.idea} business model revenue India"),
        search(f"{req.idea} challenges risks failure India {req.location}"),
    )

    combined_search = f"""
Search 1 - Market Size & Demand:
{search1}

Search 2 - Competitors & Startups:
{search2}

Search 3 - Business Models & Revenue:
{search3}

Search 4 - Challenges & Risks:
{search4}
"""

    # Run all 4 agents in parallel
    sys1, usr1 = market_prompt(req.idea, req.location, combined_search, loc_context)
    sys2, usr2 = product_prompt(req.idea, req.location, combined_search, loc_context)
    sys3, usr3 = finance_prompt(req.idea, req.location, combined_search, loc_context)
    sys4, usr4 = devil_prompt(req.idea, req.location, combined_search, loc_context)

    market, product, finance, devil = await asyncio.gather(
        call_gemini(sys1, usr1),
        call_gemini(sys2, usr2),
        call_gemini(sys3, usr3),
        call_gemini(sys4, usr4),
    )

    scores = await calculate_score(
        req.idea, req.location,
        market, product, finance, devil
    )

    return {
        "scores": scores,
        "market": market,
        "product": product,
        "finance": finance,
        "devil": devil,
        "location": req.location,
        "searches_performed": 4,
    }

@app.get("/")
def root():
    return {"status": "War Room API is live — Evidence-based startup intelligence"}