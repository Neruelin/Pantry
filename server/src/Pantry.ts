import { 
	PantryService, 
	GetCountsInput,
	GetCountsOutput, 
	AddItemTypeInput, 
	AddItemTypeOutput, 
	RemoveItemTypeInput, 
	RemoveItemTypeOutput, 
	UpdateCountInput, 
	UpdateCountOutput 
} from "@com.example/coffee-shop-server";

export interface PantryContext {
	counts: Map<string, number>;
}

export class Pantry implements PantryService<PantryContext> {
	async GetCounts(input: GetCountsInput, context: PantryContext): Promise<GetCountsOutput> {
		console.log("Recieved GetCounts");

		const output: GetCountsOutput = {counts: []};
		context.counts.forEach((val, key) => {
			output.counts.push({ name: key, count: val });
		});

		return output;
	}

	async AddItemType(input: AddItemTypeInput, context: PantryContext): Promise<AddItemTypeOutput> {
		console.log("Recieved AddItemTypes", input);
		
		if (!input.name) {
			throw Error("Input.name field is invalid: " + input.name);
		}
		
		if (!context.counts.has(input.name)) {
			context.counts.set(input.name.toLowerCase(), 0);
		}

		return {};
	}

	async RemoveItemType(input: RemoveItemTypeInput, context: PantryContext): Promise<RemoveItemTypeOutput> {
		console.log("Recieved RemoveItemType", input);
		
		if (!input.name) {
			throw Error("Input.name field is invalid: " + input.name);
		}

		if (context.counts.has(input.name)) {
			context.counts.delete(input.name.toLowerCase());
		}

		return {};
	}

	async UpdateCount(input: UpdateCountInput, context: PantryContext): Promise<UpdateCountOutput> {
		console.log("Received UpdateCount", input);

		if (!input.update || !input.update.name) {
			throw Error("Input.update.name field is invalid: " + input.update.name);
		}

		if (!context.counts.has(input.update.name)) {
			throw Error("No ItemType with name: " + input.update.name);
		}

		context.counts.set(input.update.name.toLowerCase(), input.update.count);

		return {};
	}
}
		
