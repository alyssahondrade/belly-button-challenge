// Read the `samples.json` from the provided url
const samples_url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch the JSON data
d3.json(samples_url).then(function(data) {
    var names = Object.values(data.names);
    var metadata = Object.values(data.metadata);
    var samples = Object.values(data.samples);

    let sample_values = samples.map((sample) => (sample.sample_values).slice(0,10));
    
    let sample_otuids = samples.map(function(sample) {
        // Get the corresponding top 10 otu_ids
        let top_ids = sample.otu_ids.slice(0, 10);

        // Append "OTU" to each id
        let id_list = []
        let add_otu = top_ids.map(function(id) {
            id_list.push(`OTU ${id}`);
        });
        console.log(id_list);
        return id_list;
    });
    let sample_labels = samples.map((sample) => (sample.otu_labels).slice(0, 10));

    let trace = {
        x: sample_values[0],
        y: sample_otuids[0],
        type: "bar",
        orientation: "h",
        name: sample_labels[0]
    };

    let trace_data = [trace];

    Plotly.plot("bar", trace_data);
    // let indiv_ids = first_indiv.map((sample) => (sample.otu_ids));

    // // Get the data for the first individual
    // let indiv_sample = samples[0]['sample_values'];
    // let indiv_ids = samples[0]['otu_ids'];
    // let indiv_labels = samples[0]['otu_labels'];

    // Create the horizontal bar graph
    

    // Sort the samples in descending order
    // let descending_samples = samples.sort((first, second) => second.samples - first.samples);
    // console.log(descending_samples);
    // for (let i=0; i<samples.length; i++) {
    //     let row = samples[i];
    //     let sample_values = row['sample_values'];
    //     let otu_ids = row['otu_ids'];

    //     console.log(sample_values, otu_ids);
        
        // Sort the samples in descending order
        // let descending_samples = row.sort(
        //     (first, second) => second.row - first.row);
        // console.log(descending_samples);

    // };
});



// console.log(metadata);
// // Sort the sample_values in descending order
// let descending_samples = data.sort(
//     (first, second) => second.sample_values - first.sample_values
//     );

// console.log(descending_samples);