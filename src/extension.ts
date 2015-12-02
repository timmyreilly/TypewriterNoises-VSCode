// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import {window, workspace, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument} from 'vscode';
import EditorObserver from './editor';
import cp = require('child_process');

var path = require("path");
var player = require('play-sound')({});

// this method is called when your extension is activated. activation is
// controlled by the activation events defined in package.json

var letterCounter, audioPlayer, controller;

export function activate(ctx: ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "WordcountTester" is now active!');
    
    audioPlayer = audioPlayer || new AudioPlay();
    controller = controller || new EditorObserver(audioPlayer);

    // add to a list of disposables which are disposed when this extension
    // is deactivated again.
    ctx.subscriptions.push(controller);
}

export class AudioPlay {
    private _playExe_path:string = path.join(__dirname, '..', '..', 'audio', 'play.exe');    
    private _keypress_path:string = path.join(__dirname, '..', '..', 'audio', 'typewriter-key-1.wav');
    private _carriagereturn_path:string = path.join(__dirname, '..','..','audio','typewriter-return-1.wav');
    private _isWindows:boolean;
    
    public playKeystroke () {
        if (this._isWindows) {
            cp.execFile(this._playExe_path, [this._keypress_path]);
        } else {
            player.play(this._keypress_path);
        }
    }
    
    public playCarriageReturn () {
        if (this._isWindows) {
            cp.execFile(this._playExe_path, [this._carriagereturn_path]);
        } else {
            player.play(this._carriagereturn_path);
        }
    }
    
    constructor(){
        this._isWindows = (process.platform === 'win32');
    }
}
