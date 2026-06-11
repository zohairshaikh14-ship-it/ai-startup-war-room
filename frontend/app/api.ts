export async function analyzeIdea(payload: {
  idea: string;
  location: string;
  category: string;
  stage: string;
}) {
  const res = await fetch("https://ai-startup-war-room.onrender.com", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Analysis failed");
  return res.json();
}