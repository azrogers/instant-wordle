import React from 'react';

interface GuessBoxesProps
{
	length: number,
	maxGuesses: number,
	targetWord: string,
	currentWord: string,
	words: string[]
}

interface GuessBoxesState
{
}

class GuessBoxes extends React.Component<GuessBoxesProps, GuessBoxesState>
{
	constructor(props: GuessBoxesProps)
	{
		super(props);

		this.state = {
		};
	}

	render(): React.ReactNode
	{
		let width = 75 / this.props.length;

		let rows = [];
		for (let i = 0; i < this.props.maxGuesses; i++)
		{
			let word = this.props.words.length > i ? this.props.words[i] : '';
			let isCurrentWord = false;
			if (this.props.words.length === i)
			{
				word = this.props.currentWord;
				isCurrentWord = true;
			}

			let cols = [];
			for (let j = 0; j < this.props.length; j++)
			{
				const char = word.length > j ? word[j] : '';
				const className = char !== '' && !isCurrentWord ? this.getClassNameForChar(word, char, j) : '';

				cols.push(
					<div
						className={"guess-boxes__letter " + className}
						key={`row-${i}-col-${j}`}
						style={{
							"width": `min(${width}vw, 100px)`,
							"height": `min(${width}vw, 100px)`,
							"lineHeight": `min(${width}vw, 100px)`,
							"fontSize": `min(${width - 5}vw, 50px)`,
							"animationDelay": (0.25 * j) + "s"
						}}>
						{char}
					</div>
				);
			}

			let current = isCurrentWord ? "guess-boxes__row--current" : "";

			rows.push(
				<div className={"guess-boxes__row " + current} key={"row-" + i}>
					{cols}
				</div>
			);
		}

		return (
			<div className="guess-boxes">
				{rows}
			</div>
		)
	}

	private getClassNameForChar(guess: string, char: string, pos: number)
	{
		if (
			pos < this.props.targetWord.length &&
			this.props.targetWord[pos] === char)
		{
			return 'guess-boxes__letter--correct';
		}
		else if (this.props.targetWord.indexOf(char) !== -1 && !this.anyOfLetterCorrect(guess, char))
		{
			return 'guess-boxes__letter--present';
		}

		return 'guess-boxes__letter--wrong';
	}

	private anyOfLetterCorrect(word: string, char: string): boolean
	{
		for (let i = 0; i < word.length; i++)
		{
			if (this.props.targetWord[i] === word[i] && word[i] === char)
			{
				return true;
			}
		}

		return false;
	}
}

export default GuessBoxes;