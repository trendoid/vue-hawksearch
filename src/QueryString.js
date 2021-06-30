import { createBrowserHistory } from 'history';

const stateToURLParam = {
    Keyword: 'keyword',
    SortBy: 'sort',
    PageNo: 'pg',
    MaxPerPage: 'mpp',
    CustomUrl: 'lpurl',
    SearchWithin: 'searchWithin',
    IndexName: 'indexName'
}

const rangeFacets = [];

export function addToRangeFacets(facetName) {
    rangeFacets.push(facetName);
}

export function getParamName(paramName, widget, reverse) {
    var mappingTable = widget.config.paramsMapping;

    for (let [mKey, mValue] of Object.entries(mappingTable)) {
        if (reverse) {
            [mKey, mValue] = [mValue, mKey];
        }

        if (mKey == paramName) {
            paramName = mValue;
        }
    }

    return paramName;
}

export function parseURLparams(widget) {
    var params = new URLSearchParams(location.search);
    var paramList = Object.keys(Object.fromEntries(params.entries()));
    var pendingSearch = {};

    let mappedStateToURLParam = lodash.mapValues(stateToURLParam, paramName => { return getParamName(paramName, widget) });

    for (let [key, value] of Object.entries(mappedStateToURLParam)) {
        pendingSearch[key] = params.get(value);
        lodash.pull(paramList, value)
    }

    if (paramList.length) {
        pendingSearch.FacetSelections = {};

        paramList.forEach(param => {
            pendingSearch.FacetSelections[getParamName(param, widget, true)] = decodeURIParam(params.get(param)); // decode
        });
    }

    return lodash.pickBy(pendingSearch);
}

export function updateUrl(widget) {
    return new Promise((resolve, reject) => {
        const history = createBrowserHistory();

        if (widget.config.urlUpdate.enabled) {
            history.push({
                search: getSearchQueryString(widget),
            });

            resolve();
        }
    });
}

function getSearchQueryString(widget) {
    var storeState = HawksearchVue.getWidgetStore(widget).state;
    var pendingSearch = storeState.pendingSearch;

    var paramEntries = [];

    for (let [stateField, urlParam] of Object.entries(stateToURLParam)) {
        paramEntries.push([urlParam, pendingSearch[stateField]])
    }

    var searchQuery = {
        ...Object.fromEntries(paramEntries),
        language: storeState.language,
        ...pendingSearch.FacetSelections
    };

    searchQuery = lodash.pickBy(searchQuery);
    searchQuery = lodash.mapKeys(searchQuery, (value, paramName) => getParamName(paramName, widget))

    return convertObjectToQueryString(searchQuery);
}

function convertObjectToQueryString(queryObj) {
    var params = new URLSearchParams();
    var queryArray = [];
    var value;

    for (const key in queryObj) {
        value = queryObj[key];

        if (value) {
            if (rangeFacets.includes(key)) {
                if (_.isArray(value)) {
                    value = value.map(i => i.replace(',', '::'));
                }
                else {
                    value = value.replace(',', '::');
                }
            }

            if (_.isArray(value)) {
                value = value.map(i => encodeURIComponent(i));
            }
        }

        params.set(key, value);
    }

    for (let [paramKey, paramValue] of params.entries()) {
        queryArray.push(paramKey + '=' + paramValue);
    }

    if (queryArray.length) {
        return '?' + queryArray.join('&');
    }
    else {
        return '';
    }
}

function decodeURIParam(value) {
    if (value && _.isString(value) && value.length > 1) {
        value = value.split(',');
        value = value.map(i => decodeURIComponent(i));

        if (value.length == 1) {
            value = value.map(i => i.replace('::', ','));
        }

        return value;
    }
    else {
        return value;
    }
}
