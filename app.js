// app.js - JavaScript for Interactive Modes of Major

// Musical data constants
const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const FRET_COUNT = 12;

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

// Data för pianotangenter
const pianoKeys = [
    { note: 'C', color: 'white' }, { note: 'C#', color: 'black' },
    { note: 'D', color: 'white' }, { note: 'D#', color: 'black' },
    { note: 'E', color: 'white' }, { note: 'F', color: 'white' },
    { note: 'F#', color: 'black' }, { note: 'G', color: 'white' },
    { note: 'G#', color: 'black' }, { note: 'A', color: 'white' },
    { note: 'A#', color: 'black' }, { note: 'B', color: 'white' }
];

// Utility functions
function getNoteIndex(note) {
    // Grundläggande indexhämtning
    let index = notes.indexOf(note);
    if (index !== -1) return index;

    // Hantera b-förtecken
    if (note.endsWith('b')) {
        const flatMap = { 'Db': 1, 'Eb': 3, 'Gb': 6, 'Ab': 8, 'Bb': 10 };
        return flatMap[note];
    }
    return -1; // Om noten inte hittas
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
    if (rootIndex === -1) return []; // Säkerhetskontroll
    const third = scaleNotes[(rootIndex + 2) % 7];
    const fifth = scaleNotes[(rootIndex + 4) % 7];
    return [rootNote, third, fifth];
}

/**
 * Korrigerar enharmoniska noter i en skala baserat på modens formel.
 * Om en grad är sänkt (♭) och noten har ett kryss (#), omvandlas den till ett b-förtecken.
 * @param {string[]} scaleNotes - Arrayen med skalans noter (t.ex. ['C', 'D', 'D#']).
 * @param {object} mode - Mode-objektet som innehåller en `degrees`-sträng.
 * @returns {string[]} - En ny array med de korrigerade tonnamnen.
 */
function correctEnharmonicNotes(scaleNotes, mode) {
    const degrees = mode.degrees.split('-');
    const correctedNotes = [...scaleNotes];

    for (let i = 0; i < correctedNotes.length; i++) {
        const degree = degrees[i];
        const note = correctedNotes[i];

        // Om graden ska vara sänkt och noten har ett #...
        if (degree && degree.includes('♭') && note.includes('#')) {
            // ...ersätt den med dess b-motsvarighet från noteEnharmonics-objektet.
            if (noteEnharmonics[note]) {
                correctedNotes[i] = noteEnharmonics[note];
            }
        }
    }
    return correctedNotes;
}

// Fretboard generation
function generateFretboard(rootNote, mode, modeIndex) {
    const rootIndex = getNoteIndex(rootNote);
    const scaleNoteIndices = mode.intervals.map(interval => (rootIndex + interval) % 12);
    
    // Generera och korrigera tonnamn
    let scaleNotes = getScaleNotes(rootNote, mode.intervals);
    scaleNotes = correctEnharmonicNotes(scaleNotes, mode);
    
    // Skapa en mappning från notindex till korrekt namn
    const noteIndexToNameMap = {};
    mode.intervals.forEach((interval, i) => {
        const noteIndex = (rootIndex + interval) % 12;
        noteIndexToNameMap[noteIndex] = scaleNotes[i];
    });

    let html = `<div class="fretboard-title">Guitar Fretboard (first ${FRET_COUNT} frets)</div>`;
    html += `<div class="fretboard-diagram" id="fretboard-${modeIndex}">`;
    html += '<div class="fret-number"><span></span>';
    for (let fret = 0; fret <= FRET_COUNT; fret++) {
        html += `<span>${fret}</span>`;
    }
    html += '</div>';
    guitarStrings.forEach((string, stringIndex) => {
        html += `<div class="string-label">${string}</div>`;
        for (let fret = 0; fret <= FRET_COUNT; fret++) {
            const noteIndex = (stringNoteIndices[stringIndex] + fret) % 12;
            const isScaleNote = scaleNoteIndices.includes(noteIndex);
            const displayName = isScaleNote ? noteIndexToNameMap[noteIndex] : ''; // Använd korrekta namnet
            const isRoot = noteIndex === rootIndex;
            const className = isRoot ? 'fret root-fret' : (isScaleNote ? 'fret active' : 'fret');
            html += `<div class="${className}" data-note-index="${noteIndex}">${displayName}</div>`;
        }
    });
    html += '</div>';
    return html;
}

