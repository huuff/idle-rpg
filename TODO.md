# Tasks
* Sell spoils in shop
* Selling equipment
* A base `CreatureView` that adds the name of the creature
* Put all creature views in a `creature-views` folder in `components`
* Loading creatures, items, etc from JSON
* Saving game to `localStorage`
* Showing where each stat comes from with popups

# Future
* Maybe use `immer.js` for mutations such as renaming creatures, increase level, change EXP and health... it'd be great but I'm unsure how to use it with `vue`'s reactivity

# Hard
* Do I need `firstTick` and `lastTick`? They are 2 ticks each anyway. I could have some way of specifying how many ticks something lasts and maybe some way of specifying first and last via... I dunno, template method?
