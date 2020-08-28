import sortable from './html5sortable.es.js';

/// The variable 'config' needs to be externally defined.

var { options, formUrl, minSelectedCharacters } = config;

////////////////////////////////////////////////////////////////////////////////////////////

var list = document.getElementById('casting-options');

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

[verifyRequirementsMet, updateVerificationPopup].forEach(f => {
    sortable('#casting-options')[0].addEventListener('sortupdate', f);
    sortable('#casting-selections')[0].addEventListener('sortupdate', f);
    document.querySelector('#name').addEventListener('input', f);
});

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

function updateVerificationPopup() {
    var name = document.querySelector('#name').value;
    var targetNameContainer = document.querySelector('#nameGiven');
    targetNameContainer.innerText = name;

    var characters = Array.from(document.querySelectorAll('#casting-selections>li')).map(e => e.innerText);
    var selectedPreferencesContainer = document.querySelector('#selectedPreferences');
    selectedPreferencesContainer.innerHTML = '';

    characters.forEach(character => {
        var listItem = document.createElement('li');
        listItem.appendChild(document.createTextNode(character));
        listItem.className = 'list-group-item list-group-item-light';
        selectedPreferencesContainer.appendChild(listItem);
    });
}
