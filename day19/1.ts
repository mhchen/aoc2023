import { parseInput } from '../utils';

const lines = parseInput();

type Material = 'ore' | 'clay' | 'obsidian' | 'geode';
type MaterialCost = { material: Material; cost: number };
type Action = 'idle' | Material;
const materials: Material[] = ['geode', 'obsidian', 'clay', 'ore'];

type State = {
  materialInventory: Map<Material, number>;
  robotInventory: Map<Material, number>;
  parent: State | null;
};

function collectMaterials(state: State) {
  for (const [robotType, count] of state.robotInventory.entries()) {
    state.materialInventory.set(
      robotType,
      state.materialInventory.get(robotType)! + count,
    );
  }
  return state;
}

function cloneState(state: State) {
  return {
    materialInventory: new Map(state.materialInventory),
    robotInventory: new Map(state.robotInventory),
    parent: state,
  };
}

function serializeState(state: State): string {
  const robotInventory = [...state.robotInventory.entries()]
    .map(([material, count]) => `${material}:${count}`)
    .join('|');
  const materialInventory = [...state.materialInventory.entries()]
    .map(([material, count]) => `${material}:${count}`)
    .join('|');
  return `${robotInventory}||${materialInventory}`;
}

function calculateMaxPossibleGeodes(state: State, timeRemaining: number) {
  let geodeCount = state.materialInventory.get('geode')!;
  let geodeRobotCount = state.robotInventory.get('geode')!;
  for (let i = 0; i < timeRemaining; i++) {
    geodeCount += geodeRobotCount;
    geodeRobotCount += 1;
  }
  return geodeCount;
}

class BlueprintSimulator {
  robotCostMap: Map<Material, MaterialCost[]> = new Map();

  states: State[] = [
    {
      materialInventory: new Map([
        ['ore', 0],
        ['clay', 0],
        ['obsidian', 0],
        ['geode', 0],
      ]),
      robotInventory: new Map([
        ['ore', 1],
        ['clay', 0],
        ['obsidian', 0],
        ['geode', 0],
      ]),
      parent: null,
    },
  ];

  id: number;

  counter = 1;

  allStates = new Set<string>();

  maxOreCost = 0;

  constructor(blueprintString: string) {
    const tokens = blueprintString.split(': ');
    this.id = Number(tokens[0].replace('Blueprint ', ''));
    for (const costString of tokens[1].split('. ')) {
      const [, robotType, costsString] = /Each (\w+) robot costs (.*)/.exec(
        costString.replace('.', ''),
      )!;
      const materialCosts = costsString.split(' and ').map((costLine) => {
        const [, costString, material] = /(\d+) (\w+)/.exec(costLine)!;
        const cost = Number(costString);
        if (material === 'ore') {
          this.maxOreCost = Math.max(this.maxOreCost, cost);
        }
        return { material: material as Material, cost };
      });
      this.robotCostMap.set(robotType as Material, materialCosts);
    }
  }

  determinePotentialActions(state: State): Action[] {
    const actions: Action[] = ['idle'];
    for (const robotType of materials) {
      if (
        robotType === 'ore' &&
        state.robotInventory.get('ore')! >= this.maxOreCost
      ) {
        continue;
      }
      const materialCosts = this.robotCostMap.get(robotType)!;
      const canAfford = materialCosts.every(({ material, cost }) => {
        return state.materialInventory.get(material)! >= cost;
      });
      if (canAfford) {
        if (robotType === 'geode') {
          return [robotType];
        }
        actions.push(robotType);
      }
    }
    return actions;
  }

  buildRobot(state: State, robotType: Material) {
    const materialCosts = this.robotCostMap.get(robotType)!;
    state.robotInventory.set(
      robotType,
      state.robotInventory.get(robotType)! + 1,
    );
    for (const { material, cost } of materialCosts) {
      state.materialInventory.set(
        material,
        state.materialInventory.get(material)! - cost,
      );
    }
    return state;
  }

  tick() {
    const newStates: State[] = [];
    let maxPossibleGeodes = 0;
    for (const state of this.states) {
      for (const action of this.determinePotentialActions(state)) {
        const newState = cloneState(state);
        collectMaterials(newState);
        if (action !== 'idle') {
          this.buildRobot(newState, action);
        }
        const serializedState = serializeState(newState);
        if (!this.allStates.has(serializedState)) {
          this.allStates.add(serializedState);
          const newMaxPossibleGeodes = calculateMaxPossibleGeodes(
            newState,
            24 - this.counter,
          );
          if (newMaxPossibleGeodes >= maxPossibleGeodes) {
            newStates.push(newState);
            maxPossibleGeodes = newMaxPossibleGeodes;
          }
        }
      }
    }
    this.states = newStates;
    this.counter++;
  }
}

let qualityLevelTotal = 0;
for (const line of lines) {
  const simulator = new BlueprintSimulator(line);

  while (simulator.counter <= 24) {
    simulator.tick();
  }
  let maxGeodes = 0;
  for (const state of simulator.states) {
    maxGeodes = Math.max(maxGeodes, state.materialInventory.get('geode')!);
  }
  qualityLevelTotal += maxGeodes * simulator.id;
}

console.log(qualityLevelTotal);
