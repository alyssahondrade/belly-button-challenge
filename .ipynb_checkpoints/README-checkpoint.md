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
    2. [plots.js Script](https://github.com/alyssahondrade/belly-button-challenge/tree/main#plots-script)
    3. [bonus.js Script](https://github.com/alyssahondrade/belly-button-challenge#bonus-section)
3. [References](https://github.com/alyssahondrade/belly-button-challenge/tree/main#references)

## Introduction
### Goal


### Repository Structure


### Dataset


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
1. `create_plots()` function
    - Parse the values generically. This way the parsed results can be used for both bar chart and the bubble plot, adhering to DRY principles.
    - Create the bar chart:
        - For the `x`, `y`, and `text` values, use `slice(0, 10).reverse()` to get the top 10 samples in the correct order.
        - To get a horizontal chart, use `type: "bar"` and `orientation: "h"`.
        - To have only the `otu_labels` as hovertext, use `hoverinfo: "text"`.
        - Use `Plotly.newPlot()` instead of `Plotly.plot()`, otherwise, this will add a new trace every time a new subject ID is chosen.
    - Create the bubble chart:
        - Use the generically parsed values for `x`, `y` and `marker` values as per the instructions.
        - To match the given example, use `colorscale: "Earth"` as a marker attribute.

2. `subject_metadata()` function
    - 

3. 

### `bonus.js` Script


## References