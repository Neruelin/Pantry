import Control from "./Control";
import { getPantryItems } from "../lib/api";
import { ReactNode, useCallback, useEffect, useState } from "react";

const emptyMap = new Map<string, number>();

export default function ControlWrapper() {

    const [pantryItems, setPantryItems] = useState(emptyMap);

    const refreshData = useCallback(async () => {
        setPantryItems(await getPantryItems());
    }, []);

    useEffect(() => {
        refreshData();
        const intervalId = setInterval(() => {
            refreshData();
        }, 5000);
        return () => clearInterval(intervalId);
    }, [])

    const listItems: ReactNode[] = [];
    pantryItems.forEach((count, name) => {
        listItems.push(<li key={`item-${name}`}>{name}, {count}</li>);
    })

    return (
        <main className="home">
            <div>Pantry app</div>

            <Control pantryItems={pantryItems} refreshData={refreshData} />

            <div>
                <div>Items:</div>
                <ul>{ listItems }</ul>
            </div>
        </main>
    );
}


