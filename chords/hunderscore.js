(() => {

  const indices = (array, elements) => {
    return _.map(elements, (element) => {
      return _.indexOf(array, element);
    });
  };

  const indicesBy = (array, elements, f) => {
    return _.map(elements, (n) => {
      return _.findIndex(array, ((m) => f(m, n)));
    });
  };

  const reorder = (array, indexes) => {
    return _.foldl(indexes, (memo, i) => {
      memo.push(array[i]);
      return memo;
    }, []);
  };

  const reorderBy = (array, elements, f) => {
    return _.foldl(elements, (memo, e) => {
      var i = _.findIndex(array, ((m) => f(m, e)))
      memo.push(array[i]);
      return memo;
    }, []);
  };

  _.mixin({

    fmap: (f, obj) => _.map(obj, f),

    bypass: (obj, f) => {
      f(obj);
      return obj;
    },

    log: (obj, label) => {
      console.log(label, obj);
      return obj;
    },

    dropUntil: (arr, p) => {
      var index = _.findIndex(arr, p);
      return _.drop(arr, index);
    },

    zipWith: (a1, a2, f) => {
      return _.first(_.map(_.zip(a1, a2), (pair) => {
        return f(pair[0], pair[1]);
      }), _.min([_.size(a1), _.size(a2)]))
    },

    concat: (...args) => {
      return _.chain(args).compact().toArray().flatten(true).value();
    },

    reverse: (array) => {
      return _.foldr(array, (memo, element) => {
        memo.push(element);
        return memo;
      }, []);
    },

    indices: indices,
    indicesBy: indicesBy,
    reorder: reorder,
    reorderBy: reorderBy

  });

})();
