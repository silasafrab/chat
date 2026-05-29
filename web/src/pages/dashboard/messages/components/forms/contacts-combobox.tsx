import * as React from "react";

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import { useSheetPortalContainer } from "@/components/ui/sheet";
import type { Contact } from "@/types/contact";

type ContactsComboboxProps = {
  contacts: Contact[];
  value: string[];
  onChange: (contactIds: string[]) => void;
  invalid?: boolean;
};

function normalizeContactIds(newValue: unknown): string[] {
  if (newValue == null) return [];
  if (Array.isArray(newValue)) return newValue;
  return [String(newValue)];
}

export function ContactsCombobox({
  contacts,
  value,
  onChange,
  invalid,
}: ContactsComboboxProps) {
  const anchor = useComboboxAnchor();
  const sheetContainer = useSheetPortalContainer();
  const items = React.useMemo(() => contacts.map((c) => c.id), [contacts]);

  const getContactName = React.useCallback(
    (id: string) => contacts.find((c) => c.id === id)?.name ?? id,
    [contacts],
  );

  const handleValueChange = React.useCallback(
    (newValue: unknown) => {
      console.log("[Combobox] onValueChange called with:", newValue);
      onChange(normalizeContactIds(newValue));
    },
    [onChange],
  );

  if (contacts.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhum contato disponível nesta conexão.
      </p>
    );
  }

  return (
    <Combobox
      multiple
      autoHighlight
      items={items}
      value={value}
      onValueChange={(...args) => {
        console.log("[Combobox] onValueChange raw:", args);
        handleValueChange(...args);
      }}
      itemToStringLabel={(id) => getContactName(id)}
    >
      <ComboboxChips
        ref={anchor}
        className="w-full"
        aria-invalid={invalid || undefined}
      >
        <ComboboxValue>
          {(values) => (
            <React.Fragment>
              {(values as string[]).map((id) => (
                <ComboboxChip key={id}>{getContactName(id)}</ComboboxChip>
              ))}
              <ComboboxChipsInput placeholder="Buscar contato..." />
            </React.Fragment>
          )}
        </ComboboxValue>
      </ComboboxChips>
      <ComboboxContent anchor={anchor} container={sheetContainer}>
        <ComboboxEmpty>Nenhum contato encontrado.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item} value={item} onClick={() => console.log("[ComboboxItem] clicked:", item)}>
              {getContactName(item)}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
