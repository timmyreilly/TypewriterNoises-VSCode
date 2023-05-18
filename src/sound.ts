const { exec } = require('child_process');
const execPromise = require('util').promisify(exec);

/* MAC PLAY COMMAND */
const macPlayCommand = (path: any, volume: number) => `afplay \"${path}\" -v ${volume}`;

/* WINDOW PLAY COMMANDS */
const addPresentationCore = `Add-Type -AssemblyName presentationCore;`;
const createMediaPlayer = `$player = New-Object system.windows.media.mediaplayer;`;
const loadAudioFile = (path: any) => `$player.open('${path}');`;
const playAudio = `$player.Play();`;
const stopAudio = `Start-Sleep 1; Start-Sleep -s $player.NaturalDuration.TimeSpan.TotalSeconds;Exit;`;

/* LINUX PLAY COMMANDS */
const linuxPlayCommand = (path: any, volume: number) => `paplay --volume ${volume} ${path}`;

const windowPlayCommand = (path: any, volume: number) =>
    `powershell -c ${addPresentationCore} ${createMediaPlayer} ${loadAudioFile(
        path,
    )} $player.Volume = ${volume}; ${playAudio} ${stopAudio}`;

module.exports = {
    play: async (path: any, volume = 0.5) => {
        /**
         * Window: mediaplayer's volume is from 0 to 1, default is 0.5
         * Mac: afplay's volume is from 0 to 255, default is 1. However, volume > 2 usually result in distortion.
         * Therefore, it is better to limit the volume on Mac, and set a common scale of 0 to 1 for simplicity
         */
        const volumeAdjustedByOS = process.platform === 'darwin' ? Math.min(2, volume * 2) : volume

        let playCommand = "";
        switch (process.platform) {
            case 'darwin':
                playCommand = macPlayCommand(path, Math.min(2, volume * 2));
                break;
            case 'win32':
                playCommand = windowPlayCommand(path, volume);
                break;
            case 'linux':
                playCommand = linuxPlayCommand(path, (volume * 65536)); // paplay's volume is from 0 to 65536
                break;
            default:
                throw new Error('Unsupported OS found: ' + process.platform);
        }
        // const playCommand =
        //   process.platform === 'darwin' ? macPlayCommand(path, volumeAdjustedByOS) : windowPlayCommand(path, volumeAdjustedByOS)
        try {
            await execPromise(playCommand, { windowsHide: true });
        } catch (err) {
            throw err;
        }
    },
};