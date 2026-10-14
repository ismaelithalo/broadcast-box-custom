import React, { useState, useRef } from "react";
import Button from "../../shared/Button";
import Input from "../../shared/Input";
import { useTheme, GRADIENT_PRESETS, FONT_PRESETS, ThemeSettings, DEFAULT_THEME } from "../../../providers/ThemeProvider";
import { getAdminAuthorizationHeader } from "../adminAuth";

export default function AppearancePage() {
  const { theme, saveTheme } = useTheme();
  const [form, setForm] = useState<ThemeSettings>({ ...theme });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [uploadingTarget, setUploadingTarget] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetField: "logoUrl" | "faviconUrl" | "backgroundImageUrl") => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploadingTarget(targetField);
    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: {
          Authorization: getAdminAuthorizationHeader(),
        },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setForm((prev) => ({
          ...prev,
          [targetField]: data.url,
          ...(targetField === "backgroundImageUrl" ? { backgroundMode: "image" } : {}),
        }));
      } else {
        const err = await res.text();
        setSaveError(`Erro no upload: ${err}`);
      }
    } catch {
      setSaveError("Falha na comunicação com o servidor ao fazer upload");
    } finally {
      setUploadingTarget(null);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(null);
    setSaveError(null);

    const ok = await saveTheme(form);
    setIsSaving(false);

    if (ok) {
      setSaveSuccess("Tema e preferências salvos com sucesso!");
      setTimeout(() => setSaveSuccess(null), 4000);
    } else {
      setSaveError("Erro ao salvar as configurações no servidor.");
    }
  };

  const handleReset = async () => {
    if (!window.confirm("Deseja realmente restaurar todas as configurações de aparência para o padrão original?")) {
      return;
    }
    const defaultSettings = { ...DEFAULT_THEME };
    setForm(defaultSettings);
    setIsSaving(true);
    const ok = await saveTheme(defaultSettings);
    setIsSaving(false);
    if (ok) {
      setSaveSuccess("Tema restaurado para o padrão original com sucesso!");
      setTimeout(() => setSaveSuccess(null), 4000);
    } else {
      setSaveError("Erro ao restaurar o tema no servidor.");
    }
  };

  return (
    <div className="p-6 w-full max-w-5xl mx-auto flex flex-col gap-6 text-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-700 pb-4">
        <div>
          <h1 className="text-3xl font-bold">Aparência e Personalização</h1>
          <p className="text-gray-400 text-sm mt-1">
            Personalize a identidade visual, cores, fontes, fundos e marca da sua plataforma em tempo real.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            title="Restaurar Padrão"
            color="Deny"
            onClick={handleReset}
            isDisabled={isSaving}
          />
          <Button
            title={isSaving ? "Salvando..." : "Salvar Alterações"}
            color="Accept"
            onClick={handleSave}
            isDisabled={isSaving}
          />
        </div>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-900/80 border border-emerald-500 text-emerald-200 px-4 py-3 rounded">
          {saveSuccess}
        </div>
      )}

      {saveError && (
        <div className="bg-red-900/80 border border-red-500 text-red-200 px-4 py-3 rounded">
          {saveError}
        </div>
      )}

      {/* Seção 1: Identidade da Marca */}
      <div className="bg-gray-800/80 border border-gray-700 rounded-lg p-5 flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-white">1. Identidade da Plataforma</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nome da Plataforma"
            value={form.siteName}
            setValue={(val) => setForm((prev) => ({ ...prev, siteName: val }))}
            placeholder="Ex: Minha Live Box"
          />

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Fonte da Interface</label>
            <select
              value={form.fontFamily}
              onChange={(e) => setForm((prev) => ({ ...prev, fontFamily: e.target.value }))}
              className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            >
              {Object.entries(FONT_PRESETS).map(([key, item]) => (
                <option key={key} value={key}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Logo Upload */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-300">Logo da Plataforma (Navbar)</span>
            <div className="flex items-center gap-4">
              {form.logoUrl ? (
                <div className="relative group bg-gray-900 border border-gray-700 p-2 rounded">
                  <img src={form.logoUrl} alt="Logo" className="h-10 max-w-40 object-contain" />
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, logoUrl: "" }))}
                    className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    title="Remover logo"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <span className="text-xs text-gray-500 italic">Nenhum logo enviado</span>
              )}
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e, "logoUrl")}
              />
              <Button
                title={uploadingTarget === "logoUrl" ? "Enviando..." : "Upload Logo"}
                onClick={() => logoInputRef.current?.click()}
                isDisabled={uploadingTarget !== null}
              />
            </div>
          </div>

          {/* Favicon Upload */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-300">Ícone da Aba (Favicon)</span>
            <div className="flex items-center gap-4">
              {form.faviconUrl ? (
                <div className="relative group bg-gray-900 border border-gray-700 p-2 rounded">
                  <img src={form.faviconUrl} alt="Favicon" className="h-8 w-8 object-contain" />
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, faviconUrl: "/favicon.ico" }))}
                    className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    title="Restaurar padrão"
                  >
                    ×
                  </button>
                </div>
              ) : null}
              <input
                ref={faviconInputRef}
                type="file"
                accept=".ico,.png,.svg,.jpg,.webp"
                className="hidden"
                onChange={(e) => handleFileUpload(e, "faviconUrl")}
              />
              <Button
                title={uploadingTarget === "faviconUrl" ? "Enviando..." : "Upload Ícone"}
                onClick={() => faviconInputRef.current?.click()}
                isDisabled={uploadingTarget !== null}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Seção 2: Paleta de Cores */}
      <div className="bg-gray-800/80 border border-gray-700 rounded-lg p-5 flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-white">2. Cores do Sistema</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Cor Primária */}
          <div className="flex flex-col gap-2 bg-gray-900/60 p-3 rounded border border-gray-700">
            <label className="text-sm font-medium text-gray-300">Cor Primária (Botões)</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={form.primaryColor}
                onChange={(e) => setForm((prev) => ({ ...prev, primaryColor: e.target.value }))}
                className="w-10 h-10 rounded cursor-pointer border border-gray-600 bg-transparent"
              />
              <span className="font-mono text-sm uppercase">{form.primaryColor}</span>
            </div>
          </div>

          {/* Barra de Navegação */}
          <div className="flex flex-col gap-2 bg-gray-900/60 p-3 rounded border border-gray-700">
            <label className="text-sm font-medium text-gray-300">Barra de Navegação</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={form.navbarColor}
                onChange={(e) => setForm((prev) => ({ ...prev, navbarColor: e.target.value }))}
                className="w-10 h-10 rounded cursor-pointer border border-gray-600 bg-transparent"
              />
              <span className="font-mono text-sm uppercase">{form.navbarColor}</span>
            </div>
          </div>

          {/* Fundo Base */}
          <div className="flex flex-col gap-2 bg-gray-900/60 p-3 rounded border border-gray-700">
            <label className="text-sm font-medium text-gray-300">Fundo Principal</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={form.backgroundColor}
                onChange={(e) => setForm((prev) => ({ ...prev, backgroundColor: e.target.value }))}
                className="w-10 h-10 rounded cursor-pointer border border-gray-600 bg-transparent"
              />
              <span className="font-mono text-sm uppercase">{form.backgroundColor}</span>
            </div>
          </div>

          {/* Cards */}
          <div className="flex flex-col gap-2 bg-gray-900/60 p-3 rounded border border-gray-700">
            <label className="text-sm font-medium text-gray-300">Cards e Caixas</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={form.cardColor}
                onChange={(e) => setForm((prev) => ({ ...prev, cardColor: e.target.value }))}
                className="w-10 h-10 rounded cursor-pointer border border-gray-600 bg-transparent"
              />
              <span className="font-mono text-sm uppercase">{form.cardColor}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Seção 3: Estilo de Fundo (Background) */}
      <div className="bg-gray-800/80 border border-gray-700 rounded-lg p-5 flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-white">3. Fundo da Página (Background)</h2>

        {/* Seletor de Modo */}
        <div className="flex flex-wrap gap-3">
          {(["solid", "gradient", "image"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, backgroundMode: mode }))}
              className={`px-4 py-2 rounded font-medium transition-colors ${
                form.backgroundMode === mode
                  ? "bg-blue-600 text-white"
                  : "bg-gray-900 text-gray-400 hover:text-white border border-gray-700"
              }`}
            >
              {mode === "solid" && "Cor Sólida"}
              {mode === "gradient" && "Degradê / Gradiente"}
              {mode === "image" && "Imagem de Fundo"}
            </button>
          ))}
        </div>

        {/* Opções de Gradiente */}
        {form.backgroundMode === "gradient" && (
          <div className="flex flex-col gap-3 pt-2">
            <span className="text-sm text-gray-300">Selecione um estilo pronto com degradê:</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {Object.entries(GRADIENT_PRESETS).map(([key, preset]) => {
                const isSelected = form.gradientPreset === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, gradientPreset: key }))}
                    className={`flex flex-col rounded-lg p-3 border text-left transition-all ${
                      isSelected
                        ? "border-blue-500 ring-2 ring-blue-500/50 shadow-lg"
                        : "border-gray-700 hover:border-gray-500"
                    }`}
                  >
                    <div
                      className="w-full h-14 rounded mb-2 border border-white/10"
                      style={{ background: preset.css || form.backgroundColor }}
                    />
                    <span className="text-xs font-semibold text-white">{preset.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Opções de Imagem de Fundo */}
        {form.backgroundMode === "image" && (
          <div className="flex flex-col gap-4 pt-2">
            <span className="text-sm text-gray-300">Upload de imagem de fundo global:</span>
            <div className="flex items-center gap-4">
              {form.backgroundImageUrl && (
                <div className="relative group bg-gray-900 border border-gray-700 p-2 rounded">
                  <img
                    src={form.backgroundImageUrl}
                    alt="Background"
                    className="h-20 w-32 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, backgroundImageUrl: "" }))}
                    className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    title="Remover imagem"
                  >
                    ×
                  </button>
                </div>
              )}
              <input
                ref={bgInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e, "backgroundImageUrl")}
              />
              <Button
                title={uploadingTarget === "backgroundImageUrl" ? "Enviando imagem..." : "Upload Imagem de Fundo"}
                onClick={() => bgInputRef.current?.click()}
                isDisabled={uploadingTarget !== null}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button
          title="Restaurar Padrão"
          color="Deny"
          onClick={handleReset}
          isDisabled={isSaving}
        />
        <Button
          title={isSaving ? "Salvando..." : "Salvar Alterações"}
          color="Accept"
          onClick={handleSave}
          isDisabled={isSaving}
        />
      </div>
    </div>
  );
}
