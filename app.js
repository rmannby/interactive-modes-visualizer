// app.js - JavaScript for Interactive Modes of Major

// Musical data constants
const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const noteEnharmonics = {
    'C#': 'Db', 
    'D#': 'Eb', 
    'F#': 'Gb', 
    'G#': 'Ab', 
    'A#': 'Bb'
};

// Mode definitions with all properties
const modes = [
    { 
        name: 'Major (Ionian)', 
        intervals: [0, 2, 4, 5, 7, 9, 11], 
        pattern: 'W-W-H-W-W-W-H', 
        degrees: '1-2-3-4-5-6-7', 
        formula: 'I ii iii IV V vi vii°', 
        chordTypes: ['maj', 'min', 'min', 'maj', 'maj', 'min', 'dim'], 
        description: 'The bright, happy sound. The pattern of all modes.', 
        color: 'major' 
    },
    { 
        name: 'Dorian', 
        intervals: [0, 2, 3, 5, 7, 9, 10], 
        pattern: 'W-H-W-W-W-H-W', 
        degrees: '1-2-♭3-4-5-6-♭7', 
        formula: 'i ii bIII IV v vi° bVII', 
        chordTypes: ['min', 'min', 'maj', 'maj', 'min', 'dim', 'maj'], 
        description: 'Minor scale with a raised 6th. Dark yet smooth, groovy, and mellow.', 
        color: 'dorian' 
    },
    { 
        name: 'Phrygian', 
        intervals: [0, 1, 3, 5, 7, 8, 10], 
        pattern: 'H-W-W-W-H-W-W', 
        degrees: '1-♭2-♭3-4-5-♭6-♭7', 
        formula: 'i bII bIII iv v° bVI bvii', 
        chordTypes: ['min', 'maj', 'maj', 'min', 'dim', 'maj', 'min'], 
        description: 'Minor scale with a flattened 2nd. Spanish, exotic, and tense.', 
        color: 'phrygian' 
    },
    { 
        name: 'Lydian', 
        intervals: [0, 2, 4, 6, 7, 9, 11], 
        pattern: 'W-W-W-H-W-W-H', 
        degrees: '1-2-3-#4-5-6-7', 
        formula: 'I II iii #iv° V vi vii', 
        chordTypes: ['maj', 'maj', 'min', 'dim', 'maj', 'min', 'min'], 
        description: 'Major scale with a sharpened 4th. Dreamy, bright, ethereal.', 
        color: 'lydian' 
    },
    { 
        name: 'Mixolydian', 
        intervals: [0, 2, 4, 5, 7, 9, 10], 
        pattern: 'W-W-H-W-W-H-W', 
        degrees: '1-2-3-4-5-6-♭7', 
        formula: 'I ii iii° IV v vi bVII', 
        chordTypes: ['maj', 'min', 'dim', 'maj', 'min', 'min', 'maj'], 
        description: 'Major scale with a flattened 7th. Bluesy, groovy, and bold.', 
        color: 'mixolydian' 
    },
    { 
        name: 'Aeolian (Natural Minor)', 
        intervals: [0, 2, 3, 5, 7, 8, 10], 
        pattern: 'W-H-W-W-H-W-W', 
        degrees: '1-2-♭3-4-5-♭6-♭7', 
        formula: 'i ii° bIII iv v bVI bVII', 
        chordTypes: ['min', 'dim', 'maj', 'min', 'min', 'maj', 'maj'], 
        description: 'The natural minor scale. Dark, melancholic, and somber.', 
        color: 'aeolian' 
    },
    { 
        name: 'Locrian', 
        intervals: [0, 1, 3, 5, 6, 8, 10], 
        pattern: 'H-W-W-H-W-W-W', 
        degrees: '1-♭2-♭3-4-♭5-♭6-♭7', 
        formula: 'i° bII biii iv bV bVI bvii', 
        chordTypes: ['dim', 'maj', 'min', 'min', 'maj', 'maj', 'min'], 
        description: 'Diminished tonic with a flattened 5th. Unstable, dissonant, dark, and uncomfortable.', 
        color: 'locrian' 
    }
];

// Guitar fretboard data
const guitarStrings = ['E', 'B', 'G', 'D', 'A', 'E'];
const stringNoteIndices = [4, 11, 7, 2, 9, 4]; // E, B, G, D, A, E

// Utility functions
function getNoteIndex(note) {
    return notes.indexOf(note.replace('b', '').replace('#', notes.includes(note) ? '' : '#'));
}

