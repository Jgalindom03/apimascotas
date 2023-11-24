import { Pet } from "../types.ts";
import { PetModel } from "../db/pet.ts";
import { getPetFromModel } from "../controllers/getPetFromModel.ts";
import { GraphQLError } from "graphql";

export const Query = {
    pets: async (_parent:unknown, args: {breed?: string}):Promise<Pet[]> => {
            if(args.breed){
                const pets = await PetModel.find({breed: args.breed});
                const petResponse: Pet[] = await Promise.all(pets.map(async (pet) => await getPetFromModel(pet)));
                return petResponse;
            }
            const pets = await PetModel.find();
            const petResponse: Pet[] = await Promise.all(pets.map(async (pet) => await getPetFromModel(pet)));
            return petResponse;
    },
    pet: async(_parent:unknown, args: {id: string}): Promise<Pet> => {
            const pet = await PetModel.findById(args.id);
            if(!pet){
                throw new GraphQLError(`No pet found with id ${args.id}`, {
                    extensions: {code: "NOT_FOUND"},
                });
            }
            const petResponse:Pet = await getPetFromModel(pet);
            return petResponse;
    }
}