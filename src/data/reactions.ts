
export type ReactionCondition = 'Heat' | 'Electricity' | 'UV' | null;

export interface Reaction {
  id: string;
  inputs: Record<string, number>;
  output: string;
  outputCount: number;
  equation: string;
  description: string;
  condition: ReactionCondition;
}

export const REACTIONS: Reaction[] = [
  {
    "id": "rxn_0",
    "inputs": {
      "H": 2,
      "O": 1
    },
    "output": "H2O",
    "outputCount": 1,
    "equation": "2H₂ + O₂ → 2H₂O",
    "description": "Common liquid compound.",
    "condition": null
  },
  {
    "id": "rxn_1",
    "inputs": {
      "C": 1,
      "O": 2
    },
    "output": "CO2",
    "outputCount": 1,
    "equation": "C + O₂ → CO₂",
    "description": "Colorless gas known for the greenhouse effect.",
    "condition": null
  },
  {
    "id": "rxn_2",
    "inputs": {
      "C": 1,
      "O": 1
    },
    "output": "CO",
    "outputCount": 1,
    "equation": "2C + O₂ → 2CO",
    "description": "Toxic, colorless, odorless gas.",
    "condition": "Heat"
  },
  {
    "id": "rxn_3",
    "inputs": {
      "H": 2,
      "C": 1
    },
    "output": "C2H2",
    "outputCount": 1,
    "equation": "C + 2H → C₂H₂",
    "description": "Highly flammable fuel gas.",
    "condition": "Heat"
  },
  {
    "id": "rxn_4",
    "inputs": {
      "Na": 1,
      "Cl": 1
    },
    "output": "NaCl",
    "outputCount": 1,
    "equation": "Na + Cl → NaCl",
    "description": "Common mineral salt.",
    "condition": "Electricity"
  },
  {
    "id": "rxn_5",
    "inputs": {
      "H2O": 1,
      "CO2": 1
    },
    "output": "H2CO3",
    "outputCount": 1,
    "equation": "H₂O + CO₂ → H₂CO₃",
    "description": "Found in carbonated sea water or drinks.",
    "condition": null
  },
  {
    "id": "rxn_6",
    "inputs": {
      "NaCl": 1,
      "H2O": 1
    },
    "output": "NaCl_aq",
    "outputCount": 1,
    "equation": "NaCl + H₂O → NaCl(aq)",
    "description": "Concentrated solution of salt in water.",
    "condition": "Electricity"
  },
  {
    "id": "rxn_7",
    "inputs": {
      "C": 1,
      "H": 4
    },
    "output": "CH4",
    "outputCount": 1,
    "equation": "C + 4H → CH₄",
    "description": "The simplest alkane and primary component of natural gas.",
    "condition": null
  },
  {
    "id": "rxn_8",
    "inputs": {
      "CH4": 1,
      "O": 2
    },
    "output": "CO2_combustion",
    "outputCount": 1,
    "equation": "CH₄ + 2O₂ → CO₂ + 2H₂O",
    "description": "Energy release via combustion.",
    "condition": "Heat"
  },
  {
    "id": "rxn_9",
    "inputs": {
      "C": 2,
      "H": 6
    },
    "output": "C2H6",
    "outputCount": 1,
    "equation": "2C + 6H → C2H6",
    "description": "Synthesis of Ethane.",
    "condition": "Heat"
  },
  {
    "id": "rxn_10",
    "inputs": {
      "C": 3,
      "H": 8
    },
    "output": "C3H8",
    "outputCount": 1,
    "equation": "3C + 8H → C3H8",
    "description": "Synthesis of Propane.",
    "condition": "Heat"
  },
  {
    "id": "rxn_11",
    "inputs": {
      "C": 4,
      "H": 10
    },
    "output": "C4H10",
    "outputCount": 1,
    "equation": "4C + 10H → C4H10",
    "description": "Synthesis of Butane.",
    "condition": "Heat"
  },
  {
    "id": "rxn_12",
    "inputs": {
      "C": 5,
      "H": 12
    },
    "output": "C5H12",
    "outputCount": 1,
    "equation": "5C + 12H → C5H12",
    "description": "Synthesis of Pentane.",
    "condition": "Heat"
  },
  {
    "id": "rxn_13",
    "inputs": {
      "C": 6,
      "H": 14
    },
    "output": "C6H14",
    "outputCount": 1,
    "equation": "6C + 14H → C6H14",
    "description": "Synthesis of Hexane.",
    "condition": "Heat"
  },
  {
    "id": "rxn_14",
    "inputs": {
      "C": 7,
      "H": 16
    },
    "output": "C7H16",
    "outputCount": 1,
    "equation": "7C + 16H → C7H16",
    "description": "Synthesis of Heptane.",
    "condition": "Heat"
  },
  {
    "id": "rxn_15",
    "inputs": {
      "C": 8,
      "H": 18
    },
    "output": "C8H18",
    "outputCount": 1,
    "equation": "8C + 18H → C8H18",
    "description": "Synthesis of Octane.",
    "condition": "Heat"
  },
  {
    "id": "rxn_16",
    "inputs": {
      "C": 9,
      "H": 20
    },
    "output": "C9H20",
    "outputCount": 1,
    "equation": "9C + 20H → C9H20",
    "description": "Synthesis of Nonane.",
    "condition": "Heat"
  },
  {
    "id": "rxn_17",
    "inputs": {
      "C": 10,
      "H": 22
    },
    "output": "C10H22",
    "outputCount": 1,
    "equation": "10C + 22H → C10H22",
    "description": "Synthesis of Decane.",
    "condition": "Heat"
  },
  {
    "id": "rxn_18",
    "inputs": {
      "N": 1,
      "H": 3
    },
    "output": "NH3",
    "outputCount": 1,
    "equation": "N + 3H → NH₃",
    "description": "Ammonia has a trigonal pyramidal shape and is crucial for fertilizers.",
    "condition": "Heat"
  }
];
