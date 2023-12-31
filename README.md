# belly-button-challenge
Module 14 Challenge - UWA/edX Data Analytics Bootcamp

Github repository at: [https://github.com/alyssahondrade/belly-button-challenge.git](https://github.com/alyssahondrade/belly-button-challenge.git)

Dashboard deployed at: [https://alyssahondrade.github.io/belly-button-challenge/](https://alyssahondrade.github.io/belly-button-challenge/)


## Table of Contents
1. [Introduction](https://github.com/alyssahondrade/belly-button-challenge/tree/main#introduction)
    1. [Goal](https://github.com/alyssahondrade/belly-button-challenge/tree/main#goal)
    2. [Repository Structure](https://github.com/alyssahondrade/belly-button-challenge/tree/main#repository-structure)
    3. [Dataset](https://github.com/alyssahondrade/belly-button-challenge/tree/main#dataset)
2. [Approach](https://github.com/alyssahondrade/belly-button-challenge/tree/main#approach)
    1. [Structure](https://github.com/alyssahondrade/belly-button-challenge/tree/main#structure)
    2. [plots.js Script](https://github.com/alyssahondrade/belly-button-challenge/tree/main#plotsjs-script)
    3. [bonus.js Script](https://github.com/alyssahondrade/belly-button-challenge/tree/main#bonusjs-script)
3. [References](https://github.com/alyssahondrade/belly-button-challenge/tree/main#references)


## Introduction
### Goal
Build an interactive dashboard to explore the Belly Button Biodiversity dataset, to display:
- A bar chart of a subject's top 10 samples.
- A bubble chart of all microbial species (called operational taxonomic units, or OTUs) for a subject.
- The subject's demographic information.
- A gauge indicator for their washing frequency.

### Repository Structure
- The root directory contains `index.html`.
- The `images` directory contains the `coordinates.png`.
- The `static` directory contains the following subdirectories:
    - `data` contains `samples.json`, for reference only.
    - `js` contains the scripts: `plots.js` and `bonus.js`.

### Dataset
Belly Button Biodiversity: [http://robdunnlab.com/projects/belly-button-biodiversity/](http://robdunnlab.com/projects/belly-button-biodiversity/)


## Approach
### Structure
[`plots.js`](https://github.com/alyssahondrade/belly-button-challenge/blob/main/static/js/plots.js) is structured as follows:
1. `create_plots()` - creates the bar chart and bubble plot per subject ID.
2. `subject_metadata()` - creates the "demographic info" box, populated with the metadata.
3. `optionChanged()` - allows the plots to be updated as the subject ID is changed.
4. `init()` - populates the dropdown options and creates the initial plots.

[`bonus.js`](https://github.com/alyssahondrade/belly-button-challenge/blob/main/static/js/bonus.js) is structured as follows:
1. `gradient()` - creates an array of RGB values given a start colour, end colour, and the number of steps.
2. `create_gauge()` - creates the gauge chart to plot the weekly washing frequency of the individual.

### `plots.js` Script
1. `create_plots()`
    - Parse the values generically. This way the parsed results can be used for both the bar chart and the bubble plot, adhering to DRY principles.
    - Create the bar chart:
        - For the `x`, `y`, and `text` values, use `slice(0, 10).reverse()` to get the top 10 samples in the correct order.
        - To get a horizontal chart, use `type: "bar"` and `orientation: "h"`.
        - To have only the `otu_labels` as hovertext, use `hoverinfo: "text"`.
        - Use `Plotly.newPlot()` instead of `Plotly.plot()`, otherwise, this will add a new trace every time a new subject ID is chosen.
    - Create the bubble chart:
        - Use the generically parsed values for `x`, `y` and `marker` values.
        - To match the given example, use `colorscale: "Earth"` as a marker attribute.

2. `subject_metadata()`
    - Create a filter function to find the correct subject ID.
    - Get the subject metadata using the filter function.
    - Select the `#sample-metadata` object which refers to the "demographic info" box.
    - Use `remove()` with `selectAll()` to clear the box.
    - Using a for-loop, append the metadata key-value pair as a paragraph object.

3. `optionChanged()`
    - This function is predefined as per the `selDataset`'s `onchange` attribute in the html file.
    - The function calls the `create_plots()` and `subject_metadata()` function to update the plots when a new subject ID is chosen in the dropdown.
    - The `create_gauge()` function is also called from `bonus.js` to create the indicator.

4. `init()`
    - The dropdown menu is populated with options using a for-loop.
    - The funcions as per `optionChanged()` are called for the first subject ID to initialise the webpage.
    - This function is called at the end of the script to create the initial plots.

### `bonus.js` Script
1. The constants are defined at the top of the script.
    - `start_colour` and `end_colour` are derived by using the Digital Colour Meter.
    - `gauge_centre` and `needle_length` are derived by inspection of the gauge canvas.

2. `gradient()`
    - Initialise the array that will hold the return value.
    - The outer for-loop increments based on the `steps` argument.
    - The inner for-loop increments over the `start_rgb` argument.
    - `rgba(0, 0, 0, 0)` is pushed to the end of the return array for the transparent half of the indicator.

3. `create_gauge()`
    - Calculate the maximum `wfreq` value.
        - Get all the `wfreq` values using `map()`.
        - Use `filter()` to return only non-null values, otherwise the next step will fail.
        - Use the spread operator with `Math.max()` to get the correct maximum value.
    - Given the `max_wfreq` value, create the gradient array using `gradient()`.
    - Create a `gauge_setup()` function that will return the values or labels for the gauge.
        - The gauge values can be calculated by pushing `50/max_wfreq` over an array the length of `max_wfreq`, and returned using an if-statement given `mode === "values"`.
        - The gauge labels can be calculated by pushing `${i}-${i+1}` as above, and returned using an if-statement given `mode === "labels"`.
        - To account for the transparent half of the gauge:
            - `50` is pushed to the end of `gauge_values`
            - `""` is pushed to the end of `gauge_labels`
        - This function uses `modes` to adhere to DRY principles.
    - Create a `needle_path()` function that will get the coordinates to draw the needle.
        - The needle direction, defined as `x_val` and `y_val` are derived as follows:
            - Calculate the angle for one sector.
            - Calculate the total angle given the `gauge_value` provided.
            - Convert the total angle to radians.
            - The image below demonstrates the calculations used to define the `x_val` and `y_val`.
        - The needle base coordinates were derived visually, centred about the `gauge_centre`.
            - A switch statement is used to account for 3 "states":
                - State 1: Coordinates valid for `gauge_value` from 2 to 7.
                - State 2: Coordinates valid for other numerical `gauge_value`.
                - State 3: Null value for `wfreq` (remove the needle if null).

|![coordinates.png](https://github.com/alyssahondrade/belly-button-challenge/blob/main/images/coordinates.png)|
|:---:|
|Coordinate Calculation|
> Note: Since the circle is drawn clockwise, cosine is `(+)` in Q2 and `(-)` in Q1.

4. Create the gauge plot:
    - A filter function is used to find the correct subject ID, and the result passed to the `needle_path()` function.
    - The `width` and `height` must be defined in the layout to ensure the needle is displayed consistently regardless of the size of the canvas.
    - The `path` derivation is described in the table below.

|Path Component|Description|
|:---:|:---:|
|`M ${gauge_centre} ${gauge_centre}`| Define the start position |
|`L ${needle_coords[0]} ${needle_coords[1]}`| Line to the needle point |
|`L ${needle_coords[2]} ${needle_coords[3]}`| Line to the left side |
|`L ${needle_coords[4]} ${needle_coords[5]}`| Line across to the right |
|`L ${needle_coords[0]} ${needle_coords[1]} Z`| Line back to the needle point and close the path |


## References
The instructor provided assistance during office hours about using a pie chart and scatter plot instead of an indicator for the gauge plot, due to the scaling issues when using annotation to label each gauge sector.

- [1] Iterate over a Dictionary [https://buzzcoder.gitbooks.io/codecraft-javascript/content/object/iterate-over-a-dictionary.html](https://buzzcoder.gitbooks.io/codecraft-javascript/content/object/iterate-over-a-dictionary.html)

- [2] D3 Removing Elements [https://stackoverflow.com/questions/16260285/d3-removing-elements](https://stackoverflow.com/questions/16260285/d3-removing-elements)

- [3] Math.max() [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/max#](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/max#)

- [4] Remove Null Values from Array in JavaScript [https://herewecode.io/blog/remove-null-values-from-array-javascript/](https://herewecode.io/blog/remove-null-values-from-array-javascript/)

- [5] JavaScript Operators Reference [https://www.w3schools.com/jsref/jsref_operators.asp](https://www.w3schools.com/jsref/jsref_operators.asp)

- [6] How to make background transparent with javascript [https://www.sitepoint.com/community/t/how-to-make-background-transparent-with-javascript/8129](https://www.sitepoint.com/community/t/how-to-make-background-transparent-with-javascript/8129)

- [7] Math.sin() [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sin](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sin)

- [8] JavaScript round a number to 2 decimal places (with examples) [https://codedamn.com/news/javascript/javascript-round-a-number-to-2-decimal-places-with-examples#](https://codedamn.com/news/javascript/javascript-round-a-number-to-2-decimal-places-with-examples#)

- [9] Layout.annotations in JavaScript [https://plotly.com/javascript/reference/layout/annotations/#layout-annotations](https://plotly.com/javascript/reference/layout/annotations/#layout-annotations)

- [10] Creative Interactive Charts Using Plotly.js - Pie and Gauge Charts [https://code.tutsplus.com/create-interactive-charts-using-plotlyjs-pie-and-gauge-charts--cms-29216t](https://code.tutsplus.com/create-interactive-charts-using-plotlyjs-pie-and-gauge-charts--cms-29216t)

- [11] Plot Sizing Problems [https://community.plotly.com/t/plot-sizing-problems/1620/19](https://community.plotly.com/t/plot-sizing-problems/1620/19)

- [12] Initial SVG height before window resize [https://community.plotly.com/t/initial-svg-height-before-window-resize/3673/4](https://community.plotly.com/t/initial-svg-height-before-window-resize/3673/4)

- [13] Disable hover information on trace, plotly [https://stackoverflow.com/questions/32319619/disable-hover-information-on-trace-plotly](https://stackoverflow.com/questions/32319619/disable-hover-information-on-trace-plotly)

- [14] Colorscales in JavaScript [https://plotly.com/javascript/colorscales/](https://plotly.com/javascript/colorscales/)

- [15] Deploying to GitHub Pages [https://www.codecademy.com/article/f1-u3-github-pages#](https://www.codecademy.com/article/f1-u3-github-pages#)

- [16] Bubble Charts in JavaScript [https://plotly.com/javascript/bubble-charts/](https://plotly.com/javascript/bubble-charts/)

- [17] Pie Charts in JavaScript [https://plotly.com/javascript/pie-charts/](https://plotly.com/javascript/pie-charts/)

- [18] Plotly.js gauge/pie chart data order [https://community.plotly.com/t/plotly-js-gauge-pie-chart-data-order/8686](https://community.plotly.com/t/plotly-js-gauge-pie-chart-data-order/8686)

- [19] SVG path [https://www.w3schools.com/graphics/svg_path.asp](https://www.w3schools.com/graphics/svg_path.asp)

- [20] Shapes in JavaScript [https://plotly.com/javascript/shapes/](https://plotly.com/javascript/shapes/)