function updateFretboard(rootNote, mode, modeIndex) {
    const rootIndex = getNoteIndex(rootNote);
    const scaleNoteIndices = mode.intervals.map(interval => (rootIndex + interval) % 12);

    // Generera och korrigera tonnamn
    let scaleNotes = getScaleNotes(rootNote, mode.intervals);
    scaleNotes = correctEnharmonicNotes(scaleNotes, mode);

    // Skapa en mappning från notindex till korrekt namn
    const noteIndexToNameMap = {};
    mode.intervals.forEach((interval, i) => {
        const noteIndex = (rootIndex + interval) % 12;
        noteIndexToNameMap[noteIndex] = scaleNotes[i];
    });

    const fretboard = document.getElementById(`fretboard-${modeIndex}`);
    if (!fretboard) return;
    const frets = fretboard.querySelectorAll('.fret');
    frets.forEach(fret => {
        const noteIndex = parseInt(fret.getAttribute('data-note-index'));
        const isScaleNote = scaleNoteIndices.includes(noteIndex);
        const displayName = isScaleNote ? noteIndexToNameMap[noteIndex] : ''; // Använd korrekta namnet
        const isRoot = noteIndex === rootIndex;
        fret.className = 'fret';
        if (isRoot) {
            fret.classList.add('root-fret');
        } else if (isScaleNote) {
            fret.classList.add('active');
        }
        fret.textContent = displayName;
    });
}

// Funktioner för att generera och uppdatera pianot
function generatePianoKeyboard(rootNote, intervals, modeIndex) {
    const scaleNotes = getScaleNotes(rootNote, intervals);
    let html = `<div class="piano-title">Piano Keyboard</div>`;
    html += `<div class="piano-keyboard" id="piano-keys-${modeIndex}">`;
    for (let octave = 0; octave < 2; octave++) {
        pianoKeys.forEach(key => {
            const isScaleNote = scaleNotes.includes(key.note);
            const isRoot = key.note === rootNote;
            let className = `key ${key.color}`;
            if (isScaleNote) className += ' active';
            if (isRoot) className += ' root';
            html += `<div class="${className}" data-note="${key.note}"></div>`;
        });
    }
    html += `</div>`;
    return html;
}

// KORRIGERAD FUNKTION
function updatePianoKeyboard(rootNote, intervals, modeIndex) {
    const rootIndex = getNoteIndex(rootNote);
    // Använd noternas index istället för deras namn för jämförelse
    const scaleNoteIndices = intervals.map(interval => (rootIndex + interval) % 12);
    
    const piano = document.getElementById(`piano-keys-${modeIndex}`);
    if (!piano) return;

    const keys = piano.querySelectorAll('.key');
    keys.forEach(key => {
        const keyNote = key.dataset.note;
        const keyNoteIndex = getNoteIndex(keyNote); // Konvertera tangentens namn till ett index

        // Återställ klasser
        key.classList.remove('active', 'root');

        // Jämför index istället för strängar
        const isScaleNote = scaleNoteIndices.includes(keyNoteIndex);
        if (isScaleNote) {
            key.classList.add('active');
        }
        const isRoot = keyNoteIndex === rootIndex;
        if (isRoot) {
            key.classList.add('root');
        }
    });
}

