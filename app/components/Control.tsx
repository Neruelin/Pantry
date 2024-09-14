'use client'
'use strict'

import { addItemTypeCall, removeItemTypeCall, updateCountCall } from '@/lib/api';
import { ChangeEvent, ReactNode, useMemo, useCallback, useRef } from 'react'

export type CompProps = {
    pantryItems: Map<string, number>;
    refreshData: () => Promise<void>;
}

export default function Control({ pantryItems, refreshData } : CompProps) {

    console.log("Control rendered...", pantryItems);
    
    const addItemTypeInputRef = useRef<HTMLInputElement>(null);
    const removeItemTypeInputRef = useRef<HTMLSelectElement>(null);
    const updateCountItemTypeInputRef = useRef<HTMLSelectElement>(null);
    const updateCountInputRef = useRef<HTMLInputElement>(null);

    const options: ReactNode[] = useMemo(() => {
        console.log("Generated Options...", pantryItems, );
        const opts: ReactNode[] = [];
        pantryItems.forEach((count, name) => opts.push(<option key={`updateselect-${name}`} value={name}>{name}</option>));
        return opts;
    }, [pantryItems]);

    const handleAddItemSubmit = useCallback(async () => {
        console.log("handleAddItemSubmit called...");
        if (addItemTypeInputRef.current?.value) {
            const newType = addItemTypeInputRef.current.value;
            addItemTypeInputRef.current.value = "";
            await addItemTypeCall({name: newType});
            refreshData();
        }
    }, [pantryItems, updateCountInputRef]);

    const handleRemoveItemSubmit = useCallback(async () => {
        console.log("handleAddItemSubmit called...");
        if (removeItemTypeInputRef.current?.value) {
            const removeType = removeItemTypeInputRef.current.value;
            removeItemTypeInputRef.current.value = "";
            await removeItemTypeCall({name: removeType});
            refreshData();
        }
    }, [pantryItems, updateCountInputRef]);

    const handleUpdateSelectorChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
        console.log("handleUpdateSelectorChange called...");
        let selectorCount = pantryItems.get(event.target.value);
        if (selectorCount !== null && selectorCount !== undefined && updateCountInputRef.current) {
            console.log("setCountInput called...");
            updateCountInputRef.current.value = selectorCount.toString();
        }
    }, [pantryItems, updateCountInputRef]);

    const handleUpdateCountSubmit = useCallback(async () => {
        console.log("handleAddItemSubmit called...");
        if (updateCountItemTypeInputRef.current?.value && updateCountInputRef.current?.value && !isNaN(parseInt(updateCountInputRef.current.value))) {
            const payload = {update: {
                name: updateCountItemTypeInputRef.current.value, 
                count: parseInt(updateCountInputRef.current.value)
            }};
            updateCountItemTypeInputRef.current.value = "";
            updateCountInputRef.current.value = "";
            await updateCountCall(payload);
            refreshData();
        }
    }, [pantryItems, updateCountInputRef]);

    return <div className="grid mb-6 max-w-96">
        <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Add Item Type</label>
            <div className="grid gap-6 md:grid-cols-5 mb-3">
                <input type="text" placeholder="item type to add" ref={addItemTypeInputRef} className="col-span-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                <input type="button" value="Add" onClick={handleAddItemSubmit}  className="col-span-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" />
            </div>
        </div>
        <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Remove Item Type</label>
            <div className="grid gap-6 md:grid-cols-5 mb-3">
                <select onChange={handleUpdateSelectorChange} ref={removeItemTypeInputRef} defaultValue={""} className="col-span-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option key="updateselect-default" value="" disabled hidden>item type to remove</option>
                    {options}
                </select>
                <input type="button" value="Remove" onClick={handleRemoveItemSubmit} className="col-span-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" />
            </div>
        </div>
        <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Update Item Count</label>
            <div className="grid gap-6 md:grid-cols-5 mb-3">
                <select onChange={handleUpdateSelectorChange} defaultValue={""} ref={updateCountItemTypeInputRef} className="col-span-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option key="updateselect-default" value="" disabled hidden>Choose here</option>
                    {options}
                </select>
                <input type="text" placeholder="count value" ref={updateCountInputRef} className="col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
            </div>
            <input type="button" value="Update Count" onClick={handleUpdateCountSubmit} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" />
        </div>
    </div>
}
