"use client"

import { useEffect, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { loadIndianStates } from "@/lib/india"
import { searchCities, type CitySuggestion } from "@/lib/locations"

const control =
  "h-12 w-full rounded-xl border bg-[#2c2c2c] px-4 text-sm text-white outline-none focus:border-[#E1306C]"

type Props = {
  city: string
  state: string
  onCityChange: (city: string) => void
  onStateChange: (state: string) => void
  cityError?: string
  stateError?: string
  cityId?: string
  stateId?: string
}

/** City autocomplete + state dropdown backed by /api/locations. */
export function CityStatePicker({
  city,
  state,
  onCityChange,
  onStateChange,
  cityError,
  stateError,
  cityId = "city",
  stateId = "state",
}: Props) {
  const [states, setStates] = useState<string[]>([])
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([])
  const [picked, setPicked] = useState(Boolean(city && state))
  const [open, setOpen] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    loadIndianStates().then(setStates).catch(() => setStates([]))
  }, [])

  function scheduleSearch(nextCity: string) {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(async () => {
      const q = nextCity.trim()
      if (q.length < 1) {
        setSuggestions([])
        setOpen(false)
        return
      }
      try {
        const rows = await searchCities(q)
        setSuggestions(rows)
        setOpen(rows.length > 0)
      } catch {
        setSuggestions([])
        setOpen(false)
      }
    }, 300)
  }

  function pick(item: CitySuggestion) {
    onCityChange(item.city)
    onStateChange(item.state)
    setPicked(true)
    setSuggestions([])
    setOpen(false)
  }

  return (
    <div className="space-y-4 md:col-span-2">
      <div className="space-y-2">
        <Label htmlFor={cityId}>City</Label>
        <div className="relative">
          <Input
            id={cityId}
            value={city}
            onChange={(event) => {
              const next = event.target.value
              onCityChange(next)
              setPicked(false)
              scheduleSearch(next)
            }}
            onFocus={() => {
              if (suggestions.length) setOpen(true)
            }}
            onBlur={() => {
              setTimeout(() => setOpen(false), 150)
            }}
            placeholder="Start typing a city"
            autoComplete="off"
            aria-invalid={Boolean(cityError)}
            className={cityError ? "border-[#E1306C] aria-invalid:border-[#E1306C]" : ""}
          />
          {open && suggestions.length > 0 ? (
            <ul className="absolute z-30 mt-1 max-h-48 w-full overflow-auto rounded-xl border border-white/10 bg-[#1c1c1c] py-1 shadow-lg">
              {suggestions.map((item) => (
                <li key={`${item.city}-${item.state}`}>
                  <button
                    type="button"
                    className="w-full px-3 py-2 text-left text-sm text-white hover:bg-white/10"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => pick(item)}
                  >
                    {item.city}, {item.state}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        {cityError ? <p className="text-sm text-[#E1306C]">{cityError}</p> : null}
        {city && !picked ? (
          <p className="text-xs text-[#B4B4B4]">Pick a city from the suggestions.</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor={stateId}>State</Label>
        <select
          id={stateId}
          value={state}
          onChange={(event) => {
            const next = event.target.value
            onStateChange(next)
            if (city) {
              onCityChange("")
              setPicked(false)
              setSuggestions([])
              setOpen(false)
            }
          }}
          aria-invalid={Boolean(stateError)}
          className={cn(control, stateError ? "border-[#E1306C]" : "border-white/10")}
        >
          <option value="">Select state</option>
          {states.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        {stateError ? <p className="text-sm text-[#E1306C]">{stateError}</p> : null}
      </div>
    </div>
  )
}
