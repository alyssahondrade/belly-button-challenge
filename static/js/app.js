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
        // console.log(subject_idx);

        //-------- CREATE THE BAR CHART --------//
        let x = [];
        let y = [];
        let name = [];
        
        let bar_data = [{
            x: sample_values[subject_idx].slice(0, 10).reverse(),
            y: edited_otuids[subject_idx].slice(0, 10).reverse(),
            type: "bar",
            orientation: "h",
            name: sample_labels[subject_idx].slice(0, 10)
        }];
    
        let bar_layout = {
            title: `Subject "${names[subject_idx]}" Top 10 Samples`, // NOT ALWAYS TOP 10
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
                color: sample_otuids[subject_idx]
            },
            text: sample_labels[subject_idx]
        }];

        let bubble_layout = {
            title: `Subject "${names[subject_idx]}" Biodiversity`,
            xaxis: {
                title: "OTU IDs"
            },
            yaxis: {
                title: {text: "Number of Samples"},
                automargin: true
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
        
        // let metadata_box = d3.select("#sample-metadata").text(id);


        // Use filter to find the correct subject id
        function find_id(subject) {
            // console.log(typeof(id), id, typeof(subject.id), subject.id);
            return(subject.id === parseInt(id));
        };
        
        // let subject_id = metadata.filter((subject) => subject.id === id);
        let subject_metadata = metadata.filter(find_id)[0];
        // console.log(subject_metadata);

        // Clear the metadata info box
        let metadata_box = d3.select("#sample-metadata");
        metadata_box.selectAll("p").remove();
        
        // Loop through subject_metadata to get each key-value pair
        for (let key in subject_metadata) {
            metadata_box.append("p").text(`${key}: ${subject_metadata[key]}`);
        };
    });
};

//-------- FUNCTION TO CREATE THE GAUGE --------//
function create_gauge(id) {
    // Populate the dropdown with options
    d3.json(samples_url).then(function(data) {
        
        // Import relevant JSON array
        var metadata = Object.values(data.metadata);

        // Find the maximum wfreq
        let wfreq_list = metadata.map((subject) => parseInt(subject.wfreq));
        // let wfreq_list = metadata.map((subject) => subject.wfreq);
        let wfreq_nums = wfreq_list.filter(element => element); // only passes non-null

        console.log(wfreq_list);
        console.log(wfreq_nums);

        for (let i=0; i<wfreq_nums.length; i++) {
            console.log(typeof(wfreq_nums[i]));
        };

        let max_wfreq = Math.max(...wfreq_nums);
        console.log(max_wfreq);

        // Function to generate a gradient array based on an initial and final color
        function generateGradientArray(startColor, endColor, steps) {
            let gradientArray = [];
            for (let i = 0; i < steps; i++) {
                let r = Math.round(startColor[0] + i * (endColor[0] - startColor[0]) / steps);
                let g = Math.round(startColor[1] + i * (endColor[1] - startColor[1]) / steps);
                let b = Math.round(startColor[2] + i * (endColor[2] - startColor[2]) / steps);
                gradientArray.push(`rgb(${r},${g},${b})`);
            }
            return gradientArray;
        }
        
        // Define the initial and final colors
        const startColor = [255, 0, 0]; // Red
        const endColor = [0, 0, 255]; // Blue
        const steps = max_wfreq; // Number of steps in the gradient
        
        // Generate the gradient array
        const gradientArray = generateGradientArray(startColor, endColor, steps);
        
        // Print the gradient array
        console.log(gradientArray);

        let steps_array = []
        for (let i=0; i<max_wfreq; i++) {
            let new_range = {range: [i, i+1], color: gradientArray[i]};
            steps_array.push(new_range);
        };
        console.log(steps_array);
        
        // Use filter to find the correct subject id
        function find_id(subject) {
            return(subject.id === parseInt(id));
        };

        let subject_metadata = metadata.filter(find_id)[0];
        console.log(subject_metadata);

        var gauge_data = [{
    		// domain: { x: [0, max_wfreq], y: [0, max_wfreq] },
    		value: subject_metadata.wfreq,
    		title: {
                text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week"
            },
    		type: "indicator",
    		mode: "gauge+number",
            gauge: {
                shape: "angular",
                axis: {range: [0, max_wfreq]},
                // steps: [{range: [0, 1], color: "blue"}]
                steps: steps_array
                }
    	}];
    
        // var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
        Plotly.newPlot("gauge", gauge_data);
    });
};


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

init();