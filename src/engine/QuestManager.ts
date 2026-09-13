import { CameraQuest } from '../core/types/game';
import { QUEST_POOL, generateProceduralQuest } from '../core/constants/quests';

export class QuestManager {
  private static lastQuestId: string = '';
  private static proceduralCounter: number = 0;

  public static getNextQuest(level: number): CameraQuest {
    this.proceduralCounter++;

    // Alternate between hand-crafted pool and procedural quests
    if (this.proceduralCounter % 2 === 0) {
      const procedural = generateProceduralQuest(this.proceduralCounter + Date.now());
      if (procedural.id !== this.lastQuestId) {
        this.lastQuestId = procedural.id;
        return procedural;
      }
    }

    // Filter available hand-crafted quests based on player level
    const available = QUEST_POOL.filter(
      (q) => q.levelRequired <= level && q.id !== this.lastQuestId
    );

    const pool = available.length > 0 ? available : QUEST_POOL;
    const selected = pool[Math.floor(Math.random() * pool.length)];
    this.lastQuestId = selected.id;

    return selected;
  }
}
