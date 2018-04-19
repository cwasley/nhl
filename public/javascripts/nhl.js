angular.module('nhl', [])
    .controller('NHLBracketController', ['$scope', '$http', function($scope, $http) {

        const states = ['rules', 'west1', 'west2', 'west3', 'west4', 'east1', 'east2', 'east3', 'east4', 'conf_1', 'west5', 'west6', 'east5', 'east6', 'conf_2', 'both1', 'both2', 'conf_3', 'both3', 'conf_4'];

        $('body').bootstrapMaterialDesign();
        $scope.round = 1;
        $scope.state = "west1";
        $scope.topComplete = false;
        $scope.bottomComplete = false;

        $scope.results = {};
        $scope.results.round1 = [];
        $scope.results.round2 = [];
        $scope.results.round3 = [];
        $scope.results.finals = [];
        $scope.teamBackups = [];

        // Get team data
        $http.get('/data').then(function(res) {
            $scope.teams = Object.values(res.data.data);
            for (var i = 0; i < $scope.teams.length; i++) {
                $scope.teams[i].alive = true;
            }
            console.log('');
        });


        $(function() {
            addClickListeners();
            setSliders();
            $('body').bootstrapMaterialDesign();
        });

        function addClickListeners() {
            $("button").click(function() {

                // Styling: change button classes to show that the user has selected a specific one
                var roundGroup = this.parentElement.parentElement;
                var pos = this.name, otherPos;
                if (pos == 'first') {
                    otherPos = 'second';
                } else {
                    otherPos = 'first';
                }
                // Set clicked button to display the team color and the other to revert to btn-secondary default
                $("button[name='" + pos + "']").css('background-color', $scope.teams[this.id.replace('team', '')].color);
                $("button[name='" + otherPos + "']").css('background-color', '#6c757d');

                // Set the winner and loser in both attributes
                $("#" + roundGroup.id + "winner").attr('value', $(this).val());
                $("#" + roundGroup.id + "loser").attr('value', $(this).siblings('button')[0].value);

                // Determine if the user has input a value for both bracket entries
                if (roundGroup.classList[1].substring(0,3) == "top") {
                    $scope.topComplete = $scope.bottomComplete = true;
                } else if (roundGroup.classList[1].substring(0,3) == "bot") {
                    $scope.topComplete = $scope.bottomComplete = true;
                } else if (roundGroup.classList[1].substring(0,3) == "fin") {
                    if ($(this).val() == "San Jose") {
                        alert("Are you sure you about the sharks winning here? This is probably not a wise choice");
                    }
                    $scope.topComplete = $scope.bottomComplete = true;
                }
                if ($scope.topComplete && $scope.bottomComplete) {
                    $('.buttontooltip').attr('style', '');
                }
            });
        }

        function setSliders() {

            // Slider for number of games
            $("input.slider").slider({
                ticks: [4,5,6,7],
                ticks_labels: [4,5,6,7],
                step: 1,
                value: 4,
                tooltip: 'hide'
            });

            // Slider for number of goals in final
            $("input.final-slider").slider({
                min: 0,
                max: 50,
                step: 1,
                value: 10
            });

            // Watches the slider to see if it needs to update the span next to it
            $("input.final-slider").on("slide", function(e) {
                $("#finalsGoals").text(e.value);
            });
        }

        $scope.next = function() {

            $('.buttontooltip').tooltip('enable');
            $('.buttontooltip').tooltip('hide');

            var currState = $scope.state;
            var nextState = states[states.indexOf($scope.state) + 1];

            // If we are going to a interstitial page
            if (nextState.substr(0, 4) === "conf") {
                $('.buttontooltip').attr('style', '');
            } else {
                $('.buttontooltip').attr('style', 'opacity: 0.4;');
            }

            // Coming from a confirmation page; we want to up the round count & not add anything to results
            // Also filter teams by the teams that are still alive & sort by home v away alg
            if (currState.substr(0, 4) === "conf") {

                $scope.round++;
                $('.buttontooltip').attr('style', 'opacity: 0.4;');
                var backup = angular.copy($scope.teams);
                $scope.teamBackups.push(backup);

                // Filter teams by those that are still in the running
                $scope.teams = $scope.teams.filter(function(a) {
                    return a.alive;
                });

                // Sort teams (in groups of 2) by their points (optionally ROW for a tie breaker)
                for (var i = 0; i < $scope.teams.length; i+=2) {
                    var firstTeam = $scope.teams[i];
                    var secondTeam = $scope.teams[i+1];

                    // Second team has more points so it becomes the home team
                    if (firstTeam.pts < secondTeam.pts) {
                        $scope.teams[i+1] = firstTeam;
                        $scope.teams[i] = secondTeam;
                    } else if (firstTeam.pts == secondTeam.pts) {

                        // sort by row instead
                        if (firstTeam.row < secondTeam.row) {
                            $scope.teams[i+1] = firstTeam;
                            $scope.teams[i] = secondTeam;
                        }
                    }
                }

                // TODO we now want to sort by either PTS or ROW
            } else if ($scope.topComplete && $scope.bottomComplete) {

                if ($('#r4i0goals').val() == '') {
                    $('.buttontooltip').tooltip('show');
                    return;
                }
                // We know we need to push our results into their respective arrays
                var match1 = {}, match2 = {};

                // Grab all user data from their inputs
                var winners = $("input[id$='winner']");
                var losers = $("input[id$='loser']");
                var games = $("input[id$='games']");
                var goals = $("input[id$='goals']");

                // TODO combine logic from the if into one if/else for rounds 1,2,3 v. finals
                if ($scope.round === 1) {

                    // grab the winners and losers from each matchup, and update teams if they lost
                    for (var i = 0; i < $scope.teams.length; i++) {
                        var team = $scope.teams[i];
                        if (team.city === winners[0].value) {
                            match1.winner = team.city;
                        } else if (team.city === losers[0].value) {
                            team.alive = false;
                            match1.loser = team.city;
                        }
                    }
                    match1.games = games[0].value;

                    // Push all four teams to the round 1 array so we know what happened
                    $scope.results.round1.push(match1);

                } else if ($scope.round === 2) {

                    // grab the winners and losers from each matchup, and update teams if they lost
                    for (var i = 0; i < $scope.teams.length; i++) {
                        var team = $scope.teams[i];
                        if (team.city === winners[0].value) {
                            match1.winner = team.city;
                        } else if (team.city === losers[0].value) {
                            team.alive = false;
                            match1.loser = team.city;
                        }
                    }
                    match1.games = games[0].value;

                    // TODO this is probably the easiest thing to extract so we keep teh same for-loop logic above
                    // Push all four teams to the round 1 array so we know what happened
                    $scope.results.round2.push(match1);

                } else if ($scope.round === 3) {

                    // grab the winners and losers from each matchup, and update teams if they lost
                    for (var i = 0; i < $scope.teams.length; i++) {
                        var team = $scope.teams[i];
                        if (team.city === winners[0].value) {
                            match1.winner = team.city;
                        } else if (team.city === losers[0].value) {
                            team.alive = false;
                            match1.loser = team.city;
                        }
                    }
                    match1.games = games[0].value;

                    // TODO this is probably the easiest thing to extract so we keep the same for-loop logic above
                    // Push all four teams to the round 1 array so we know what happened
                    $scope.results.round3.push(match1);

                } else if ($scope.round === 4) {

                    // Only match
                    for (var i = 0; i < $scope.teams.length; i++) {
                        var team = $scope.teams[i];
                        if (team.city === winners[0].value) {
                            match1.winner = team.city;
                        } else if (team.city === losers[0].value) {
                            team.alive = false;
                            match1.loser = team.city;
                        }
                    }
                    match1.games = games[0].value;
                    match1.goals = goals[0].value;

                    // Push finals results
                    $scope.results.finals.push(match1);
                }
            } else {

                // Show a tooltip letting the user know they need to input all info to proceed
                $('.buttontooltip').tooltip('show');
                return;
            }
            $('.buttontooltip').tooltip('hide');
            $('.buttontooltip').tooltip('disable');
            $scope.topComplete = $scope.bottomComplete = false;
            $scope.state = nextState;

            setTimeout(function() {
                addClickListeners();
                setSliders();
            }, 1);
        };

        $scope.back = function() {

            var backState = states[states.indexOf($scope.state) - 1];
            if (backState == 'rules') {
                window.location = '/rules';
                return;
            }
            // TODO check if we need to change opacity of next button and/or tooltip
            if (backState.substr(0, 4) === "conf") {
                $scope.teams = $scope.teamBackups.pop();
                $scope.round--;
            } else {
                var result1, result2;
                if ($scope.round == 1) {
                    result1 = $scope.results.round1.pop();

                } else if ($scope.round == 2) {
                    result1 = $scope.results.round2.pop();
                } else if ($scope.round == 3) {
                    result1 = $scope.results.round3.pop();
                } else {
                    result1 = $scope.results.finals.pop();
                }
                for (var i = 0; i < $scope.teams.length; i++) {
                    var team = $scope.teams[i];
                    if (team.city === result1.loser) {
                        team.alive = true;
                    }
                }
                if (backState == 'rules') {
                    window.location = '/rules';
                }
            }
            $scope.state = backState;
            setTimeout(function() {
                addClickListeners();
                setSliders();
            }, 1);
            $scope.topComplete = $scope.bottomComplete = false;
        };

        $scope.submit = function() {

            if ($('#loginName').val() == '' || $('#loginEmail').val() == '') {
                $('.buttontooltip').tooltip('show');
            } else {
                $('.buttontooltip').tooltip('hide');
                var data = {
                    predictions: JSON.stringify($scope.results),
                    name: $('#loginName').val(),
                    email: $('#loginEmail').val()
                };
                $.ajax({
                    type: 'POST',
                    url: '/submit',
                    data: data,
                    dataType: 'json',
                    success: function (data) {
                        window.location = "/confirmation";
                    }
                });
            }
        }
    }])
    .controller('ListController', ['$scope', '$http', function($scope, $http) {

        $('body').bootstrapMaterialDesign();
        $scope.teams = teams;
        $scope.brackets = brackets;
        $scope.predictions = predictions;
        $scope.games = games;

        $scope.nodeDataArray = [];
        $(function() {

            $('.tip').tooltip({
                placement: "top"
            });
            for (var i = 0; i < $scope.predictions.length; i++) {


                $scope.updateBracket($scope.predictions[i], i)
            }
        });

        $scope.updateBracket = function(predictions, index) {

            var predictionsCopy = angular.copy(predictions);

            for (var i = 0; i < predictionsCopy.length; i++) {
                var prediction = predictionsCopy[i];

                // Original Picks
                if ($scope.games[i].next_game_id && predictionsCopy[$scope.games[i].next_game_id - 1].winner_id !== prediction.winner_id) {
                    prediction.color = 'gray';
                    for (var j = i; j < predictionsCopy.length; j++) {
                        if (predictionsCopy[j].winner_id === predictionsCopy[i].loser_id) {
                            predictionsCopy[j].color = 'gray';
                        }
                    }

                    // Removing displaying games for those that are lost
                }

                // Check for actual games & propogate losses forward
                for (var j = 0; j < $scope.games.length; j++) {
                    if ($scope.games[j].winner) {
                        if (prediction.winner_id === $scope.games[j].team1_id || prediction.winner_id === $scope.games[j].team2_id) {
                            if (prediction.winner_id !== $scope.games[j].winner) {
                                prediction.color = 'gray';
                            }
                        }
                    }
                }


                // Updating to include actual series results

                // if (nextGame && nextGame.winner && nextGame.winner !== prediction.winner_id) {
                //     predictionsCopy[i].color = 'gray';
                //     for (var j = i; j < predictionsCopy.length; j++) {
                //         if (predictionsCopy[j].winner_id === predictionsCopy[i].winner_id) {
                //             predictionsCopy[j].color = 'gray';
                //
                //         }
                //     }
                // }
            }

            var nodeData = calculateBracket(predictionsCopy);
            generateBracket(nodeData, index);
        };

        function computeTextRotation(d) {
            var angle = (d.x0 + d.x1) / Math.PI * 90;

            // Avoid upside-down labels
            return (angle < 100 || angle > 260) ? angle : angle + 180;  // labels as rims
            //return (angle < 180) ? angle - 90 : angle + 90;  // labels as spokes
        }
        function calculateBracket(bracket) {

            var nodeData = {
                "name": bracket[14].winner_id, "games": 0, "goals": bracket[14].num_goals,"color": bracket[14].color, "children": [{
                    "name": bracket[13].winner_id, "color": bracket[13].color, "games": bracket[14].num_games, "children": [{
                        "name": bracket[10].winner_id, "color": bracket[10].color, "games": bracket[13].num_games, "children": [{
                            "name": bracket[4].winner_id, "color": bracket[4].color, "games": bracket[10].num_games, "children": [
                                { "name": "TBL", "color": ($scope.games[4].winner === null || $scope.games[4].winner === bracket[4].winner_id) && bracket[4].winner_id === 'TBL' ? "#00205B" : 'gray', "games": bracket[4].winner_id === 'TBL' ? bracket[4].num_games : 0, "size": 5},
                                { "name": "NJD", "color": ($scope.games[4].winner === null || $scope.games[4].winner === bracket[4].winner_id) && bracket[4].winner_id === 'NJD' ? "#C8102E" : 'gray', "games": bracket[4].winner_id === 'NJD' ? bracket[4].num_games : 0, "size": 5}]
                        },
                            {
                                "name": bracket[5].winner_id, "color": bracket[5].color, "games": bracket[10].num_games, "children": [
                                    { "name": "BOS", "color": ($scope.games[5].winner === null || $scope.games[5].winner === bracket[5].winner_id) && bracket[5].winner_id === 'BOS' ? "#FFB81C" : 'gray', "games": bracket[5].winner_id === 'BOS' ? bracket[5].num_games : 0, "size": 5},
                                    { "name": "TOR", "color": ($scope.games[5].winner === null || $scope.games[5].winner === bracket[5].winner_id) && bracket[5].winner_id === 'TOR' ? "#00205B" : 'gray', "games": bracket[5].winner_id === 'TOR' ? bracket[5].num_games : 0, "size": 5}]
                            }]
                    },
                        {
                            "name": bracket[11].winner_id, "color": bracket[11].color, "games": bracket[13].num_games, "children": [{
                            "name": bracket[6].winner_id, "color": bracket[6].color, "games": bracket[11].num_games, "children": [
                                { "name": "WSH", "color": ($scope.games[6].winner === null || $scope.games[6].winner === bracket[6].winner_id) && bracket[6].winner_id === 'WSH' ? "#C8102E" : 'gray', "games": bracket[6].winner_id === 'WSH' ? bracket[6].num_games : 0, "size": 5},
                                { "name": "CBJ", "color": ($scope.games[6].winner === null || $scope.games[6].winner === bracket[6].winner_id) && bracket[6].winner_id === 'CBJ' ? "#041E42" : 'gray', "games": bracket[6].winner_id === 'CBJ' ? bracket[6].num_games : 0, "size": 5}]
                        },
                            {
                                "name": bracket[7].winner_id, "color":bracket[7].color, "games": bracket[11].num_games, "children": [
                                { "name": "PIT", "color": ($scope.games[7].winner === null || $scope.games[7].winner === bracket[7].winner_id) && bracket[7].winner_id === 'PIT' ? "#FFB81C" : 'gray', "games": bracket[7].winner_id === 'PIT' ? bracket[7].num_games : 0, "size": 5},
                                { "name": "PHI", "color": ($scope.games[7].winner === null || $scope.games[7].winner === bracket[7].winner_id) && bracket[7].winner_id === 'PHI' ? "#FA4616" : 'gray', "games": bracket[7].winner_id === 'PHI' ? bracket[7].num_games : 0, "size": 5}]
                            }]
                        }]
                },
                    {
                        "name": bracket[12].winner_id, "color": bracket[12].color, "games": bracket[14].num_games, "children": [{
                        "name": bracket[9].winner_id, "color": bracket[9].color, "games": bracket[12].num_games, "children": [{
                            "name": bracket[3].winner_id, "color": bracket[3].color, "games": bracket[9].num_games, "children": [
                                { "name": "SJS", "color": ($scope.games[3].winner === null || $scope.games[3].winner === bracket[3].winner_id) && bracket[3].winner_id === 'SJS' ? "#006272" : 'gray', "games": bracket[3].winner_id === 'SJS' ? bracket[3].num_games : 0, "size": 5},
                                { "name": "ANA", "color": ($scope.games[3].winner === null || $scope.games[3].winner === bracket[3].winner_id) && bracket[3].winner_id === 'ANA' ? "#FC4C02" : 'gray', "games": bracket[3].winner_id === 'ANA' ? bracket[3].num_games : 0, "size": 5}]
                        },
                            {
                                "name": bracket[2].winner_id, "color": bracket[2].color, "games": bracket[9].num_games, "children": [
                                { "name": "LAK", "color": ($scope.games[2].winner === null || $scope.games[2].winner === bracket[2].winner_id) && bracket[2].winner_id === 'LAK' ? "#000000" : 'gray', "games": bracket[2].winner_id === 'LAK' ? bracket[2].num_games : 0, "size": 5},
                                { "name": "VGK", "color": ($scope.games[2].winner === null || $scope.games[2].winner === bracket[2].winner_id) && bracket[2].winner_id === 'VGK' ? "#B9975B" : 'gray', "games": bracket[2].winner_id === 'VGK' ? bracket[2].num_games : 0, "size": 5}]
                            }]
                    },
                        {
                            "name": bracket[8].winner_id, "color": bracket[8].color, "games": bracket[12].num_games, "children": [{
                            "name": bracket[1].winner_id, "color": bracket[1].color, "games": bracket[8].num_games, "children": [
                                { "name": "MIN", "color": ($scope.games[1].winner === null || $scope.games[1].winner === bracket[1].winner_id) && bracket[1].winner_id === 'MIN' ? "#154734" : 'gray', "games": bracket[1].winner_id === 'MIN' ? bracket[1].num_games : 0, "size": 5},
                                { "name": "WPG", "color": ($scope.games[1].winner === null || $scope.games[1].winner === bracket[1].winner_id) && bracket[1].winner_id === 'WPG' ? "#041E42" : 'gray', "games": bracket[1].winner_id === 'WPG' ? bracket[1].num_games : 0, "size": 5}]
                        },
                            {
                                "name": bracket[0].winner_id, "color": bracket[0].color, "games": bracket[8].num_games, "children": [
                                { "name": "COL", "color": ($scope.games[0].winner === null || $scope.games[0].winner === bracket[0].winner_id) && bracket[0].winner_id === 'COL' ? "#6F263D" : 'gray', "games": bracket[0].winner_id === 'COL' ? bracket[0].num_games : 0, "size": 5},
                                { "name": "NSH", "color": ($scope.games[0].winner === null || $scope.games[0].winner === bracket[0].winner_id) && bracket[0].winner_id === 'NSH' ? "#FFB81C" : 'gray', "games": bracket[0].winner_id === 'NSH' ? bracket[0].num_games : 0, "size": 5}]
                            }]
                        }]
                    }]
            };
            return nodeData;
        }

        function generateBracket(nodeData, i) {
            // Variables
            var width = 360;
            var height = 360;
            var radius = Math.min(width, height) / 2;

            // Create primary <g> element
            var g = d3.select('#radial-bracket-' + i)
                .attr('width', width)
                .attr('height', height)
                .append('g')
                .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

            // Data strucure
            var partition = d3.partition()
                .size([2 * Math.PI, radius]);

            // Find data root
            var root = d3.hierarchy(nodeData)
                .sum(function (d) {
                    return d.size
                });

            // Size arcs
            partition(root);
            var arc = d3.arc()
                .startAngle(function (d) {
                    return d.x0
                })
                .endAngle(function (d) {
                    return d.x1
                })
                .innerRadius(function (d) {
                    return d.y0
                })
                .outerRadius(function (d) {
                    return d.y1
                });

            // Put it all together
            g.selectAll('g')
                .data(root.descendants())
                .enter().append('g').attr("class", "node").append('path')
                .attr("d", arc)
                .style('stroke', '#fff')
                .style("fill", function (d) {
                    return d.data.color;
                });

            g.selectAll(".node")
                .append("text")
                .attr("transform", function (d) {
                    if (d.parent) {
                        return "translate(" + arc.centroid(d) + ")rotate(" + computeTextRotation(d) + ")";
                    } else {
                        return "";
                    }
                })
                .attr("dx", function (d) {
                    if (d.parent && (d.data.games === 0 || d.data.color === 'gray')) {
                        return "-20";
                    } else if (d.parent) {
                        return "-28";
                    } else {
                        return "-13";
                    }
                })
                .attr("dy", ".5em") // rotation align
                .style("fill", function (d) {
                    return "#fff";
                })
                .text(function (d) {
                    return (d.data.games === 0 || d.data.color === 'gray') ? d.data.name : d.data.name + ' in ' + d.data.games;
                })
        }

    }])
    .controller('StandingsController', ['$scope', '$http', function($scope, $http) {

        var uniqueStandings = [...new Set(brackets.map(item => item.points))];
        for (var i = 0; i < brackets.length; i++) {
            for (var j = 0; j < uniqueStandings.length; j++) {
                if (brackets[i].points === uniqueStandings[j]) {
                    brackets[i].place = j + 1;
                    break;
                }
            }
        }
        $scope.brackets = brackets;

}]);