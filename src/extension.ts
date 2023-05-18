// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import path = require('path');
import * as vscode from 'vscode';
import cp = require('child_process');
import EditorObserver from './editor';

const sound = require("sound-play")
const ourSound = require("./sound");
var player = require('play-sound')({});
var pplay = require('play').Play;

let audioPlayer: AudioPlay, controller: any;
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "typewriter-sounds" is now active!');

    audioPlayer = audioPlayer || new AudioPlay();
    controller = controller || new EditorObserver(audioPlayer);
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('typewriter-sounds.helloWorld', () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World from typewriter-sounds!');
    });

    context.subscriptions.push(controller);
    context.subscriptions.push(disposable);
}

export class AudioPlay {
    private _playExePath: string = path.join(__dirname, '..', 'src', 'audio', 'play.exe');
    private _keypressPath: string = path.join(__dirname, '..', 'src', 'audio', 'typewriter-key-1.wav');
    private _carriageReturnPath: string = path.join(__dirname, '..', 'src', 'audio', 'typewriter-return-1.wav');

    constructor() {
    }

    public playKeystroke() {
        ourSound.play(this._keypressPath);
    }

    public playCarriageReturn() {
        ourSound.play(this._carriageReturnPath);
    }
}

// This method is called when your extension is deactivated
export function deactivate() { }
