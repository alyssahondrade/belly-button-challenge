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
        let wfreq_list = metadata.map((subject) => parseInt(subject.wfreq)); // convert to integer
        let wfreq_nums = wfreq_list.filter(element => element); // only pass non-null
        let max_wfreq = Math.max(...wfreq_nums); // spread operator to expand iterable

        // Create a function that will create a gradient array given rgb values
        function gradient(start_rgb, end_rgb, steps) {
            let output_array = [];
            
            for (let i=0; i<steps; i++) {
                let rgb_array = []

                // Get the rgb values in array form
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

        // Generate the gradient array (beige -> dark sea green)
        const start_colour = [245,245,220]; // beige
        const end_colour = [143,188,143]; // dark sea green
        const gradientArray = gradient(start_colour, end_colour, max_wfreq);

        // Create the steps array
        let steps_array = []
        for (let i=0; i<max_wfreq; i++) {
            let new_range = {range: [i, i+1], color: gradientArray[i]};
            steps_array.push(new_range);
        };
        
        // Use filter to find the correct subject id
        function find_id(subject) {
            return(subject.id === parseInt(id));
        };

        let subject_metadata = metadata.filter(find_id)[0];
        console.log(subject_metadata);

        function gauge_setup(mode) {
            let gauge_values = []
            let gauge_labels = []
            
            for (let i=0; i<max_wfreq; i++) {
                // Get the gauge values
                gauge_values.push(100/max_wfreq);

                // Get the gauge labels
                gauge_labels.push(`${i}-${i+1}`);
            };

            // Add the value for the "transparent" half
            gauge_values.push(100);
            gauge_labels.push("");

            if (mode === "values") {
                return(gauge_values);
            }
            else if (mode === "labels") {
                return(gauge_labels);
            };
        };

        const gauge_centre = 0.5;

        function needle_path(gauge_value) {
            gauge_value = 9;
            // Define the needle length as a constant
            const needle_length = 0.15;

            // Calculate the angle of one sector (in degrees)
            let one_sector = 360 / (2 * max_wfreq);

            // Calculate the total angle given the gauge_value
            let sector_degrees = gauge_value * one_sector;

            // Convert the total angle to radians
            let needle_angle = sector_degrees * Math.PI / 180;

            // Get the x-value, accounting for angles from 0-180 degrees
            let x_val = gauge_centre - needle_length * Math.cos(needle_angle);

            // Get the y-value, accounting for the "transparent" pie half    
            let y_val = gauge_centre + 2 * needle_length * Math.sin(needle_angle);

            // Round the values to 2 decimal points
            let x = Math.round(x_val*100)/100;
            let y = Math.round(y_val*100)/100;

            let lx = 0;
            let ly = 0;
            let rx = 0;
            let ry = 0;

            // let lx = 0.5;
            // let ly = 0.49;
            // let rx = 0.5;
            // let ry = 0.51;
            
            // Calculate the needle base left and right
            // if (gauge_value === 0 | gauge_value === 9) {
                // lx = 0.50;
                // ly = 0.48;
                // rx = 0.50;
                // ry = 0.52;
            // }
            // else if (gauge_value === 1) {
            //     lx = 0.
            // }
            switch (gauge_value) {
                case 0:
                case 1:
                case 8:
                case 9:
                    lx = 0.50;
                    ly = 0.49;
                    rx = 0.50;
                    ry = 0.51;
                    break;
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                    lx = 0.495;
                    ly = 0.50;
                    rx = 0.505;
                    ry = 0.50;
                    break;
            };

            return([x, y, lx, ly, rx, ry]);
        };
        
        let needle_coords = needle_path(subject_metadata.wfreq);

        let gauge_data = [
            {
                type: "pie",
                values: gauge_setup("values"),
                text: gauge_setup("labels"),
                direction: "clockwise",
                textinfo: "text",
                textposition: "inside",
                marker: {colors: gradientArray},
                labels: gauge_setup("labels"),
                hole: 0.5,
                rotation: 90,
                showlegend: false
            }
        ];
        
        let gauge_layout = {
            title: {text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week"},
            width: 720,
            height: 450,
            // autosize: true,
            shapes: [
            {
                type: "path",
                path: `M ${gauge_centre} ${gauge_centre} L ${needle_coords[0]} ${needle_coords[1]} L ${needle_coords[2]} ${needle_coords[3]} L ${needle_coords[4]} ${needle_coords[5]} L ${needle_coords[0]} ${needle_coords[1]} Z`,
                fillcolor: "maroon",
                line: {color: "maroon"}
            },
            {
                type: "circle",
                xref: gauge_centre,
                yref: gauge_centre,
                fillcolor: "maroon",
                line: {color: "maroon"},
                x0: gauge_centre-0.01, // 0.49
                y0: gauge_centre-0.02, // 0.48
                x1: gauge_centre+0.01, // 0.51
                y1: gauge_centre+0.02  // 0.52
            }]
        };
        
        Plotly.newPlot("gauge", gauge_data, gauge_layout);
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