// Mode card generation
function generateModeCard(rootNote, mode, modeIndex) {
    // 1. Hämta och korrigera skalans toner
    let scaleNotes = getScaleNotes(rootNote, mode.intervals);
    scaleNotes = correctEnharmonicNotes(scaleNotes, mode);

    const chords = scaleNotes.map((note, i) => getChordName(note, mode.chordTypes[i]));
    const degreesArray = mode.degrees.split('-');
    const degreeElements = degreesArray.map(degree => {
        const isAltered = degree.includes('♭') || degree.includes('#');
        return `<span class="degree ${isAltered ? 'altered' : ''}">${degree}</span>`;
    }).join('');

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
                        <span class="chord" data-mode-index="${modeIndex}" data-chord-index="${i}">
                            ${chord}
                        </span>
                    `).join('')}
                </div>
            </div>
            <div class="fretboard">
                ${generateFretboard(rootNote, mode, modeIndex)}
            </div>
            <div class="piano-container" id="piano-${modeIndex}">
                ${generatePianoKeyboard(rootNote, mode.intervals, modeIndex)}
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

    if (modesGrid.children.length === 0) {
        modesGrid.innerHTML = modes.map((mode, index) =>
            generateModeCard(rootNote, mode, index)
        ).join('');
    } else {
        modes.forEach((mode, index) => {
            // 1. Hämta och korrigera skalans toner
            let scaleNotes = getScaleNotes(rootNote, mode.intervals);
            scaleNotes = correctEnharmonicNotes(scaleNotes, mode);
            
            const chords = scaleNotes.map((note, i) => getChordName(note, mode.chordTypes[i]));
            const degreesArray = mode.degrees.split('-');
            const degreeElements = degreesArray.map(degree => {
                const isAltered = degree.includes('♭') || degree.includes('#');
                return `<span class="degree ${isAltered ? 'altered' : ''}">${degree}</span>`;
            }).join('');

            const modeCard = document.getElementById(`mode-${index}`);
            modeCard.querySelector('.scale-notes').innerHTML = scaleNotes.map((note, i) =>
                `<span class="note ${i === 0 ? 'root' : ''}">${note}</span>`
            ).join('');
            modeCard.querySelector('.scale-degrees').innerHTML = `<span class="scale-degrees-label">Scale Degrees:</span> ${degreeElements}`;
            
            modeCard.querySelector('.chord-progression').innerHTML = `
                <strong>Chords:</strong>
                ${chords.map((chord, i) => `
                    <span class="chord" data-mode-index="${index}" data-chord-index="${i}">
                        ${chord}
                    </span>
                `).join('')}
            `;
            
            updateFretboard(rootNote, mode, index);
            updatePianoKeyboard(rootNote, mode.intervals, index);
        });
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('rootNote').addEventListener('change', updateModes);
    updateModes();

    const globalChordTooltip = document.getElementById('global-chord-tooltip');

    document.addEventListener('mouseover', function(event) {
        if (event.target.classList.contains('chord')) {
            const chordElement = event.target;
            const modeIndex = parseInt(chordElement.dataset.modeIndex);
            const chordIndex = parseInt(chordElement.dataset.chordIndex);

            if (isNaN(modeIndex) || isNaN(chordIndex)) return;

            const mode = modes[modeIndex];
            const rootNote = document.getElementById('rootNote').value;
            
            // Hämta och korrigera skaltoner för att bygga korrekt treklang
            let scaleNotes = getScaleNotes(rootNote, mode.intervals);
            scaleNotes = correctEnharmonicNotes(scaleNotes, mode);
            
            const chordTriads = scaleNotes.map((note, i) => getChordTriad(note, mode.chordTypes[i], scaleNotes));

            globalChordTooltip.textContent = `Triad: ${chordTriads[chordIndex].join(' - ')}`;
            globalChordTooltip.style.display = 'block';

            const chordRect = chordElement.getBoundingClientRect();
            const tooltipRect = globalChordTooltip.getBoundingClientRect();

            globalChordTooltip.style.left = `${chordRect.left + (chordRect.width / 2) - (tooltipRect.width / 2)}px`;
            globalChordTooltip.style.top = `${chordRect.top - tooltipRect.height - 10}px`;
        }
    });

    document.addEventListener('mouseout', function(event) {
        if (event.target.classList.contains('chord')) {
            globalChordTooltip.style.display = 'none';
        }
    });

    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark-mode') {
        body.classList.add('dark-mode');
    } else if (savedTheme === 'light-mode') {
        body.classList.remove('dark-mode');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        body.classList.add('dark-mode');
    }

    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark-mode' : 'light-mode');
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        if (!localStorage.getItem('theme')) {
            if (event.matches) {
                body.classList.add('dark-mode');
            } else {
                body.classList.remove('dark-mode');
            }
        }
    });
});