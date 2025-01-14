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

export function Countries({countries, onCountryChange, selectedCountry}) {
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
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? countries.find((c) => c.isoCode === value).name
            : "Selecciona un país..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Busca un país..." className="h-9" />
          <CommandList>
            <CommandEmpty>País no encontrado.</CommandEmpty>
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
