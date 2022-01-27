import React from 'react';
import logo from './logo.svg';
import './App.scss';
import FlashMessage from 'react-flash-message';

import { Words, WordsGuesses } from './Words';
import GuessBoxes from './GuessBoxes';
import OnScreenKeyboard from './OnScreenKeyboard';

import 'react-simple-keyboard/build/css/index.css';

interface AppProps { }

interface AppState
{
	maxLength: number,
	maxGuesses: number,
	word: string | undefined,
	currentGuess: string,
	correctLetters: Set<string>,
	presentLetters: Set<string>,
	wrongLetters: Set<string>,
	won: boolean,
	showGuessFailed: boolean,
	message: string,
	words: string[],

	showAbout: boolean
}

class App extends React.Component<AppProps, AppState>
{
	constructor(props: any)
	{
		super(props);

		this.state = {
			maxLength: 5,
			maxGuesses: 6,
			word: undefined,
			correctLetters: new Set<string>(),
			presentLetters: new Set<string>(),
			wrongLetters: new Set<string>(),
			currentGuess: '',
			won: false,
			showGuessFailed: false,
			message: '',
			words: [],
			showAbout: false
		};

		this.onLetterPressed = this.onLetterPressed.bind(this);
		this.generateNewWord = this.generateNewWord.bind(this);
		this.onKeyPress = this.onKeyPress.bind(this);
	}

	componentDidMount()
	{
		document.addEventListener('keydown', this.onKeyPress);
		this.generateNewWord();
	}

	componentWillUnmount()
	{
		document.removeEventListener('keydown', this.onKeyPress);
	}

	render()
	{
		let keyboard = (<section></section>);
		if (!this.state.won && this.state.words.length !== this.state.maxGuesses)
		{
			keyboard = (
				<section className="App__keyboard">
					<OnScreenKeyboard
						targetWord={this.state.word ?? ''}
						correctLetters={Array.from(this.state.correctLetters)}
						presentLetters={Array.from(this.state.presentLetters)}
						wrongLetters={Array.from(this.state.wrongLetters)}
						onLetterPressed={this.onLetterPressed} />
				</section>
			);
		}

		let flash = (<div className="flash" style={{opacity: 0}}></div>);
		if (this.state.showGuessFailed)
		{
			flash = (
				<div className="flash" style={{opacity: 1}}>
					<FlashMessage duration={3000}>
						<em>{this.state.message}</em>
					</FlashMessage>
				</div>
			);
		}

		let win = (
			<section className="App__win">
				<p>You successfully guessed the word in {this.state.words.length} tries!</p>
				<button onClick={this.generateNewWord}>Try a New Word!</button>
			</section>
		);

		let lost = (
			<section className="App__lost">
				<p>You ran out of guesses! The word you were looking for was "{this.state.word}".</p>
				<button onClick={this.generateNewWord}>Try a New Word!</button>
			</section>
		);

		let about = (
			<section className="App__about">
				<div className="App__about__bg" onClick={() => this.setState({ showAbout: false })}></div>
				<div>
					<span className="close" onClick={() => this.setState({ showAbout: false })}>&times;</span>
					<h2>Instant Wordle</h2>
					<p>it's like wordle but you can keep playing forever. and you can't post the results on social media.</p>
					<p>
						<>a real quick thing by </>
						<a href="https://twitter.com/covoxkid">@covoxkid</a>
						<>. direct your questions, comments, and concerns to </>
						<a href="mailto:ashley@anime.lgbt">ashley@anime.lgbt</a>
						<>.</>
					</p>
				</div>
			</section>
		);

		let guessFailedClass = (
			this.state.showGuessFailed &&
			this.state.currentGuess.length === this.state.maxLength) ? "App__body--failed" : "";

		return (
			<div className="App">
				<header className="App__header">
					<h1>Instant Wordle</h1>
				</header>
				<section className={"App__body " + guessFailedClass}>
					<div className="App__flash">
						{flash}
					</div>
					<GuessBoxes
						words={this.state.words}
						currentWord={this.state.currentGuess}
						length={this.state.maxLength}
						maxGuesses={this.state.maxGuesses}
						targetWord={this.state.word ?? ''} />
				</section>
				{keyboard}
				{this.state.won && win}
				{!this.state.won && this.state.words.length === this.state.maxGuesses && lost}
				<div className="App__showAbout" onClick={() => this.setState({ showAbout: true })}>About</div>
				{this.state.showAbout && about}
			</div>
		);
	}

	private onWordSubmitted(word: string): boolean
	{
		if (Words.indexOf(word.toLowerCase()) === -1 &&
			WordsGuesses.indexOf(word.toLowerCase()) === -1)
		{
			this.setState({
				message: 'guess not found in word list',
				showGuessFailed: true
			});

			return false;
		}

		// should always be the same, but...
		let targetWord = this.state.word ?? '';
		if (targetWord.length !== word.length)
		{
			return false;
		}

		let words = this.state.words;
		words.push(word);

		// check all the letters
		let letters = word.split('');
		for (let i = 0; i < letters.length; i++)
		{
			let letter = letters[i];
			if (letter === targetWord[i])
			{
				this.state.correctLetters.add(letter);
			}
			else if (targetWord.indexOf(letter) !== -1)
			{
				this.state.presentLetters.add(letter);	
			}
			else
			{
				this.state.wrongLetters.add(letter);
			}
		}

		this.setState({
			words: [...words],
			won: word === this.state.word
		});

		return true;
	}

	private onKeyPress(event: KeyboardEvent)
	{
		if (event.key.length === 1 && /^[A-Za-z]$/.test(event.key))
		{
			this.onLetterPressed(event.key.toUpperCase());	
		}
		else if (event.code === "Backspace")
		{
			this.onLetterPressed("{bksp}");	
		}
		else if (event.code === "Enter")
		{
			this.onLetterPressed("{enter}");
		}
	}

	private onLetterPressed(char: string)
	{
		this.setState({ showGuessFailed: false });
		
		let currentGuess = this.state.currentGuess;
		if (char === '{bksp}')
		{
			currentGuess = currentGuess.length > 0 ? currentGuess.substring(0, currentGuess.length - 1) : '';
		}
		else if (char === '{enter}')
		{
			if (
				currentGuess.length === this.state.maxLength &&
				this.onWordSubmitted(currentGuess))
			{
				currentGuess = '';
			}
		}
		else if(currentGuess.length < this.state.maxLength)
		{
			currentGuess += char;
		}

		this.setState({
			currentGuess
		});
	}

	private generateNewWord()
	{
		let word = '';
		do
		{
			word = Words[Math.floor(Math.random() * Words.length)];
		} while (word === this.state.word);
		
		this.setState({
			word: word.toUpperCase(),
			correctLetters: new Set<string>(),
			presentLetters: new Set<string>(),
			wrongLetters: new Set<string>(),
			currentGuess: '',
			won: false,
			words: []
		});
	}
};

export default App;