function getNote(index) {
    return notes[index % 12];
}

function getScaleNotes(rootNote, intervals) {
    const rootIndex = getNoteIndex(rootNote);
    return intervals.map(interval => getNote(rootIndex + interval));
}

function getChordName(rootNote, chordType) {
    const suffix = chordType === 'maj' ? '' : chordType === 'min' ? 'm' : '°';
    return rootNote + suffix;
}

function getChordTriad(rootNote, chordType, scaleNotes) {
    const rootIndex = scaleNotes.indexOf(rootNote);
    const third = scaleNotes[(rootIndex + 2) % 7];
    const fifth = scaleNotes[(rootIndex + 4) % 7];
    return [rootNote, third, fifth];
}

// Fretboard generation
function generateFretboard(rootNote, intervals) {
    const rootIndex = getNoteIndex(rootNote);
    const scaleNotes = intervals.map(interval => (rootIndex + interval) % 12);
    
    let html = '<div class="fretboard-title">Guitar Fretboard (first 12 frets)</div>';
    html += '<div class="fretboard-diagram">';
    
    // Add fret numbers
    html += '<div class="fret-number">';
    html += '<span></span>';
    for (let fret = 0; fret <= 11; fret++) {
        html += `<span>${fret}</span>`;
    }
    html += '</div>';
    
    // Add strings
    guitarStrings.forEach((string, stringIndex) => {
        html += `<div class="string-label">${string}</div>`;
        for (let fret = 0; fret <= 11; fret++) {
            const noteIndex = (stringNoteIndices[stringIndex] + fret) % 12;
            const noteName = notes[noteIndex];
            const isScaleNote = scaleNotes.includes(noteIndex);
            const isRoot = noteIndex === rootIndex;
            const className = isRoot ? 'fret root-fret' : (isScaleNote ? 'fret active' : 'fret');
            html += `<div class="${className}">${isScaleNote ? noteName : ''}</div>`;
        }
    });
    
    html += '</div>';
    return html;
}

// Mode card generation
function generateModeCard(rootNote, mode, modeIndex) {
    const scaleNotes = getScaleNotes(rootNote, mode.intervals);
    const chords = scaleNotes.map((note, i) => getChordName(note, mode.chordTypes[i]));
    const chordTriads = scaleNotes.map((note, i) => getChordTriad(note, mode.chordTypes[i], scaleNotes));
    
    // Parse scale degrees to identify altered ones
    const degreesArray = mode.degrees.split('-');
    const degreeElements = degreesArray.map(degree => {
        const isAltered = degree.includes('♭') || degree.includes('#');
        return `<span class="degree ${isAltered ? 'altered' : ''}">${degree}</span>`;
    }).join('');
    
    const modeName = mode.name.replace(/[()]/g, '').replace(/ /g, '_');
    
    let html = `
        <div class="mode-card ${mode.color}" id="mode-${modeIndex}">
            <div class="mode-header">
                <div class="mode-name">${mode.name}</div>
                <div class="mode-formula">${mode.formula}</div>
            </div>
            <div class="mode-info">
                <div class="scale-notes">
                    ${scaleNotes.map((note, i) => 
                        `<span class="note ${i === 0 ? 'root' : ''}">${note}</span>`
                    ).join('')}
                </div>
                <div class="scale-degrees">
                    <span class="scale-degrees-label">Scale Degrees:</span>
                    ${degreeElements}
                </div>
                <div class="interval-pattern">
                    Interval Pattern: <span>${mode.pattern}</span>
                </div>
                <div class="chord-progression">
                    <strong>Chords:</strong>
                    ${chords.map((chord, i) => `
                        <span class="chord">
                            ${chord}
                            <span class="chord-tooltip">Triad: ${chordTriads[i].join(' - ')}</span>
                        </span>
                    `).join('')}
                </div>
            </div>
            <div class="fretboard">
                ${generateFretboard(rootNote, mode.intervals)}
            </div>
            <div class="description">${mode.description}</div>
        </div>
    `;
    return html;
}

// Update all modes based on selected root note
function updateModes() {
    const rootNote = document.getElementById('rootNote').value;
    const modesGrid = document.getElementById('modesGrid');
    
    modesGrid.innerHTML = modes.map((mode, index) => 
        generateModeCard(rootNote, mode, index)
    ).join('');
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Set up event listener for root note selector
    document.getElementById('rootNote').addEventListener('change', updateModes);
    
    // Initial render
    updateModes();
});