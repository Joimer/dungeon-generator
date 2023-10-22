import { rand } from "./random.mjs"

export function attack(attacker, defender) {
    const baseAttack = rand(attacker.atk, attacker.atk + 1) * 2;
    const baseDef = defender.def + defender.level;
    if (baseAttack <= baseDef) {
        return 1;
    }

    const dmg = baseAttack - baseDef;
    if (dmg >= defender.hp) {
        return defender.hp;
    }

    return dmg;
}
