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

export function Cities({cities, selectedCity, onCityChange, disabled=false, isList = false}) {
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
  const [value, setValue] = React.useState( selectedCity ||"")

  const handleSelect = (currentValue) => {
    const selectedValue = currentValue === value ? "" : currentValue
    setValue(selectedValue)
    setOpen(false)
    onCityChange(selectedValue)
  }
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant={isList ? "ghost" : "outline"}
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? value
            : t("common.city.selectACity")}
          {!isList && <ChevronsUpDown className="opacity-50" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder={t("common.city.seekForACityPlaceholder")} className="h-9" />
          <CommandList>
            <CommandEmpty>{t("common.city.cityNotFound")}</CommandEmpty>
            <CommandGroup>
              {cities.map((city) => (
                <CommandItem
                  key={city.name}
                  value={city.name}
                  onSelect={handleSelect}
                >
                  {city.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === city.name ? "opacity-100" : "opacity-0"
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
