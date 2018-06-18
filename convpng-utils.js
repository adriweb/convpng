/* ConvPNG-web helper script - Adriweb */

(function()
{
    let maxImg = 1;

    const buttonsContainer = document.getElementById("buttonsContainer");
    const dlList = document.getElementById("dlList");

    var addBlobFileLink = function(file, name) {
        const li = document.createElement("li");
        const a  = document.createElement("a");
        a.href = window.URL.createObjectURL((new Blob([file], {type: 'application/octet-stream'})));
        a.download = name;
        a.innerText = name;
        li.appendChild(a);
        dlList.appendChild(li);
    }

    var cleanup = function()
    {
        dlList.innerHTML = buttonsContainer.innerHTML = "";
        for (var i=0; i<maxImg; i++) {
            try { FS.unlink("IMAGE" + ('00'+i).slice(-2) + ".8xv"); } catch (e){}
        }
    }

    var makeCompressedAndDownload = function(buttonLink)
    {
        /* TODO */
    }

    var addDownloadButtons = function()
    {
        // Add download buttons
        if (/firefox/i.test(navigator.userAgent))
        {
            // Launch all downloads
            var btn = document.createElement("btn");
            btn.href = "#";
            btn.className = "btn btn-default";
            btn.innerHTML = "<span class='glyphicon glyphicon-download-alt' aria-hidden='true'></span> Launch downloads (all files)";
            btn.onclick = function() {
                [].forEach.call(document.querySelectorAll('#dlList a'), function (a) { a.click(); });
            };
            buttonsContainer.appendChild(btn);
        }

        // Launch a zip download // TODO
        /*
        var btn = document.createElement("a");
        btn.href = "#";
        btn.className = "btn btn-default";
        btn.innerHTML = "<span class='glyphicon glyphicon-compressed' aria-hidden='true'></span> Download all files in a .zip";
        btn.onclick = (function(btn) {
            return function(event) {
                makeCompressedAndDownload(btn);
                event.stopPropagation();
                return false;
            }
        })(btn);
        buttonsContainer.appendChild(btn);
        */
    }

    var fileLoaded = function(imgName)
    {
        const iniFile = `
#AppvarC           : ${imgName}
#OutputPalettes    : tiles_gfx
#PNGImages         :
${imgName}

#GroupC            : tiles_gfx
#Tilemap           : 80,80,true
#Compression       : zx7
#PNGImages         :
${imgName}
`;
        // Write convpng.ini
        FS.writeFile("convpng.ini", iniFile);

        Module.callMain();

        // Display appvars
        const fileName = imgName + ".8xv";
        try {
            const file = FS.readFile(fileName, {encoding: 'binary'});
            if (file) {
                addBlobFileLink(file, fileName);
            }
        } catch (e) {
            console.log('[Error] Oops, probably reached the end of the files ' + e.message, fileName);
        }
    }

    fileLoad = function(event)
    {
        cleanup();

        const files = event.target.files;
        maxImg = files.length;
        Array.from(files).forEach((file, idx) =>
        {
            if (!file || !(/\.(png)$/i.test(file.name)))
            {
                alert('Error: please only select PNG files');
                return;
            }
        })
        Array.from(files).forEach((file, idx) =>
        {
            const reader = new FileReader();
            reader.onloadend = (event) =>
            {
                if (event.target.readyState === FileReader.DONE)
                {
                    const fName = `${"IMAGE" + ('00'+idx).slice(-2)}`;
                    FS.writeFile(fName + '.png', new Uint8Array(event.target.result), {encoding: 'binary'});
                    fileLoaded(fName);
                    if (idx == maxImg-1) {
                        addDownloadButtons();
                    }
                }
            }
            reader.readAsArrayBuffer(file);
        })
    }
})()
