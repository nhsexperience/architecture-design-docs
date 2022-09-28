import { Canvg, presets} from 'canvg';
import Reveal from 'reveal.js'
import RevealMarkdown from 'reveal.js/plugin/markdown/markdown.esm.js'
import Markdown from  'reveal.js/plugin/markdown/markdown.esm.js'
import 'reveal.js/dist/reveal.css'
import 'reveal.js/dist/theme/black.css'
import '@fontsource/source-sans-pro'
import RevealMenu from 'reveal.js-menu/menu.esm.js'
import 'reveal.js-menu/menu.css'

const preset = presets.offscreen()

var x = RevealMarkdown;
var $ = require("jquery");
global.jQuery = $;
global.$ = $;
window.jQuery = $;
window.$ = $;

export function UseReveal(document, deckid, useMermaid, mermaidSelector = 'code.mermaid', embed = true, showMenu=false  )
{
  
    $(document).ready(LoadUpReveal(document, deckid, useMermaid, mermaidSelector, embed, showMenu));
}

async function sleep(ms) {
    await new Promise(r => setTimeout(r, ms));
}

function LoadUpReveal(document, deckid, useMermaid, mermaidSelector = 'code.mermaid', embed = true, showMenu=false )
{
    var pluginsToLoad =[RevealMarkdown];
    if(showMenu)
    pluginsToLoad.push(RevealMenu);

    var sleepTime = 100;
    var selectorToUse = 'div.'+ deckid + ' > div.slides > section.present > div.mermaid, div.'+ deckid + ' > div.slides > section.present > pre > code.mermaid';
    var selectorToUseOnSlideChange = 'div.mermaid, code.mermaid';
    let deck1 = new Reveal( document.querySelector('div.'+ deckid), {
        embedded: embed,
        keyboardCondition: 'focused',
        controls: true,
        controlsTutorial: true,
        controlsLayout: 'bottom-right',
        controlsBackArrows: 'faded',
        progress: true,
        autoSlide: 5000,
        slideNumber: true,
        showSlideNumber: 'all',
        loop: true,
        plugins: pluginsToLoad,
        backgroundTransition: 'none',
        transition: 'none',
        center: false,
    } );
    
    deck1
    .initialize(
        {
            menu: {
                path: '/assets-webpack/reveal.js-menu',
                side: 'left',
                width: 'normal',
                numbers: false,
                titleSelector: 'h1, h2, h3, h4, h5, h6',
                useTextContentForMissingTitles: false,
                hideMissingTitles: false,
                markers: true,
                custom: false,
                themes: false,
                themesPath: 'dist/theme/',
            
                // Specifies if the transitions menu panel will be shown.
                // Set to 'true' to show the transitions menu panel with
                // the default transitions list. Alternatively, provide an
                // array to specify the transitions to make available in
                // the transitions panel, for example...
                // ['None', 'Fade', 'Slide']
                transitions: false,
            
                // Adds a menu button to the slides to open the menu panel.
                // Set to 'false' to hide the button.
                openButton: true,
            
                // If 'true' allows the slide number in the presentation to
                // open the menu panel. The reveal.js slideNumber option must
                // be displayed for this to take effect
                openSlideNumber: false,
            
       
                keyboard: true,
        
                sticky: true,
            
            
                autoOpen: true,
            
          
                delayInit: false,
            
                // If 'true' the menu will be shown when the menu is initialised.
                openOnInit: false,
      
                loadIcons: true
              }
        })
    .then( () => {
        if(useMermaid)
           // await sleep(sleepTime);
           var currentSlide = deck1.getCurrentSlide();
            UseMermaidNow(currentSlide, selectorToUseOnSlideChange);
      } );

    deck1.on('slidechanged',  (event) => {
        if(useMermaid)
        {
            //await sleep(sleepTime);
            RemoveProcessed(event.previousSlide);
            UseMermaidNow(event.currentSlide, selectorToUseOnSlideChange);
        }
      } );
    
    deck1.on('slidetransitionend', event => {
       
        // event.previousSlide, event.currentSlide, event.indexh, event.indexv
      } );

    deck1.addEventListener('menu-ready', function (event) {
        // your code
      });
}

function RemoveProcessed(slideToRemoveFrom)
{
    var processedAttribName = 'data-processed';
    var selectorToUse = 'div.mermaid[data-processed], code.mermaid[data-processed]';
    var toRender = slideToRemoveFrom.querySelectorAll(selectorToUse);
    toRender.forEach((item)=>
    {
        if(item.hasAttribute(processedAttribName))
        {
            while (item.firstChild) {
                item.removeChild(item.firstChild);
              }
            item.removeAttribute(processedAttribName);        
            
            var rawCode = item.rawCode;
            item.innerHTML = rawCode;
        }
    });
    var toRenderCheck = slideToRemoveFrom.querySelectorAll(selectorToUse);
}

