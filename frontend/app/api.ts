export async function analyzeIdea(payload: {
  idea: string;
  location: string;
  category: string;
  stage: string;
}) {
  const res = await fetch("http://127.0.0.1:8000/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Analysis failed");
  return res.json();
}