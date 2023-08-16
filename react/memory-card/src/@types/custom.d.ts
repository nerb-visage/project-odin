export {};

declare global {
	type GameActions = "set_clicked" | "shuffle" | "reset";
	type GameCardAction = Partial<GameCard> & {
		type: GameActions;
	};
	type MemoryGame = {
		isOver: boolean,
		cards: GameCard[],
		score: number,
	}
	type GameCard = {
		id: number;
		image: string;
		name: string;
		clicked?: boolean;
	};
}
