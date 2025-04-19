"use client"

import * as React from "react"
import { format, getMonth, getYear, setMonth, setYear } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"
import { es, enUS } from "date-fns/locale"
import { useSelector } from "react-redux"
import { useTranslation } from "react-i18next"


export function DatePicker({
  startYear = getYear(new Date()) - 100,
  endYear = getYear(new Date()) + 100,
  initialDate = new Date(), // Fecha inicial desde el componente padre
  onDateChange, // Función de callback para devolver la fecha modificada
  disabled=false
}) {

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

  const months = React.useMemo(() => {
    return preferredLanguage === 'es' ? [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ] : [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]
  }, [preferredLanguage])

  const locale = preferredLanguage === 'es' ? es : enUS;

  const [date, setDate] = React.useState(initialDate);

  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i
  );

  const handleMonthChange = (month) => {
    const newDate = setMonth(date, months.indexOf(month));
    setDate(newDate);
    if (onDateChange) {
      onDateChange(newDate);
    }
  }

  const handleYearChange = (year) => {
    const newDate = setYear(date, parseInt(year));
    setDate(newDate)
    if (onDateChange) {
      onDateChange(newDate);
    }
  }

  const handleSelect = (selectedData) => {
    if (selectedData) {
      setDate(selectedData)
      if (onDateChange) {
        onDateChange(selectedData);
      }
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant={"outline"}
          className={cn(
            "w-[250px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP", { locale: locale }) : <span>{t("common.datePicker.selectDate")}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="flex justify-between p-2">
          <Select
            onValueChange={handleMonthChange}
            value={months[getMonth(date)]}
          >
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder={t("common.datePicker.month")} />
            </SelectTrigger>
            <SelectContent>
              {months.map(month => (
                <SelectItem key={month} value={month}>{month}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            onValueChange={handleYearChange}
            value={getYear(date).toString()}
          >
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder={t("common.datePicker.year")} />
            </SelectTrigger>
            <SelectContent>
              {years.map(year => (
                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Calendar
          mode="single"
          locale={locale}
          selected={date}
          onSelect={handleSelect}
          initialFocus
          month={date}
          onMonthChange={setDate}
        />
      </PopoverContent>
    </Popover>
  )
}