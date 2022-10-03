import { TSpecieData, TSpeciePaths, TSpecieText } from "../types/specieType";
import * as specieRepository from "../repositories/specieRepository";
import { Species } from "@prisma/client";

export async function createSpecie(specie: Object, pictures: Object) {
  const specieData: TSpecieData = createSpecieObject(specie, pictures);

  const existSpecie = await getSpecieByName(specieData.cientificName);
  if (existSpecie !== null)
    throw { type: "conflict", message: "This specie already exists" };

  await specieRepository.createSpecie(specieData);

  return;
}

async function getSpecieByName(name: string) {
  const specie: Species = await specieRepository.findByName(name);

  return specie;
}

function createSpecieObject(specie: Object, pictures: Object) {
  const picturesPath = createPicturePathObject(pictures);
  const specieTexts = createSpecieTextObject(specie);

  return { ...specieTexts, ...picturesPath };
}

function createSpecieTextObject(specie: Object) {
  let specieData: TSpecieText = {
    cientificName: specie["cientific-name"],
    generalCharacteristics: specie["general-characteristics"],
    leafMorfology: specie["leaf-morfology"],
    flowerMorfology: specie["flower-morfology"],
    fruitMorfology: specie["fruit-morfology"],
    undergroundMorfology: specie["underground-morfology"],
    edibleParts: specie["edible-parts"],
  };

  if (specie["curiosities"])
    specieData = { ...specieData, curiosities: specie["curiosities"] };

  return specieData;
}

function createPicturePathObject(pictures: Object) {
  let picsPath: TSpeciePaths = {
    leafPicturePath: `/public/uploads/${pictures["leaf-pic"][0].filename}`,
    flowerPicturePath: `/public/uploads/${pictures["flower-pic"][0].filename}`,
    fruitPicturePath: `/public/uploads/${pictures["fruit-pic"][0].filename}`,
  };

  if (pictures["underground-pic"])
    picsPath = {
      ...picsPath,
      undergroundPicturePath: `/public/uploads/${pictures["underground-pic"][0].filename}`,
    };

  return picsPath;
}
