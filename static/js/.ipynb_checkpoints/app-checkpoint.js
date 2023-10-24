// Read the `samples.json` from the provided url
const samples_url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

//-------- POPULATE THE DROPDOWN WITH OPTIONS --------//
d3.json(samples_url).then(function(data) {
    // Import relevant JSON array
    var names = Object.values(data.names);
    
    let dropdown_menu = d3.select("#selDataset");
    
    for (let i=0; i<names.length; i++) {
        let new_option = dropdown_menu.append("option");
        new_option.attr("value", names[i]);
        new_option.text(names[i]);
    };
});

//-------- FUNCTION TO CREATE THE PLOTS PER ID --------//
function get_data(subject_id) {
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
        console.log(subject_idx);

        //-------- CREATE THE BAR CHART --------//
        let bar_data = [{
            x: sample_values[subject_idx].slice(0, 10).reverse(),
            y: edited_otuids[subject_idx].slice(0, 10).reverse(),
            type: "bar",
            orientation: "h",
            name: sample_labels[subject_idx].slice(0, 10)
        }];
    
        let bar_layout = {
            title: `Subject "${names[subject_idx]}" Top 10 Samples`,
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

        Plotly.plot("bar", bar_data, bar_layout);

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
        
        Plotly.plot("bubble", bubble_data, bubble_layout);
    });
    console.log("THIS CODE JUST RAN");
};

//-------- FUNCTION TO CREATE THE METADATA CHART --------//
function subject_metadata(id) {
    d3.json(samples_url).then(function(data) {

        // Import relevant JSON array
        var metadata = Object.values(data.metadata);
        
        // let metadata_box = d3.select("#sample-metadata").text(id);

        // Loop through the array to find the correct id
        for (let i=0; i<metadata.length; i++) {
            subject = metadata[i]

            // Code block for when the match is found
            if (id == subject.id) {
                
                // Loop through each key in the dictionary
                for (let key in subject) {
                    
                    // Create a paragraph element for each dictionary row
                    let pair = d3.select("#sample-metadata").append("p").text(`${key}: ${subject[key]}`);
                };
            };            
        };
    });
};

// Dynamically update the plot when the option is changed
d3.selectAll("#selDataset").on("change", updatePlotly);

//-------- FUNCTION TO UPDATE THE PLOT --------//
function updatePlotly() {
    d3.json(samples_url).then(function(data) {
        // Import relevant JSON array
        var names = Object.values(data.names);

        let dropdown_menu = d3.select("#selDataset");

        console.log(this.onchange);
        // Add each subject id as an option
        for (let i=0; i<names.length; i++) {
            if (this.value === names[i]) {
                get_data(names[i]);
            };
        };
    });
};

function optionChanged(id) {
    get_data(id);
    subject_metadata(id);
};


//-------- FUNCTION TO CREATE WEBPAGE --------//
function init() {
    get_data("940");
    subject_metadata("940");
};

init();


// // Fetch the JSON data
// d3.json(samples_url).then(function(data) {
//     var names = Object.values(data.names);
//     var metadata = Object.values(data.metadata);
//     var samples = Object.values(data.samples);

//     //-------- CREATE THE HORIZONTAL BAR GRAPH --------//
//     // Get the first 10 results for each sample_value and reverse the list
//     let sample_values = samples.map((sample) => (sample.sample_values).slice(0,10).reverse());

//     // Get the otu_ids
//     let sample_otuids = samples.map(function(sample) {
        
//         // Get the corresponding top 10 otu_ids
//         let top_ids = sample.otu_ids.slice(0, 10);

//         // Create a list to hold the transformed list
//         let id_list = []
//         let add_otu = top_ids.map((id) => id_list.push("OTU" + id));

//         // Reverse the list to match the sample_values list, for plotting
//         return id_list.reverse();
//     });

//     // Get the sample labels, reversed as above
//     let sample_labels = samples.map((sample) => (sample.otu_labels).slice(0, 10));

//     let bar_trace = {
//         x: sample_values[0],
//         y: sample_otuids[0],
//         type: "bar",
//         orientation: "h",
//         name: sample_labels[0]
//     };

//     let bar_data = [bar_trace];

//     let layout = {
//         title: `Subject "${names[0]}" Samples`,
//         xaxis: {
//             title: {text: "Sample Values"}
//         },
//         yaxis: {
//             title: {text: "IDs", standoff: 10},
//             automargin: true,
//             tickcolor: "white",
//             ticklen: 10
//         }
//     };

//     // Create the plot
//     Plotly.plot("bar", bar_data, layout);

//     //-------- CREATE THE BUBBLE CHART --------//
//     let bubble_values = samples.map((sample) => (sample.sample_values))[0];
//     let bubble_ids = samples.map((sample) => (sample.otu_ids))[0];
//     let bubble_labels = samples.map((sample) => (sample.otu_labels))[0];
    
//     let bubble_trace = {
//         x: bubble_ids,
//         y: bubble_values,
//         mode: "markers",
//         marker: {
//             size: bubble_values,
//             color: bubble_ids
//         },
//         text: bubble_labels
//     };

//     let bubble_data = [bubble_trace];

//     Plotly.plot("bubble", bubble_data);

//     //-------- CREATE THE METADATA CHART --------//
//     function subject_metadata(id) {
//         // let metadata_box = d3.select("#sample-metadata").text(id);
//         for (let i=0; i<metadata.length; i++) {
//             subject = metadata[i]
//             if (id == subject.id) {
//                 for (let key in subject) {
//                     // Create a paragraph element for each dictionary row
//                     let pair = d3.select("#sample-metadata").append("p").text(`${key}: ${subject[key]}`);
//                 };
//             };            
//         };
//     };    
//     subject_metadata(940);
    
// });