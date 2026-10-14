import { ArrowPathIcon, XMarkIcon, PencilSquareIcon, PhotoIcon } from "@heroicons/react/16/solid";
import React, { useContext, useEffect, useRef, useState } from "react";
import Button from "../../shared/Button";
import Input from "../../shared/Input";
import Toggle from "../../shared/Toggle";
import ModalTextInput from "../../shared/ModalTextInput";
import ModalMessageBox from "../../shared/ModalMessageBox";
import { LocaleContext } from "../../../providers/LocaleProvider";
import { getIcon } from "../../shared/Icons";
import {
  clearAdminToken,
  getAdminAuthorizationHeader,
  isInvalidAdminSessionResponse,
} from "../adminAuth";

interface Profile {
  streamKey: string;
  token: string;
  isPublic: boolean;
  motd: string;
  backgroundImage?: string;
}

const ProfilesPage = () => {
  const { locale } = useContext(LocaleContext);
  const [response, setResponse] = useState<Profile[]>();
  const [isAddProfileModalOpen, setIsAddProfileModalOpen] = useState<boolean>(false);
  const [isRemoveProfileModalOpen, setIsRemoveProfileModalOpen] = useState<string>("");
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [isUploadingBg, setIsUploadingBg] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [successMessage, setSuccessMessage] = useState<string>();

  const bgInputRef = useRef<HTMLInputElement>(null);

  const copyTokenToClipboard = (token: string) => navigator.clipboard.writeText(token);

  const refreshProfiles = () => {
    fetch(`/api/admin/profiles`, {
      method: "GET",
      headers: {
        Authorization: getAdminAuthorizationHeader(),
      },
    })
      .then((result) => {
        if (isInvalidAdminSessionResponse(result.status)) {
          clearAdminToken();
          return;
        }

        return result.json();
      })
      .then((result) => {
        setResponse(() => result);
      });
  };

  const resetProfileToken = (streamKey: string) => {
    fetch(`/api/admin/profiles/reset-token`, {
      method: "POST",
      headers: {
        Authorization: getAdminAuthorizationHeader(),
      },
      body: JSON.stringify({ streamKey: streamKey }),
    }).then((result) => {
      if (isInvalidAdminSessionResponse(result.status)) {
        clearAdminToken();
        return;
      }

      refreshProfiles();
    });
  };

  const addProfile = (streamKey: string) => {
    fetch(`/api/admin/profiles/add-profile`, {
      method: "POST",
      headers: {
        Authorization: getAdminAuthorizationHeader(),
      },
      body: JSON.stringify({ streamKey: streamKey }),
    }).then((result) => {
      if (isInvalidAdminSessionResponse(result.status)) {
        clearAdminToken();
        return;
      }

      if (result.status === 400) {
        result.text().then((resultText) => setErrorMessage(() => resultText));
        return;
      }

      setIsAddProfileModalOpen(() => false);
      refreshProfiles();
    });
  };

  const removeProfile = (streamKey: string) => {
    fetch(`/api/admin/profiles/remove-profile`, {
      method: "POST",
      headers: {
        Authorization: getAdminAuthorizationHeader(),
      },
      body: JSON.stringify({ streamKey: streamKey }),
    }).then((result) => {
      if (isInvalidAdminSessionResponse(result.status)) {
        clearAdminToken();
        return;
      }

      if (result.status === 400) {
        result.text().then((resultText) => setErrorMessage(() => resultText));
        return;
      }

      setIsRemoveProfileModalOpen(() => "");
      refreshProfiles();
    });
  };

  const handleProfileBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProfile) return;

    const formData = new FormData();
    formData.append("file", file);

    setIsUploadingBg(true);
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
        setEditingProfile((prev) => (prev ? { ...prev, backgroundImage: data.url } : null));
      } else {
        const err = await res.text();
        setErrorMessage(`Erro no upload: ${err}`);
      }
    } catch {
      setErrorMessage("Erro de rede no upload da imagem");
    } finally {
      setIsUploadingBg(false);
    }
  };

  const saveProfileEdit = async () => {
    if (!editingProfile) return;

    try {
      const res = await fetch("/api/admin/profiles/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: getAdminAuthorizationHeader(),
        },
        body: JSON.stringify({
          streamKey: editingProfile.streamKey,
          motd: editingProfile.motd,
          isPublic: editingProfile.isPublic,
          backgroundImage: editingProfile.backgroundImage || "",
        }),
      });

      if (res.ok) {
        setEditingProfile(null);
        setSuccessMessage("Perfil atualizado com sucesso!");
        setTimeout(() => setSuccessMessage(undefined), 3000);
        refreshProfiles();
      } else {
        const err = await res.text();
        setErrorMessage(`Falha ao salvar: ${err}`);
      }
    } catch {
      setErrorMessage("Erro de rede ao salvar perfil");
    }
  };

  useEffect(() => {
    refreshProfiles();
  }, []);

  return (
    <div className="p-6 w-full h-full max-w-6xl mx-auto flex flex-col justify-between text-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{locale.admin_page_profiles.title}</h1>
        <Button
          title={locale.admin_page_profiles.button_add_profile}
          color="Accept"
          onClick={() => setIsAddProfileModalOpen(true)}
        />
      </div>

      {successMessage && (
        <div className="mb-4 bg-emerald-900/80 border border-emerald-500 text-emerald-200 px-4 py-2 rounded">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 bg-red-900/80 border border-red-500 text-red-200 px-4 py-2 rounded flex justify-between items-center">
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage(undefined)} className="text-white font-bold ml-2">×</button>
        </div>
      )}

      <div className="overflow-x-auto h-full mb-4">
        <ModalTextInput
          title={locale.admin_page_profiles.add_profile_modal_title}
          message={locale.admin_page_profiles.add_profile_modal_message}
          errorMessage={errorMessage}
          placeholder={locale.admin_page_profiles.add_profile_modal_placeholder}
          isOpen={isAddProfileModalOpen}
          canCloseOnBackgroundClick={true}
          onAccept={(result) => addProfile(result.toString())}
          onDeny={() => setIsAddProfileModalOpen(false)}
        />

        <ModalMessageBox
          title={locale.admin_page_profiles.remove_profile_modal_title}
          message={locale.admin_page_profiles.remove_profile_modal_message + " " + isRemoveProfileModalOpen}
          errorMessage={errorMessage}
          isOpen={isRemoveProfileModalOpen !== ""}
          canCloseOnBackgroundClick={true}
          onAccept={() => removeProfile(isRemoveProfileModalOpen)}
          onDeny={() => setIsRemoveProfileModalOpen("")}
        />

        {/* Modal de Edição de Perfil (Background, MOTD, Visibilidade) */}
        {editingProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-lg w-full flex flex-col gap-4 shadow-2xl">
              <div className="flex justify-between items-center border-b border-gray-700 pb-3">
                <h2 className="text-xl font-bold">
                  Editar Perfil: <span className="text-blue-400">{editingProfile.streamKey}</span>
                </h2>
                <button
                  onClick={() => setEditingProfile(null)}
                  className="text-gray-400 hover:text-white text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              <Input
                label="MOTD (Mensagem do Dia)"
                value={editingProfile.motd}
                setValue={(val) => setEditingProfile((prev) => (prev ? { ...prev, motd: val } : null))}
                placeholder="Ex: Bem-vindo à live!"
              />

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-300">Visibilidade</label>
                <Toggle
                  titleLeft="Privado"
                  onClickLeft={() => setEditingProfile((prev) => (prev ? { ...prev, isPublic: false } : null))}
                  titleRight="Público"
                  onClickRight={() => setEditingProfile((prev) => (prev ? { ...prev, isPublic: true } : null))}
                  selected={editingProfile.isPublic ? "Right" : "Left"}
                />
              </div>

              {/* Background do Profile */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-300">Imagem de Fundo do Canal</label>
                <div className="flex items-center gap-3">
                  {editingProfile.backgroundImage ? (
                    <div className="relative group bg-gray-900 border border-gray-700 p-1 rounded">
                      <img
                        src={editingProfile.backgroundImage}
                        alt="Background"
                        className="h-16 w-24 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setEditingProfile((prev) => (prev ? { ...prev, backgroundImage: "" } : null))
                        }
                        className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        title="Remover fundo"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400 italic">Sem imagem personalizada</span>
                  )}

                  <input
                    ref={bgInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfileBgUpload}
                  />

                  <Button
                    title={isUploadingBg ? "Enviando..." : "Upload Fundo"}
                    onClick={() => bgInputRef.current?.click()}
                    isDisabled={isUploadingBg}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-700">
                <Button title="Cancelar" color="Deny" onClick={() => setEditingProfile(null)} />
                <Button title="Salvar Alterações" color="Accept" onClick={saveProfileEdit} />
              </div>
            </div>
          </div>
        )}

        <table className="min-w-full rounded-lg bg-gray-900/40 border border-gray-800">
          <thead className="bg-gray-800/80 text-white">
            <tr>
              <th className="px-4 py-3 text-left">{locale.admin_page_profiles.table_header_stream_key}</th>
              <th className="px-4 py-3 text-left">Fundo</th>
              <th className="px-4 py-3 text-left">{locale.admin_page_profiles.table_header_is_public}</th>
              <th className="px-4 py-3 text-left">{locale.admin_page_profiles.table_header_motd}</th>
              <th className="px-4 py-3 text-left">{locale.admin_page_profiles.table_header_token}</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {response?.map((profile, index) => {
              return (
                <tr key={index} className="hover:bg-gray-800/40 transition-colors">
                  <td className="px-4 py-3 font-semibold text-blue-400">{profile.streamKey}</td>
                  <td className="px-4 py-3">
                    {profile.backgroundImage ? (
                      <img
                        src={profile.backgroundImage}
                        alt="Fundo"
                        className="h-8 w-12 object-cover rounded border border-gray-700"
                        title="Fundo personalizado configurado"
                      />
                    ) : (
                      <span className="text-xs text-gray-500 italic">Padrão</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    <span
                      className={`px-2 py-0.5 rounded text-xs ${
                        profile.isPublic ? "bg-emerald-900 text-emerald-300" : "bg-amber-900 text-amber-300"
                      }`}
                    >
                      {profile.isPublic ? locale.admin_page_profiles.yes : locale.admin_page_profiles.no}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300 max-w-xs truncate">{profile.motd}</td>
                  <td className="px-4 py-3">
                    <div
                      title="Copiar token"
                      className="flex items-center gap-1.5 cursor-pointer font-mono text-xs text-gray-400 hover:text-white"
                      onClick={() => copyTokenToClipboard(profile.token)}
                    >
                      {getIcon("Copy")}
                      <span className="truncate max-w-[120px]">{profile.token}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        title="Editar configurações e fundo"
                        onClick={() => setEditingProfile(profile)}
                        className="p-1 rounded bg-blue-900/60 hover:bg-blue-800 text-blue-300 hover:text-white transition-colors cursor-pointer"
                      >
                        <PencilSquareIcon className="h-4 w-4" />
                      </button>
                      <button
                        title="Resetar token"
                        onClick={() => resetProfileToken(profile.streamKey)}
                        className="p-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors cursor-pointer"
                      >
                        <ArrowPathIcon className="h-4 w-4" />
                      </button>
                      <button
                        title="Excluir perfil"
                        onClick={() => setIsRemoveProfileModalOpen(() => profile.streamKey)}
                        className="p-1 rounded bg-red-900/60 hover:bg-red-800 text-red-300 hover:text-white transition-colors cursor-pointer"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default ProfilesPage;
