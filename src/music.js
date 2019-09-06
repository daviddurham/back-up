var Music = function() {
    
    // audio buffers
    this.buffers = [];
    this.loaded = 0;

	// base audio source
    this.src = null;

    // sequence playback - mainly for testing
	this.currStep = -1;
	
    // 99 is a rest
    var a = 99;

    // melody
    this.seq = [-3,a,a,a,  -1,a,a,a,  0,a,a,a,  -3,a,2,a,
                -3,a,a,a,  -1,a,a,a,  4,a,a,a,   2,a,a,a,
                -3,a,a,a,  -1,a,-1,a, 0,a,0,a,  -3,a,2,a,
                -3,a,a,a,  -1,a,a,a,  4,a,a,a,   2,a,0,a,
            
                 4,a,a,a,   5,a,a,a,  4,a,a,a,   5,a,a,a,
                 7,a,a,a,   4,a,a,a,  2,a,a,a,   a,a,a,a,
                 2,a,a,a,   4,a,a,a,  2,a,a,a,   4,a,a,a,
                 2,a,a,a,  -1,a,a,a, -3,a,a,a,   a,a,a,a];

    // note frequencies
    //           C3      C#3/Db3 D3      D#3/E3b E3      F3      F3#/G3b G3      G3#/Ab3 A3      A3#/Bb3 B3      C4      C#4/Db4 D4      D#4/Eb4 E4      F4      F#4     G4      G#4
    //           -12     -11     -10     -9      -8      -7      -6      -5      -4      -3      -2      -1      0       1       2       3       4       5       6       7       8       9       10      11      12 
    this.freq = [130.81, 138.59, 146.83, 155.56, 164.81, 174.61, 185.00, 196.00, 207.65, 220.00, 233.08, 246.94, 261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392.00, 415.30, 440.00, 466.16, 493.88, 523.25];
    
    // c4 (middle C) is at index 12 in the frequencies array
    this.freqOffset = 12;

    // ms interval calculated from bpm
    // 60 / tempo * 1000
    this.tempo = 140;
    this.interval = 100;//(60 / this.tempo) * 1000;

    this.loadSound("a/xylo.mp3", 0);
}

Music.prototype = {
    
	loadSound : function(file, buffer) {

        var self = this;

        var request = new XMLHttpRequest();
        request.open("GET", file, true);
        request.responseType = "arraybuffer";

        request.onload = function() {

            audioCtx.decodeAudioData(request.response, function(b) {

                self.buffers[buffer] = b;
                self.loaded++;

                // all sounds loaded
                if (self.loaded == 1) {

                    self.onSoundsLoaded();
                }
            },

            function(e){

            });
        }

        request.send();
    },

    onSoundsLoaded : function() {

        this.play();
    },

	getFrequency : function(offset) {

        var perc = this.freq[this.freqOffset + offset] / this.freq[this.freqOffset];
        return perc;        
    },

    note : function(buffer, note) {

        // 99 is a rest
        if (note != 99) {
        
            var src = audioCtx.createBufferSource();

            // which sound to play
            src.buffer = this.buffers[buffer];

            // connect the source to the context destination
            src.connect(audioCtx.destination);

            src.start(0);
		    src.playbackRate.value = this.getFrequency(note);
        }
        
        var self = this;
        setTimeout(function() { self.onNoteComplete() }, this.interval);
    },

    onNoteComplete : function() {

        // use this for sequences
        if (this.currStep >= 0) {

            this.currStep++;

            if (this.currStep > this.seq.length - 1) {

                // loop
                this.currStep = 0;//-1;
                //return
            }

            this.note(0, this.seq[this.currStep]);
        }
    },

    // maybe don't need this here - but it's useful for testing
    play : function() {

        this.currStep = 0;
        this.note(0, this.seq[this.currStep]);
    },

    stop : function() {

        this.currStep = -1;
    }
}