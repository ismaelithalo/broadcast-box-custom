import { useContext, useEffect, useState } from "react";
import { LocaleContext, LocaleTypes } from "../../providers/LocaleProvider";
import Button from '../shared/Button';
import { getIcon } from "./Icons";

interface Props {
  placeholder?: string;
  onClose?: () => void;
  canCloseOnBackgroundClick?: boolean;
}

export function LocalesModal(props: Props) {
  const { onClose, canCloseOnBackgroundClick } = props;
  const { setLocale, localeCode } = useContext(LocaleContext);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      onClose?.();
    }
  }, [isOpen, onClose]);

  const activeName = LocaleTypes.find((l) => l.locale === localeCode)?.name || "Idioma";

  return (
    <div className="cursor-default select-none flex justify-end flex-row w-min">
      <button
        type="button"
        className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-white px-2.5 py-1 rounded bg-black/20 hover:bg-black/40 transition-colors cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
        title={`Idioma atual: ${activeName} (Clique para alterar)`}
      >
        <span className="font-semibold">{localeCode === "pt-BR" ? "PT-BR" : localeCode.toUpperCase()}</span>
        <span className="w-4 h-4 flex items-center justify-center">{getIcon("Language")}</span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end pt-14 pr-4 bg-black/40 backdrop-blur-xs"
          onClick={() => canCloseOnBackgroundClick && setIsOpen(false)}
        >
          <div
            className="flex flex-col p-4 w-60 bg-gray-800 gap-2 h-min border border-gray-700 rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 px-1">
              Selecionar Idioma
            </div>
            {LocaleTypes.map((localeSelection) => (
              <Button
                key={localeSelection.locale}
                title={`${localeSelection.name} ${localeSelection.locale === localeCode ? "✓" : ""}`}
                color={localeSelection.locale === localeCode ? "Accept" : "Normal"}
                stretch
                onClick={() => {
                  setLocale(localeSelection);
                  setIsOpen(false);
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default LocalesModal;
