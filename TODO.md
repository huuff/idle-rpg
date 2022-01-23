# Tasks
3. Showing equipped items in inventary
4. Add option to equip and unequip
5. Buying equipment
* A base `CreatureView` that adds the name of the creature
* Put all creature views in a `creature-views` folder in `components`

# Future
* Maybe use `immer.js` for mutations such as renaming creatures, increase level, change EXP and health... it'd be great but I'm unsure how to use it with `vue`'s reactivity

# Hard
* Do I need `firstTick` and `lastTick`? They are 2 ticks each anyway. I could have some way of specifying how many ticks something lasts and maybe some way of specifying first and last via... I dunno, template method?
