angular.module('nhl', [])
    .controller('NHLBracketController', ['$scope', function($scope) {
        $('body').bootstrapMaterialDesign();

        $scope.state = "west1";

        $(document).ready(function() {
            $("#r1i1games").slider({
                tooltip: 'always'
            });
        });


        $("button").click(function() {

            // Replace text in dropdown with what the team you selected / number of games
            // context is something like west-2-1 where 'west' is the conference,
            // 2 in this case would be the round, and 1 would be the index
            var details = this.parentElement.id.replace('#', '').split('-');
            var round = details[0];
            var roundIndex = details[1];
            var idToFind = "#" + this.parentElement.id.replace('-opts', '-text');

            // TODO if we have values that depend on this one, remove them
            $(idToFind).text($(this).text());
            $(idToFind).val($(this).text());
            $('input[name=' + round + '-' + roundIndex + ']').val($(this).text());

            // Check if we have all four elements filled in to go to the next step
            // (team 1, number of games 1, team 2, number of games 2)

            // TODO combine logic from rounds 2 & 3
            // First sort by round so we know which elements to grab
            if (round !== '5') {
                // second round; 8 total fields per conference, we only want to look @ first or last four depending on index
                var subGroup = Math.floor(roundIndex / 4);
                var filled_in = true;
                var newValues = [];
                for (var i = subGroup * 4; i < subGroup * 4 + 4; i++) {
                    var toCheck = '#'  + round + '-' + i + '-text';
                    var itemValue = $(toCheck)[0].value;
                    if (itemValue === 'Team' || itemValue === '#') {
                        filled_in = false;
                        break;
                    } else {
                        newValues.push(itemValue);
                    }
                }

                // If we have all four fields, we want to allow next round to be edited
                // & fill in values based on user input
                if (filled_in) {
                    var winningTeamId = '#' + (parseInt(round) + 1) + '-' + (subGroup * 2);
                    $(winningTeamId + '-text').removeClass('disabled');
                    $(winningTeamId + '-opts')[0].children[0].text = newValues[0];
                    $(winningTeamId + '-opts')[0].children[1].text = newValues[2];

                    var numGamesId = '#' + (parseInt(round) + 1) + '-' + (subGroup * 2 + 1);
                    $(numGamesId + '-text').removeClass('disabled');

                    // TODO For now we just reset the values & text of this item but we really need something more dynamic;
                    // this is tied to TODO above
                    $(winningTeamId + '-text').text = "Team";
                    $(winningTeamId + '-text').value = "Team";
                    $(numGamesId + '-text').text = "#";
                    $(numGamesId + '-text').value = "#";
                }
            }
            else {
                var filled_in = true;
                for (var i = 0; i < 2; i++) {
                    var toCheck = '#5-' + i + '-text';
                    var itemValue = $(toCheck)[0].value;
                    if (itemValue === 'Team' || itemValue === '#') {
                        filled_in = false;
                        break;
                    }
                }

                if (filled_in) {
                    $('#submitButton').prop('disabled', false);
                }
            }
        });

        $scope.showInstructions = function() {

        }

        $scope.next = function(nextState) {
            if ($scope.filled_in) {
                $scope.state = nextState;
            } else {
                $('.buttontooltip').tooltip('show');
            }
        }
}]);