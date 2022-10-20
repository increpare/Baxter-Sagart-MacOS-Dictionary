//load tsv
let fs = require('fs');
let tsv = require('tsv');
let data = fs.readFileSync('baxtersagart.tsv', 'utf8');
let lines = tsv.parse(data);
//remove first line

let dict={};
//need to consolidate lines
for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    let char = line.zi;
    //if char not in dict, make list
    if (!(char in dict)) {
        dict[char] = [];
    }
    dict[char].push(line);
}

let dat = `<?xml version="1.0" encoding="UTF-8"?>
<!--
	This is a sample dictionary source file.
	It can be built using Dictionary Development Kit.
-->
<d:dictionary xmlns="http://www.w3.org/1999/xhtml" xmlns:d="http://www.apple.com/DTDs/DictionaryService-1.0.rng">
`;

//loop throuhg dict
for (let char in dict) {
    let entries=dict[char];
    dat +=
    `
    <d:entry id="${char}" d:title="${char}">
        <d:index d:value="${char}"/>
        <h1>${char}</h1>
        <dl>
        `;

    for (let i = 0; i < entries.length; i++) {
        var line = entries[i];
        //escape gloss
        var gloss_escaped = line.gloss.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
        var OC_escaped = line.OC.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
        dat+=`
        <dt class="pronunciation">${line.py} | ${line.MC} | ${OC_escaped}</dt>
        <dd>${gloss_escaped}</dd>
        `;
    }

    dat +=`
    </dl>
    </d:entry>
    `;
}


dat+=`
</d:dictionary>`;

fs.writeFileSync('project_templates/MyDictionary.xml', dat, 'utf8');