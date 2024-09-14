'use server'

import { getClient } from "@/app"
import { AddItemTypeInput, RemoveItemTypeInput, UpdateCountInput } from "@com.example/coffee-shop-client";

export async function getPantryItems(): Promise<Map<string, number>> {
    console.log("GetPantryItems called...");
    const data = (await getClient().getCounts()).counts || [];
    const pantryItems = new Map<string, number>();
    data.forEach((item) => {
        if (item.name && item.count !== undefined && item.count !== null) {
            pantryItems.set(item.name, item.count);
        }
    });
    return pantryItems;
}

export async function addItemTypeCall(input: AddItemTypeInput) {
    await getClient().addItemType(input);
}

export async function removeItemTypeCall(input: RemoveItemTypeInput) {
    await getClient().removeItemType(input);
}

export async function updateCountCall(input: UpdateCountInput) {
    await getClient().updateCount(input);
}