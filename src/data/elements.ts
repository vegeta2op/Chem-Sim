export type ElementType = 'Solid' | 'Liquid' | 'Gas' | 'Unknown' | 'Compound';
export type BondType = 'single' | 'double' | 'triple';

export interface AtomNode {
  element: string;
  x: number;
  y: number;
  bonds?: { to: number; type: BondType }[];
}

export interface MolecularStructure {
  atoms: AtomNode[];
  showHydrogens: boolean;
}

export interface ChemicalElement {
  id: string;
  name: string;
  atomicNumber: number;
  symbol: string;
  category: string;
  state: ElementType;
  color: string;
  description: string;
  unlocked: boolean;
  structure?: MolecularStructure;
}

export const INITIAL_ELEMENTS: ChemicalElement[] = [
  {
    "id": "H",
    "name": "Hydrogen",
    "atomicNumber": 1,
    "symbol": "H",
    "category": "Nonmetal",
    "state": "Gas",
    "color": "#A8A8A8",
    "description": "The lightest and most abundant element.",
    "unlocked": true
  },
  {
    "id": "O",
    "name": "Oxygen",
    "atomicNumber": 8,
    "symbol": "O",
    "category": "Nonmetal",
    "state": "Gas",
    "color": "#F08080",
    "description": "Highly reactive nonmetal and oxidizing agent.",
    "unlocked": true
  },
  {
    "id": "C",
    "name": "Carbon",
    "atomicNumber": 6,
    "symbol": "C",
    "category": "Nonmetal",
    "state": "Solid",
    "color": "#4B4B4B",
    "description": "Fundamental building block of life.",
    "unlocked": true
  },
  {
    "id": "N",
    "name": "Nitrogen",
    "atomicNumber": 7,
    "symbol": "N",
    "category": "Nonmetal",
    "state": "Gas",
    "color": "#87CEEB",
    "description": "Crucial component of amino acids.",
    "unlocked": true
  },
  {
    "id": "Cl",
    "name": "Chlorine",
    "atomicNumber": 17,
    "symbol": "Cl",
    "category": "Halogen",
    "state": "Gas",
    "color": "#1FF233",
    "description": "Disinfectant and oxidizing agent.",
    "unlocked": true
  },
  {
    "id": "Na",
    "name": "Sodium",
    "atomicNumber": 11,
    "symbol": "Na",
    "category": "Alkali Metal",
    "state": "Solid",
    "color": "#DEC8C8",
    "description": "Soft, silvery-white, highly reactive metal.",
    "unlocked": true
  },
  {
    "id": "Mg",
    "name": "Magnesium",
    "atomicNumber": 12,
    "symbol": "Mg",
    "category": "Alkaline Earth Metal",
    "state": "Solid",
    "color": "#C0C0C0",
    "description": "Lightweight and strong metal.",
    "unlocked": true
  },
  {
    "id": "S",
    "name": "Sulfur",
    "atomicNumber": 16,
    "symbol": "S",
    "category": "Nonmetal",
    "state": "Solid",
    "color": "#FFFFE0",
    "description": "Bright yellow crystalline solid.",
    "unlocked": true
  },
  {
    "id": "Fe",
    "name": "Iron",
    "atomicNumber": 26,
    "symbol": "Fe",
    "category": "Transition Metal",
    "state": "Solid",
    "color": "#A52A2A",
    "description": "Durable and magnetic transition metal.",
    "unlocked": true
  },
  {
    "id": "H2O",
    "name": "Water",
    "atomicNumber": 0,
    "symbol": "H₂O",
    "category": "Compound",
    "state": "Unknown",
    "color": "#4FC3F7",
    "description": "Common liquid compound.",
    "unlocked": false,
    "structure": {
      "atoms": [
        { "element": "O", "x": 0, "y": 0, "bonds": [{ "to": 1, "type": "single" }, { "to": 2, "type": "single" }] },
        { "element": "H", "x": -1, "y": -0.8 },
        { "element": "H", "x": 1, "y": -0.8 }
      ],
      "showHydrogens": true
    }
  },
  {
    "id": "CO2",
    "name": "Carbon Dioxide",
    "atomicNumber": 0,
    "symbol": "CO₂",
    "category": "Compound",
    "state": "Unknown",
    "color": "#90A4AE",
    "description": "Colorless gas known for the greenhouse effect.",
    "unlocked": false,
    "structure": {
      "atoms": [
        { "element": "O", "x": -1.5, "y": 0, "bonds": [{ "to": 1, "type": "double" }] },
        { "element": "C", "x": 0, "y": 0, "bonds": [{ "to": 0, "type": "double" }, { "to": 2, "type": "double" }] },
        { "element": "O", "x": 1.5, "y": 0, "bonds": [{ "to": 1, "type": "double" }] }
      ],
      "showHydrogens": true
    }
  },
  {
    "id": "CO",
    "name": "Carbon Monoxide",
    "atomicNumber": 0,
    "symbol": "CO",
    "category": "Compound",
    "state": "Unknown",
    "color": "#78909C",
    "description": "Toxic, colorless, odorless gas.",
    "unlocked": false,
    "structure": {
      "atoms": [
        { "element": "C", "x": -0.75, "y": 0, "bonds": [{ "to": 1, "type": "triple" }] },
        { "element": "O", "x": 0.75, "y": 0, "bonds": [{ "to": 0, "type": "triple" }] }
      ],
      "showHydrogens": true
    }
  },
  {
    "id": "C2H2",
    "name": "Acetylene",
    "atomicNumber": 0,
    "symbol": "C₂H₂",
    "category": "Compound",
    "state": "Unknown",
    "color": "#FFB74D",
    "description": "Highly flammable fuel gas.",
    "unlocked": false,
    "structure": {
      "atoms": [
        { "element": "H", "x": -2, "y": 0, "bonds": [{ "to": 1, "type": "single" }] },
        { "element": "C", "x": -1, "y": 0, "bonds": [{ "to": 0, "type": "single" }, { "to": 2, "type": "triple" }] },
        { "element": "C", "x": 1, "y": 0, "bonds": [{ "to": 1, "type": "triple" }, { "to": 3, "type": "single" }] },
        { "element": "H", "x": 2, "y": 0, "bonds": [{ "to": 2, "type": "single" }] }
      ],
      "showHydrogens": true
    }
  },
  {
    "id": "NH3",
    "name": "Ammonia",
    "atomicNumber": 0,
    "symbol": "NH₃",
    "category": "Compound",
    "state": "Unknown",
    "color": "#E6E6FA",
    "description": "Ammonia has a trigonal pyramidal shape and is crucial for fertilizers.",
    "unlocked": false,
    "structure": {
      "atoms": [
        { "element": "N", "x": 0, "y": 0, "bonds": [{ "to": 1, "type": "single" }, { "to": 2, "type": "single" }, { "to": 3, "type": "single" }] },
        { "element": "H", "x": 0, "y": -1, "bonds": [{ "to": 0, "type": "single" }] },
        { "element": "H", "x": -0.87, "y": 0.5, "bonds": [{ "to": 0, "type": "single" }] },
        { "element": "H", "x": 0.87, "y": 0.5, "bonds": [{ "to": 0, "type": "single" }] }
      ],
      "showHydrogens": true
    }
  },
  {
    "id": "NaCl",
    "name": "Table Salt",
    "atomicNumber": 0,
    "symbol": "NaCl",
    "category": "Compound",
    "state": "Unknown",
    "color": "#E0E0E0",
    "description": "Common mineral salt.",
    "unlocked": false,
    "structure": {
      "atoms": [
        { "element": "Na", "x": -1, "y": 0, "bonds": [{ "to": 1, "type": "single" }] },
        { "element": "Cl", "x": 1, "y": 0, "bonds": [{ "to": 0, "type": "single" }] }
      ],
      "showHydrogens": true
    }
  },
  {
    "id": "H2CO3",
    "name": "Carbonic Acid",
    "atomicNumber": 0,
    "symbol": "H₂CO₃",
    "category": "Compound",
    "state": "Unknown",
    "color": "#81C784",
    "description": "Found in carbonated sea water or drinks.",
    "unlocked": false,
    "structure": {
      "atoms": [
        { "element": "O", "x": 0, "y": -1, "bonds": [{ "to": 2, "type": "double" }] },
        { "element": "O", "x": -1.2, "y": 0.5, "bonds": [{ "to": 2, "type": "single" }] },
        { "element": "C", "x": 0, "y": 0, "bonds": [{ "to": 0, "type": "double" }, { "to": 1, "type": "single" }, { "to": 3, "type": "single" }] },
        { "element": "O", "x": 1.2, "y": 0.5, "bonds": [{ "to": 2, "type": "single" }] }
      ],
      "showHydrogens": true
    }
  },
  {
    "id": "NaCl_aq",
    "name": "Brine",
    "atomicNumber": 0,
    "symbol": "NaCl_aq",
    "category": "Compound",
    "state": "Unknown",
    "color": "#aaaaaa",
    "description": "Concentrated solution of salt in water.",
    "unlocked": false
  },
  {
    "id": "CH4",
    "name": "Methane",
    "atomicNumber": 0,
    "symbol": "CH₄",
    "category": "Compound",
    "state": "Unknown",
    "color": "#FFF176",
    "description": "The simplest alkane and primary component of natural gas.",
    "unlocked": false,
    "structure": {
      "atoms": [
        { "element": "H", "x": 0, "y": -1.2, "bonds": [{ "to": 4, "type": "single" }] },
        { "element": "H", "x": -1.2, "y": 0.5, "bonds": [{ "to": 4, "type": "single" }] },
        { "element": "H", "x": 1.2, "y": 0.5, "bonds": [{ "to": 4, "type": "single" }] },
        { "element": "H", "x": 0, "y": 0.8, "bonds": [{ "to": 4, "type": "single" }] },
        { "element": "C", "x": 0, "y": 0, "bonds": [{ "to": 0, "type": "single" }, { "to": 1, "type": "single" }, { "to": 2, "type": "single" }, { "to": 3, "type": "single" }] }
      ],
      "showHydrogens": true
    }
  },
  {
    "id": "CO2_combustion",
    "name": "CO2 + Water",
    "atomicNumber": 0,
    "symbol": "CO₂_combustion",
    "category": "Compound",
    "state": "Unknown",
    "color": "#aaaaaa",
    "description": "Energy release via combustion.",
    "unlocked": false
  },
  {
    "id": "C2H6",
    "name": "Ethane",
    "atomicNumber": 0,
    "symbol": "C₂H₆",
    "category": "Compound",
    "state": "Unknown",
    "color": "#aaaaaa",
    "description": "Synthesis of Ethane.",
    "unlocked": false
  },
  {
    "id": "C3H8",
    "name": "Propane",
    "atomicNumber": 0,
    "symbol": "C₃H₈",
    "category": "Compound",
    "state": "Unknown",
    "color": "#aaaaaa",
    "description": "Synthesis of Propane.",
    "unlocked": false
  },
  {
    "id": "C4H10",
    "name": "Butane",
    "atomicNumber": 0,
    "symbol": "C₄H₁₀",
    "category": "Compound",
    "state": "Unknown",
    "color": "#aaaaaa",
    "description": "Synthesis of Butane.",
    "unlocked": false
  },
  {
    "id": "C5H12",
    "name": "Pentane",
    "atomicNumber": 0,
    "symbol": "C₅H₁₂",
    "category": "Compound",
    "state": "Unknown",
    "color": "#aaaaaa",
    "description": "Synthesis of Pentane.",
    "unlocked": false
  },
  {
    "id": "C6H14",
    "name": "Hexane",
    "atomicNumber": 0,
    "symbol": "C₆H₁₄",
    "category": "Compound",
    "state": "Unknown",
    "color": "#aaaaaa",
    "description": "Synthesis of Hexane.",
    "unlocked": false
  },
  {
    "id": "C7H16",
    "name": "Heptane",
    "atomicNumber": 0,
    "symbol": "C₇H₁₆",
    "category": "Compound",
    "state": "Unknown",
    "color": "#aaaaaa",
    "description": "Synthesis of Heptane.",
    "unlocked": false
  },
  {
    "id": "C8H18",
    "name": "Octane",
    "atomicNumber": 0,
    "symbol": "C₈H₁₈",
    "category": "Compound",
    "state": "Unknown",
    "color": "#aaaaaa",
    "description": "Synthesis of Octane.",
    "unlocked": false
  },
  {
    "id": "C9H20",
    "name": "Nonane",
    "atomicNumber": 0,
    "symbol": "C₉H₂₀",
    "category": "Compound",
    "state": "Unknown",
    "color": "#aaaaaa",
    "description": "Synthesis of Nonane.",
    "unlocked": false
  },
  {
    "id": "C10H22",
    "name": "Decane",
    "atomicNumber": 0,
    "symbol": "C₁₀H₂₂",
    "category": "Compound",
    "state": "Unknown",
    "color": "#aaaaaa",
    "description": "Synthesis of Decane.",
    "unlocked": false
  }
];
