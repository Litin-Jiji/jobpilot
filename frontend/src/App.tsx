import { Routes, Route } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import Dashboard from './pages/Dashboard'
import AnalyzeApplication from './pages/AnalyzeApplication'
import Applications from './pages/Applications'
import ApplicationDetail from './pages/ApplicationDetail'
import ResumeBuilder from './pages/ResumeBuilder'

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/analyze" element={<AnalyzeApplication />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/applications/:id" element={<ApplicationDetail />} />
        <Route path="/resume-builder" element={<ResumeBuilder />} />
        <Route path="/resume-builder/:resumeId/:jobId" element={<ResumeBuilder />} />
      </Routes>
    </AppShell>
  )
}
