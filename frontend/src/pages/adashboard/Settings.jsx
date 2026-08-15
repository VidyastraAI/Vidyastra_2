import React, { useState } from 'react';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('General'); // 'General' | 'Security' | 'Storage' | 'Email'

  // General Settings State
  const [generalSettings, setGeneralSettings] = useState({
    platformName: 'VidyAstra AI Academy',
    supportEmail: 'admin@vidyastra.ai',
    timezone: '(GMT+05:30) India Standard Time (IST)',
    maintenanceMode: false,
    aiProcessingEngine: 'Whisper-v3 + Llama-3-70B',
  });

  // Security Settings State
  const [securitySettings, setSecuritySettings] = useState({
    userRegistration: 'Open', // 'Open' | 'Invite Only'
    defaultUserRole: 'Student', // 'Student' | 'Faculty'
    enforce2FA: false,
    sessionTimeoutMins: '60',
    minPasswordLength: '8',
  });

  // Storage Settings State
  const [storageSettings, setStorageSettings] = useState({
    maxFileUploadMB: '500',
    allowedVideoFormats: 'MP4, MKV, AVI',
    autoBackupSchedule: 'Daily at 12:00 AM',
    cloudStorageBucket: 'vidyastra-prod-asia-south1',
  });

  // Email Settings State
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: 'smtp.sendgrid.net',
    smtpPort: '587',
    senderEmail: 'notifications@vidyastra.ai',
    enableSmtpAuth: true,
  });

  const [isSaving, setIsSaving] = useState(false);

  // Save Settings Handler
  const handleSaveAllSettings = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('System Settings & Platform Configurations Updated Successfully!');
    }, 800);
  };

  // Trigger Backup Action
  const handleTriggerBackup = () => {
    alert('Database & Storage Backup Initiated! The backup archive will be ready shortly.');
  };

  // Send Test Email Action
  const handleSendTestEmail = () => {
    alert(`Test notification email sent to ${generalSettings.supportEmail}`);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
      
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Admin System Settings</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure global platform variables, access security, backup policies, and system integrations
          </p>
        </div>

        <button
          onClick={handleSaveAllSettings}
          disabled={isSaving}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-md transition active:scale-95 flex items-center gap-2 disabled:opacity-50"
        >
          {isSaving ? 'Saving Changes...' : '💾 Save Settings'}
        </button>
      </div>

      {/* Main Settings Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4 overflow-x-auto">
          {[
            { id: 'General', label: '🌐 General System' },
            { id: 'Security', label: '🔒 Security & Access' },
            { id: 'Storage', label: '☁️ Storage & Backup' },
            { id: 'Email', label: '✉️ Email & SMTP' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: GENERAL SYSTEM SETTINGS */}
        {activeTab === 'General' && (
          <form onSubmit={handleSaveAllSettings} className="space-y-5 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Platform Name</label>
                <input
                  type="text"
                  value={generalSettings.platformName}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, platformName: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">System Support Email</label>
                <input
                  type="email"
                  value={generalSettings.supportEmail}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, supportEmail: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Default Server Timezone</label>
                <select
                  value={generalSettings.timezone}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, timezone: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="(GMT+05:30) India Standard Time (IST)">(GMT+05:30) India Standard Time (IST)</option>
                  <option value="(GMT+00:00) UTC / GMT">(GMT+00:00) UTC / GMT</option>
                  <option value="(GMT-05:00) Eastern Time (US & Canada)">(GMT-05:00) Eastern Time (US & Canada)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">AI Transcription Engine</label>
                <input
                  type="text"
                  value={generalSettings.aiProcessingEngine}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, aiProcessingEngine: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
            </div>

            {/* Maintenance Mode Toggle */}
            <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-100 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-800">System Maintenance Mode</h4>
                <p className="text-[11px] text-slate-500 font-medium">When active, only admins can log into the portal. Students & Faculty see a maintenance banner.</p>
              </div>

              <button
                type="button"
                onClick={() => setGeneralSettings({ ...generalSettings, maintenanceMode: !generalSettings.maintenanceMode })}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
                  generalSettings.maintenanceMode ? 'bg-amber-600' : 'bg-slate-300'
                }`}
              >
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                  generalSettings.maintenanceMode ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: SECURITY & ACCESS CONTROL */}
        {activeTab === 'Security' && (
          <form onSubmit={handleSaveAllSettings} className="space-y-5 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">User Registration Policy</label>
                <select
                  value={securitySettings.userRegistration}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, userRegistration: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="Open">Open Registration (Self Sign-up)</option>
                  <option value="Invite Only">Admin / Faculty Invite Only</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Default Assigned Role</label>
                <select
                  value={securitySettings.defaultUserRole}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, defaultUserRole: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="Student">Student</option>
                  <option value="Faculty">Faculty</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Session Timeout (Minutes)</label>
                <input
                  type="number"
                  value={securitySettings.sessionTimeoutMins}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeoutMins: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Minimum Password Length</label>
                <input
                  type="number"
                  value={securitySettings.minPasswordLength}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, minPasswordLength: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-800">Enforce Two-Factor Authentication (2FA)</h4>
                <p className="text-[11px] text-slate-500 font-medium">Require OTP verification for all Faculty and Admin logins.</p>
              </div>

              <button
                type="button"
                onClick={() => setSecuritySettings({ ...securitySettings, enforce2FA: !securitySettings.enforce2FA })}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
                  securitySettings.enforce2FA ? 'bg-indigo-600' : 'bg-slate-300'
                }`}
              >
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                  securitySettings.enforce2FA ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: STORAGE & BACKUP */}
        {activeTab === 'Storage' && (
          <form onSubmit={handleSaveAllSettings} className="space-y-5 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Max File Upload Limit (MB)</label>
                <input
                  type="number"
                  value={storageSettings.maxFileUploadMB}
                  onChange={(e) => setStorageSettings({ ...storageSettings, maxFileUploadMB: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Cloud Storage Bucket Path</label>
                <input
                  type="text"
                  value={storageSettings.cloudStorageBucket}
                  onChange={(e) => setStorageSettings({ ...storageSettings, cloudStorageBucket: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
            </div>

            <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h4 className="text-xs font-bold text-slate-800">Database & System Storage Backups</h4>
                <p className="text-[11px] text-slate-500 font-medium">Automatic Schedule: {storageSettings.autoBackupSchedule}</p>
              </div>

              <button
                type="button"
                onClick={handleTriggerBackup}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition active:scale-95 whitespace-nowrap"
              >
                📦 Backup Now
              </button>
            </div>
          </form>
        )}

        {/* TAB 4: EMAIL & SMTP GATEWAY */}
        {activeTab === 'Email' && (
          <form onSubmit={handleSaveAllSettings} className="space-y-5 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">SMTP Host Server</label>
                <input
                  type="text"
                  value={emailSettings.smtpHost}
                  onChange={(e) => setEmailSettings({ ...emailSettings, smtpHost: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">SMTP Port</label>
                <input
                  type="text"
                  value={emailSettings.smtpPort}
                  onChange={(e) => setEmailSettings({ ...emailSettings, smtpPort: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600">System Notification Sender Email</label>
              <input
                type="email"
                value={emailSettings.senderEmail}
                onChange={(e) => setEmailSettings({ ...emailSettings, senderEmail: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleSendTestEmail}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
              >
                ✉️ Send Test Email
              </button>
            </div>
          </form>
        )}

      </div>

    </div>
  );
}