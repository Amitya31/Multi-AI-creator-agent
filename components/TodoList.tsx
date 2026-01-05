"use client"
import { useState } from "react";
import { Card } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ScrollArea } from "./ui/scroll-area"
import { Button } from "./ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";

const TodoList = () => {
    const [date,setDate] = useState<Date|undefined>(new Date())
    const [open,setOpen] = useState(false)
    return (
        <div className="">
            <h1 className="text-lg font-medium mb-6"></h1>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger  asChild>
                    <Button>
                        <CalendarIcon/>
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-auto">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(date)=>{
                        setDate(date)
                        setOpen(false)
                      }}
                      className="rounded-md border"
                    />
                </PopoverContent>
            </Popover>
            <ScrollArea className="max-h-[400px] mt-4 overflow-y-auto">
                <div className="flex flex-col gap-4">
                <Card>
                    <div className="flex items-center gap-4">
                        <Checkbox id="item1"/>
                        <label htmlFor="item1" className="text-sm text-muted-foreground bg-muted">
                            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                        </label>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center gap-4">
                        <Checkbox id="item1"/>
                        <label htmlFor="item1" className="text-sm text-muted-foreground bg-muted">
                            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                        </label>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center gap-4">
                        <Checkbox id="item1"/>
                        <label htmlFor="item1" className="text-sm text-muted-foreground bg-muted">
                            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                        </label>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center gap-4">
                        <Checkbox id="item1"/>
                        <label htmlFor="item1" className="text-sm text-muted-foreground bg-muted">
                            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                        </label>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center gap-4">
                        <Checkbox id="item1"/>
                        <label htmlFor="item1" className="text-sm text-muted-foreground bg-muted">
                            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                        </label>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center gap-4">
                        <Checkbox id="item1"/>
                        <label htmlFor="item1" className="text-sm text-muted-foreground bg-muted">
                            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                        </label>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center gap-4">
                        <Checkbox id="item1"/>
                        <label htmlFor="item1" className="text-sm text-muted-foreground bg-muted">
                            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                        </label>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center gap-4">
                        <Checkbox id="item1"/>
                        <label htmlFor="item1" className="text-sm text-muted-foreground bg-muted">
                            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                        </label>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center gap-4">
                        <Checkbox id="item1"/>
                        <label htmlFor="item1" className="text-sm text-muted-foreground bg-muted">
                            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                        </label>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center gap-4">
                        <Checkbox id="item1"/>
                        <label htmlFor="item1" className="text-sm text-muted-foreground bg-muted">
                            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                        </label>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center gap-4">
                        <Checkbox id="item1"/>
                        <label htmlFor="item1" className="text-sm text-muted-foreground bg-muted">
                            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                        </label>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center gap-4">
                        <Checkbox id="item1"/>
                        <label htmlFor="item1" className="text-sm text-muted-foreground bg-muted">
                            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                        </label>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center gap-4">
                        <Checkbox id="item1"/>
                        <label htmlFor="item1" className="text-sm text-muted-foreground bg-muted">
                            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                        </label>
                    </div>
                </Card>
                </div>
            </ScrollArea>
        </div>
    )
}

export default TodoList;