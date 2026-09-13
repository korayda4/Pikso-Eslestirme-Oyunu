import { CameraQuest } from '../core/types/game';
import { QUEST_POOL } from '../core/constants/quests';

export class QuestManager {
  private static lastQuestId: string = '';

  public static getNextQuest(level: number): CameraQuest {
    // Filter available quests based on player level
    const available = QUEST_POOL.filter(
      (q) => q.levelRequired <= level && q.id !== this.lastQuestId
    );

    const pool = available.length > 0 ? available : QUEST_POOL;
    const selected = pool[Math.floor(Math.random() * pool.length)];
    this.lastQuestId = selected.id;

    return selected;
  }
}
