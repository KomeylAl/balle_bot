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
import { useRouter } from "next/navigation"
import { useSetAccountId } from "@/hooks/useAccount"

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
];

interface ComboProps {
  funds: any;
}

export function ComboboxDemo({ funds }: ComboProps) {

  const router = useRouter();
  
  const userFunds =
  funds.map((fund: any) => ({
    value: fund.fund.id,
    label: fund.fund.name,
  })) || [];
  
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const { mutate: setFund } = useSetAccountId();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between text-black"
        >
          {value
            ? userFunds.find((fund: any) => fund.value === value)?.label
            : "یک صندوق انتخاب کنید..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="جستجتو در صندوق ها..." />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {userFunds.map((fund: any) => (
                <CommandItem
                  key={fund.value}
                  value={fund.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                    setFund(fund.value);
                    router.push("/dashboard");
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === fund.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {fund.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
