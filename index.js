var URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
navigator.saveBlob = navigator.saveBlob || navigator.msSaveBlob || navigator.mozSaveBlob || navigator.webkitSaveBlob;
window.saveAs = window.saveAs || window.webkitSaveAs || window.mozSaveAs || window.msSaveAs;

// Because highlight.js is a bit awkward at times
var languageOverrides = {
    js: 'javascript',
    html: 'xml'
};

var livestyles;

emojify.setConfig({
    img_dir: 'emoji'
});

var md = markdownit({
    html: true,
    highlight: function (code, lang) {
        if (languageOverrides[lang]) lang = languageOverrides[lang];
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(lang, code).value;
            } catch (e) {
            }
        }
        return '';
    }
}).use(markdownitFootnote);

function update(e) {
    setOutput(e.getValue());
}

function setOutput(val) {
    val = val.replace(/<equation>((.*?\n)*?.*?)<\/equation>/ig, function (a, b) {
        return '<img src="http://latex.codecogs.com/png.latex?' + encodeURIComponent(b) + '" />';
    });

    var out = document.getElementById('out');
    var old = out.cloneNode(true);
    out.innerHTML = md.render(val);
    emojify.run(out);

    var allold = old.getElementsByTagName("*");
    if (allold === undefined) return;

    var allnew = out.getElementsByTagName("*");
    if (allnew === undefined) return;

    for (var i = 0, max = Math.min(allold.length, allnew.length); i < max; i++) {
        if (!allold[i].isEqualNode(allnew[i])) {
            out.scrollTop = allnew[i].offsetTop;
            return;
        }
    }
}

var editor = CodeMirror.fromTextArea(document.getElementById('code'), {
    mode: "spell-checker",
    backdrop: "gfm",
    lineNumbers: false,
    matchBrackets: true,
    lineWrapping: true,
    theme: 'base16-light',
    extraKeys: {
        "Enter": "newlineAndIndentContinueMarkdownList"
    }
});

editor.on('change', update);

function selectionChanger(selection, operator, endoperator) {
    if (selection === "") {
        return operator;
    }
    if (!endoperator) {
        endoperator = operator
    }
    var isApplied = selection.slice(0, 2) === operator && seisAppliedection.slice(-2) === endoperator;
    return isApplied ? selection.slice(2, -2) : operator + selection + endoperator;
}

editor.addKeyMap({
    // bold
    'Ctrl-B': function (cm) {
        cm.replaceSelection(selectionChanger(cm.getSelection(), '**'));
    },
    // italic
    'Ctrl-I': function (cm) {
        cm.replaceSelection(selectionChanger(cm.getSelection(), '_'));
    },
    // code
    'Ctrl-K': function (cm) {
        cm.replaceSelection(selectionChanger(cm.getSelection(), '`'));
    },
    // keyboard shortcut
    'Ctrl-L': function (cm) {
        cm.replaceSelection(selectionChanger(cm.getSelection(), '<kbd>', '</kbd>'));
    }
});

document.addEventListener('drop', function (e) {
    e.preventDefault();
    e.stopPropagation();

    var reader = new FileReader();
    reader.onload = function (e) {
        editor.setValue(e.target.result);
    };

    reader.readAsText(e.dataTransfer.files[0]);
}, false);

document.addEventListener('keydown', function (e) {
    if (e.keyCode === 83 && (e.ctrlKey || e.metaKey)) {
        e.shiftKey ? showMenu() : saveInBrowser();

        e.preventDefault();
        return false;
    }

    if (e.keyCode === 27 && menuVisible) {
        hideMenu();

        e.preventDefault();
        return false;
    }
});

function clearEditor() {
    editor.setValue("");
}

function toggleNightMode(button) {
    button.classList.toggle('selected');
    document.getElementById('toplevel').classList.toggle('nightmode');
}

function toggleReadMode(button) {
    button.classList.toggle('selected');
    document.getElementById('out').classList.toggle('focused');
    document.getElementById('in').classList.toggle('hidden');
}

function updateHash() {
    window.location.hash = btoa( // base64 so url-safe
        RawDeflate.deflate( // gzip
            unescape(encodeURIComponent( // convert to utf8
                editor.getValue()
            ))
        )
    );
}

function start() {
    if (window.location.hash) {
        var h = window.location.hash.replace(/^#/, '');
        if (h.slice(0, 5) === 'view:') {
            setOutput(decodeURIComponent(escape(RawDeflate.inflate(atob(h.slice(5))))));
            document.body.className = 'view';
        } else {
            editor.setValue(
                decodeURIComponent(escape(
                    RawDeflate.inflate(
                        atob(
                            h
                        )
                    )
                ))
            );
        }
    } else if (localStorage.getItem('content')) {
        editor.setValue(localStorage.getItem('content'));
    }
    update(editor);
    editor.focus();
}

start();
