import { useLocalStorage } from './useLocalStorage';

export interface AppSettings {
  geminiApiKey: string;
  voiceSource: 'system' | 'google' | 'azure';
  dictionarySource: 'free' | 'cambridge' | 'oxford';
  theme: 'light' | 'dark' | 'system';
}

const defaultSettings: AppSettings = {
  geminiApiKey: '',
  voiceSource: 'system',
  dictionarySource: 'free',
  theme: 'system',
};

export function useSettings() {
  const [settings, setSettings] = useLocalStorage<AppSettings>('app-settings', defaultSettings);

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return {
    settings,
    updateSetting,
    setSettings
  };
} 