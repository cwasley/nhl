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
        $scope.teams = TEAMS;
        $scope.brackets = BRACKETS;
        var tempBrackets = angular.copy($scope.brackets);
        tempBrackets = tempBrackets.sort(function(a, b) {
            if (a.points === b.points) {
                if (a.potentialPoints === b.potentialPoints) {
                    return a.name > b.name;
                } else {
                    return b.potentialPoints - a.potentialPoints;
                }
            } else {
                return b.points - a.points;
            }
        });
        for (var i = 0; i < $scope.brackets.length; i++) {
            for (var j = 0; j < tempBrackets.length; j++) {
                if ($scope.brackets[i].id === tempBrackets[j].id) {
                    var place = j + 1;
                    switch(place) {
                        case 1:
                        case 21:
                            $scope.brackets[i].place = place + "st";
                            break;
                        case 3:
                        case 23:
                            $scope.brackets[i].place = place + "rd";
                            break;
                        case 2:
                        case 22:
                            $scope.brackets[i].place = place + "nd";
                            break;
                        default:
                            $scope.brackets[i].place = place + "th";
                            break;
                    }
                    break;
                }
            }
        }
        $scope.predictions = PREDICTIONS;
        $scope.series = SERIES;

        $scope.nodeDataArray = [];
        $(function() {

            $('.tip').tooltip({
                placement: "top"
            });
            for (var i = 0; i < $scope.predictions.length; i++) {
                $scope.updateBracket($scope.predictions[i], i)
            }
        });

        // TODO in the future this should be moved into the backend along with pretty much everything else; the page is mostly static so we can just send the
        // node data in and generate the brackets one time
        $scope.updateBracket = function(predictions, index) {

                // Start from the 'root'; we want to copy information from the DB in a way d3 can understand
                var nodeArray = [];
                var rootNode = {};
                rootNode.name = predictions[predictions.length - 1].winner_id;
                rootNode.color = predictions[predictions.length - 1].color;
                rootNode.games = predictions[predictions.length - 1].num_games;
                rootNode.status = 1;
                nodeArray.unshift(rootNode);
                for (var j = predictions.length - 2; j >= 0; j--) {
                    var branchNode = {};
                    branchNode.name = predictions[j].winner_id;
                    branchNode.color = predictions[j].color;
                    var nextGame = $scope.series[$scope.series[j].next_series_id - 1];
                    var gameFinished = nextGame.winner;
                    if (gameFinished && nextGame.winner === predictions[$scope.series[j].next_series_id - 1].winner_id && nextGame.winner === predictions[j].winner_id) {
                        // Correct Prediction
                        // TODO make this dynamic per round
                        branchNode.status = 8 - Math.abs(predictions[$scope.series[j].next_series_id - 1].num_games - nextGame.num_games);
                    } else if (gameFinished && nextGame.winner !== predictions[j].winner_id) {
                        // Incorrect Prediction
                        branchNode.status = -1;

                        // Propagate errors forward
                        for (var i = 0; i < nodeArray.length; i++) {
                            if (nodeArray[i].name === predictions[j].winner_id) {
                                nodeArray[i].status = -1;
                            }
                        }
                    } else if (predictions[$scope.series[j].next_series_id - 1].winner_id !== predictions[j].winner_id){
                        branchNode.status = -1;
                    } else {
                        branchNode.games = predictions[$scope.series[j].next_series_id - 1].num_games;
                        branchNode.status = 1;
                    }
                    branchNode.lowerGames = predictions[j].num_games;
                    nodeArray.unshift(branchNode);
                }

                // Add 16 original teams & states
                var leafNodes = [];
                for (var j = 0; j < $scope.teams.length / 2; j++) {
                    var leafNode1 = {};
                    var leafNode2 = {};
                    leafNode1.name = $scope.teams[j * 2].id;
                    leafNode1.color = $scope.teams[j * 2].color;
                    leafNode1.games = nodeArray[j].lowerGames;
                    leafNode2.name = $scope.teams[j * 2 + 1].id;
                    leafNode2.color = $scope.teams[j * 2 + 1].color;
                    leafNode2.games = nodeArray[j].lowerGames;
                    if (nodeArray[j].name === $scope.teams[j * 2].id) {
                        if ($scope.series[j].winner) {
                            if ($scope.series[j].winner === nodeArray[j].name) {
                                leafNode1.status = 8 - Math.abs($scope.series[j].num_games - nodeArray[j].lowerGames);
                            } else {
                                leafNode1.status = -1;

                                // Propagate errors forward
                                for (var i = 0; i < nodeArray.length; i++) {
                                    if (nodeArray[i].name === leafNode1.name) {
                                        nodeArray[i].status = -1;
                                    }
                                }
                            }
                        } else {
                            leafNode1.status = 1;
                        }
                    } else {
                        leafNode1.status = -1;
                    }

                    if (nodeArray[j].name === $scope.teams[j * 2 + 1].id) {
                        if ($scope.series[j].winner) {
                            if ($scope.series[j].winner === nodeArray[j].name) {
                                leafNode2.status = 8 - Math.abs($scope.series[j].num_games - nodeArray[j].lowerGames);
                            } else {
                                leafNode2.status = -1;

                                // Propagate errors forward
                                for (var i = 0; i < nodeArray.length; i++) {
                                    if (nodeArray[i].name === leafNode2.name) {
                                        nodeArray[i].status = -1;
                                    }
                                }
                            }
                        } else {
                            leafNode2.status = 1;
                        }
                    } else {
                        leafNode2.status = -1;
                    }

                    leafNodes.unshift(leafNode1);
                    leafNodes.unshift(leafNode2);
                }
                for (var i = 15; i >= 0; i--) {
                    nodeArray.unshift(leafNodes[i]);
                }

            var nodeData = calculateBracket(nodeArray);
            generateBracket(nodeData, index);
        };

        function computeTextRotation(d) {
            var angle = (d.x0 + d.x1) / Math.PI * 90;

            // Avoid upside-down labels
            return (angle < 100 || angle > 260) ? angle : angle + 180;  // labels as rims
            //return (angle < 180) ? angle - 90 : angle + 90;  // labels as spokes
        }
        function calculateBracket(nodeArray) {

            var nodeData = {
                "name": nodeArray[30].name, "games": 0, "color": nodeArray[30].color, "status": nodeArray[30].status, "children": [{
                    "name": nodeArray[29].name, "color": nodeArray[29].color, "games": nodeArray[29].games, "status": nodeArray[29].status, "children": [{
                        "name": nodeArray[26].name, "color": nodeArray[26].color, "games": nodeArray[26].games, "status": nodeArray[26].status, "children": [{
                            "name": nodeArray[20].name, "color": nodeArray[20].color, "games": nodeArray[20].games, "status": nodeArray[20].status, "children": [
                                { "name": nodeArray[7].name, "color": nodeArray[7].color, "games": nodeArray[7].games, "status": nodeArray[7].status, "size": 5},
                                { "name": nodeArray[6].name, "color": nodeArray[6].color, "games": nodeArray[6].games, "status": nodeArray[6].status, "size": 5}]
                        },
                            {
                                "name": nodeArray[21].name, "color": nodeArray[21].color, "games": nodeArray[21].games, "status": nodeArray[21].status, "children": [
                                { "name": nodeArray[5].name, "color": nodeArray[5].color, "games": nodeArray[5].games, "status": nodeArray[5].status, "size": 5},
                                { "name": nodeArray[4].name, "color": nodeArray[4].color, "games": nodeArray[4].games, "status": nodeArray[4].status, "size": 5}]
                            }]
                    },
                        {
                            "name": nodeArray[27].name, "color": nodeArray[27].color, "games": nodeArray[27].games, "status": nodeArray[27].status, "children": [{
                            "name": nodeArray[22].name, "color": nodeArray[22].color, "games": nodeArray[22].games, "status": nodeArray[22].status, "children": [
                                { "name": nodeArray[3].name, "color": nodeArray[3].color, "games": nodeArray[3].games, "status": nodeArray[3].status, "size": 5},
                                { "name": nodeArray[2].name, "color": nodeArray[2].color, "games": nodeArray[2].games, "status": nodeArray[2].status, "size": 5}]
                        },
                            {
                                "name": nodeArray[23].name, "color": nodeArray[23].color, "games": nodeArray[23].games, "status": nodeArray[23].status, "children": [
                                { "name": nodeArray[1].name, "color": nodeArray[1].color, "games": nodeArray[1].games, "status": nodeArray[1].status, "size": 5},
                                { "name": nodeArray[0].name, "color": nodeArray[0].color, "games": nodeArray[0].games, "status": nodeArray[0].status, "size": 5}]
                            }]
                        }]
                },
                    {
                        "name": nodeArray[28].name, "color": nodeArray[28].color, "games": nodeArray[28].games, "status": nodeArray[28].status, "children": [{
                        "name": nodeArray[25].name, "color": nodeArray[25].color, "games": nodeArray[25].games, "status": nodeArray[25].status, "children": [{
                            "name": nodeArray[19].name, "color": nodeArray[19].color, "games": nodeArray[19].games, "status": nodeArray[19].status, "children": [
                                { "name": nodeArray[8].name, "color": nodeArray[8].color, "games": nodeArray[8].games, "status": nodeArray[8].status, "size": 5},
                                { "name": nodeArray[9].name, "color": nodeArray[9].color, "games": nodeArray[9].games, "status": nodeArray[9].status, "size": 5}]
                        },
                            {
                                "name": nodeArray[18].name, "color": nodeArray[18].color, "games": nodeArray[18].games, "status": nodeArray[18].status, "children": [
                                { "name": nodeArray[10].name, "color": nodeArray[10].color, "games": nodeArray[10].games, "status": nodeArray[10].status, "size": 5},
                                { "name": nodeArray[11].name, "color": nodeArray[11].color, "games": nodeArray[11].games, "status": nodeArray[11].status, "size": 5}]
                            }]
                    },
                        {
                            "name": nodeArray[24].name, "color": nodeArray[24].color, "games": nodeArray[24].games, "status": nodeArray[24].status, "children": [{
                            "name": nodeArray[17].name, "color": nodeArray[17].color, "games": nodeArray[17].games, "status": nodeArray[17].status, "children": [
                                { "name": nodeArray[12].name, "color": nodeArray[12].color, "games": nodeArray[12].games, "status": nodeArray[12].status, "size": 5},
                                { "name": nodeArray[13].name, "color": nodeArray[13].color, "games": nodeArray[13].games, "status": nodeArray[13].status, "size": 5}]
                        },
                            {
                                "name": nodeArray[16].name, "color": nodeArray[16].color, "games": nodeArray[16].games, "status": nodeArray[16].status, "children": [
                                { "name": nodeArray[14].name, "color": nodeArray[14].color, "games": nodeArray[14].games, "status": nodeArray[14].status, "size": 5},
                                { "name": nodeArray[15].name, "color": nodeArray[15].color, "games": nodeArray[15].games, "status": nodeArray[15].status, "size": 5}]
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
                .style('opacity', function(d) {
                    if (d.data.status > 0) {
                        if (d.data.games === 5) {
                            return 0.95;
                        } else if (d.data.games === 6) {
                            return 0.90;
                        } else if (d.data.games === 7) {
                            return 0.85;
                        }
                    }
                })
                .style("fill", function (d) {
                    return d.data.status > 0 ? d.data.color : 'gray';
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
                    // TODO fixME
                    if (d.parent && d.data.color === 'gray') {
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
                    if (d.data.status === 1 && d.parent) {
                        return d.data.name + ' in ' + d.data.games;
                    } else {
                        return d.data.name;
                    }
                })
                .append("tspan")
                .style("font-weight", "bold")
                .text(function(d) {
                    return d.data.status > 1 ? '(+' + (d.data.status - 5) + ')' : '';
                })
        }

    }])
    .controller('StandingsController', ['$scope', '$http', function($scope, $http) {

        $('body').bootstrapMaterialDesign();
        $scope.width = $(window).width();
        $scope.updating = false;
        $scope.brackets = BRACKETS;
        if (STANDINGS) {
            $scope.brackets = $scope.brackets.sort(function(a, b) {
                if (a.points === b.points) {
                    if (a.potentialPoints === b.potentialPoints) {
                        return a.name > b.name;
                    } else {
                        return b.potentialPoints - a.potentialPoints;
                    }
                } else {
                    return b.points - a.points;
                }
            });
        }
        for (var i = 0; i < $scope.brackets.length; i++) {
            var place = i + 1;
            switch(place) {
                case 1:
                case 21:
                    $scope.brackets[i].place = place + "st";
                    break;
                case 3:
                case 23:
                    $scope.brackets[i].place = place + "rd";
                    break;
                case 2:
                case 22:
                    $scope.brackets[i].place = place + "nd";
                    break;
                default:
                    $scope.brackets[i].place = place + "th";
                    break;
            }

        }
        $(function() {
            $("[rel=tooltip]").tooltip({placement: 'top'});
        });

        $scope.updateDB = function(bracket) {
            $scope.updating = true;
            var data = {
                type: 'user',
                change: 'paid',
                id: bracket.id,
                value: bracket.paid
            };
            $.ajax({
                type: 'POST',
                url: '/update',
                data: data,
                dataType: 'json',
                success: function (data) {
                    $scope.updating = false;
                    $scope.$apply();
                }
            });
        }

    }])
    .controller('SeriesController', ['$scope', '$http', function($scope, $http) {

        $scope.brackets = BRACKETS;
        $scope.series = SERIES;
        $scope.teams = TEAMS;

        $scope.stanleyCupGoals = 0;

        // Make a color mapping for buttons
        var colors = {};
        for (var i = 0; i < $scope.teams.length; i++) {
            colors[$scope.teams[i].id] = $scope.teams[i].color;
        }

        for (var i = 0; i < $scope.series.length; i++) {
            var series = $scope.series[i];
            series.team1_color = colors[series.team1_id];
            series.team2_color = colors[series.team2_id];
            series.lastInput = 7;
            series.expanded = false;
            switch (series.round) {
                case 1:
                    series.roundName = "First Round";
                    break;
                case 2:
                    series.roundName = "Second Round";
                    break;
                case 3:
                    series.roundName = "Conference Finals";
                    break;
                case 4:
                    series.roundName = "Stanley Cup Final";
                    series.num_goals = 0;
                    for (var j = 0; j < series.goal_array.length; j++) {
                        series.num_goals += series.goal_array[j] ? parseInt(series.goal_array[j]) : 0;
                    }
            }
        }

        $scope.currSeriesNum = -1;
        $scope.score = -1;
        $scope.winningTeam = '';
        $scope.losingTeam = '';
        $scope.winerColor = '';
        $scope.params = [];

        $('body').bootstrapMaterialDesign();
        $scope.series = disableButtons($scope.series);

        $scope.updateDB = function(series, game, newValue) {

            if ($scope.series[series-1].enabled === false) {
                $scope.params = [series, game, newValue];
                $("#resetModal").modal();
                return;
            }
            $scope.series[series - 1]['game' + game] = newValue;
            $scope.series = disableButtons($scope.series);

            // Check to see if anyone should be moving on
            var team1count = 0, team2count = 0;
            for (var i = 1; i < 8; i++) {
                if ($scope.series[series-1]['game' + i] === $scope.series[series-1].team1_id) {
                    $scope.winningTeam = $scope.series[series-1].team1_id;
                    $scope.winnerColor = $scope.series[series-1].team1_color;
                    $scope.losingTeam = $scope.series[series-1].team2_id;
                    team1count++;
                } else if ($scope.series[series-1]['game' + i] === $scope.series[series-1].team2_id) {
                    $scope.winningTeam = $scope.series[series-1].team2_id;
                    $scope.winnerColor = $scope.series[series-1].team2_color;
                    $scope.losingTeam = $scope.series[series-1].team1_id;
                    team2count++;
                }
                if (team1count > 3 || team2count > 3) {
                    $scope.currSeriesNum = series;
                    $scope.score = i - 4;
                    if (i === 7) {
                        $scope.series[series-1].lastInput = 7;
                    }
                    $("#winnerModal").modal({
                        backdrop: 'static'
                    });
                    break;
                }
            }

            var data = {
                type: 'series',
                change: game,
                id: series,
                value: newValue
            };
            $.ajax({
                type: 'POST',
                url: '/update',
                data: data,
                dataType: 'json',
                success: function( data ) {
                    console.log("successful request");
                }
            })
        };

        $scope.callUpdate = function() {
            var currSeries = $scope.series[$scope.params[0]-1];
            var id = currSeries.id;
            var winner  = currSeries.winner;
            var num_games = currSeries.num_games;
            var teamKey = '';
            if (currSeries.id % 2 === 1) {
                teamKey = "team1_id";
            } else {
                teamKey = "team2_id";
            }
            currSeries.enabled = true;
            var winner = currSeries.winner;
            var loserArray = [];
            loserArray.push(winner);
            currSeries.winner = currSeries.num_games = currSeries.num_goals = null;
            while (currSeries.next_series_id !== null) {
                currSeries = $scope.series[currSeries.next_series_id - 1];
                currSeries.enabled = false;
                for (var i = 0; i < loserArray.length; i++) {
                    if (currSeries.team1_id === loserArray[i]) {
                        currSeries.team1_id = null;
                        currSeries.team1_color = null;
                    } else if (currSeries.team2_id === loserArray[i]) {
                        currSeries.team2_id = null;
                        currSeries.team2_color = null;
                    }
                }
                loserArray.push(currSeries.winner);
                currSeries.winner = currSeries.num_games = currSeries.num_goals = currSeries.game1 = currSeries.game2 = currSeries.game3 = currSeries.game4 = currSeries.game5 = currSeries.game6 = currSeries.game7 = null;
            }

            $scope.updateDB($scope.params[0], $scope.params[1], $scope.params[2]);
            var data = {
                winner: winner,
                num_games: num_games,
                series_id: id,
                teamKey: teamKey,
                toEnable: false,
                updating: false
            };
            $.ajax({
                type: 'POST',
                url: '/updateSeries',
                data: data,
                dataType: 'json',
                success: function( data ) {
                    console.log("successfully updated");
                }
            })
        };

        $('#winnerModal').on('show.bs.modal', function (event) {
            var modal = $(this);

            modal.find('.modal-body p').text('Looks like ' + $scope.winningTeam + ' beat ' + $scope.losingTeam + ' with a final score of 4-' + $scope.score + '. Is this correct?');
        });

        $scope.ignoreLast = function() {
            $scope.series[$scope.currSeriesNum - 1]['game' + ($scope.score + 4)] = null;
            $scope.series = disableButtons($scope.series);
            var data = {
                type: 'series',
                change: $scope.score + 4,
                id: $scope.currSeriesNum,
                value: ""
            };
            $.ajax({
                type: 'POST',
                url: '/update',
                data: data,
                dataType: 'json',
                success: function( data ) {
                    console.log("successful request");
                }
            })
        };

        $scope.closeOut = function() {
            var currSeries = $scope.series[$scope.currSeriesNum - 1];
            currSeries.enabled = false;
            currSeries.winner = $scope.winningTeam;
            currSeries.num_games = 4 + $scope.score;
            var teamKey = '';
            var toEnable = "false";
            if (currSeries.next_series_id) {

                var futureSeries = $scope.series[currSeries.next_series_id - 1];
                // Assign team to future series
                if (currSeries.id % 2 === 1) {
                    futureSeries.team1_id = $scope.winningTeam;
                    futureSeries.team1_color = $scope.winnerColor;
                    teamKey = "team1_id";
                } else {
                    futureSeries.team2_id = $scope.winningTeam;
                    futureSeries.team2_color = $scope.winnerColor;
                    teamKey = "team2_id";
                }
                if (futureSeries.team1_id && futureSeries.team2_id) {
                    futureSeries.enabled = true;
                    toEnable = true;
                }

            }

            // Make a call to DB to update winner, update num games, update one spot in a future game if applicable, and recalculate scores.
            // Out of those four, we don't care about num games, winner, & scores for this page. Just need to disable and move one name down into a future round; if both teams are there,
            // Enable that row.

            // For the call we need winner, num_games, series_id, to_enable
            var data = {
                winner: $scope.winningTeam,
                num_games: 4 + $scope.score,
                series_id: currSeries.id,
                teamKey: teamKey,
                toEnable: toEnable,
                updating: true
            };
            $.ajax({
                type: 'POST',
                url: '/updateSeries',
                data: data,
                dataType: 'json',
                success: function( data ) {
                    console.log("successfully updated");
                }
            })
        };

        $scope.calculateScore = function(series) {
            var team1 = 0, team2 = 0;
            for (var i = 1; i < 8; i++) {
                if (series['game' + i] === series.team1_id) {
                    team1++;
                } else if (series['game' + i] === series.team2_id) {
                    team2++;
                } else {
                    break;
                }
            }
            return team1 + '-' + team2;

        };

        $scope.toggle = function(id) {
            $(id).collapse('toggle');
            $scope.series[id.replace('#series', '')].expanded = !$scope.series[id.replace('#series', '')].expanded;
        };

        $scope.recalculateStanleyCup = function() {
            recalculateHelper();
        };

        function recalculateHelper() {
            var finalSeries = $scope.series[14];
            finalSeries.num_goals = 0;
            for (var j = 0; j < finalSeries.goal_array.length; j++) {
                if (finalSeries.goal_array[j] === '') {
                    finalSeries.goal_array[j] = null;
                }
                finalSeries.num_goals += finalSeries.goal_array[j] ? parseInt(finalSeries.goal_array[j]) : 0;
            }
            var data = {
                value: JSON.stringify(finalSeries.goal_array),
                change: "finalGoals"
            };
            $.ajax({
                type: 'POST',
                url: '/update',
                data: data,
                dataType: 'json',
                success: function( data ) {
                    console.log("successfully updated");
                }
            })
        }

        // Disable/Enable games to be picked throughout a series
        function disableButtons(seriesArray) {
            for (var i = 0; i < seriesArray.length; i++) {
                var lastEntry = false;

                // Enable/disable individual buttons
                for (var j = 1; j < 8; j++) {
                    var currentGame = seriesArray[i]['game' + j];
                    seriesArray[i]['game' + j + '_enabled'] = false;

                    // Want to null out goals as well if we're going backwards
                    if (lastEntry && seriesArray[i].goal_array) {
                        if (seriesArray[i].goal_array[j - 1]) {
                            seriesArray[i].goal_array[j - 1] = null;
                            recalculateHelper();
                        }
                    }
                    if (currentGame === null && !lastEntry) {

                        // We found the current game that we are on; enable it
                        lastEntry = true;
                        seriesArray[i]['game' + (j) + '_enabled'] = true;
                        seriesArray[i].lastInput = j-1;
                    }
                }
            }
            return seriesArray;
        }
    }]);