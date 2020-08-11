import sortable from './html5sortable.es.js';

/// Configuration section. This should be fetched from another location. /////////////////////////////////////////////////////////////////////////////////////////

var options = [
    "Aphrodite",
    "Apollo",
    "Artemis",
    "Ares",
    "Athena",
    "Dionysos",
    "Demeter",
    "Hades",
    "Eris",
    "Hephaistos",
    "Hecate",
    "Hermes",
    "Hera",
    "Poseidon",
    "Persephone",
    "Zeus",
];

var formUrl = "https://docs.google.com/forms/d/e/1FAIpQLSd3wYA05KwqPRxjV3V4v7uUw9k7hx75WDn-NLet2G4j1rSLuQ/viewform?entry.1246043067=$CHARACTERS&entry.1009823322=$NAME";

var minSelectedCharacters = 5;

var list = document.getElementById('casting-options');

////////////////////////////////////////////////////////////////////////////////////////////

options.sort().forEach((option) => {
    var item = document.createElement('li');
    item.className = 'list-group-item list-group-item-light';
    item.appendChild(document.createTextNode(option));
    list.appendChild(item);
});

sortable('#casting-options', {
    forcePlaceholderSize: false,
    acceptFrom: '#casting-selections, #casting-options',
    hoverClass: 'is-hovered',
});

sortable('#casting-selections', {
    forcePlaceholderSize: false,
    acceptFrom: '#casting-options, #casting-selections',
    hoverClass: 'is-hovered',
});

sortable('#casting-options')[0].addEventListener('sortupdate', verifyRequirementsMet);
sortable('#casting-selections')[0].addEventListener('sortupdate', verifyRequirementsMet);
document.querySelector('#name').addEventListener('input', verifyRequirementsMet);

var rowHeight = document.getElementById('casting-options').offsetHeight;
['casting-options', 'casting-selections'].forEach(listId => {
    document.getElementById(listId).style.minHeight = rowHeight;
});

document.getElementById('submit').addEventListener('click', () => {
    var name = document.querySelector('#name').value;
    var characters = `(${name})\n` + Array.from(document.querySelectorAll('#casting-selections>li')).map((e, i) => `${i + 1} ${e.innerText}`).join('\n');

    var url = formUrl.replace('$CHARACTERS', encodeURIComponent(characters)).replace('$NAME', encodeURIComponent(name));

    window.location.href = url;
});

function verifyRequirementsMet() {
    var submitButton = document.querySelector('#prepareSubmit');
    var name = document.querySelector('#name').value;
    var nameIsFilledOut = (name !== undefined && name !== null && name.length > 1);

    if (nameIsFilledOut && document.querySelectorAll('#casting-selections>li').length >= minSelectedCharacters) {
        submitButton.disabled = false;
    } else {
        submitButton.disabled = true;
    }
}
