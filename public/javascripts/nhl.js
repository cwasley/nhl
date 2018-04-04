angular.module('nhl', [])
    .controller('NHLBracketController', ['$scope', function($scope) {

        $('body').bootstrapMaterialDesign();
        $(function() {
            addClickListeners();
            setSliders();
            $('body').bootstrapMaterialDesign();
        });

        function addClickListeners() {
            $("button").click(function() {

                var roundGroup = this.parentElement;
                // Styling: change button classes to show that the user has selected a specific one

                $("#" + roundGroup.id + " button").removeClass('btn-primary').addClass('btn-secondary');
                $(this).removeClass('btn-secondary').addClass('btn-primary');

                // Set the input value for the winning team to the user-chosen one
                $("input[name='" + roundGroup.id + "']").attr('value', $(this).text());

                if (roundGroup.classList[1].substring(0,3) == "top") {
                    $scope.topComplete = true;
                } else if (roundGroup.classList[1].substring(0,3) == "bottom") {
                    $scope.bottomComplete = true;
                } else {
                    $scope.topComplete = $scope.bottomComplete = true;
                }
                if ($scope.topComplete && $scope.bottomComplete) {
                    $('.buttontooltip').attr('style', '');
                }
            });
        }

        function setSliders() {
            $("input.slider").slider({
                ticks: [4,5,6,7],
                ticks_labels: [4,5,6,7],
                step: 1,
                value: 4,
                tooltip: 'hide'
            });
            $("input.final-slider").slider({
                min: 0,
                max: 50,
                step: 1,
                value: 10
            });
            $("input.final-slider").on("slide", function(e) {
                $("#finalsGoals").text(e.value);
            });
        }


        $scope.round = 1;
        $scope.state = "west1";
        $scope.topComplete = false;
        $scope.bottomComplete = false;

        $scope.round2teams = [];
        $scope.round3teams = [];
        $scope.round4teams = [];
        $scope.finalteam = [];

        $scope.next = function(currState, nextState) {
            if (currState.substr(0, 4) === "conf") {
                $scope.round++;
            } else if ($scope.topComplete && $scope.bottomComplete) {
                $scope.topComplete = $scope.bottomComplete = false;
                var team1 = {}, team2 = {};
                var winners = $("input[name$='winner']");
                var games = $("input[name$='games']");
                if ($scope.round === 1) {
                    team1.name = winners[0].value;
                    team1.games = games[0].value;
                    team2.name = winners[1].value;
                    team2.games = games[1].value;
                    $scope.round2teams.push(team1);
                    $scope.round2teams.push(team2);
                } else if ($scope.round === 2) {
                    team1.name = winners[0].value;
                    team1.games = games[0].value;
                    team2.name = winners[1].value;
                    team2.games = games[1].value;
                    $scope.round3teams.push(team1);
                    $scope.round3teams.push(team2);
                } else if ($scope.round === 3) {
                    team1.name = winners[0].value;
                    team1.games = games[0].value;
                    team2.name = winners[1].value;
                    team2.games = games[1].value;
                    $scope.round4teams.push(team1);
                    $scope.round4teams.push(team2);
                } else {
                    team1.name = winners[0].value;
                    team1.games = games[0].value;
                    team1.goals = $("input[name$='goals']")[0].value;
                    $scope.finalteam.push(team1);
                }
            } else {
                $('.buttontooltip').tooltip('show');
                return;
            }
            $scope.state = nextState;
            $('.buttontooltip').tooltip('hide');
            setTimeout(function() {
                addClickListeners();
                setSliders();
            }, 1);
        };

        $scope.back = function(backState) {
            if (backState == 'instructions') {
                window.location = '/instructions';
            } else {
                $scope.state = backState;
                setTimeout(function() {
                    addClickListeners();
                    setSliders();
                }, 1);
            }
            $scope.topComplete = $scope.bottomComplete = false;
            if (backState.substr(0, 4) !== "conf") {
                if ($scope.round == 1) {
                    $scope.round2teams.pop();
                    $scope.round2teams.pop();
                } else if ($scope.round == 2) {
                    $scope.round3teams.pop();
                    $scope.round3teams.pop();
                } else if ($scope.round == 3) {
                    $scope.round4teams.pop();
                    $scope.round4teams.pop();
                } else {
                    $scope.finalteam.pop();
                }
            } else {
                $scope.round--;
            }
        }

        function processForm(e) {
            if (e.preventDefault) e.preventDefault();

            /* do what you want with the form */

            // You must return false to prevent the default form behavior
            return false;
        }

        $scope.submit = function() {
            document.getElementById('bracketForm').submit()
        }
}]);