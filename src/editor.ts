import { Disposable, window } from "vscode";
import * as vscode from 'vscode';
import {AudioPlay} from './extension';


export default class EditorObserver {
    private _disposable: Disposable;
    private _audioPlayer: AudioPlay;
    private _lastText : any;
    private _lastLine: number;

    constructor(audioplayer: AudioPlay) {
        this._audioPlayer = audioplayer;
        this._lastLine = 0; 
        // subscribe to selection change and editor activation events...
        let subscriptions: Disposable[] = [];
        window.onDidChangeTextEditorSelection(this._onEvent, this, subscriptions);
        window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions);
        
        this._disposable = Disposable.from(...subscriptions);
    }

    private _onEvent(e: any) {
        if (!this._hasTextChanged(e)) return; 
        let lineChanged = this._hasEnteredReturn(e);
        
        if (lineChanged) {
            this._audioPlayer.playCarriageReturn();
        } else {
            this._audioPlayer.playKeystroke();
        }
    }

    private _hasTextChanged(e: vscode.TextEditorSelectionChangeEvent) {
        let currentText = e.textEditor.document.getText();
        let hasChangd = (currentText !== this._lastText);
        this._lastText = currentText;
        
        return hasChangd;
    }

    private _hasEnteredReturn(e: vscode.TextEditorSelectionChangeEvent): boolean {
        // selection[0] is the start, and selection[1] is the end
        // Taken from the event, which contains the current texteditor and its selections
		let lastPosition : vscode.Selection = e.textEditor.selections[0];
        let lineChanged = (lastPosition.end.line !== this._lastLine);
            
        this._lastLine = lastPosition.end.line;
        return lineChanged;
    }

}
