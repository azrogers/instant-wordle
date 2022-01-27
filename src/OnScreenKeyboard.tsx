import React, { Component, ChangeEvent } from 'react';
import ReactDOM from 'react-dom';
import Keyboard from 'react-simple-keyboard';

interface OSKProps
{
	targetWord: string,
	correctLetters: string[],
	presentLetters: string[],
	wrongLetters: string[],
	onLetterPressed: (char: string) => void
}

interface OSKState
{
}

class OnScreenKeyboard extends Component<OSKProps, OSKState>
{
	constructor(props: OSKProps)
	{
		super(props);

		this.onKeyPress = this.onKeyPress.bind(this);
	}

	onKeyPress(button: string)
	{
		this.props.onLetterPressed(button);
	}

	render()
	{
		let buttonTheme = [];

		if (this.props.correctLetters.length > 0)
		{
			buttonTheme.push({
				class: "osk__letter--correct",
				buttons: this.props.correctLetters.join(' ')
			});
		}
		if (this.props.presentLetters.length > 0)
		{
			buttonTheme.push({
				class: "osk__letter--present",
				buttons: this.props.presentLetters.join(' ')
			});
		}
		if (this.props.wrongLetters.length > 0)
		{
			buttonTheme.push({
				class: "osk__letter--wrong",
				buttons: this.props.wrongLetters.join(' ')
			});
		}

		return (
			<Keyboard 
				onKeyPress={this.onKeyPress}
				buttonTheme={buttonTheme}
				layout={{
					'default': [
						'Q W E R T Y U I O P',
						'A S D F G H J K L',
						'{enter} Z X C V B N M {bksp}'
					]
				}}
				display={{
					'{bksp}': '⌫',
					'{enter}': '✓'
				}}
			/>
		);
	}
}

export default OnScreenKeyboard;