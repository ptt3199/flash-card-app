import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { useSettings } from '../hooks/useSettings';
import { Save, Loader2 } from 'lucide-react';

export default function SettingsPage() {
  const { settings: storedSettings, setSettings } = useSettings();
  const [localSettings, setLocalSettings] = useState(storedSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setLocalSettings(storedSettings);
  }, [storedSettings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLocalSettings(prev => ({ ...prev, [name]: value }));
    setIsSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSettings(localSettings);
    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }, 500);
  };

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Settings</h1>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">API Keys</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="geminiApiKey" className="block text-sm font-medium text-gray-700 mb-2">
                    Gemini API Key
                  </label>
                  <input
                    type="password"
                    id="geminiApiKey"
                    name="geminiApiKey"
                    value={localSettings.geminiApiKey}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your Gemini API key"
                  />
                  <p className="mt-1 text-sm text-gray-500">Used as a fallback for word definitions.</p>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Preferences</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="dictionarySource" className="block text-sm font-medium text-gray-700 mb-2">
                    Dictionary Source
                  </label>
                  <select
                    id="dictionarySource"
                    name="dictionarySource"
                    value={localSettings.dictionarySource}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="free">Free Dictionary API</option>
                    <option value="cambridge" disabled>Cambridge (coming soon)</option>
                    <option value="oxford" disabled>Oxford (coming soon)</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-2">
                    Theme
                  </label>
                  <select
                    id="theme"
                    name="theme"
                    value={localSettings.theme}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="system">System</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {isSaving ? 'Saving...' : isSaved ? 'Saved!' : 'Save Settings'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
