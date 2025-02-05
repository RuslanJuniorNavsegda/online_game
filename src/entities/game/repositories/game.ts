import { prisma } from "@/shared/lib/db";
import {
  GameEntity,
  GameIdleEntity,
  GameInProgressEntity,
  GameOverDrawEntity,
  GameOverEntity,
} from "../domain";
import {} from "@prisma/client";
import { z } from "zod";

async function gamesList(): Promise<GameEntity[]> {
  const games = await prisma.game.findMany({
    include: {
      winner: true,
      players: true,
    },
  });

  return games.map(dbGameToGameEntity);
}

const fieldSchema = z.array(z.union([z.string(), z.null()]));

function dbGameToGameEntity(
  game: Game & {
    players: User[];
  }
): GameEntity {
  switch (game.status) {
    case "idle": {
      return {
        id: game.id,
        players: game.players,
        status: game.status,
      } satisfies GameIdleEntity;
    }
    case "inProgress": {
      return {
        id: game.id,
        players: game.players,
        status: game.status,
        field: game.field,
      } satisfies GameInProgressEntity;
    }
    case "gameOver": {
      return {
        id: game.id,
        players: game.players,
        status: game.status,
      } satisfies GameOverEntity;
    }
    case "gameOverDraw": {
      return {
        id: game.id,
        players: game.players,
        status: game.status,
      } satisfies GameOverDrawEntity;
    }
  }
}

export const gameRepository = { gamesList };
