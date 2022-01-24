# Tasks
* Loading creatures, equipment, etc from JSON
* Saving game to `localStorage`
* Showing where each stat comes from with popups
* Put autoplay somewhere where it's accessible at any time
* More equipment items!
* Make current `InventoryView` `PlayerInventoryView` and add some `InventoryView` that shows an inventory and adds the options to filter it. Maybe pass the result via a scoped slot or smth.

# Future
* Maybe use `immer.js` for mutations such as renaming creatures, increase level, change EXP and health... it'd be great but I'm unsure how to use it with `vue`'s reactivity
* Thief can steal in battle for extra drops
* Some way that thieves cannot equip swords? Maybe weapons have strength requirements and classes can have a bonus that allows them to equip them? Or just some skill that allows their usage?
* Some randomness in creature drops
* Some price variation (e.g. more expensive to buy than sell earning)

# Hard
* Do I need `firstTick` and `lastTick`? They are 2 ticks each anyway. I could have some way of specifying how many ticks something lasts and maybe some way of specifying first and last via... I dunno, template method?
