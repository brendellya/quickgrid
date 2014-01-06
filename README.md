#What is Quick Grid?

<p>Quick Grid is a quick and simple way to add a responsive grid to your web projects as well as on-fly customizations using the 1000px grid format. See Elliot Jay Stock's excellent post.</p>

<p>Ditch the PSD and Illustrator grid templates, you shouldn't need to open a graphics suite to use a nice grid. Just add a couple of references to your page and you're all set.</p>

###Quick Grid Features
- Quick and unobtrusive, it sets itself up. Just add the javascript and css.
- Quick disable, just change gridSettings.isDebug to false, and bye bye grid.
- Customize, change colomn layouts, colors, opacity, and even toggle grid above or below content in real-time.
- Settings presist, settings are saved in a browser session so you can refresh the page as often as you like.
- Static or responsive, change the @max-width variable to a percent or absolute value.

###Dependencies
 - Any flavor of jQuery is all you need.
 - Less is recommended but not required (if you change the default LESS you will need to recompile the CSS)

Works in all modern browsers including IE9+.

###Getting Started
Add the grid stylesheet (LESS or CSS) to your head.  Add the grid-guide.js file to your head or footer and set
gridSettings.isDebug = true and that's it.

<code>
var gridSettings = { isDebug: true };
</code>

<em>Common sense but I'm saying anyway. This grid-guide.js is meant to help with prototyping and development and should be disabled
on production (reason a minified js file is not included). On small projects where resources are not a concern setting isDebug
to false or omitting it completely will disable to grid, however in most cases you would likely just remove the javascript
references on code complete.</em>

###Customizations

Static or Responsive(somewhat):
@max-width: 90%;
LESS Changes (set to 90% by default but can be change to an absolute value such as 1000px)

####Settings Form
1. Columns - can be a single digit or comma-seperate list.
Single values must be multiple of 6: [1,2,3,6]
Array values must equal a total of 6: (1,1,2,2)
2. Hide/Show Form - click the title to toggle the form, state is save to browser session

####HTML Markup
The html is pretty straight-forward.  There's no need to add a bunch of crazy class names just a two will do. Check the [demo](http://brendellya.com/quickgrid/) for
reference. Just create a parent element with the classname of "row", and follow it with a div, section, article, aside element with the
following columns classes [c1, c2, c3, c4, c5, c6]. You can use any combination as long as the row total equals 6. Easy peasy!

    <div class="row">
        <div class="c1">copy</div>
        <div class="c2">copy</div>
        <div class="c3">copy</div>
    </div>

###More about the 1000px grid
The concept of the 1000px grid is that using a round number, you can easily divide columns using easy math. Using this formula
we can easily deduct several column combinations using the base-width of 15%. You can get more details here:
http://elliotjaystocks.com/blog/a-better-photoshop-grid-for-responsive-web-design/
