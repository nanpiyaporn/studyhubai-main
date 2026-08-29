// Client-side agent service communicating through secure server API proxies

// Agent 1: Syllabus & Document Parser
export async function runSyllabusAgent(rawText: string) {
  const response = await fetch('/api/agent/run-pipeline', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ syllabusText: rawText }),
  });
  if (!response.ok) {
    throw new Error('Syllabus parsing failed');
  }
  return await response.json();
}

// Agent 2: Audio/Lecture to LaTeX Formatter
export async function runLatexTranscriptionAgent(transcript: string) {
  const response = await fetch('/api/agent/transcribe-audio-latex', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ spokenTranscript: transcript }),
  });
  if (!response.ok) {
    throw new Error('LaTeX transcription failed');
  }
  const data = await response.json();
  return data.latexFormulation || data.markdownSummary || '';
}

// Agent 3: Active Recall & Flashcard Deck Generator
export async function runActiveRecallAgent(studyNotes: string, cardCount: number = 5) {
  const response = await fetch('/api/agent/generate-anki-deck', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic: studyNotes }),
  });
  if (!response.ok) {
    throw new Error('Flashcard generation failed');
  }
  const data = await response.json();
  return data.cards || [];
}

// Agent 4: Study Schedule & Calendar Planner
export async function runStudyPlannerAgent(tasks: any[], availableHoursPerDay: number) {
  const response = await fetch('/api/agent/run-pipeline', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      syllabusText: `Tasks to schedule: ${JSON.stringify(tasks)}. Available daily hours: ${availableHoursPerDay}`,
      studyHoursPerWeek: availableHoursPerDay * 7,
    }),
  });
  if (!response.ok) {
    throw new Error('Study planner failed');
  }
  const data = await response.json();
  return data.studyBlocks || [];
}
