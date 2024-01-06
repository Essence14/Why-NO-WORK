let coordinates = {}

$(document).ready(function () {
    get_coordinates();
    render_elements();
})

function get_coordinates() {
    let searchParams = new URLSearchParams(window.location.search)
    if (searchParams.has('source') && searchParams.has('destination')) {
        let source = searchParams.get('source')
        let destination = searchParams.get('destination')
        coordinates.source_lat = source.split(";")[0]
        coordinates.source_lon = source.split(";")[1]
        coordinates.destination_lat = destination.split(";")[0]
        coordinates.destination_lon = destination.split(";")[1]
        console.log(coordinates.source_lat, coordinates.source_lon, coordinates.destination_lat, coordinates.destination_lon)
    } else {
        alert("Coordinates not selected!")
        window.history.back();
    }
}

function render_elements() {
    $.ajax({
        url: `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates.source_lon}%2C${coordinates.source_lat}%3B${coordinates.destination_lon}%2C${coordinates.destination_lat}?alternatives=true&geometries=polyline&steps=true&access_token=pk.eyJ1IjoiYXBvb3J2ZWxvdXMiLCJhIjoiY2ttZnlyMDgzMzlwNTJ4a240cmEzcG0xNyJ9.-nSyL0Gy2nifDibXJg4fTA`,
        type: "get",
        success: function (response) {
            var images = {
                "turn_right": "ar_right.png",
                "turn_left": "ar_left.png",
                "turn_slightly_left": "ar_slight_left.png",
                "turn_slightly_right": "ar_slight_right.png",
                "continue forward": "ar_straight.png"
            }
            var steps = response.routes[0].legs[0].steps
            for (var i = 0; i < steps.length; i++) {
                var images
                var distance = steps[i].distance
                var instruction = steps[i].maneuver.instruction
                console.log(instruction)
                //<a-image name="${instruction}" src="./assets/${images[images]}" look-at="#step_${i - 1}"scale="7 7 7" id="step_${i}"positon="0 0 0" ></a-image>
                //<a-image name="${instruction}" src="./assets/ar_start.png" look-at="#step_${i + 1}"scale="7 7 7" id="step_${i}"positon="0 0 0" ></a-image>
                if (instruction.includes("Turn right")) {
                    images = "turn_right"
                }
                else if (instruction.includes("Turn left")) {
                    images = "turn_left"
                }
                if (i > 0) {
                    $("#scene_container").append(
                        `<a-entity gps-entity-place="latitude:${steps[i].maneuver.location[1]};longitude:${steps[i].maneuver.location[0]}">
                        <a-entity>
                        <a-text value="${instruction}(${distance}m)"height="30"></a-text>
                        </a-entity>

                    </a-entity>`)
                }
                else {
                    $("#scene_container").append(
                        `<a-entity gps-entity-place="latitude:${steps[i].maneuver.location[1]};longitude:${steps[i].maneuver.location[0]}">
                        
                        <a-entity>
                        <a-text value="${instruction}(${distance}m)" height="30"></a-text>
                        </a-entity>

                    </a-entity>`)
                }
            }
        }
    })
}
