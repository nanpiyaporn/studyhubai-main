import React, { useState, useEffect } from 'react';
import { UserSession, WorkflowResult, StudyBlock, GoogleTaskItem, EmailDraft } from './types';
import { Header, ActiveTabType } from './components/Header';
import { AuthModal } from './components/AuthModal';
import { TaskmasterWorkflow } from './components/TaskmasterWorkflow';
import { TextbookProcurementHub } from './components/TextbookProcurementHub';
import { AudioLatexTranscriber } from './components/AudioLatexTranscriber';
import { AnkiActiveRecallHub } from './components/AnkiActiveRecallHub';
import { PolicyGuardianView } from './components/PolicyGuardianView';
import { ResearchScraperView } from './components/ResearchScraperView';
import { CalendarView } from './components/CalendarView';
import { TasksManager } from './components/TasksManager';
import { GmailComms } from './components/GmailComms';
import { AgentActivityTerminal } from './components/AgentActivityTerminal';
import { NextJsExportModal } from './components/NextJsExportModal';
import { WorkflowArchitectureView } from './components/WorkflowArchitectureView';

export default function App() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTabType>('workflow');
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [workflowResult, setWorkflowResult] = useState<WorkflowResult | null>(null);

  // Check persisted session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('studyhub_user_session');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.isAuthenticated) {
          setSession(parsed);
          setIsAuthModalOpen(false);
        }
      } catch (e) {
        localStorage.removeItem('studyhub_user_session');
      }
    }
  }, []);

  const handleLoginSuccess = (newSession: UserSession) => {
    setSession(newSession);
    setIsAuthModalOpen(false);
    localStorage.setItem('studyhub_user_session', JSON.stringify(newSession));
  };

  const handleSignOut = () => {
    setSession(null);
    setIsAuthModalOpen(true);
    localStorage.removeItem('studyhub_user_session');
    localStorage.removeItem('studyhub_oauth_token');
  };

  const handleWorkflowComplete = (result: WorkflowResult) => {
    setWorkflowResult(result);
  };

  const handleUpdateBlock = (updatedBlock: StudyBlock) => {
    if (!workflowResult) return;
    const updatedBlocks = workflowResult.studyBlocks.map((b) =>
      b.id === updatedBlock.id ? updatedBlock : b
    );
    setWorkflowResult({ ...workflowResult, studyBlocks: updatedBlocks });
  };

  const handleUpdateTasks = (tasks: GoogleTaskItem[]) => {
    if (!workflowResult) return;
    setWorkflowResult({ ...workflowResult, tasks });
  };

  const handleUpdateDrafts = (drafts: EmailDraft[]) => {
    if (!workflowResult) return;
    setWorkflowResult({ ...workflowResult, emailDrafts: drafts });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* Top Navigation */}
      <Header
        session={session}
        onSignOut={handleSignOut}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onToggleTerminal={() => setIsTerminalOpen((prev) => !prev)}
        isTerminalOpen={isTerminalOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasWorkflowResult={!!workflowResult}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {session ? (
          <>
            {activeTab === 'workflow' && (
              <TaskmasterWorkflow
                session={session}
                workflowResult={workflowResult}
                onWorkflowComplete={handleWorkflowComplete}
                onNavigateTab={(tab) => setActiveTab(tab as any)}
              />
            )}

            {activeTab === 'architecture' && (
              <WorkflowArchitectureView />
            )}

            {activeTab === 'schedule_rules' && (
              <PolicyGuardianView
                policyRules={workflowResult?.policyRules || []}
                studyBlocks={workflowResult?.studyBlocks || []}
                courseCode={workflowResult?.courseCode}
              />
            )}

            {activeTab === 'textbook' && (
              <TextbookProcurementHub
                textbook={workflowResult?.textbook || null}
                options={workflowResult?.textbookOptions || []}
                courseCode={workflowResult?.courseCode}
              />
            )}

            {activeTab === 'audio_latex' && (
              <AudioLatexTranscriber
                formulations={workflowResult?.quantitativeFormulations || []}
                courseCode={workflowResult?.courseCode}
              />
            )}

            {activeTab === 'anki' && (
              <AnkiActiveRecallHub
                ankiCards={workflowResult?.ankiCards || []}
                courseCode={workflowResult?.courseCode}
              />
            )}

            {activeTab === 'research' && (
              <ResearchScraperView
                papers={workflowResult?.researchPapers || []}
                courseCode={workflowResult?.courseCode}
              />
            )}

            {activeTab === 'calendar' && (
              <CalendarView
                studyBlocks={workflowResult?.studyBlocks || []}
                session={session}
                onUpdateBlock={handleUpdateBlock}
                courseCode={workflowResult?.courseCode}
              />
            )}

            {activeTab === 'tasks' && (
              <TasksManager
                tasks={workflowResult?.tasks || []}
                session={session}
                onUpdateTasks={handleUpdateTasks}
                courseCode={workflowResult?.courseCode}
              />
            )}

            {activeTab === 'gmail' && (
              <GmailComms
                drafts={workflowResult?.emailDrafts || []}
                session={session}
                onUpdateDrafts={handleUpdateDrafts}
                courseCode={workflowResult?.courseCode}
                instructor={workflowResult?.instructor}
                instructorEmail={workflowResult?.instructorEmail}
              />
            )}
          </>
        ) : (
          <div className="text-center py-24">
            <h2 className="text-xl font-bold text-slate-700">Authentication Required</h2>
            <p className="text-sm text-slate-500 mt-2">
              Please sign in with your Google Account to access the StudyHub Taskmaster workflows.
            </p>
          </div>
        )}
      </main>

      {/* Mandatory Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen && !session}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Agent Activity & Telemetry Terminal Drawer */}
      <AgentActivityTerminal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
        logs={workflowResult?.logs || []}
      />

      {/* Next.js & NextAuth Production Code Export Modal */}
      <NextJsExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />

    </div>
  );
}

