const fs = require('fs');

const elements = [
    { id: 'H', name: 'Hydrogen', atomicNumber: 1, symbol: 'H', category: 'Nonmetal', state: 'Gas', color: '#A8A8A8', description: 'The lightest and most abundant element.', unlocked: true },
    { id: 'O', name: 'Oxygen', atomicNumber: 8, symbol: 'O', category: 'Nonmetal', state: 'Gas', color: '#F08080', description: 'Highly reactive nonmetal and oxidizing agent.', unlocked: true },
    { id: 'C', name: 'Carbon', atomicNumber: 6, symbol: 'C', category: 'Nonmetal', state: 'Solid', color: '#4B4B4B', description: 'Fundamental building block of life.', unlocked: true },
    { id: 'N', name: 'Nitrogen', atomicNumber: 7, symbol: 'N', category: 'Nonmetal', state: 'Gas', color: '#87CEEB', description: 'Crucial component of amino acids.', unlocked: true },
    { id: 'Cl', name: 'Chlorine', atomicNumber: 17, symbol: 'Cl', category: 'Halogen', state: 'Gas', color: '#1FF233', description: 'Disinfectant and oxidizing agent.', unlocked: true },
    { id: 'Na', name: 'Sodium', atomicNumber: 11, symbol: 'Na', category: 'Alkali Metal', state: 'Solid', color: '#DEC8C8', description: 'Soft, silvery-white, highly reactive metal.', unlocked: true },
    { id: 'Mg', name: 'Magnesium', atomicNumber: 12, symbol: 'Mg', category: 'Alkaline Earth Metal', state: 'Solid', color: '#C0C0C0', description: 'Lightweight and strong metal.', unlocked: true },
    { id: 'S', name: 'Sulfur', atomicNumber: 16, symbol: 'S', category: 'Nonmetal', state: 'Solid', color: '#FFFFE0', description: 'Bright yellow crystalline solid.', unlocked: true },
    { id: 'Fe', name: 'Iron', atomicNumber: 26, symbol: 'Fe', category: 'Transition Metal', state: 'Solid', color: '#A52A2A', description: 'Durable and magnetic transition metal.', unlocked: true },
];

const compounds = [];
const reactions = [];

function addReaction(inputs, outputId, outputName, equation, desc, condition = null) {
    let out = compounds.find(c => c.id === outputId);
    if (!out) {
        compounds.push({
            id: outputId,
            name: outputName,
            atomicNumber: 0,
            symbol: outputId.replace(/\d/g, (d) => ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉'][d]),
            category: 'Compound',
            state: 'Unknown',
            color: '#aaaaaa',
            description: desc,
            unlocked: false
        });
    }

    reactions.push({
        id: `rxn_${reactions.length}`,
        inputs,
        output: outputId,
        outputCount: 1,
        equation,
        description: desc,
        condition
    });
}

// 1. Water and simple oxides
addReaction({ 'H': 2, 'O': 1 }, 'H2O', 'Water', '2H₂ + O₂ → 2H₂O', 'Common liquid compound.');
addReaction({ 'C': 1, 'O': 2 }, 'CO2', 'Carbon Dioxide', 'C + O₂ → CO₂', 'Colorless gas known for the greenhouse effect.');
addReaction({ 'C': 1, 'O': 1 }, 'CO', 'Carbon Monoxide', '2C + O₂ → 2CO', 'Toxic, colorless, odorless gas.', 'Heat');

// 2. Condition-based reactions
addReaction({ 'H': 2, 'C': 1 }, 'C2H2', 'Acetylene', 'C + 2H → C₂H₂', 'Highly flammable fuel gas.', 'Heat');
addReaction({ 'Na': 1, 'Cl': 1 }, 'NaCl', 'Table Salt', 'Na + Cl → NaCl', 'Common mineral salt.', 'Electricity');

// 3. Advanced Synthesis (using compounds)
addReaction({ 'H2O': 1, 'CO2': 1 }, 'H2CO3', 'Carbonic Acid', 'H₂O + CO₂ → H₂CO₃', 'Found in carbonated sea water or drinks.');
addReaction({ 'NaCl': 1, 'H2O': 1 }, 'NaCl_aq', 'Brine', 'NaCl + H₂O → NaCl(aq)', 'Concentrated solution of salt in water.', 'Electricity');

// 4. Multi-step organic
addReaction({ 'C': 1, 'H': 4 }, 'CH4', 'Methane', 'C + 4H → CH₄', 'The simplest alkane and primary component of natural gas.');
addReaction({ 'CH4': 1, 'O': 2 }, 'CO2_combustion', 'CO2 + Water', 'CH₄ + 2O₂ → CO₂ + 2H₂O', 'Energy release via combustion.', 'Heat');

// Alkanes with Heat
for (let n = 2; n <= 10; n++) {
    const h = 2 * n + 2;
    const id = `C${n}H${h}`;
    const alkaneNames = ['', 'Methane', 'Ethane', 'Propane', 'Butane', 'Pentane', 'Hexane', 'Heptane', 'Octane', 'Nonane', 'Decane'];
    addReaction({ 'C': n, 'H': h }, id, alkaneNames[n], `${n}C + ${h}H → ${id}`, `Synthesis of ${alkaneNames[n]}.`, 'Heat');
}

const fileContentElement = `
export type ElementType = 'Solid' | 'Liquid' | 'Gas' | 'Unknown' | 'Compound';
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
}

export const INITIAL_ELEMENTS: ChemicalElement[] = ${JSON.stringify([...elements, ...compounds], null, 2)};
`;

const fileContentReaction = `
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

export const REACTIONS: Reaction[] = ${JSON.stringify(reactions, null, 2)};
`;

fs.writeFileSync('src/data/elements.ts', fileContentElement);
fs.writeFileSync('src/data/reactions.ts', fileContentReaction);
console.log(`Generated ${reactions.length} reactions with conditions.`);
