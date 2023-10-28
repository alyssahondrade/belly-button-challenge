// Define the constants
// const start_colour = [245, 245, 220]; // beige
// const end_colour = [143, 188, 143]; // dark sea green
const start_colour = [245, 240, 232];
const end_colour = [128, 170, 124];
const gauge_centre = 0.5; // value for both x- and y-coordinates
const needle_length = 0.15;


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


//-------- FUNCTION TO CREATE THE GAUGE --------//
function create_gauge(id) {
    d3.json(samples_url).then(function(data) {
        
        // Import relevant JSON array
        var metadata = Object.values(data.metadata);

        // Find the maximum wfreq
        let wfreq_list = metadata.map((subject) => parseInt(subject.wfreq)); // convert to integer
        let wfreq_nums = wfreq_list.filter(element => element); // only pass non-null
        let max_wfreq = Math.max(...wfreq_nums); // spread operator to expand iterable

        // Generate the gradient array (beige -> dark sea green)
        const gradientArray = gradient(start_colour, end_colour, max_wfreq);

        // Create a function that will return the values OR labels for the gauge
        function gauge_setup(mode) {
            let gauge_values = []
            let gauge_labels = []
            
            for (let i=0; i<max_wfreq; i++) {
                gauge_values.push(50/max_wfreq); // Get the gauge values
                gauge_labels.push(`${i}-${i+1}`); // Get the gauge labels
            };

            // Add the value for the "transparent" half
            gauge_values.push(50);
            gauge_labels.push("");

            if (mode === "values") {
                return(gauge_values);
            }
            else if (mode === "labels") {
                return(gauge_labels);
            };
        };

        function needle_path(gauge_value) {
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
            let x = Math.round(x_val * 100)/100;
            let y = Math.round(y_val * 100)/100;

            // Define the default needle base coordinates (valid for 2-7 inclusive)
            let lx = gauge_centre - 0.005; // 0.495
            let ly = gauge_centre;
            let rx = gauge_centre + 0.005; // 0.505
            let ry = gauge_centre;
            
            // Calculate the needle base coordinates
            switch (gauge_value) {
                case 0:
                case 1:
                case 8:
                case 9:
                    lx = gauge_centre;
                    ly = gauge_centre - 0.01; // 0.49
                    rx = gauge_centre;
                    ry = gauge_centre + 0.01; // 0.51
                    break;
                case null: // Needle disappears if wfreq is "null"
                    x = gauge_centre;
                    y = gauge_centre;
            };

            return([x, y, lx, ly, rx, ry]);
        };

        // Use filter to find the correct subject id
        function find_id(subject) {
            return(subject.id === parseInt(id));
        };
        let subject_metadata = metadata.filter(find_id)[0];
        let needle_coords = needle_path(subject_metadata.wfreq);

        let gauge_data = [{
            type: "pie",
            values: gauge_setup("values"),
            text: gauge_setup("labels"),
            direction: "clockwise",
            textinfo: "text",
            textposition: "inside",
            marker: {colors: gradientArray},
            hole: 0.5,
            rotation: 90,
            showlegend: false,
            hoverinfo: "skip" // remove hovertext for the gauge
            }];
        
        let gauge_layout = {
            title: {text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week"},
            width: 720,
            height: 450,
            shapes: [{
                type: "path", // needle triangle
                path: `
                    M ${gauge_centre} ${gauge_centre}\
                    L ${needle_coords[0]} ${needle_coords[1]}\
                    L ${needle_coords[2]} ${needle_coords[3]}\
                    L ${needle_coords[4]} ${needle_coords[5]}\
                    L ${needle_coords[0]} ${needle_coords[1]}\
                    Z`,
                fillcolor: "maroon",
                line: {color: "maroon"}
            }, {
                type: "circle", // needle base
                xref: gauge_centre,
                yref: gauge_centre,
                fillcolor: "maroon",
                line: {color: "maroon"},
                x0: gauge_centre - 0.01, // 0.49
                y0: gauge_centre - 0.02, // 0.48
                x1: gauge_centre + 0.01, // 0.51
                y1: gauge_centre + 0.02  // 0.52
            }]
        };
        
        Plotly.newPlot("gauge", gauge_data, gauge_layout);
    });
};