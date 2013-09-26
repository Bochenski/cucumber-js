var _ = require('underscore');

var Hook = function(code, options) {
  var Cucumber = require('../../cucumber');

  var tags = options['tags'] || [];

  var self = {
    
    invoke: function invoke(world, callback) {
      code.call(world, callback);
    },

    invokeBesideScenario: function invokeBesideScenario(scenario, world, callback) {
      if (self.appliesToScenario(scenario))
        self.invoke(world, callback);
      else
        callback(function(endPostScenarioAroundHook) { endPostScenarioAroundHook(); });
    },

    appliesToScenario: function appliesToScenario(scenario) {
      var astFilter = self.getAstFilter();
      return astFilter.isElementEnrolled(scenario);
    },

    getAstFilter: function getAstFilter() {
      var tagGroups = Cucumber.TagGroupParser.getTagGroupsFromStrings(tags);
      var rules = _.map(tagGroups, function(tagGroup) {
        var rule = Cucumber.Ast.Filter.AnyOfTagsRule(tagGroup);
        return rule;
      });
      var astFilter = Cucumber.Ast.Filter(rules);
      return astFilter;
    }
  };
  return self;
};
module.exports = Hook;
