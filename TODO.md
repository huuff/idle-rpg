# Tasks
* Showing where each stat comes from with popups
* Put autoplay somewhere where it's accessible at any time
* More equipment items!
* Make current `InventoryView` `PlayerInventoryView` and add some `InventoryView` that shows an inventory and adds the options to filter it. Maybe pass the result via a scoped slot or smth.
* Refreshing the settings tab when saving or deleting
* Also load the map status (maybe main ticker?)
* I could test some stuff like inventory functions n shiet

# Future
* I couldn't test `basic-zones` nor `basic-settlements` since they have some quite intricate circular dependencies
* Maybe use `immer.js` for mutations such as renaming creatures, increase level, change EXP and health... it'd be great but I'm unsure how to use it with `vue`'s reactivity
* Thief can steal in battle for extra drops
* Some way that thieves cannot equip swords? Maybe weapons have strength requirements and classes can have a bonus that allows them to equip them? Or just some skill that allows their usage?
* Some randomness in creature drops
* Some price variation (e.g. more expensive to buy than sell earning)
* Maybe loading classes from JSON as I do from the rest, but there aren't many and the interface is not set in stone yet

# Hard
* Do I need `firstTick` and `lastTick`? They are 2 ticks each anyway. I could have some way of specifying how many ticks something lasts and maybe some way of specifying first and last via... I dunno, template method?. UPDATE: Tickers could just be generators! 2yields: 2 ticks. Everything would fit a single function.
