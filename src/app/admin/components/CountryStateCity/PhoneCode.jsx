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

export function PhoneCodes({countries, onCodeSelect, selectedPhoneCode}) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(selectedPhoneCode || '')
  const filteredCountries = countries.filter(country => !country.phonecode.includes('+'));

  const handleSelect = (currentValue) => {
    const selectedValue = currentValue === value ? "" : currentValue
    setValue(selectedValue)
    setOpen(false)
    // Llamar a la función pasada como prop para notificar al componente padre
    onCodeSelect(selectedValue)
  }


  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[90px] justify-between"
        >
          {value
            ? value
            : "Code"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Código..." className="h-9" />
          <CommandList>
            <CommandEmpty>Código no encontrado.</CommandEmpty>
            <CommandGroup>
              {filteredCountries?.map((country) => (
                <CommandItem
                  key={country.isoCode}
                  value={country.phonecode}
                  onSelect={handleSelect}
                >
                  {country.flag} {country.name} +{country.phonecode}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === country.phonecode ? "opacity-100" : "opacity-0"
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
