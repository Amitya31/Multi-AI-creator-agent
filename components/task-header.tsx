import { Badge } from "./ui/badge";

type TaskHeaderProps = {
  name: string;
  status: string;
  createdAt: string;
};
export function TaskHeader({name, status, createdAt}:TaskHeaderProps){
    return (
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-xl font-semibold">{name}</h1>
                <p className="text-sm text-muted-foreground">
                    Created at {new Date(createdAt).toLocaleString()}
                </p>
            </div>
            <Badge>{status}</Badge>
        </div>
    )
}