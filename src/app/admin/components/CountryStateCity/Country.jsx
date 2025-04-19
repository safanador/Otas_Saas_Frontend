"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useSelector } from "react-redux"
import { useTranslation } from "react-i18next"

export function Countries({countries, onCountryChange, selectedCountry, disabled = false}) {
    // Get language from Redux store
    const { preferredLanguage } = useSelector((state) => state.auth.user);
    // Initialize translation hook
    const { t, i18n } = useTranslation();
    // Set the language from Redux
    React.useEffect(() => {
      if (preferredLanguage) {
        i18n.changeLanguage(preferredLanguage);
      }
    }, [preferredLanguage, i18n]);  

  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(selectedCountry)

  const handleSelect = (currentValue) => {
    const selectedValue = currentValue === value ? "" : currentValue
    setValue(selectedValue)
    setOpen(false)
    // Llamar a la función pasada como prop para notificar al componente padre
    onCountryChange(selectedValue)
  }
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled} // Deshabilitar el botón
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? countries.find((c) => c.isoCode === value).name
            : t("common.country.selectACountry")}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex justify-start w-full p-0" align="start" >
        <Command>
          <CommandInput placeholder={t("common.country.seekForACountryPlaceholder")} className="h-9" />
          <CommandList>
            <CommandEmpty>{t("common.country.countryNotFound")}</CommandEmpty>
            <CommandGroup>
              {countries?.map((country) => (
                <CommandItem
                  key={country.name}
                  value={country.isoCode}
                  onSelect={handleSelect}
                >
                  {country.flag} {country.name} {country.isoCode}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === country.name ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
