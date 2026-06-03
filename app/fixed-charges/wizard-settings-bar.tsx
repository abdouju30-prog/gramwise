"use client";

import { CurrencySwitcher } from "@/app/components/currency-switcher";
import { useMessages } from "@/lib/i18n/locale-provider";

export function WizardSettingsBar() {
  const m = useMessages();

  return (
    <div className="wizard-settings-bar">
      <div className="wizard-settings-group">
        <span className="wizard-settings-label">{m.currency.legend}</span>
        <CurrencySwitcher />
      </div>
      <p className="field-hint wizard-settings-hint">{m.currency.hint}</p>
    </div>
  );
}
