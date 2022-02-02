import { useCreaturesStore } from "@/creatures-store";
import Creatures from "@/creatures/creature";


export default function startAutolevel() {
    const creaturesStore = useCreaturesStore();

    // Adjust level (i.e. increase it if enough exp has been gathered) of
    // all creatures on state changes
    creaturesStore.$subscribe((_, state) => {
        for (const creature of Object.values(state.creatures)) {
          Creatures.adjustLevel(creature);
        }
      });
}

  