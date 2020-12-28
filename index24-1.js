
function battle(boost) {
    let immuneSystem = [
        {
            units: 2991,
            hitPoints: 8084,
            immune: [],
            weakness: ['fire'],
            attack: {
                damage: 19,
                type: 'radiation',
                initiative: 11
            }
        },
        {
            units: 4513,
            hitPoints: 3901,
            immune: ['bludgeoning', 'radiation'],
            weakness: ['slashing'],
            attack: {
                damage: 7,
                type: 'bludgeoning',
                initiative: 12
            }
        },
        {
            units: 5007,
            hitPoints: 9502,
            immune: ['bludgeoning'],
            weakness: ['fire'],
            attack: {
                damage: 16,
                type: 'fire',
                initiative: 2
            }
        },
        {
            units: 2007,
            hitPoints: 5188,
            immune: [],
            weakness: ['radiation'],
            attack: {
                damage: 23,
                type: 'cold',
                initiative: 9
            }
        },
        {
            units: 1680,
            hitPoints: 1873,
            immune: ['bludgeoning'],
            weakness: ['radiation'],
            attack: {
                damage: 10,
                type: 'bludgeoning',
                initiative: 10
            }
        },
        {
            units: 1344,
            hitPoints: 9093,
            immune: ['bludgeoning', 'cold'],
            weakness: ['radiation'],
            attack: {
                damage: 63,
                type: 'cold',
                initiative: 16
            }
        },
        {
            units: 498,
            hitPoints: 2425,
            immune: ['fire', 'bludgeoning', 'cold'],
            weakness: [],
            attack: {
                damage: 44,
                type: 'slashing',
                initiative: 3
            }
        },
        {
            units: 1166,
            hitPoints: 7295,
            immune: [],
            weakness: [],
            attack: {
                damage: 56,
                type: 'bludgeoning',
                initiative: 8
            }
        },
        {
            units: 613,
            hitPoints: 13254,
            immune: ['radiation', 'cold', 'fire'],
            weakness: [],
            attack: {
                damage: 162,
                type: 'radiation',
                initiative: 15
            }
        },
        {
            units: 1431,
            hitPoints: 2848,
            immune: [],
            weakness: ['radiation'],
            attack: {
                damage: 19,
                type: 'cold',
                initiative: 1
            }
        },
    ]

    let infection = [
        {
            units: 700,
            hitPoints: 47055,
            immune: ['slashing'],
            weakness: ['fire'],
            attack: {
                damage: 116,
                type: 'fire',
                initiative: 14
            }
        },
        {
            units: 2654,
            hitPoints: 13093,
            immune: [],
            weakness: ['radiation'],
            attack: {
                damage: 8,
                type: 'radiation',
                initiative: 19
            }
        },
        {
            units: 5513,
            hitPoints: 18026,
            immune: ['radiation'],
            weakness: ['slashing'],
            attack: {
                damage: 6,
                type: 'slashing',
                initiative: 20
            }
        },
        {
            units: 89,
            hitPoints: 48412,
            immune: [],
            weakness: ['cold'],
            attack: {
                damage: 815,
                type: 'radiation',
                initiative: 17
            }
        },
        {
            units: 2995,
            hitPoints: 51205,
            immune: [],
            weakness: ['cold'],
            attack: {
                damage: 28,
                type: 'slashing',
                initiative: 7
            }
        },
        {
            units: 495,
            hitPoints: 21912,
            immune: [],
            weakness: [],
            attack: {
                damage: 82,
                type: 'cold',
                initiative: 13
            }
        },
        {
            units: 2911,
            hitPoints: 13547,
            immune: [],
            weakness: [],
            attack: {
                damage: 7,
                type: 'slashing',
                initiative: 18
            }
        },
        {
            units: 1017,
            hitPoints: 28427,
            immune: ['fire'],
            weakness: [],
            attack: {
                damage: 52,
                type: 'fire',
                initiative: 4
            }
        },
        {
            units: 2048,
            hitPoints: 29191,
            immune: [],
            weakness: ['bludgeoning'],
            attack: {
                damage: 22,
                type: 'bludgeoning',
                initiative: 6
            }
        },
        {
            units: 1718,
            hitPoints: 15725,
            immune: ['cold'],
            weakness: [],
            attack: {
                damage: 18,
                type: 'slashing',
                initiative: 5
            }
        }
    ]

    // Immune System:
    // 17 units each with 5390 hit points (weak to radiation, bludgeoning) with
    //  an attack that does 4507 fire damage at initiative 2
    // 989 units each with 1274 hit points (immune to fire; weak to bludgeoning,
    //  slashing) with an attack that does 25 slashing damage at initiative 3
    // 
    // Infection:
    // 801 units each with 4706 hit points (weak to radiation) with an attack
    //  that does 116 bludgeoning damage at initiative 1
    // 4485 units each with 2961 hit points (immune to radiation; weak to fire,
    //  cold) with an attack that does 12 slashing damage at initiative 4

    /*
    var immuneSystem = [
        {
            units: 17,
            hitPoints: 5390,
            immune: [],
            weakness: ['radiation', 'bludgeoning'],
            attack: {
                damage: 4507,
                type: 'fire',
                initiative: 2
            }
        },
        {
            units: 989,
            hitPoints: 1274,
            immune: ['fire'],
            weakness: ['bludgeoning', 'slashing'],
            attack: {
                damage: 25,
                type: 'slashing',
                initiative: 3
            }
        }
    ]

    var infection = [
        {
            units: 801,
            hitPoints: 4706,
            immune: [],
            weakness: ['radiation'],
            attack: {
                damage: 116,
                type: 'bludgeoning',
                initiative: 1
            }
        },
        {
            units: 4485,
            hitPoints: 2961,
            immune: ['radiation'],
            weakness: ['fire', 'cold'],
            attack: {
                damage: 12,
                type: 'slashing',
                initiative: 4
            }
        }
    ]
    */

    function numberElems(desc, array) {
        var number = 0
        for (var elem of array) {
            elem.number = ++number
            elem.desc = desc + ' ' + number
        }
    }

    function calcDamage(src, target) {
        var damage = 0

        if (!target.immune.find((elem) => elem === src.attack.type)) {
            damage = src.effectivePower

            // Weak to our attack?
            if (target.weakness.find((elem) => elem === src.attack.type))
                damage *= 2
        }

        return damage
    }

    function chooseTargets(srcGroup, targetGroup) {
        function chooseTarget(src, targetGroup) {
            var targets = []

            for (var target of targetGroup) {
                if (target.targetted)
                    continue

                var damage = calcDamage(src, target)

                // Immune to our attack?
                if (damage <= 0)
                    continue

                targets.push({
                    damage,
                    target
                })
            }

            if (targets.length > 0) {
                targets.sort((elem1, elem2) => {
                    if (elem1.damage == elem2.damage) {
                        if (elem1.target.effectivePower == elem2.target.effectivePower) {
                            return elem2.target.attack.initiative - elem1.target.attack.initiative
                        } else {
                            return elem2.target.effectivePower - elem1.target.effectivePower
                        }
                    }
                    return elem2.damage - elem1.damage
                })

                src.target = targets[0].target
                src.target.targetted = true
                // console.log(`${srcGrpDesc} group ${src.number} attacking ${targetGrpDesc} group ${src.target.number} with ${targets[0].damage} damage`)
            } else {
                // No targets
                src.target = null
                // console.log(`${srcGrpDesc} group ${src.number} has no target`)
            }
        }

        // Sort in to effectivePower / initiative order
        var order = srcGroup.slice()
        order.sort((elem1, elem2) => {
            if (elem1.effectivePower == elem2.effectivePower) {
                return elem2.attack.initiative - elem1.attack.initiative
            }
            return elem2.effectivePower - elem1.effectivePower
        })

        for (var elem of targetGroup) {
            elem.targetted = false
        }

        for (var elem of order) {
            // console.log(`Target order ${elem.desc} ${elem.effectivePower} ${elem.attack.initiative}`)
            chooseTarget(elem, targetGroup)
        }
    }

    function calcEffectivePower(elem) {
        elem.effectivePower = elem.units * elem.attack.damage
    }

    numberElems('Infection', infection)
    numberElems('Immune system', immuneSystem)

    // Apply boost
    for (elem of immuneSystem) {
        elem.attack.damage += boost
    }

    var round = 0
    while (immuneSystem.length > 0 && infection.length > 0) {
        ++round
        // console.log(`Round ${round}`)

        // --- Target selection ---

        // Calc effective power
        for (var elem of immuneSystem) {
            calcEffectivePower(elem)
        }
        for (var elem of infection) {
            calcEffectivePower(elem)
        }

        // Choose target
        chooseTargets(infection, immuneSystem)
        chooseTargets(immuneSystem, infection)

        // Attack phase
        var combined = []
        for (var elem of immuneSystem) {
            if (elem.target) combined.push({item: elem})
        }
        for (var elem of infection) {
            if (elem.target) combined.push({item: elem})
        }

        combined.sort((elem1, elem2) => {
            return elem2.item.attack.initiative - elem1.item.attack.initiative
        })

        var somethingHappened = false
        for (var elem of combined) {
            var src = elem.item
            var target = src.target

            // Recalculate effective power
            calcEffectivePower(src)
            var damage = calcDamage(src, target)
            if (damage > 0) {
                // Attack target
                var killed = Math.min(target.units, Math.floor(damage / target.hitPoints))
                if (killed > 0) {
                    // console.log(`${src.desc} -> ${target.desc} - ${killed}`)
                    // console.log(`${elem.srcDesc} group ${src.number} attacks group ${target.number} killing ${killed}`)
                    target.units -= killed
                    somethingHappened = true
                }
            }
        }
        if (!somethingHappened)
            break

        immuneSystem = immuneSystem.filter((elem) => elem.units > 0)
        infection = infection.filter((elem) => elem.units > 0)
    }

    return {
        immuneSystem,
        infection
    }
}

var result = battle(0)

var total = 0
for (var elem of result.immuneSystem) {
    total += elem.units
}
for (var elem of result.infection) {
    total += elem.units
}

console.log(`Part 1: ${total}`)

boost = 1
while (true) {
    var result = battle(boost)
    if (result.immuneSystem.length > 0 && result.infection.length == 0) {
        var total = 0
        for (var elem of result.immuneSystem) {
            total += elem.units
        }
        console.log(`Part 2: ${total}`)
        break
    }
    ++boost
}
