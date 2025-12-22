import { Button } from "@/components/ui/button";
import {CirclePlus} from "lucide-react"

export default function Home() {
  return (
    <div className="h-screen flex justify-center items-center">
      <Button variant="default" size="lg" className="cursor-pointer text-my-color" >
        <CirclePlus/>
        Click me</Button>
    </div>
  )
};