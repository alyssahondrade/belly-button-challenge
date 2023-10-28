// Read the `samples.json` from the provided url
const samples_url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

//-------- FUNCTION TO CREATE THE PLOTS PER ID --------//
function create_plots(subject_id) {
    d3.json(samples_url).then(function(data) {
        
        // Import relevant JSON array
        var names = Object.values(data.names);
        var samples = Object.values(data.samples);

        //-------- PARSE THE VALUES --------//
        // Get the first 10 results for each sample_value and reverse the list
        let sample_values = samples.map((sample) => sample.sample_values);
        
        // Get the otu_ids
        let sample_otuids = samples.map((sample) => sample.otu_ids);

        // Get otu_ids with "OTU " prefixed to each one        
        let edited_otuids = samples.map(function(sample) {
            
            // Get the corresponding top 10 otu_ids
            let top_ids = sample.otu_ids;
    
            // Create a list to hold the transformed list
            let id_list = []
            let add_otu = top_ids.map((id) => id_list.push("OTU " + id));
    
            // Reverse the list to match the sample_values list, for plotting
            return id_list;
        });

        // Get the sample labels, reversed as above
        let sample_labels = samples.map((sample) => sample.otu_labels);

        // Get the index of the subject_id
        let subject_idx = names.indexOf(subject_id);

        //-------- CREATE THE BAR CHART --------//
        let x = [];
        let y = [];
        let name = [];
        
        let bar_data = [{
            x: sample_values[subject_idx].slice(0, 10).reverse(),
            y: edited_otuids[subject_idx].slice(0, 10).reverse(),
            type: "bar",
            orientation: "h",
            text: sample_labels[subject_idx].slice(0, 10).reverse(),
            hoverinfo: "text" // otu_labels as the hovertext
        }];
    
        let bar_layout = {
            title: "Top Samples",
            xaxis: {
                title: {text: "Number of Samples"}
            },
            yaxis: {
                title: {text: "IDs", standoff: 10},
                automargin: true,
                tickcolor: "white",
                ticklen: 10
            }
        };

        Plotly.newPlot("bar", bar_data, bar_layout);
        
        //-------- CREATE THE BUBBLE CHART --------//
        let bubble_data = [{
            x: sample_otuids[subject_idx],
            y: sample_values[subject_idx],
            mode: "markers",
            marker: {
                size: sample_values[subject_idx],
                color: sample_otuids[subject_idx],
                colorscale: "Earth"
            },
            text: sample_labels[subject_idx],
            hoverinfo: "text"
        }];

        let bubble_layout = {
            title: "Biodiversity Distribution",
            xaxis: {title: "OTU IDs"},
            yaxis: {
                title: {text: "Number of Samples", standoff: 10},
                automargin: true,
                tickcolor: "white",
                ticklen: 10
            }
        };
        
        Plotly.newPlot("bubble", bubble_data, bubble_layout);
    });
};

//-------- FUNCTION TO CREATE THE METADATA CHART --------//
function subject_metadata(id) {
    d3.json(samples_url).then(function(data) {

        // Import relevant JSON array
        var metadata = Object.values(data.metadata);
        
        // Use filter to find the correct subject id
        function find_id(subject) {
            // console.log(typeof(id), id, typeof(subject.id), subject.id);
            return(subject.id === parseInt(id));
        };
        
        // let subject_id = metadata.filter((subject) => subject.id === id);
        let subject_metadata = metadata.filter(find_id)[0];

        // Clear the metadata info box
        let metadata_box = d3.select("#sample-metadata");
        metadata_box.selectAll("p").remove();
        
        // Loop through subject_metadata to get each key-value pair
        for (let key in subject_metadata) {
            metadata_box.append("p").text(`${key}: ${subject_metadata[key]}`);
        };
    });
};

//-------- HELPER FUNCTION: GRADIENT ARRAY --------//
// Create a function that will create a gradient array given rgb values
function gradient(start_rgb, end_rgb, steps) {

    // Initialise array that will hold the final array
    let output_array = [];

    // Get the rgb values in array form
    for (let i=0; i<steps; i++) {
        let rgb_array = []
        
        for (let j=0; j<start_rgb.length; j++) {
            rgb_array.push(Math.round(start_rgb[j] + i*(end_rgb[j] - start_rgb[j])/steps));
        };

        // Convert the rgb array to this format: `rgb(r-val, g-val, b-val)`
        output_array.push(`rgb(${rgb_array})`);
    };

    // Add the transparent bottom half
    output_array.push("rgba(0, 0, 0, 0)");

    return(output_array);
};

//-------- FUNCTION TO UPDATE THE PLOTS --------//
// As per the "selDataset" onchange attribute
function optionChanged(id) {
    create_plots(id);
    subject_metadata(id);
    create_gauge(id);
};

//-------- FUNCTION TO CREATE WEBPAGE --------//
function init() {
    // Populate the dropdown with options
    d3.json(samples_url).then(function(data) {

        // Import relevant JSON array
        var names = Object.values(data.names);

        // Isolate the dropdown menu in the html
        let dropdown_menu = d3.select("#selDataset");

        // Use a for-loop to create a new option
        for (let i=0; i<names.length; i++) {
            let new_option = dropdown_menu.append("option");
            new_option.attr("value", names[i]);
            new_option.text(names[i]);
        };

        // Call the functions to populate the webpage
        create_plots(names[0]);
        subject_metadata(names[0]);
        create_gauge(names[0]);
    });
};

// Call the init() function
init();