export function MermaidInit(addlinks=true)
{
    mermaid.initialize({
        logLevel: 1,
        flowchart: { useMaxWidth: false, htmlLabels: false },
        mermaid: {
            startOnLoad: false,
            callback: function(id) {
                if(addlinks)
                {
                    console.log(id);
                    addLinks(id);
                }
            },
        },
    });
}

function UseMermaidNow(useMermaidOn, selector='.language-mermaid')
{
    
    var toRender = useMermaidOn.querySelectorAll(selector);
    if(toRender.length>0)
    {
        toRender.forEach(item =>
            {
                if(!item.hasOwnProperty('rawCode'))
                    item.rawCode = item.innerHTML;
            });

        window.mermaid.init(undefined, toRender);
        var afterRender = useMermaidOn.querySelectorAll(selector);
        afterRender.forEach(item =>
            {
                var x = 1;
            });
    }
}

export function UseMermaid(document, addlinks=true, selector='.language-mermaid', excludeSelector='div.slides > section')
{
    $(document).ready(function() {
        MermaidInit(addlinks);
        UseMermaidNow(document, selector, excludeSelector);
    });
}

function addLinks(id)
{
    var svg = document.getElementById(id);
    var btn = document.createElement('button'); 
    btn.id = id +"_button";
    var pre = svg.parentNode.parentNode;
    pre.id = id + "_pre";
    btn.innerHTML = "View diagram as PNG (" + id + ")";

    //Remove to enable the png button.
    btn.style.display = "none";

    svg.parentNode.parentNode.before(btn);
   
    svg.addEventListener('mouseover', (event) => 
    { 
        event.target.style.cursor = "pointer";
    });

    svg.addEventListener('click', (event) => 
    { 
        console.log(event);
        var pngVersion = document.getElementById(id+"_png");
        if(pngVersion)
        {
            window.open(pngVersion.src)
        }
        else
        {
            drawCanvas(id, (img)=>
            {
                img.style.display = "none";
                var p = document.createElement('p'); 
                btn.after(p);
                p.appendChild(img);
                window.open(img.src); 
            });
        }
    });

    btn.addEventListener('click', function () 
    { 
        var pngVersion = document.getElementById(id+"_png");
        if(pngVersion)
        {
            if (pngVersion.style.display === "none") {
                pngVersion.style.display = "block";
                pre.style.display = "none";
                btn.innerHTML = "View diagram as SVG (" + id + ")";
              } 
              else {
                pngVersion.style.display = "none";
                pre.style.display = "block";
                btn.innerHTML = "View diagram as PNG (" + id + ")";
              }
        }
        else
        {
            btn.innerHTML = "View diagram as SVG (" + id + ")";
            drawCanvas(id, (img)=>
            {
                img.style.display = "block";
                var p = document.createElement('p'); 
                btn.after(p);
                p.appendChild(img);
                pre.style.display = "none";
            });
        }
    });
}

function drawCanvas(id, callback)
{

    var svg = document.getElementById(id);
    var { width, height } = svg.getBoundingClientRect();
    var pixelRatio = 2;//window.devicePixelRatio || 1;

    // lets scale the canvas and change its CSS width/height to make it high res.
      //  canvas.style.width = canvas.width +'px';
    var newWidth = width * pixelRatio;
    var newHeight = height * pixelRatio;

        
    var canvas =  canvas = new OffscreenCanvas(newWidth, newHeight);// document.createElement('canvas'); // Create a Canvas element.
    var ctx = canvas.getContext('2d'); // For Canvas returns 2D graphic.

   // ctx.fillStyle = 'white'; // background color for the canvas
   // ctx.fillRect(0, 0, width, height); // fill the color on the canvas


// Now that its high res we need to compensate so our images can be drawn as 
//normal, by scaling everything up by the pixelRatio.
  //  ctx.setTransform(pixelRatio,0,0,pixelRatio,0,0);

    var img =  document.createElement('img');
    var data = svg.outerHTML; // Get SVG element as HTML code.
    Canvg.from(ctx, data, preset)
        .then(result =>
            {
                result.resize(canvas.width, canvas.height, 'xMidYMid meet');
                result.render()
                    .then(function()
                    {
                       // toDataURL return DataURI as Base64 format.
                         img.id=id+"_png";
                         
                         canvas.convertToBlob()
                            .then(blobresult=>
                                {
                                    img.src = URL.createObjectURL(blobresult);
                                    callback(img);
                                });

                         //img.style.width = width +'px';
                       
                    });
        });
}