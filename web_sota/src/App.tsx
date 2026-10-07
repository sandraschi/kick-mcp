import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { LoggerProvider } from "@/context/LoggerContext";
import { Categories } from "@/pages/Categories";
import { Channels } from "@/pages/Channels";
import { Chat } from "@/pages/Chat";
import { Dashboard } from "@/pages/Dashboard";
import { HelpPage } from "@/pages/HelpPage";
import { Leaderboard } from "@/pages/Leaderboard";
import { Livestreams } from "@/pages/Livestreams";
import { Log } from "@/pages/Log";
import { Moderation } from "@/pages/Moderation";
import { Rewards } from "@/pages/Rewards";
import { SettingsPage } from "@/pages/SettingsPage";

export default function App() {
  return (
    <LoggerProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="livestreams" element={<Livestreams />} />
            <Route path="categories" element={<Categories />} />
            <Route path="channels" element={<Channels />} />
            <Route path="chat" element={<Chat />} />
            <Route path="rewards" element={<Rewards />} />
            <Route path="moderation" element={<Moderation />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="log" element={<Log />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="help" element={<HelpPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LoggerProvider>
  );
}
