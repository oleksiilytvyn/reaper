import { useColorMode } from "@kobalte/core"

import { Icon } from "~/ui/icon"
import { Button } from "~/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/ui/dropdown-menu"

export function ModeToggle() {
   const { setColorMode } = useColorMode()

   return (
      <DropdownMenu>
         <DropdownMenuTrigger as={Button<"button">} variant="ghost" class="w-10 px-0">
            <Icon name="sun" class="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"/>
            <Icon name="moon" class="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"/>
            <span class="sr-only">Toggle theme</span>
         </DropdownMenuTrigger>
         <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => setColorMode("light")}>
               <Icon name="sun" class="mr-2 size-4"/>
               <span>Light</span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setColorMode("dark")}>
               <Icon name="moon" class="mr-2 size-4"/>
               <span>Dark</span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setColorMode("system")}>
               <Icon name="laptop" class="mr-2 size-4"/>
               <span>System</span>
            </DropdownMenuItem>
         </DropdownMenuContent>
      </DropdownMenu>
   )
}